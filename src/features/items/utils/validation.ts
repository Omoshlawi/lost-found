import { z } from 'zod';

export const DocumentTypeSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  icon: z.string().min(1, 'Icon required').optional(),
  isActive: z.boolean().optional(),
  replacementInstructions: z.string().optional(),
  averageReplacementCost: z.number({ coerce: true }).optional(),
  requiredVerification: z.enum(['LOW', 'STANDARD', 'HIGH', 'INSTITUTIONAL']),
});

export const DocumentImageSchema = z.object({
  url: z.string().min(1, 'Required'),
});

export const DocumentSchema = z.object({
  serialNumber: z.string().optional(),
  issuer: z.string().optional(),
  ownerName: z.string().min(1, 'Owner name required'),
  typeId: z.string().min(1, 'Type required'),
  issuanceDate: z.date({ coerce: true }).optional(),
  expiryDate: z.date({ coerce: true }).optional(),
  images: DocumentImageSchema.array().optional(),
});

export const LostDocumentReportSchema = z.object({
  reportId: z.string().min(1, 'Report required').uuid(),
  identifyingMarks: z.string().optional().optional(),
  contactPreference: z.enum(['APP', 'EMAIL', 'PHONE', 'ANY']),
  urgencyLevel: z.enum(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']),
});

export const FoundDocumentReportSchema = z.object({
  reportId: z.string().min(1, 'Report required').uuid(),
  handoverPreference: z.enum(['IN_PERSON', 'THROUGH_AUTHORITY', 'THIRD_PARTY', 'MAIL']),
  securityQuestion: z.string().optional().optional(),
  securityAnswer: z.string().optional().optional(),
});

export const DocumentReportSchema = z.object({
  documentId: z.string().min(1),
  countyCode: z.string().min(1),
  subCountyCode: z.string().min(1),
  wardCode: z.string().min(1),
  landMark: z.string().optional(),
  description: z.string().optional(),
  lostOrFoundDate: z.date({ coerce: true }),
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

const _ReportLostOrFoundDocumentSchema = DocumentReportSchema.omit({
  documentId: true,
  status: true,
}).merge(
  z.object({
    type: z.enum(['LOST', 'FOUND']),
    document: DocumentSchema,
    lost: LostDocumentReportSchema.omit({ reportId: true }).optional(),
    found: FoundDocumentReportSchema.omit({ reportId: true }).optional(),
  })
);

export const ReportLostOrFoundDocumentSchema = _ReportLostOrFoundDocumentSchema
  .refine(
    (data) => {
      if (data.type === 'LOST') return data.lost !== undefined;
      return true;
    },
    {
      message: 'Lost details are required when type is LOST',
      path: ['lost'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'FOUND') return data.found !== undefined;
      return true;
    },
    {
      message: 'Found details are required when type is FOUND',
      path: ['found'],
    }
  );
