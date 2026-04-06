import { APIFetchResponse, constructUrl, PaginatedData, useApi } from '@/lib/api';
import { StatusTransition } from '../types';

export const useStatusTransitions = (filters: Record<string, any> = {}) => {
  const url = constructUrl('/status-transitions', { 
    ...filters,
    v: 'custom:include(changedBy,reason)' // Expand relations
   });
  const { data, error, isLoading, mutate } =
    useApi<APIFetchResponse<PaginatedData<StatusTransition>>>(url);

  return {
    statusTransitions: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    currentPage: data?.data?.currentPage ?? 1,
    pageSize: data?.data?.pageSize ?? 12,
    error,
    isLoading,
    mutate,
  };
};

export const useStatusTransition = (id?: string) => {
  const url = constructUrl(`/status-transitions/${id}`);
  const { data, error, isLoading, mutate } = useApi<APIFetchResponse<StatusTransition>>(
    id ? url : null
  );

  return {
    statusTransition: data?.data,
    error,
    isLoading,
    mutate,
  };
};
