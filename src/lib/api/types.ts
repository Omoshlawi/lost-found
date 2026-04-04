import { AxiosError } from 'axios';
// eslint-disable-next-line no-duplicate-imports
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type APIFetchInit = Omit<AxiosRequestConfig, 'url'>;
export type APIFetchResponse<T = any, K = any> = AxiosResponse<T, K>;
export type APIFetchError<T = any, K = any> = AxiosError<T, K>;

/** Pagination fields spread at the root level (document-cases, claims pattern). */
export interface PaginatedData<T> {
  results: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  next: string | null;
  prev: string | null;
}

/** Pagination fields nested under a `pagination` key (addresses, address-locales pattern). */
export interface NestedPaginatedData<T> {
  results: T[];
  pagination: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    next: string | null;
    prev: string | null;
  };
}
