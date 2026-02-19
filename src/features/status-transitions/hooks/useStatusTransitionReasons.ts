import useSWR from 'swr';
import { APIFetchResponse, constructUrl } from '@/lib/api';
import { TransitionReason } from '../types';

export const useTransitionReasons = (params: Record<string, any>) => {
  const url = constructUrl('/status-transitions-reasons', {
    includeGlobal: 'true',
    orderBy: 'createdAt',
    ...params,
  });
  const { data, error, isLoading } = useSWR<APIFetchResponse<{ results: TransitionReason[] }>>(url);
  return { reasons: data?.data?.results ?? [], error, isLoading };
};
