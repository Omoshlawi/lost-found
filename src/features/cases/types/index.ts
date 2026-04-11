import { User } from 'better-auth';
import { z } from 'zod';
import { Address } from '@/features/addresses/types';
import { Station } from '@/features/custody/types';
import { CaseDocumentSchema, FoundDocumentCaseSchema, LostDocumentCaseSchema } from '../utils';

export interface DocumentCase {
  id: string;
  caseNumber: string;
  userId: string;
  user?: User;
  addressId: string;
  extraction?: AIExtraction;
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
  DRAFT = 'DRAFT', // When the lost case is in draft status
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

export interface ImageAnalysisResult {
  index: number;
  imageType: string;
  quality: number;
  readability: number;
  focus: number;
  lighting: number;
  tamperingDetected: boolean;
  warnings: string[];
  usableForExtraction: boolean;
}

export interface ConfidenceScore {
  serialNumber: number;
  documentNumber: number;
  batchNumber: number;
  issuer: number;
  ownerName: number;
  dateOfBirth: number;
  placeOfBirth: number;
  placeOfIssue: number;
  gender: number;
  note: number;
  typeId: number;
  issuanceDate: number;
  expiryDate: number;
  additionalFields: Array<{
    fieldName: string;
    nameScore: number;
    fieldValue: string;
    valueScore: number;
  }>;
}

export interface LostDocumentCase {
  id: string;
  caseId: string;
  case?: DocumentCase;
  status: LostDocumentCaseStatus;
  auto?: boolean;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}
/** Response from GET /documents/cases/found/:id/collect/active */
export interface ActiveCollectionState {
  hasActiveCollection: boolean;
  expiresAt?: string;
  attempts?: number;
  maxAttempts?: number;
  /** Only present when the requesting user is the case owner (finder) */
  code?: string;
}

export interface FoundDocumentCase {
  id: string;
  caseId: string;
  case?: DocumentCase;
  status: FoundDocumentCaseStatus;
  submissionMethod?: SubmissionMethod;
  custodyStatus?: CustodyStatus;
  currentStationId?: string;
  currentStation?: Station;
  createdAt: string;
  updatedAt: string;
  pointAwarded: number;
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

export interface AddressComponent {
  type: string;
  value: string;
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
  ownerName?: string;
  fullName: string;
  surname: string;
  givenNames: string[];
  typeId: string;
  reportId: string;
  issuanceDate: string;
  expiryDate: string;
  createdAt: string;
  voided: boolean;
  type: Type;
  images: DocumentImage[];
  additionalFields?: DocumentField[];
  addressRaw?: string;
  addressCountry?: string;
  addressComponents?: AddressComponent[];
  photoPresent?: boolean;
  fingerprintPresent?: boolean;
  signaturePresent?: boolean;
  isExpired?: boolean;
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

export interface AiInteraction {
  id: string;
  userId: string;
  interactionType: string;
  aiModel: string;
  modelVersion: string;
  entityType: string;
  entityId?: string;
  prompt: string;
  response: string;
  tokenUsage: TokenUsage;
  processingTime?: string;
  estimatedCost?: string;
  success: boolean;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
}

export interface TokenUsage {
  totalTokenCount: number;
  promptTokenCount: number;
  candidatesTokenCount: number;
}

export enum ExtractionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum SubmissionMethod {
  DROPOFF = 'DROPOFF',
  PICKUP = 'PICKUP',
}

export enum CustodyStatus {
  WITH_FINDER = 'WITH_FINDER',
  IN_CUSTODY = 'IN_CUSTODY',
  IN_TRANSIT = 'IN_TRANSIT',
  HANDED_OVER = 'HANDED_OVER',
  DISPOSED = 'DISPOSED',
}

export interface AIExtraction {
  id: string;
  extractionStatus: ExtractionStatus;
  currentStep: 'VISION' | 'TEXT' | 'POST_PROCESSING' | null;
  ocrConfidence?: number;
  extractionConfidence?: number;
  fallbackTriggered?: boolean;
  createdAt: string;
}

export interface AdditionalField {
  fieldName: string;
  fieldValue: string;
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

export type CaseType = 'LOST' | 'FOUND';

export type FoundDocumentCaseFormData = z.infer<typeof FoundDocumentCaseSchema>;

export type LostDocumentCaseFormData = z.infer<typeof LostDocumentCaseSchema>;
export type CaseDocumentFormData = z.infer<typeof CaseDocumentSchema>;
