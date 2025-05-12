import { z } from 'zod';
import { DocumentReportSchema, ReportLostOrFoundDocumentSchema } from '../utils';

export interface DocumentReport {
  id: string;
  userId: string;
  lostOrFoundDate: string;
  countyCode: string;
  county?: County;
  subCountyCode: string;
  subCounty?: SubCounty;
  wardCode: string;
  ward?: Ward;
  landMark?: string;
  tags: string[];
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
  lostReport?: LostReport;
  foundReport?: FoundReport;
  document?: Document;
}

export interface LostReport {
  id: string;
  reportId: string;
  createdAt: string;
  updatedAt: string;
  contactPreference: string;
  voided: boolean;
}
export interface FoundReport {
  id: string;
  reportId: string;
  createdAt: string;
  updatedAt: string;
  handoverPreference: string;
  securityQuestion: any;
  securityAnswer: any;
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
  serialNumber?: string;
  documentNumber?: string;
  batchNumber?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  gender?: string;
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

export interface County {
  code: string;
  name: string;
  subCounties: SubCounty[];
}

export interface SubCounty {
  code: string;
  name: string;
  countyCode: string;
  wards: Ward[];
}

export interface Ward {
  code: string;
  name: string;
  countyCode: string;
  subCountyCode: string;
}

export type DocumentReportFormData = z.infer<typeof ReportLostOrFoundDocumentSchema>;

export type ReportType = 'Lost' | 'Found' | 'Unknown';
