import { APIFetchResponse, constructUrl, useApi } from '@/lib/api';
import { DocumentReport } from '../types';

export const useDocumentReport = () => {
  const url = constructUrl(`/documents/reports`);
  const { data, error, mutate, isLoading } =
    useApi<APIFetchResponse<{ results: Array<DocumentReport> }>>(url);
  return {
    reports: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};
