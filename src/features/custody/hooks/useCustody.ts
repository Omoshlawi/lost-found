import { apiFetch, APIFetchResponse, constructUrl, mutate, PaginatedData, useApi } from '@/lib/api';
import {
  CreateOperationPayload,
  DocumentOperation,
  DocumentOperationType,
  StaffStationOperation,
  StationOperationType,
  UpdateOperationPayload,
} from '../types';

const OPERATIONS_KEY = '/document-custody/operations';

// ── Lifecycle: list + single ──────────────────────────────────────────────────

export const useDocumentOperations = (params: Record<string, any> = {}) => {
  const url = constructUrl(OPERATIONS_KEY, params);
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useApi<APIFetchResponse<PaginatedData<DocumentOperation>>>(url);
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

export const useDocumentOperation = (id?: string) => {
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useApi<APIFetchResponse<DocumentOperation>>(id ? `${OPERATIONS_KEY}/${id}` : null);
  return {
    operation: data?.data ?? null,
    isLoading,
    error,
    mutate: swrMutate,
  };
};

// ── Lifecycle: mutations ──────────────────────────────────────────────────────

export const createOperation = async (payload: CreateOperationPayload) => {
  const result = await apiFetch<DocumentOperation>(OPERATIONS_KEY, {
    method: 'POST',
    data: payload,
  });
  mutate(OPERATIONS_KEY);
  return result.data;
};

export const updateOperation = async (id: string, payload: UpdateOperationPayload) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}`, {
    method: 'PATCH',
    data: payload,
  });
  mutate(OPERATIONS_KEY);
  return result.data;
};

export const addOperationItem = async (id: string, foundCaseId: string, notes?: string) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}/items`, {
    method: 'POST',
    data: { foundCaseId, notes },
  });
  mutate(`${OPERATIONS_KEY}/${id}`);
  return result.data;
};

export const removeOperationItem = async (id: string, itemId: string) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}/items/${itemId}`, {
    method: 'DELETE',
  });
  mutate(`${OPERATIONS_KEY}/${id}`);
  return result.data;
};

export const skipOperationItem = async (id: string, itemId: string, comment?: string) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}/items/${itemId}/skip`, {
    method: 'POST',
    data: { comment },
  });
  mutate(`${OPERATIONS_KEY}/${id}`);
  return result.data;
};

export const submitOperation = async (id: string) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}/submit`, {
    method: 'POST',
  });
  mutate(OPERATIONS_KEY);
  return result.data;
};

export const approveOperation = async (id: string) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}/approve`, {
    method: 'POST',
  });
  mutate(OPERATIONS_KEY);
  return result.data;
};

export const rejectOperation = async (id: string, reasonCode: string, comment?: string) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}/reject`, {
    method: 'POST',
    data: { reasonCode, comment },
  });
  mutate(OPERATIONS_KEY);
  return result.data;
};

export const executeOperation = async (id: string) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}/execute`, {
    method: 'POST',
  });
  mutate(OPERATIONS_KEY);
  return result.data;
};

export const cancelOperation = async (id: string, reasonCode: string, comment?: string) => {
  const result = await apiFetch<DocumentOperation>(`${OPERATIONS_KEY}/${id}/cancel`, {
    method: 'POST',
    data: { reasonCode, comment },
  });
  mutate(OPERATIONS_KEY);
  return result.data;
};

// ── Deprecated: per-case shortcut mutations ───────────────────────────────────
// These create a single-item DRAFT operation and immediately execute it.
// Use the new lifecycle operations for multi-case or approval workflows.

const singleItemOp = async (
  foundCaseId: string,
  opCode: string,
  stationKey: 'stationId' | 'toStationId',
  stationId?: string,
  notes?: string
) => {
  const opTypes = await apiFetch<any>(`/document-operation-types?limit=50`);
  const opType = opTypes.data?.results?.find((t: any) => t.code === opCode);
  if (!opType) {
    throw new Error(`${opCode} operation type not found`);
  }
  const created = await createOperation({
    operationTypeId: opType.id,
    foundCaseIds: [foundCaseId],
    [stationKey]: stationId,
    notes,
  });
  return executeOperation(created!.id);
};

export const recordAudit = (foundCaseId: string, data: { stationId: string; notes?: string }) =>
  singleItemOp(foundCaseId, 'AUDIT', 'stationId', data.stationId, data.notes);

export const recordConditionUpdate = (
  foundCaseId: string,
  data: { stationId: string; notes: string }
) => singleItemOp(foundCaseId, 'CONDITION_UPDATE', 'stationId', data.stationId, data.notes);

export const recordDisposal = (foundCaseId: string, data: { stationId: string; notes: string }) =>
  singleItemOp(foundCaseId, 'DISPOSAL', 'stationId', data.stationId, data.notes);

export const initiateTransfer = (
  foundCaseId: string,
  data: { toStationId: string; notes?: string }
) => singleItemOp(foundCaseId, 'TRANSFER_OUT', 'toStationId', data.toStationId, data.notes);

export const recordReturn = (foundCaseId: string, data: { stationId: string; notes?: string }) =>
  singleItemOp(foundCaseId, 'RETURN', 'stationId', data.stationId, data.notes);

// ── Per-case history (CustodyDetailPage) ─────────────────────────────────────

export const useCustodyHistory = (foundCaseId?: string, params: Record<string, any> = {}) => {
  const url = constructUrl(`/document-custody/${foundCaseId}/history`, params);
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useApi<APIFetchResponse<PaginatedData<DocumentOperation>>>(foundCaseId ? url : null);
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

// ── Document Operation Types ──────────────────────────────────────────────────

export const useDocumentOperationTypes = (params: Record<string, any> = {}) => {
  const url = constructUrl('/document-operation-types', params);
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useApi<APIFetchResponse<PaginatedData<DocumentOperationType>>>(url);
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

export const updateDocumentOperationType = async (
  id: string,
  payload: Partial<DocumentOperationType>
) => {
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

// ── Station Operation Types ───────────────────────────────────────────────────

export const useStationOperationTypes = (stationId?: string) => {
  const url = constructUrl(`/pickup-stations/${stationId}/operation-types`, { limit: 50 });
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useApi<APIFetchResponse<PaginatedData<StationOperationType>>>(stationId ? url : null);
  return {
    stationOpTypes: data?.data?.results ?? [],
    isLoading,
    error,
    mutate: swrMutate,
  };
};

export const updateStationOperationType = async (
  stationId: string,
  id: string,
  payload: { isEnabled: boolean }
) => {
  const result = await apiFetch<StationOperationType>(
    `/pickup-stations/${stationId}/operation-types/${id}`,
    {
      method: 'PATCH',
      data: payload,
    }
  );
  mutate(`/pickup-stations/${stationId}/operation-types`);
  return result.data;
};

// ── Staff Station Operations ──────────────────────────────────────────────────

export const useStaffStationOperations = (params: Record<string, any> = {}) => {
  const url = constructUrl('/staff-station-operations', params);
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useApi<APIFetchResponse<PaginatedData<StaffStationOperation>>>(url);
  return {
    grants: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    isLoading,
    error,
    mutate: swrMutate,
  };
};

export const grantStaffStationOperation = async (payload: {
  userId: string;
  stationId: string;
  operationTypeIds: string[];
}) => {
  const result = await apiFetch<StaffStationOperation[]>('/staff-station-operations', {
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

// ── Allowed Operations ────────────────────────────────────────────────────────

export const useAllowedOperations = (stationId: string | undefined) => {
  const url = constructUrl('/document-custody/allowed-operations', {
    stationId,
  });
  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useApi<APIFetchResponse<{ allowedOperations: DocumentOperationType[] }>>(
    stationId ? url : null
  );
  return {
    allowedOperations: data?.data?.allowedOperations ?? [],
    isLoading,
    error,
    mutate: swrMutate,
  };
};
