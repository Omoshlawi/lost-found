import { z } from 'zod';
import { statusTransitionReasonsSchema } from '@/features/status-transitions/utils/validation';

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

export const rejectClaimSchema = statusTransitionReasonsSchema;
export const verifyClaimSchema = statusTransitionReasonsSchema;
export const cancelClaimSchema = statusTransitionReasonsSchema;
