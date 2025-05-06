import { apiFetch, APIFetchResponse, constructUrl, mutate, useApi } from '@/lib/api';
import { DocumentReport, DocumentReportFormData } from '../types';

export const useDocumentReports = () => {
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

export const useDocumentReportApi = () => {
  const createDocumentReport = async (payload: DocumentReportFormData) => {
    const report = await apiFetch<DocumentReport>('/documents/reports', {
      method: 'POST',
      data: payload,
    });
    return report.data;
  };
  const updateDocumentReport = async (
    reportId: string,
    payload: DocumentReportFormData,
    method: 'PUT' | 'PATCH' = 'PATCH'
  ) => {
    const report = await apiFetch<DocumentReport>(`/documents/reports/${reportId}`, {
      method: method,
      data: payload,
    });
    return report.data;
  };
  const deleteDocumentReport = async (reportId: string, method: 'DELETE' | 'PURGE' = 'DELETE') => {
    const report = await apiFetch<DocumentReport>(`/documents/reports/${reportId}`, {
      method: method,
    });
    return report.data;
  };

  const mutateDocumentReport = () => {
    mutate('/documents/reports');
  };
  return {
    createDocumentReport,
    updateDocumentReport,
    deleteDocumentReport,
    mutateDocumentReport,
  };
};
