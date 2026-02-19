import { z } from 'zod';

export const claimFormSchema = z.object({
  securityQuestions: z
    .object({
      question: z.string(),
      response: z.string().nonempty(),
    })
    .array()
    .min(4),
  matchId: z.string().uuid(),
  // attachments: z.string().nonempty().array().nonempty().max(2),
});

export const ClaimStatusTransitionSchema = z.object({
  reason: z.enum([
    'USER_DISPUTE_SUBMITTED',
    'ADDITIONAL_EVIDENCE_PROVIDED',
    'REVIEW_REQUESTED',
    'DISPUTE_REVIEW_COMPLETED',

    'OTHER',
  ]),
  comment: z.string().optional(),
});

export const rejectClaimSchema = ClaimStatusTransitionSchema.pick({
  comment: true,
}).extend({
  reason: z.enum([
    'INVALID_DOCUMENT',
    'INCOMPLETE_DOCUMENTATION',
    'INCORRECT_INFORMATION',
    'DUPLICATE_CLAIM',
    'NOT_ELIGIBLE',
    'POLICY_VIOLATION',
    'FRAUD_SUSPECTED',
    'FRAUD_CONFIRMED',
    'NEW_EVIDENCE_INVALIDATES_CLAIM',
    'VERIFIED_BY_MISTAKE',
    'OTHER',
  ]),
});
export const verifyClaimSchema = ClaimStatusTransitionSchema.pick({
  comment: true,
}).extend({
  reason: z.enum([
    'DOCUMENTS_VALIDATED',
    'MANUAL_REVIEW_APPROVED',
    'DISPUTE_RESOLVED_IN_FAVOR',
    'ADDITIONAL_EVIDENCE_ACCEPTED',
    'OTHER',
  ]),
});
export const cancelClaimSchema = ClaimStatusTransitionSchema.pick({
  comment: true,
}).extend({
  reason: z.enum(['USER_WITHDREW_DISPUTE', 'DUPLICATE_SUBMISSION', 'OTHER']),
});