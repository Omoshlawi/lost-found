import { User } from 'better-auth';
import { z } from 'zod';
import { FoundDocumentCase } from '../cases/types';
import { Match } from '../matches/types';
import { claimFormSchema, rejectClaimSchema, verifyClaimSchema } from './utils/validation';

export enum ClaimStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export interface ClaimAttachment {
  id: string;
  claimId: string;
  storageKey: string;
  uploadedById: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  userId: string;
  user?: User;
  foundDocumentCaseId: string;
  foundDocumentCase: FoundDocumentCase;
  attachments: ClaimAttachment[];
  matchId: string;
  match?: Match;
  status: ClaimStatus;
  pickupStationId?: string;
  preferredHandoverDate?: string;
  verification: ClaimVerification;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimVerification {
  id: string;
  claimId: string;
  userResponses: ClaimUserResponse[];
  passed: boolean;
  createdAt: string;
}

export interface ClaimUserResponse {
  question: string;
  response: string;
}

export type ClaimFormData = z.infer<typeof claimFormSchema>;
export type RejectClaimFormData = z.infer<typeof rejectClaimSchema>;
export type VerifyClaimFormData = z.infer<typeof verifyClaimSchema>;
