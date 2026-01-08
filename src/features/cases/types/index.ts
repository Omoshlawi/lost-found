import { z } from 'zod';
import { Address } from '@/features/addresses/types';
import { CaseDocumentSchema, FoundDocumentCaseSchema, LostDocumentCaseSchema } from '../utils';

export interface DocumentCase {
  id: string;
  userId: string;
  addressId: string;
  address?: Address;
  eventDate: string;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  lostDocumentCase?: LostDocumentCase;
  foundDocumentCase?: FoundDocumentCase;
  document?: Document;
}

export enum LostDocumentCaseStatus {
  SUBMITTED = 'SUBMITTED', // When user submit lost document info
  COMPLETED = 'COMPLETED', // When the document is reunited with the owner
}

export enum FoundDocumentCaseStatus {
  DRAFT = 'DRAFT', // When the document is in draft status
  SUBMITTED = 'SUBMITTED', // When the document is submitted by the user to pickup station/point
  VERIFIED = 'VERIFIED', // When the document is verified by the admin
  REJECTED = 'REJECTED', // When the document is rejected by the admin
  COMPLETED = 'COMPLETED', // When the document is reunited with the owner
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

export interface LostDocumentCase {
  id: string;
  caseId: string;
  case?: DocumentCase;
  status: LostDocumentCaseStatus;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}
export interface FoundDocumentCase {
  id: string;
  caseId: string;
  case?: DocumentCase;
  status: FoundDocumentCaseStatus;
  createdAt: string;
  updatedAt: string;
  pointAwarded: number;
  securityQuestion: Array<SecurityQuestion>;
  voided: boolean;
}

export interface DocumentField {
  id: string;
  documentId: string;
  document?: Document;
  fieldName: string;
  fieldValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  caseId: string;
  case?: DocumentCase;
  serialNumber?: string;
  documentNumber?: string;
  batchNumber?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Unknown';
  nationality?: string;
  bloodGroup?: string;
  placeOfIssue?: string;
  note?: string;
  issuer: string;
  ownerName: string;
  typeId: string;
  reportId: string;
  issuanceDate: string;
  expiryDate: string;
  createdAt: string;
  voided: boolean;
  type: Type;
  images: Array<DocumentImage>;
  additionalFields?: Array<DocumentField>;
}

export interface DocumentImage {
  id: string;
  url: string;
  documentId: string;
}

export interface Type {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  replacementInstructions: string;
  averageReplacementCost: number;
  requiredVerification: string;
  voided: boolean;
}

export interface AsyncState<TData = any, TError extends Error = Error> {
  isLoading: boolean;
  error?: TError;
  data?: TData;
}

export interface Extraction {
  id: string;
}

export interface AdditionalField {
  fieldName: string;
  fieldValue: string;
}

export type CaseType = 'LOST' | 'FOUND';

export type FoundDocumentCaseFormData = z.infer<typeof FoundDocumentCaseSchema>;

export type LostDocumentCaseFormData = z.infer<typeof LostDocumentCaseSchema>;
export type CaseDocumentFormData = z.infer<typeof CaseDocumentSchema>;
