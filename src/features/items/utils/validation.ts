import { z } from 'zod';

export const DocumentImageSchema = z
  .object({
    url: z.string().min(1, 'Required'),
    imageType: z.enum(['FRONT', 'BACK', 'FULL']).optional(),
    ocrText: z.string().optional(),
  })
  .array();

export const DocumentFieldSchema = z.object({
  documentId: z.string().uuid(),
  fieldName: z.string().min(1, 'Required'),
  fieldValue: z.string().min(1, 'Required'),
});

export const DocumentSchema = z.object({
  serialNumber: z.string().optional(),
  documentNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  issuer: z.string().optional(),
  ownerName: z.string().min(1, 'Owner name required'),
  dateOfBirth: z.date({ coerce: true }).optional(),
  placeOfBirth: z.string().optional(),
  placeOfIssue: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Unknown']).optional(),
  nationality: z.string().optional(),
  bloodGroup: z.string().optional(),
  note: z.string().optional(),
  typeId: z.string().min(1, 'Type required'),
  issuanceDate: z.date({ coerce: true }).optional(),
  expiryDate: z.date({ coerce: true }).optional(),
  images: DocumentImageSchema.optional(),
  additionalFields: DocumentFieldSchema.omit({ documentId: true }).array().optional(),
});

export const LostDocumentReportSchema = z.object({
  reportId: z.string().min(1, 'Report required').uuid(),
  contactPreference: z.enum(['APP', 'EMAIL', 'PHONE', 'ANY']).optional(),
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

export const _ReportLostOrFoundDocumentSchema = DocumentReportSchema.omit({
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
export const ReportLostOrFoundDocumentPartialSchema = _ReportLostOrFoundDocumentSchema
  .partial()
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

export const ImageProcessOptionsSchema = z.object({
  width: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  height: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  fit: z.enum(['cover', 'contain', 'fill', 'inside', 'outside']).optional(),
  grayScale: z.boolean().optional(),
  contrast: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  brightness: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  hue: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  saturation: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  lightness: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  sharpness: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  blur: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
  normalize: z.boolean().optional(),
  threshold: z
    .number({ coerce: true })
    .refine((n) => n !== 0, 'Cannot be zero')
    .optional(),
});

export const OCRImageProcessingOptions = ImageProcessOptionsSchema.extend({
  path: z.string().min(1, 'Required').startsWith('uploads', 'Invalid file path').optional(),
  mode: z.enum(['preview', 'scanned']).optional().optional(),
});
