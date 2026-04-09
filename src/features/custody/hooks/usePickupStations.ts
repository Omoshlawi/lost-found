import { APIFetchResponse, constructUrl, PaginatedData, useApi } from '@/lib/api';
import { Station } from '../types';

export const usePickupStations = (params: Record<string, any> = {}) => {
  const url = constructUrl('/pickup-stations', { limit: 100, ...params });
  const { data, error, isLoading } = useApi<APIFetchResponse<PaginatedData<Station>>>(url);
  return {
    stations: data?.data?.results ?? [],
    isLoading,
    error,
  };
};
