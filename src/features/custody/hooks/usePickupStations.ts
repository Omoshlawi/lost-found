import useSWR from 'swr';
import { APIFetchResponse, constructUrl, PaginatedData } from '@/lib/api';
import { Station } from '../types';

export const usePickupStations = (params: Record<string, any> = {}) => {
  const url = constructUrl('/pickup-stations', { limit: 100, ...params });
  const { data, error, isLoading, mutate } = useSWR<APIFetchResponse<PaginatedData<Station>>>(url);
  return {
    stations: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    isLoading,
    error,
    mutate,
  };
};
