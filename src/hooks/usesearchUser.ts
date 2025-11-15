import { useState } from 'react';
import useSWR from 'swr';
import { useDebouncedValue } from '@mantine/hooks';
import { APIFetchResponse, constructUrl } from '@/lib/api';
import { User } from '@/types/auth';

export const useSearchUser = () => {
  const [search, setSearch] = useState<Record<string, any>>();
  const [debounced] = useDebouncedValue(search, 500);
  const url = constructUrl('/auth/admin/list-users', debounced);
  const { data, error, isLoading } = useSWR<APIFetchResponse<{ users: Array<User> }>>(
    debounced ? url : undefined
  );
  return {
    users: data?.data?.users ?? [],
    isLoading,
    error,
    setFilters: setSearch,
    filters: search,
  };
};
