import { useMemo } from 'react';
import useSWR from 'swr';
import { APIFetchResponse } from '@/lib/api';
import { SystemRole } from '../types';

const useRoles = () => {
  const { data, error, isLoading, mutate } =
    useSWR<APIFetchResponse<{ results: SystemRole[] }>>('/extended/auth/roles');

  const roleRecords = useMemo<SystemRole[]>(() => {
    const payload = data?.data;
    return payload?.results ?? [];
  }, [data]);

  const roles = useMemo(
    () => roleRecords.map((item) => ({ value: item.role, label: item.label ?? item.name })),
    [roleRecords]
  );

  return { roles, roleRecords, error, isLoading, mutate };
};

export default useRoles;
