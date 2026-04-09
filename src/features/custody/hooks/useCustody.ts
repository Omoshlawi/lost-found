import { apiFetch, APIFetchResponse, constructUrl, mutate, PaginatedData, useApi } from '@/lib/api';
import { DocumentOperation, DocumentOperationType, StaffStationOperation, StationOperationType } from '../types';

// ─── Custody Operation History ─────────────────────────────────────────────────

export const useCustodyHistory = (foundCaseId?: string, params: Record<string, any> = {}) => {
  const url = constructUrl(`/document-custody/${foundCaseId}/history`, params);
  const { data, error, isLoading, mutate: swrMutate } = useApi<APIFetchResponse<PaginatedData<DocumentOperation>>>(
    foundCaseId ? url : null
  );
  return {
    operations: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    currentPage: data?.data?.currentPage ?? 1,
    pageSize: data?.data?.pageSize ?? 20,
    isLoading,
    error,
    mutate: swrMutate,
  };
};

// ─── Custody API calls ─────────────────────────────────────────────────────────

export const recordReceived = async (foundCaseId: string, data: { stationId: string; notes?: string }) => {
  const result = await apiFetch<DocumentOperation>(`/document-custody/${foundCaseId}/receive`, {
    method: 'POST',
    data,
  });
  mutate(`/document-custody/${foundCaseId}/history`);
  return result.data;
};

export const initiateTransfer = async (foundCaseId: string, data: { toStationId: string; notes?: string }) => {
  const result = await apiFetch<DocumentOperation>(`/document-custody/${foundCaseId}/transfer`, {
    method: 'POST',
    data,
  });
  mutate(`/document-custody/${foundCaseId}/history`);
  return result.data;
};

export const confirmTransfer = async (foundCaseId: string, data: { pairedOperationId: string; notes?: string }) => {
  const result = await apiFetch<DocumentOperation>(`/document-custody/${foundCaseId}/transfer/confirm`, {
    method: 'POST',
    data,
  });
  mutate(`/document-custody/${foundCaseId}/history`);
  return result.data;
};

export const recordHandover = async (foundCaseId: string, data: { stationId: string; notes?: string }) => {
  const result = await apiFetch<DocumentOperation>(`/document-custody/${foundCaseId}/handover`, {
    method: 'POST',
    data,
  });
  mutate(`/document-custody/${foundCaseId}/history`);
  return result.data;
};

export const recordDisposal = async (foundCaseId: string, data: { stationId: string; notes: string }) => {
  const result = await apiFetch<DocumentOperation>(`/document-custody/${foundCaseId}/dispose`, {
    method: 'POST',
    data,
  });
  mutate(`/document-custody/${foundCaseId}/history`);
  return result.data;
};

export const recordReturn = async (foundCaseId: string, data: { stationId: string; notes?: string }) => {
  const result = await apiFetch<DocumentOperation>(`/document-custody/${foundCaseId}/return`, {
    method: 'POST',
    data,
  });
  mutate(`/document-custody/${foundCaseId}/history`);
  return result.data;
};

export const recordAudit = async (foundCaseId: string, data: { stationId: string; notes?: string }) => {
  const result = await apiFetch<DocumentOperation>(`/document-custody/${foundCaseId}/audit`, {
    method: 'POST',
    data,
  });
  mutate(`/document-custody/${foundCaseId}/history`);
  return result.data;
};

export const recordConditionUpdate = async (foundCaseId: string, data: { stationId: string; notes: string; metadata?: Record<string, unknown> }) => {
  const result = await apiFetch<DocumentOperation>(`/document-custody/${foundCaseId}/condition`, {
    method: 'POST',
    data,
  });
  mutate(`/document-custody/${foundCaseId}/history`);
  return result.data;
};

// ─── Document Operation Types ─────────────────────────────────────────────────

export const useDocumentOperationTypes = (params: Record<string, any> = {}) => {
  const url = constructUrl('/document-operation-types', params);
  const { data, error, isLoading, mutate: swrMutate } = useApi<APIFetchResponse<PaginatedData<DocumentOperationType>>>(url);
  return {
    operationTypes: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    isLoading,
    error,
    mutate: swrMutate,
  };
};

export const createDocumentOperationType = async (payload: Partial<DocumentOperationType>) => {
  const result = await apiFetch<DocumentOperationType>('/document-operation-types', {
    method: 'POST',
    data: payload,
  });
  mutate('/document-operation-types');
  return result.data;
};

export const updateDocumentOperationType = async (id: string, payload: Partial<DocumentOperationType>) => {
  const result = await apiFetch<DocumentOperationType>(`/document-operation-types/${id}`, {
    method: 'PATCH',
    data: payload,
  });
  mutate('/document-operation-types');
  return result.data;
};

export const deleteDocumentOperationType = async (id: string) => {
  await apiFetch(`/document-operation-types/${id}`, { method: 'DELETE' });
  mutate('/document-operation-types');
};

// ─── Station Operation Types ──────────────────────────────────────────────────

export const useStationOperationTypes = (stationId?: string) => {
  const url = constructUrl(`/pickup-stations/${stationId}/operation-types`, { limit: 50 });
  const { data, error, isLoading, mutate: swrMutate } = useApi<APIFetchResponse<PaginatedData<StationOperationType>>>(
    stationId ? url : null
  );
  return {
    stationOpTypes: data?.data?.results ?? [],
    isLoading,
    error,
    mutate: swrMutate,
  };
};

export const updateStationOperationType = async (stationId: string, id: string, payload: { isEnabled: boolean }) => {
  const result = await apiFetch<StationOperationType>(`/pickup-stations/${stationId}/operation-types/${id}`, {
    method: 'PATCH',
    data: payload,
  });
  mutate(`/pickup-stations/${stationId}/operation-types`);
  return result.data;
};

// ─── Staff Station Operations ─────────────────────────────────────────────────

export const useStaffStationOperations = (params: Record<string, any> = {}) => {
  const url = constructUrl('/staff-station-operations', params);
  const { data, error, isLoading, mutate: swrMutate } = useApi<APIFetchResponse<PaginatedData<StaffStationOperation>>>(url);
  return {
    grants: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    isLoading,
    error,
    mutate: swrMutate,
  };
};

export const grantStaffStationOperation = async (payload: { userId: string; stationId: string; operationTypeId: string }) => {
  const result = await apiFetch<StaffStationOperation>('/staff-station-operations', {
    method: 'POST',
    data: payload,
  });
  mutate('/staff-station-operations');
  return result.data;
};

export const revokeStaffStationOperation = async (id: string) => {
  await apiFetch(`/staff-station-operations/${id}`, { method: 'DELETE' });
  mutate('/staff-station-operations');
};
