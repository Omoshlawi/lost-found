import {
  apiFetch,
  APIFetchResponse,
  cleanFiles,
  constructUrl,
  delay,
  mutate,
  useApi,
} from '@/lib/api';
import { DocumentImage, DocumentReport, DocumentReportFormData } from '../types';

export const useDocumentReports = (params: Record<string, any> = {}) => {
  const url = constructUrl(`/documents/reports`, params);
  const { data, error, mutate, isLoading } =
    useApi<APIFetchResponse<{ results: Array<DocumentReport> }>>(url);
  return {
    reports: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};
export const useDocumentReport = (reportId?: string) => {
  const url = constructUrl(`/documents/reports/${reportId}`, {
    v: 'custom:include(foundReport,lostReport,document:include(type, images),county:select(name),subCounty:select(name),ward:select(name))',
  });
  const { data, error, mutate, isLoading } = useApi<APIFetchResponse<DocumentReport>>(
    reportId ? url : null
  );
  return {
    report: data?.data,
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
    payload: Partial<DocumentReportFormData>,
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

  const uploadDocumentImage = async (
    reportId: string,
    reportDocumentId: string,
    data: Array<{ url: string }>
  ) => {
    const images = await apiFetch<{ results: Array<DocumentImage> }>(
      `/documents/reports/${reportId}/document/${reportDocumentId}/images`,
      { method: 'POST', data }
    );
    return images.data.results ?? [];
  };
  const deleteDocumentImage = async (reportId: string, image: DocumentImage) => {
    await apiFetch<{ results: Array<DocumentImage> }>(
      `/documents/reports/${reportId}/document/${image.documentId}/images/${image.id}`,
      { method: 'DELETE' }
    );
    await cleanFiles([image.url]);
  };

  const mutateDocumentReport = () => {
    mutate('/documents/reports');
  };
  return {
    createDocumentReport,
    updateDocumentReport,
    deleteDocumentReport,
    mutateDocumentReport,
    uploadDocumentImage,
    deleteDocumentImage,
  };
};
