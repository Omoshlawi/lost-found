import { APIFetchResponse, constructUrl, useApi } from '@/lib/api';
import { County } from '../types';

export const useLocations = () => {
  const url = constructUrl('/locations/counties', {
    v: 'custom:select(code,name,subCounties:select(code,name,countyCode,wards:select(code,name,countyCode,subCountyCode)))',
  });
  const { data, error, isLoading } = useApi<APIFetchResponse<{ results: Array<County> }>>(url);
  return {
    locations: data?.data?.results ?? [],
    isLoading,
    error,
  };
};
