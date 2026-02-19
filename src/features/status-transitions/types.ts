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

export type StatusTransitionReasonFormData = z.infer<typeof statusTransitionReasonsSchema>;
