import { apiFetch, APIFetchResponse, constructUrl, mutate, PaginatedData, useApi } from '@/lib/api';
import { DocumentType, DocumentTypeFormData } from '../types';

// lists document types — defaults keep existing callers (dropdowns) working unchanged
export const useDocumentTypes = (filters: Record<string, any> = {}) => {
  const url = constructUrl('/documents/types', { includeVoided: true, limit: 100, ...filters });
  const { data, error, isLoading, mutate } =
    useApi<APIFetchResponse<PaginatedData<DocumentType>>>(url);
  return {
    documentTypes: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    currentPage: data?.data?.currentPage ?? 1,
    pageSize: data?.data?.pageSize ?? 12,
    error,
    isLoading,
    mutate,
  };
};

// findes document by document id
export const useDocumentType = (documentTypeId?: string) => {
  const url = constructUrl(`/documents/types/${documentTypeId}`);
  const { data, error, isLoading, mutate } = useApi<APIFetchResponse<DocumentType>>(
    documentTypeId ? url : null
  );
  return {
    documentType: data?.data,
    error,
    isLoading,
    mutate,
  };
};

export const useDocumentTypesApi = () => {
  const createDocumentType = async (payload: DocumentTypeFormData) => {
    const doctype = await apiFetch<DocumentType>('/documents/types', {
      method: 'POST',
      data: payload,
    });
    return doctype.data;
  };
  const updateDocumentType = async (documentTypeId: string, payload: DocumentTypeFormData) => {
    const doctype = await apiFetch<DocumentType>(`/documents/types/${documentTypeId}`, {
      method: 'PATCH',
      data: payload,
    });
    return doctype.data;
  };
  const deleteDocumentType = async (documentTypeId: string, purge: boolean = false) => {
    const doctype = await apiFetch<DocumentType>(`/documents/types/${documentTypeId}`, {
      method: 'DELETE',
      params: { purge },
    });
    return doctype.data;
  };

  const mutateDocumentTypes = () => {
    mutate('/documents/types');
  };
  return {
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    mutateDocumentTypes,
  };
};
