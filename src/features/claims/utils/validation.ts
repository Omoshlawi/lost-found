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
