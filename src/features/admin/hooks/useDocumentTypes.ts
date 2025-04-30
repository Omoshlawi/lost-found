import { APIFetchResponse, constructUrl, useApi } from '@/lib/api';
import { DocumentType } from '../types';

const useDocumentTypes = () => {
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

export default useDocumentTypes;
