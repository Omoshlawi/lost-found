import dayjs from 'dayjs';
import useSWR from 'swr';
import { StatusTransitionReasonFormData } from '@/features/status-transitions/types';
import { apiFetch, APIFetchResponse, constructUrl, mutate, PaginatedData, useApi } from '@/lib/api';
import {
  ActiveExchangeState,
  CaseDocumentFormData,
  DocumentCase,
  DocumentExchange,
  DocumentImage,
  ExchangeStatus,
  ExtractionStatus,
  FoundDocumentCaseFormData,
  LostDocumentCaseFormData,
} from '../types';

export const useDocumentCases = (params: Record<string, any> = {}) => {
  const url = constructUrl(`/documents/cases`, params);
  const { data, error, mutate, isLoading } =
    useApi<APIFetchResponse<PaginatedData<DocumentCase>>>(url);
  return {
    reports: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    currentPage: data?.data?.currentPage ?? 1,
    pageSize: data?.data?.pageSize ?? 12,
    isLoading,
    error,
    mutate,
  };
};
export const useDocumentCase = (reportId?: string) => {
  const url = constructUrl(`/documents/cases/${reportId}`, {
    v: 'custom:include(foundDocumentCase,lostDocumentCase,document:include(type, images),document:include(additionalFields),address:include(locale),extraction:include(aiextractionInteractions:include(aiInteraction)))',
  });
  const { data, error, mutate, isLoading } = useApi<APIFetchResponse<DocumentCase>>(
    reportId ? url : null,
    undefined,
    {
      refreshInterval: (latest) => {
        const status = latest?.data?.extraction?.extractionStatus;
        return status === ExtractionStatus.PENDING || status === ExtractionStatus.IN_PROGRESS
          ? 3000
          : 0;
      },
    }
  );
  return {
    report: data?.data,
    isLoading,
    error,
    mutate,
  };
};

export interface CaseTimelineEvent {
  key: string;
  timestamp: string | null;
  status: 'done' | 'active' | 'pending';
}

export const useDocumentCaseTimeline = (caseId?: string) => {
  const { data, error, isLoading } = useApi<APIFetchResponse<{ events: CaseTimelineEvent[] }>>(
    caseId ? `/documents/cases/${caseId}/timeline` : null
  );
  return {
    events: data?.data?.events ?? [],
    isLoading,
    error,
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
  caseId: string,
  documentId: string,
  data: { images: Array<string> }
) => {
  const images = await apiFetch<{ images: Array<DocumentImage> }>(
    `/documents/cases/${caseId}/documents/${documentId}/images`,
    { method: 'POST', data }
  );
  mutate(`/documents/cases`);
  return images.data.images ?? [];
};

const updateDocumentCase = async (caseId: string, payload: Partial<FoundDocumentCaseFormData>) => {
  const documentCase = await apiFetch<DocumentCase>(`/documents/cases/${caseId}`, {
    method: 'PATCH',
    data: payload,
  });
  mutate('/documents/cases');
  return documentCase.data;
};

export interface InitiateExchangeResponse {
  exchangeId: string;
  exchangeNumber: string;
  verificationId: string;
  expiresAt: string;
}

const initiateExchange = async (foundCaseId: string): Promise<InitiateExchangeResponse> => {
  const result = await apiFetch<InitiateExchangeResponse>(
    `/exchange/inbound/${foundCaseId}/issue-code`,
    { method: 'POST' }
  );
  mutate('/exchange/inbound');
  mutate('/documents/cases');
  return result.data;
};

const verifyExchange = async (
  foundCaseId: string,
  data: { code: string }
): Promise<DocumentCase> => {
  const result = await apiFetch<DocumentCase>(`/exchange/inbound/${foundCaseId}/verify`, {
    method: 'POST',
    data,
  });
  mutate('/exchange/inbound');
  mutate('/documents/cases');
  return result.data;
};

const cancelExchange = async (foundCaseId: string, data: { reason: string }): Promise<void> => {
  await apiFetch(`/exchange/inbound/${foundCaseId}/cancel`, { method: 'POST', data });
  mutate('/exchange/inbound');
  mutate('/documents/cases');
};

const cancelVerification = async (foundCaseId: string, data: { reason: string }): Promise<void> => {
  await apiFetch(`/exchange/inbound/${foundCaseId}/cancel-code`, { method: 'POST', data });
  mutate('/exchange/inbound');
  mutate('/documents/cases');
};

export const useActiveExchange = (foundCaseId?: string) => {
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useSWR<APIFetchResponse<ActiveExchangeState>>(
    foundCaseId ? `/exchange/inbound/${foundCaseId}/active` : null,
    {
      refreshInterval: (data) => {
        const s = data?.data;
        return s?.hasActiveExchange &&
          (s.status === ExchangeStatus.SCHEDULED || s.status === ExchangeStatus.IN_PROGRESS)
          ? 4000
          : 0;
      },
    }
  );
  const exchange = data?.data;
  return {
    exchange,
    hasActiveExchange: exchange?.hasActiveExchange ?? false,
    hasActiveVerification:
      (exchange?.hasActiveExchange ?? false) &&
      exchange?.status === ExchangeStatus.IN_PROGRESS &&
      !!exchange?.expiresAt,
    isLoading,
    error,
    mutate: swrMutate,
  };
};

/** @deprecated use useActiveExchange */
export const useActiveCollection = useActiveExchange;

export const useDocumentExchanges = (foundCaseId?: string) => {
  const { data, isLoading, error, mutate: swrMutate } = useSWR<
    APIFetchResponse<{ results: DocumentExchange[] }>
  >(
    foundCaseId
      ? `/exchange?foundCaseId=${foundCaseId}&orderBy=-createdAt&limit=50&v=custom:include(station,address,createdBy,completedBy,cancelledBy)`
      : null
  );
  return {
    exchanges: data?.data?.results ?? [],
    isLoading,
    error,
    mutate: swrMutate,
  };
};

const verifyfoundDocumentCase = async (
  foundCaseId: string,
  data: StatusTransitionReasonFormData
) => {
  const documentCase = await apiFetch<DocumentCase>(
    `/documents/cases/found/${foundCaseId}/verify`,
    {
      method: 'POST',
      data,
    }
  );
  mutate('/documents/cases');
  return documentCase.data;
};

const rejectFoundDocumentCase = async (
  foundCaseId: string,
  data: StatusTransitionReasonFormData
) => {
  const documentCase = await apiFetch<DocumentCase>(
    `/documents/cases/found/${foundCaseId}/reject`,
    {
      method: 'POST',
      data,
    }
  );
  mutate('/documents/cases');
  return documentCase.data;
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
    updateDocumentCase,
    initiateExchange,
    verifyExchange,
    cancelExchange,
    cancelVerification,
    verifyfoundDocumentCase,
    rejectFoundDocumentCase,
  };
};
