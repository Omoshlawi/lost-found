import { apiFetch, APIFetchResponse, constructUrl, mutate, useApi } from '@/lib/api';
import { DocumentType, DocumentTypeFormData } from '../types';

// lists all document types
export const useDocumentTypes = () => {
  const url = constructUrl('/documents/types');
  const { data, error, isLoading, mutate } =
    useApi<APIFetchResponse<{ results: Array<DocumentType> }>>(url);
  return {
    documentTypes: data?.data?.results ?? [],
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
  const updateDocumentType = async (
    documentTypeId: string,
    payload: DocumentTypeFormData,
    method: 'PUT' | 'PATCH' = 'PATCH'
  ) => {
    const doctype = await apiFetch<DocumentType>(`/documents/types/${documentTypeId}`, {
      method: method,
      data: payload,
    });
    return doctype.data;
  };
  const deleteDocumentType = async (
    documentTypeId: string,
    method: 'DELETE' | 'PURGE' = 'DELETE'
  ) => {
    const doctype = await apiFetch<DocumentType>(`/documents/types/${documentTypeId}`, {
      method: method,
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
