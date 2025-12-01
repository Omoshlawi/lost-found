import { z } from 'zod';

export const DocumentImageItemSchema = z.object({
  url: z.string(),
  imageType: z.enum(['FRONT', 'BACK', 'FULL']).optional(),
});

export const DocumentImageSchema = z.object({
  images: DocumentImageItemSchema.array(),
});

export const CaseDocumentFieldSchema = z.object({
  documentId: z.string().uuid(),
  fieldName: z.string().min(1, 'Required'),
  fieldValue: z.string().min(1, 'Required'), // All values stored as strings and converted as needed
});

export const CaseDocumentSchema = z.object({
  serialNumber: z.string().optional(), // Secondary identifier like serial number if present
  documentNumber: z.string().optional(), // Generic document number (ID number, passport number, etc.)
  batchNumber: z.string().optional(), // Batch number if available
  issuer: z.string().optional(),
  ownerName: z.string().min(1, 'Owner name required'),
  dateOfBirth: z.coerce.date().optional(), // Owner's date of birth
  placeOfBirth: z.string().optional(), // Owner's place of birth
  placeOfIssue: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Unknown']).optional(), // Owner's gender
  nationality: z.string().optional(),
  note: z.string().optional(), // Additional notes, could be also any identifying marks on document as well, any instruction,e.t.c
  typeId: z.string().min(1, 'Type required'),
  issuanceDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
  images: DocumentImageItemSchema.array().optional(),
  additionalFields: CaseDocumentFieldSchema.omit({ documentId: true }).array().optional(),
});

export const DocumentFieldSchema = z.object({
  documentId: z.string().uuid(),
  fieldName: z.string().min(1, 'Required'),
  fieldValue: z.string().min(1, 'Required'),
});

export const DocumentCaseSchema = z.object({
  documentId: z.string().min(1),
  addressId: z.string().min(1),
  description: z.string().optional(),
  eventDate: z.coerce.date(),
  tags: z.string().min(1).array().optional(),
  status: z.enum([
    'ACTIVE',
    'MATCHED',
    'RETURNED',
    'EXPIRED',
    'CLAIMED',
    'PENDING_VERIFICATION',
    'ARCHIVED',
  ]),
});

export const FoundDocumentCaseSchema = z.object({
  addressId: z.string().uuid(),
  eventDate: z.coerce.date(),
  tags: z.string().min(1).array().optional(),
  description: z.string().optional(),
});

export const LostDocumentCaseSchema = FoundDocumentCaseSchema.merge(CaseDocumentSchema).omit({
  images: true,
});
