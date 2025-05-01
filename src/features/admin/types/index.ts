import { z } from 'zod';
import { DocumentTypeSchema } from '../utils';

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  replacementInstructions: string;
  averageReplacementCost: number;
  requiredVerification: 'LOW' | 'STANDARD' | 'HIGH' | 'INSTITUTIONAL';
  voided: boolean;
}

export type DocumentTypeFormData = z.infer<typeof DocumentTypeSchema>;
