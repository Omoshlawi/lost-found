import { apiFetch, APIFetchResponse, constructUrl, mutate, PaginatedData, useApi } from '@/lib/api';
import { TransitionReason, TransitionReasonFormData } from '../types';

export const useTransitionReasons = (filters: Record<string, any> = {}) => {
  const url = constructUrl('/status-transitions-reasons', { ...filters });
  const { data, error, isLoading, mutate } =
    useApi<APIFetchResponse<PaginatedData<TransitionReason>>>(url);

  return {
    transitionReasons: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    currentPage: data?.data?.currentPage ?? 1,
    pageSize: data?.data?.pageSize ?? 12,
    error,
    isLoading,
    mutate,
  };
};

export const useTransitionReason = (id?: string) => {
  const url = constructUrl(`/status-transitions-reasons/${id}`);
  const { data, error, isLoading, mutate } = useApi<APIFetchResponse<TransitionReason>>(
    id ? url : null
  );

  return {
    transitionReason: data?.data,
    error,
    isLoading,
    mutate,
  };
};

export const useTransitionReasonsApi = () => {
  const createTransitionReason = async (payload: TransitionReasonFormData) => {
    const res = await apiFetch<TransitionReason>('/status-transitions-reasons', {
      method: 'POST',
      data: payload,
    });
    return res.data;
  };

  const updateTransitionReason = async (id: string, payload: Partial<TransitionReasonFormData>) => {
    const res = await apiFetch<TransitionReason>(`/status-transitions-reasons/${id}`, {
      method: 'PATCH',
      data: payload,
    });
    return res.data;
  };

  const deleteTransitionReason = async (id: string, purge: boolean = false) => {
    const res = await apiFetch<TransitionReason>(`/status-transitions-reasons/${id}`, {
      method: 'DELETE',
      params: { purge },
    });
    return res.data;
  };

  const restoreTransitionReason = async (id: string) => {
    const res = await apiFetch<TransitionReason>(`/status-transitions-reasons/${id}/restore`, {
      method: 'POST',
    });
    return res.data;
  };

  const mutateTransitionReasons = () => {
    mutate('/status-transitions-reasons');
  };

  return {
    createTransitionReason,
    updateTransitionReason,
    deleteTransitionReason,
    restoreTransitionReason,
    mutateTransitionReasons,
  };
};

export const useTransitionReasonEntityTypes = () => {
  const { data, error, isLoading } = useApi<APIFetchResponse<{ results: string[] }>>(
    '/status-transitions-reasons/entity-types'
  );

  return {
    entityTypes: data?.data?.results ?? [],
    error,
    isLoading,
  };
};
