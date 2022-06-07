import {AxiosInstance, AxiosRequestConfig, Axios} from "axios";

export interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
    isAuthenticated?: boolean;
}