import { AxiosRequestConfig } from 'axios';

export interface IAxiosErrorData extends AxiosRequestConfig {
  isAuthenticated?: boolean;
}
