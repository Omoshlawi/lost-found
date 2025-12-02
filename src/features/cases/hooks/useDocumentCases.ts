import dayjs from 'dayjs';
import { apiFetch, APIFetchResponse, constructUrl, mutate, useApi } from '@/lib/api';
import {
  CaseDocumentFormData,
  DocumentCase,
  DocumentImage,
  FoundDocumentCaseFormData,
  LostDocumentCaseFormData,
} from '../types';

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
    v: 'custom:include(foundDocumentCase,lostDocumentCase,document:include(type, images),document:include(additionalFields))',
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

export const createFoundDocumentCase = async (payload: FoundDocumentCaseFormData) => {
  const foundDocumentCase = await apiFetch<DocumentCase>('/documents/cases/found', {
    method: 'POST',
    data: { ...payload, eventDate: dayjs(payload?.eventDate).format('YYYY-MM-DD') },
  });
  mutate('/documents/cases');
  return foundDocumentCase.data;
};

export const updateFoundDocumentCase = async (
  caseId: string,
  payload: FoundDocumentCaseFormData
) => {
  const foundDocumentCase = await apiFetch<DocumentCase>(`/documents/cases/${caseId}`, {
    method: 'PATCH',
    data: { ...payload, eventDate: dayjs(payload?.eventDate).format('YYYY-MM-DD') },
  });
  mutate('/documents/cases');
  return foundDocumentCase.data;
};

export const createLostDocumentCase = async (payload: LostDocumentCaseFormData) => {
  const lostDocumentCase = await apiFetch<DocumentCase>('/documents/cases/lost', {
    method: 'POST',
    data: {
      ...payload,
      eventDate: payload?.eventDate ? dayjs(payload?.eventDate).format('YYYY-MM-DD') : undefined,
      dateOfBirth: payload?.dateOfBirth
        ? dayjs(payload?.dateOfBirth).format('YYYY-MM-DD')
        : undefined,
      issuanceDate: payload?.issuanceDate
        ? dayjs(payload?.issuanceDate).format('YYYY-MM-DD')
        : undefined,
      expiryDate: payload?.expiryDate ? dayjs(payload?.expiryDate).format('YYYY-MM-DD') : undefined,
    },
  });
  mutate('/documents/cases');
  return lostDocumentCase.data;
};

export const updateLostDocumentCase = async (caseId: string, payload: LostDocumentCaseFormData) => {
  const lostDocumentCase = await apiFetch<DocumentCase>(`/documents/cases/${caseId}`, {
    method: 'PATCH',
    data: { ...payload, eventDate: dayjs(payload?.eventDate).format('YYYY-MM-DD') },
  });
  mutate('/documents/cases');
  return lostDocumentCase.data;
};

export const deleteDocumentCase = async (caseId: string, purge: boolean = false) => {
  const documentCase = await apiFetch<DocumentCase>(`/documents/cases/${caseId}`, {
    method: 'DELETE',
    params: { purge },
  });
  mutate('/documents/cases');
  return documentCase.data;
};

export const restoreDocumentCase = async (caseId: string) => {
  const documentCase = await apiFetch<DocumentCase>(`/documents/cases/${caseId}/restore`, {
    method: 'POST',
  });
  mutate('/documents/cases');
  return documentCase.data;
};

export const updateCaseDocument = async (
  caseId: string,
  documentId: string,
  payload: CaseDocumentFormData
) => {
  const documentCase = await apiFetch<DocumentCase>(
    `/documents/cases/${caseId}/documents/${documentId}`,
    {
      method: 'PATCH',
      data: {
        ...payload,
        dateOfBirth: payload?.dateOfBirth
          ? dayjs(payload?.dateOfBirth).format('YYYY-MM-DD')
          : undefined,
        issuanceDate: payload?.issuanceDate
          ? dayjs(payload?.issuanceDate).format('YYYY-MM-DD')
          : undefined,
        expiryDate: payload?.expiryDate
          ? dayjs(payload?.expiryDate).format('YYYY-MM-DD')
          : undefined,
      },
    }
  );
  mutate('/documents/cases');
  return documentCase.data;
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
  mutate(`/documents/cases`);
  return images.data.results ?? [];
};

export const useDocumentCaseApi = () => {
  return {
    createFoundDocumentCase,
    updateFoundDocumentCase,
    createLostDocumentCase,
    updateLostDocumentCase,
    deleteDocumentCase,
    restoreDocumentCase,
    uploadDocumentImage,
    updateCaseDocument,
  };
};
