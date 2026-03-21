import { z } from 'zod';
import { TemplateType } from '../types';

export const templateShema = z.object({
  key: z.string().nonempty('Key is required'),
  type: z.enum([TemplateType.Notification, TemplateType.Prompt, TemplateType.Invoice]),
  name: z.string().nonempty('Name is required'),
  description: z.string().optional(),
  slots: z.record(z.string(), z.string()),
  schema: z.object({
    required: z.string().array(),
    optional: z.string().array(),
  }),
  metadata: z.record(z.string(), z.any()),
});
