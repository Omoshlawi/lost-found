import { useState } from 'react';
import useSWR from 'swr';
import { useDebouncedValue } from '@mantine/hooks';
import { Station } from '@/features/custody/types';
import { APIFetchResponse, constructUrl, PaginatedData } from '@/lib/api';

export const useSearchStation = () => {
  const [search, setSearch] = useState<Record<string, any>>();
  const [debounced] = useDebouncedValue(search, 500);
  const url = constructUrl('/stations', { limit: 20, ...debounced });
  const { data, error, isLoading } = useSWR<APIFetchResponse<PaginatedData<Station>>>(
    debounced ? url : undefined
  );
  return {
    stations: data?.data?.results ?? [],
    isLoading,
    error,
    setFilters: setSearch,
    filters: search,
  };
};
