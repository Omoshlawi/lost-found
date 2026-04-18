import { z } from 'zod';

export const GrantStaffOperationSchema = z.object({
  userId: z.string().nonempty('Please select a staff member'),
  stationId: z.string().uuid('Please select a station'),
  operationTypeIds: z.array(z.string().uuid()).min(1, 'Select at least one operation type'),
});

// ── New operation form ────────────────────────────────────────────────────────

/**
 * Schema factory — accepts the currently selected operation type so that
 * conditional required rules (notes, destination station) can be enforced
 * by Zod rather than ad-hoc imperative checks.
 */
export const makeNewOperationSchema = (opType?: {
  requiresNotes?: boolean;
  requiresDestinationStation?: boolean;
}) =>
  z
    .object({
      operationTypeId: z.string().min(1, 'Select an operation type'),
      foundCaseIds: z.array(z.string()).min(1, 'Select at least one document'),
      stationId: z.string().nullable().optional(),
      toStationId: z.string().nullable().optional(),
      notes: opType?.requiresNotes
        ? z.string().min(1, 'Notes are required for this operation type')
        : z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (opType?.requiresDestinationStation && !data.toStationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Destination station is required for this operation type',
          path: ['toStationId'],
        });
      }
    });

export type NewOperationFormData = z.infer<ReturnType<typeof makeNewOperationSchema>>;
