import { z } from 'zod';

const addressTypeEnum = z.enum(['HOME', 'WORK', 'BILLING', 'SHIPPING', 'OFFICE', 'OTHER']);
const levelKeys = ['level1', 'level2', 'level3', 'level4', 'level5'] as const;

const optionalString = z
  .string()
  .trim()
  .max(255, 'Too long')
  .optional()
  .or(z.literal(''))
  .transform((value) => value || undefined);

const optionalNullableString = z
  .string()
  .trim()
  .max(255, 'Too long')
  .optional()
  .or(z.literal(''))
  .transform((value) => (value ? value : undefined));

const isoDateString = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((value) => (value ? value : undefined))
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
    message: 'Invalid date',
  })
  .transform((value) => (value ? new Date(value).toISOString() : undefined));

export const AddressSchema = z.object({
  type: addressTypeEnum,
  label: optionalNullableString,
  address1: z.string().trim().min(1, 'Address line 1 is required').max(255),
  address2: optionalNullableString,
  landmark: optionalNullableString,
  level1: z.string().trim().min(1, 'Level 1 is required').max(255),
  level2: optionalNullableString,
  level3: optionalNullableString,
  level4: optionalNullableString,
  level5: optionalNullableString,
  cityVillage: optionalNullableString,
  stateProvince: optionalNullableString,
  country: z
    .string()
    .trim()
    .length(2, 'Use ISO 3166-1 alpha-2 code')
    .transform((value) => value.toUpperCase()),
  postalCode: optionalNullableString,
  latitude: z
    .number({ coerce: true })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .nullable()
    .optional(),
  longitude: z
    .number({ coerce: true })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .nullable()
    .optional(),
  plusCode: optionalNullableString,
  startDate: isoDateString,
  endDate: isoDateString.nullable(),
  preferred: z.boolean().default(false),
  formatted: optionalNullableString,
  localeFormat: z
    .object(
      levelKeys.reduce(
        (shape, key) => ({
          ...shape,
          [key]: optionalNullableString,
        }),
        {} as Record<(typeof levelKeys)[number], typeof optionalNullableString>
      )
    )
    .partial()
    .optional(),
});

export type AddressSchemaType = typeof AddressSchema;

