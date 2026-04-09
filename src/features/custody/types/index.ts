export enum CustodyStatus {
  WITH_FINDER = 'WITH_FINDER',
  IN_CUSTODY = 'IN_CUSTODY',
  IN_TRANSIT = 'IN_TRANSIT',
  HANDED_OVER = 'HANDED_OVER',
  DISPOSED = 'DISPOSED',
}

export interface DocumentOperationType {
  id: string;
  code: string;
  prefix: string;
  name: string;
  description?: string | null;
  requiresDestinationStation: boolean;
  requiresSourceStation: boolean;
  requiresNotes: boolean;
  isHighPrivilege: boolean;
  isFinalOperation: boolean;
  metadata?: Record<string, unknown> | null;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StationOperationType {
  id: string;
  stationId: string;
  operationTypeId: string;
  operationType?: DocumentOperationType;
  isEnabled: boolean;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffStationOperation {
  id: string;
  userId: string;
  stationId: string;
  operationTypeId: string;
  grantedById: string;
  user?: { id: string; name: string };
  station?: { id: string; name: string; code: string };
  operationType?: { id: string; code: string; name: string };
  grantedBy?: { id: string; name: string };
  voided: boolean;
  voidedAt?: string | null;
  voidedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Station {
  id: string;
  name: string;
  code: string;
}

export interface DocumentOperation {
  id: string;
  operationNumber: string;
  foundCaseId: string;
  operationTypeId: string;
  operationType?: DocumentOperationType;
  stationId?: string | null;
  station?: Station | null;
  fromStationId?: string | null;
  fromStation?: Station | null;
  toStationId?: string | null;
  toStation?: Station | null;
  requestedByStationId?: string | null;
  requestedByStation?: Station | null;
  performedById: string;
  performedBy?: { id: string; name: string };
  pairedOperationId?: string | null;
  custodyStatusBefore: CustodyStatus;
  custodyStatusAfter: CustodyStatus;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}
