import { FoundDocumentCase, LostDocumentCase } from '../cases/types';

export interface Layer2FieldScore {
  weightedScore: number;
  threshold: number;
  fields: Layer2FieldDto[];
}

export interface Layer2FieldDto {
  field: string;
  triggerValue?: string | null;
  candidateValue?: string | null;
  maskedCandidatevalue?: string | null;
  matched: boolean;
  score: number;
  weight: number;
  contribution: number;
}

export interface Match {
  id: string;
  matchNumber: string;
  vectorScore: number;
  exactScore: number;
  finalScore: number;
  lostDocumentCaseId: string;
  lostDocumentCase: LostDocumentCase;
  foundDocumentCaseId: string;
  foundDocumentCase: FoundDocumentCase;
  verdict: MatchVerdict;
  aiVerificationResult?: AiAnalysis;
  securityQuestions: { question: string; answer: string }[];
  layer2FieldScores?: Layer2FieldScore;
  status: MatchStatus;
  createdAt: string;
  updatedAt: string;
  notifiedAt?: string;
  viewedAt?: string;
  voided: boolean;
}

export enum MatchVerdict {
  VERIFIED_MATCH = 'VERIFIED_MATCH', // overwhelming evidence — same person, same document
  PROBABLE_MATCH = 'PROBABLE_MATCH', // strong evidence — minor discrepancies explainable by OCR
  POSSIBLE_MATCH = 'POSSIBLE_MATCH', // partial evidence — needs human review
  NO_MATCH = 'NO_MATCH', // evidence conflicts — not the same document or person
}
export interface AiAnalysis {
  verdict: MatchVerdict;
  confidence: MatchConfidence;
  recommendation: MatchVerdict;
  reasoning: string;
  fieldAnalysis: FieldAnalysis[];
  matchingFields: string[];
  conflictingFields: string[];
  redFlags: string[];
  confidenceFactors: ConfidenceFactors;
}

enum FieldMatch {
  YES = 'YES',
  PARTIAL = 'PARTIAL',
  NO = 'NO',
  MISSING = 'MISSING',
}
export interface FieldAnalysis {
  field: string;
  match: FieldMatch;
  triggerValue: number;
  candidateValue: string;
}

export interface ConfidenceFactors {
  strengths: string[];
  weaknesses: string[];
}

export enum MatchStatus {
  PENDING = 'PENDING', // Match found, awaiting user action
  REJECTED = 'REJECTED', // User rejected match
  CLAIMED = 'CLAIMED', // User claimed this match
}

export enum MatchConfidence {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NO_MATCH = 'NO_MATCH',
}
