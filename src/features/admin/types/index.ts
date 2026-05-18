import { z } from 'zod';
import { DocumentTypeSchema, ResourceActionSchema, ResourceSchema, RoleSchema, SystemSettingSchema, TransitionReasonSchema } from '../utils';

export interface DocumentType {
  id: string;
  category:
    | 'IDENTITY'
    | 'ACADEMIC'
    | 'PROFESSIONAL'
    | 'VEHICLE'
    | 'FINANCIAL'
    | 'MEDICAL'
    | 'LEGAL'
    | 'OTHER'; // A
  name: string;
  loyaltyPoints: number;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  replacementInstructions: string;
  averageReplacementCost: number;
  requiredVerification: 'LOW' | 'STANDARD' | 'HIGH' | 'INSTITUTIONAL';
  voided: boolean;
}

export type DocumentTypeFormData = z.infer<typeof DocumentTypeSchema>;

export interface TransitionReason {
  id: string;
  code: string;
  entityType: string;
  fromStatus: string;
  toStatus: string;
  auto: boolean;
  label: string;
  description: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}

export type TransitionReasonFormData = z.infer<typeof TransitionReasonSchema>;

export interface RolePermission {
  resource: string;
  resourceName: string;
  action: string;
  actionName: string;
}

export interface SystemRole {
  role: string;
  name: string;
  label?: string;
  permissions: RolePermission[];
}

// ─── Resource / Role (DB-managed) ────────────────────────────────────────────

export interface ResourceAction {
  id: string;
  resourceId: string;
  name: string;
  slug: string;
  description: string | null;
  isBuiltIn: boolean;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isBuiltIn: boolean;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
  actions: ResourceAction[];
}

export interface RolePermissionRecord {
  id: string;
  roleId: string;
  resourceId: string;
  resource: Resource;
  resourceActionId: string;
  resourceAction: ResourceAction;
  createdAt: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  canDelete: boolean;
  canEditPermissions: boolean;
  voided: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: RolePermissionRecord[];
}

export type EffectivePermissions = Record<string, string[]>;

export type ResourceFormData = z.infer<typeof ResourceSchema>;
export type ResourceActionFormData = z.infer<typeof ResourceActionSchema>;
export type RoleFormData = z.infer<typeof RoleSchema>;

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  isPublic: boolean;
  updatedAt: string;
  updatedBy?: string;
  voided: boolean;
}

export type SystemSettingFormData = z.infer<typeof SystemSettingSchema>;
