import { z } from 'zod';

export const GrantStaffOperationSchema = z.object({
  userId: z.string().nonempty('Please select a staff member'),
  stationId: z.string().uuid('Please select a station'),
  operationTypeIds: z.array(z.string().uuid()).min(1, 'Select at least one operation type'),
});
