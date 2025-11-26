import { apiFetch, APIFetchResponse, cleanFiles, constructUrl, mutate, useApi } from '@/lib/api';
import { DocumentCase, DocumentCaseFormData, DocumentImage } from '../types';

export const useDocumentCases = (params: Record<string, any> = {}) => {
  const url = constructUrl(`/documents/cases`, params);
  const { data, error, mutate, isLoading } =
    useApi<APIFetchResponse<{ results: Array<DocumentCase> }>>(url);
  return {
    reports: data?.data?.results ?? [],
    isLoading,
    error,
    mutate,
  };
};
export const useDocumentCase = (reportId?: string) => {
  const url = constructUrl(`/documents/cases/${reportId}`, {
    v: 'custom:include(foundDocumentCase,lostDocumentCase,document:include(type, images),county:select(name),subCounty:select(name),ward:select(name))',
  });
  const { data, error, mutate, isLoading } = useApi<APIFetchResponse<DocumentCase>>(
    reportId ? url : null
  );
  return {
    report: data?.data,
    isLoading,
    error,
    mutate,
  };
};

export const useDocumentCaseApi = () => {
  const createDocumentReport = async (payload: DocumentCaseFormData) => {
    const report = await apiFetch<DocumentCase>('/documents/cases', {
      method: 'POST',
      data: payload,
    });
    return report.data;
  };
  const updateDocumentReport = async (reportId: string, payload: Partial<DocumentCaseFormData>) => {
    const report = await apiFetch<DocumentCase>(`/documents/cases/${reportId}`, {
      method: 'PATCH',
      data: payload,
    });
    return report.data;
  };
  const deleteDocumentReport = async (reportId: string, purge: boolean = false) => {
    const report = await apiFetch<DocumentCase>(`/documents/cases/${reportId}`, {
      method: 'DELETE',
      params: { purge },
    });
    return report.data;
  };

  const uploadDocumentImage = async (
    reportId: string,
    reportDocumentId: string,
    data: Array<{ url: string }>
  ) => {
    const images = await apiFetch<{ results: Array<DocumentImage> }>(
      `/documents/cases/${reportId}/document/${reportDocumentId}/images`,
      { method: 'POST', data }
    );
    return images.data.results ?? [];
  };
  const deleteDocumentImage = async (reportId: string, image: DocumentImage) => {
    await apiFetch<{ results: Array<DocumentImage> }>(
      `/documents/cases/${reportId}/document/${image.documentId}/images/${image.id}`,
      { method: 'DELETE' }
    );
    await cleanFiles([image.url]);
  };

  const mutateDocumentReport = () => {
    mutate('/documents/cases');
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
