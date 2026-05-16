import { apiFetch, APIFetchResponse, constructUrl, mutate, PaginatedData, useApi } from '@/lib/api';
import { SystemSetting, SystemSettingFormData } from '../types';

export const useSystemSettings = (filters: Record<string, any> = {}) => {
  const url = constructUrl('/settings', { includeSystemSettings: true, limit: 50, ...filters });
  const { data, error, isLoading, mutate: revalidate } =
    useApi<APIFetchResponse<PaginatedData<SystemSetting>>>(url);
  return {
    settings: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    currentPage: data?.data?.currentPage ?? 1,
    pageSize: data?.data?.pageSize ?? 50,
    error,
    isLoading,
    mutate: revalidate,
  };
};

export const useSystemSettingsApi = () => {
  const updateSetting = async (key: string, payload: Omit<SystemSettingFormData, 'key'>) => {
    const res = await apiFetch<SystemSetting>('/settings', {
      method: 'POST',
      data: { key, ...payload, isSystemSetting: true },
    });
    return res.data;
  };

  const mutateSettings = () => mutate('/settings');

  return { updateSetting, mutateSettings };
};
