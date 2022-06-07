import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import { ICustomAxiosRequestConfig } from "@app/types/axios";

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
    console.log('ERROR: ', error)
    if (typeof window !== 'undefined' && error) {
        if (error.code === 'ECONNREFUSED') {
            window.location.href = '/500?message=The server seems to not responding'
            return;
        } else if (error.response.data.error === 'invalid_token' && !error.response.data.error_description.includes('expired')) {
            window.location.href = '/login?' + new URLSearchParams({
                callbackUrl: window.location.pathname
            })
        }
    }
    throw error
}

authenticatedClient.interceptors.request.use(onFulfilledRequest);
authenticatedClient.interceptors.response.use((response) => response, onRejectedRequest)
unauthenticatedClient.interceptors.response.use((response) => response, onRejectedRequest)
internalClient.interceptors.response.use((response) => response, onRejectedRequest)

export { authenticatedClient, unauthenticatedClient, internalClient  }

