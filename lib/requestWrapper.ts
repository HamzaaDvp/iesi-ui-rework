import axios, {
  AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse,
} from 'axios';
import snackbarUtil from '@app/lib/snackbar';
import { IRequestErrorBody, ISessionToken } from '@app/types/auth';
import { EconnRefusedError, ExpiredTokenError, InvalidTokenError } from '@app/throwables/auth';
import { encodeQueryParams } from '@app/lib/urlUtils';

const axiosConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:8080/api',
  timeout: 1000,
};

const authenticatedClient: AxiosInstance = axios.create(axiosConfig);
const unauthenticatedClient: AxiosInstance = axios.create(axiosConfig);
const internalClient: AxiosInstance = axios.create();

async function onFulfilledRequest(request: AxiosRequestConfig) {
  const sessionTokenRes: AxiosResponse<ISessionToken> = await axios.get('/api/token');
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${sessionTokenRes.data.access_token}`,
  };
  return request;
}

function onRejectedRequest(error: AxiosError<IRequestErrorBody>) {
  if (error && error.response) {
    if (error.code === 'ECONNREFUSED') {
      if (typeof window === 'undefined') {
        throw new EconnRefusedError('The server seems to not responding');
      } else {
        window.location.href = '/500?message=The server seems to not responding';
        return;
      }
    } else if (error.response.data.error === 'invalid_token' && !error.response.data.error_description.includes('expired')) {
      if (typeof window === 'undefined') {
        throw new InvalidTokenError('Access token is invalid');
      } else {
        window.location.href = `/login?${encodeQueryParams({
          callbackUrl: window.location.pathname,
        })}`;
      }
    } else if (error.response.data.error === 'invalid_token' && error.response.data.error_description.includes('expired')) {
      throw new ExpiredTokenError('The token has expired');
    }

    snackbarUtil.error('Error');
  }

  throw error;
}

authenticatedClient.interceptors.request.use(onFulfilledRequest);

authenticatedClient.interceptors.response.use((response) => {
  if (typeof window !== 'undefined' && response.config.method !== 'get') {
    snackbarUtil.success('Authenticated client');
  }
  return response;
}, onRejectedRequest);

unauthenticatedClient.interceptors.response.use((response) => {
  if (
    typeof window !== 'undefined'
        && response.config.method !== 'get'
        && !response.config.url?.includes('grant_type=refresh_token')
  ) {
    snackbarUtil.success('Unauthenticated client');
  }
  return response;
}, onRejectedRequest);

internalClient.interceptors.response.use((response) => {
  if (
    typeof window !== 'undefined'
        && response.config.method !== 'get'
        && !response.config.url?.includes('grant_type=refresh_token')
  ) {
    snackbarUtil.success('Internal client');
  }
  return response;
}, onRejectedRequest);

export { authenticatedClient, unauthenticatedClient, internalClient };
