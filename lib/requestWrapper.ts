import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

const axiosConfig: AxiosRequestConfig = {
    baseURL: 'http://localhost:8080/api',
    timeout: 1000,
}

const requestWrapper: AxiosInstance = axios.create(axiosConfig);

async function onFulfilledRequest(request: AxiosRequestConfig) {
    const sessionTokenRes = await axios.get("/api/token");
    request.headers = {
        ...request.headers,
        Authorization: `Bearer ${sessionTokenRes.data.access_token}`,
    }

    return request;
}

requestWrapper.interceptors.request.use(onFulfilledRequest);

export { requestWrapper }

