import { AxiosError } from 'axios';
// eslint-disable-next-line no-duplicate-imports
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type APIFetchInit = Omit<AxiosRequestConfig, 'url'>;
export type APIFetchResponse<T = any, K = any> = AxiosResponse<T, K>;
export type APIFetchError<T = any, K = any> = AxiosError<T, K>;
