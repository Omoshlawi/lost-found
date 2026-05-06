import { z } from 'zod';
import { SubmissionMethod } from '../types';

export const GrantStaffOperationSchema = z.object({
  userId: z.string().nonempty('Please select a staff member'),
  stationId: z.string().uuid('Please select a station'),
  operationTypeIds: z.array(z.string().uuid()).min(1, 'Select at least one operation type'),
});

// ── New operation form ────────────────────────────────────────────────────────

/**
 * Schema factory — accepts the currently selected operation type so that
 * conditional required rules are enforced by Zod rather than ad-hoc checks.
 *
 * Conditional rules:
 *   requiresDestinationStation → toStationId required    (e.g. TRANSFER_OUT)
 *   requiresSourceStation      → fromStationId required  (e.g. TRANSFER_IN)
 *   requiresNotes              → notes required           (e.g. DISPOSAL)
 *   code === REQUISITION       → requestedByStationId required
 */
export const makeNewOperationSchema = (opType?: {
  code?: string;
  requiresNotes?: boolean;
  requiresDestinationStation?: boolean;
  requiresSourceStation?: boolean;
  requiresTargetArea?: boolean;
}) =>
  z
    .object({
      operationTypeId: z.string().min(1, 'Select an operation type'),
      foundCaseIds: z.array(z.string()).min(1, 'Select at least one document'),
      stationId: z.string().nullable().optional(),
      toStationId: z.string().nullable().optional(),
      fromStationId: z.string().nullable().optional(),
      responsiblePersonId: z.string().nullable().optional(),
      notes: opType?.requiresNotes
        ? z.string().min(1, 'Notes are required for this operation type')
        : z.string().optional(),
      targetArea: z.string().optional(),
      // RECEIPT-specific filter fields (only used in the UI to populate foundCaseIds)
      receiptSubmissionMethod: z
        .enum([SubmissionMethod.DROPOFF, SubmissionMethod.PICKUP])
        .nullable()
        .optional(),
      receiptAreaValue: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (opType?.requiresDestinationStation && !data.toStationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Destination station is required for this operation type',
          path: ['toStationId'],
        });
      }
      if (opType?.requiresSourceStation && !data.fromStationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Source station is required for this operation type',
          path: ['fromStationId'],
        });
      }
      if (opType?.requiresTargetArea && !data.targetArea?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Target area is required for this operation type',
          path: ['targetArea'],
        });
      }
    });

export type NewOperationFormData = z.infer<ReturnType<typeof makeNewOperationSchema>>;
