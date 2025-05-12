import { z } from 'zod';

export const DocumentTypeSchema = z.object({
  name: z.string().min(1),
  category: z.enum([
    'IDENTITY',
    'ACADEMIC',
    'PROFESSIONAL',
    'VEHICLE',
    'FINANCIAL',
    'MEDICAL',
    'LEGAL',
    'OTHER',
  ]),
  description: z.string().nullable().optional(),
  icon: z.string().min(1, 'Icon required').optional(),
  loyaltyPoints: z.number({ coerce: true }),
  replacementInstructions: z.string().optional(),
  averageReplacementCost: z.number({ coerce: true }).optional(),
});
