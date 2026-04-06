import { User } from 'better-auth';
import { z } from 'zod';
import { statusTransitionReasonsSchema } from './utils/validation';

export interface TransitionReason {
  id: string;
  code: string;
  entityType: string;
  fromStatus: string;
  toStatus: string;
  auto: boolean;
  label: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}

export interface StatusTransition {
  id: string;
  entityId: string;
  entityType: string;
  fromStatus: string;
  toStatus: string;
  reasonId?: string;
  reason?: TransitionReason;
  comment?: string;
  changedById: string;
  changedBy?: User;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export type StatusTransitionReasonFormData = z.infer<typeof statusTransitionReasonsSchema>;
