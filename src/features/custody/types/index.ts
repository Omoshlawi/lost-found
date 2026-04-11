import { z } from 'zod';
import { GrantStaffOperationSchema } from '../utils/validation';

export type GrantStaffOperationFormData = z.infer<typeof GrantStaffOperationSchema>;

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum CustodyStatus {
  WITH_FINDER = 'WITH_FINDER',
  IN_CUSTODY = 'IN_CUSTODY',
  IN_TRANSIT = 'IN_TRANSIT',
  HANDED_OVER = 'HANDED_OVER',
  DISPOSED = 'DISPOSED',
}

export enum DocumentOperationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum DocumentOperationItemStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

// ── Core types ────────────────────────────────────────────────────────────────

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
  address1: string;
  address2?: string | null;
  landmark?: string | null;
  level1: string;
  level2?: string | null;
  level3?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  formatted?: string | null;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentOperationItem {
  id: string;
  operationId: string;
  foundCaseId: string;
  foundCase?: {
    id: string;
    custodyStatus: CustodyStatus;
    case: {
      caseNumber: string;
      document?: { type?: { name: string } } | null;
      user?: { id: string; name: string } | null;
    };
  } | null;
  status: DocumentOperationItemStatus;
  custodyStatusBefore?: CustodyStatus | null;
  custodyStatusAfter?: CustodyStatus | null;
  notes?: string | null;
  createdAt: string;
}

export interface DocumentOperation {
  id: string;
  operationNumber: string;
  operationTypeId: string;
  operationType?: DocumentOperationType;
  status: DocumentOperationStatus;
  stationId?: string | null;
  station?: { id: string; name: string; code: string } | null;
  fromStationId?: string | null;
  fromStation?: { id: string; name: string; code: string } | null;
  toStationId?: string | null;
  toStation?: { id: string; name: string; code: string } | null;
  requestedByStationId?: string | null;
  requestedByStation?: { id: string; name: string; code: string } | null;
  createdById: string;
  createdBy?: { id: string; name: string } | null;
  notes?: string | null;
  completedAt?: string | null;
  items: DocumentOperationItem[];
  createdAt: string;
  updatedAt: string;
}

// ── Form payloads ────────────────────────────────────────────────────────────��

export interface CreateOperationPayload {
  operationTypeId: string;
  foundCaseIds: string[];
  stationId?: string;
  fromStationId?: string;
  toStationId?: string;
  requestedByStationId?: string;
  notes?: string;
}

export interface UpdateOperationPayload {
  stationId?: string | null;
  fromStationId?: string | null;
  toStationId?: string | null;
  notes?: string | null;
}

// ── Staff grant grouping ──────────────────────────────────────────────────────

export type StationGroup = {
  stationId: string;
  station?: StaffStationOperation['station'];
  operations: StaffStationOperation[];
};

export type GroupedStaffGrant = {
  userId: string;
  user?: StaffStationOperation['user'];
  stations: StationGroup[];
  totalOperations: number;
  latestGrantedAt: string;
};
