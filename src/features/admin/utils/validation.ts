import { z } from "zod";

export const DocumentTypeSchema = z.object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    icon: z.string().min(1, "Icon required").optional(),
    isActive: z.boolean().optional(),
    replacementInstructions: z.string().optional(),
    averageReplacementCost: z.number({ coerce: true }).optional(),
    requiredVerification: z.enum(["LOW", "STANDARD", "HIGH", "INSTITUTIONAL"]),
  });