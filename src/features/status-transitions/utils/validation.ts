import { z } from 'zod';

export const statusTransitionReasonsSchema = z.object({
  reason: z.string().uuid(),
  comment: z.string().optional(),
});
