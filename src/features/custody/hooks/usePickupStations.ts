import useSWR from 'swr';
import { APIFetchResponse, constructUrl, PaginatedData } from '@/lib/api';
import { Station } from '../types';

export const usePickupStations = (params: Record<string, any> = {}, skip: boolean = false) => {
  const url = constructUrl('/pickup-stations', { limit: 100, ...params });
  const { data, error, isLoading, mutate } = useSWR<APIFetchResponse<PaginatedData<Station>>>(
    skip ? null : url
  );
  return {
    stations: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    isLoading,
    error,
    mutate,
  };
};

export const usePickupStation = (id: string) => {
  const url = constructUrl(`/pickup-stations/${id}`);
  const { data, error, isLoading, mutate } = useSWR<APIFetchResponse<Station>>(url);
  return {
    stations: data?.data,
    isLoading,
    error,
    mutate,
  };
};
