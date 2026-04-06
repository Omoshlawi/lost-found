import { z } from 'zod';
import { DocumentTypeSchema, TransitionReasonSchema } from '../utils';

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
