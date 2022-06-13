import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {EconnRefusedError, ExpiredTokenError, InvalidTokenError} from "@app/throwables/auth";


const axiosConfig: AxiosRequestConfig = {
    baseURL: 'http://localhost:8080/api',
    timeout: 1000,
}

const authenticatedClient: AxiosInstance = axios.create(axiosConfig);
const unauthenticatedClient: AxiosInstance = axios.create(axiosConfig);
const internalClient: AxiosInstance = axios.create();

async function onFulfilledRequest(request: AxiosRequestConfig) {
    const sessionTokenRes = await axios.get("/api/token");
    request.headers = {
        ...request.headers,
        Authorization: `Bearer ${sessionTokenRes.data.access_token}`,
    }
    return request;
}

async function onRejectedRequest(error: any) {
    if (error) {
        if (error.code === 'ECONNREFUSED') {
            if (typeof window === 'undefined') {
                throw new EconnRefusedError("The server seems to not responding");
            } else {
                window.location.href = '/500?message=The server seems to not responding'
                return;
            }
        } else if (error.response.data.error === 'invalid_token' && !error.response.data.error_description.includes('expired')) {
            if (typeof window === 'undefined') {
                throw new InvalidTokenError("Access token is invalid")
            } else {
                window.location.href = '/login?' + new URLSearchParams({
                    callbackUrl: window.location.pathname
                })
            }
        } else if (error.response.data.error === 'invalid_token' && error.response.data.error_description.includes('expired')) {
            throw new ExpiredTokenError("The token has expired")
        }
    }

    throw error;
}

authenticatedClient.interceptors.request.use(onFulfilledRequest);
authenticatedClient.interceptors.response.use((response) => response, onRejectedRequest)
unauthenticatedClient.interceptors.response.use((response) => response, onRejectedRequest)
internalClient.interceptors.response.use((response) => response, onRejectedRequest)

export { authenticatedClient, unauthenticatedClient, internalClient  }

