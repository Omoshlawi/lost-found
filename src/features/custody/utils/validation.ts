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
 *   requiresCounterpartStation → counterpartStationId required  (e.g. TRANSFER_OUT, TRANSFER_IN, REQUISITION)
 *   requiresNotes              → notes required                  (e.g. DISPOSAL)
 */
export const makeNewOperationSchema = (opType?: {
  code?: string;
  requiresNotes?: boolean;
  requiresCounterpartStation?: boolean;
  requiresTargetArea?: boolean;
}) =>
  z
    .object({
      operationTypeId: z.string().min(1, 'Select an operation type'),
      foundCaseIds: z.array(z.string()).min(1, 'Select at least one document'),
      stationId: z.string().nullable().optional(),
      counterpartStationId: z.string().nullable().optional(),
      responsiblePersonId: z.string().nullable().optional(),
      notes: z.string().optional().nullable(),
      targetArea: z.string().optional(),
      // RECEIPT-specific filter fields (only used in the UI to populate foundCaseIds)
      receiptSubmissionMethod: z
        .enum([SubmissionMethod.STATION_DROPOFF, SubmissionMethod.AGENT_PICKUP])
        .nullable()
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (opType?.requiresCounterpartStation && !data.counterpartStationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Counterpart station is required for this operation type',
          path: ['counterpartStationId'],
        });
      }
      if (opType?.requiresTargetArea && !data.targetArea?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Target area is required for this operation type',
          path: ['targetArea'],
        });
      }
      if (opType?.requiresNotes && !data.notes?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Notes are required for this operation type',
          path: ['notes'],
        });
      }
    });

export type NewOperationFormData = z.infer<ReturnType<typeof makeNewOperationSchema>>;
