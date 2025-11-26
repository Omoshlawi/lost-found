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

const optionalLongString = z
  .string()
  .trim()
  .max(2000, 'Too long')
  .optional()
  .or(z.literal(''))
  .transform((value) => value || undefined);

const localeLevelSchema = z.object({
  label: z.string().trim().min(1, 'Label is required').max(255),
  level: z.enum(levelKeys, {
    errorMap: () => ({ message: 'Level must be level1-level5' }),
  }),
  required: z.boolean().default(true),
  aliases: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'Alias cannot be empty')
        .max(100, 'Alias too long')
    )
    .optional(),
  helperText: optionalLongString,
});

const validationRuleSchema = z.object({
  field: z.string().trim().min(1, 'Field key is required').max(64),
  rule: z.string().trim().min(1, 'Validation rule is required').max(512),
});

const metadataSchema = z
  .object({
    instructions: optionalLongString,
    preferredFields: z
      .array(
        z
          .string()
          .trim()
          .min(1, 'Preferred field cannot be empty')
          .max(64, 'Preferred field too long')
      )
      .optional(),
    validationRules: z.array(validationRuleSchema).optional(),
  })
  .partial();

const postalCodeSchema = z.object({
  label: z.string().trim().min(1, 'Label is required').max(64),
  required: z.boolean().default(true),
  description: optionalLongString,
});

const exampleAddressEntrySchema = z.object({
  field: z.string().trim().min(1, 'Field name is required').max(64),
  value: z.string().trim().min(1, 'Value is required').max(255),
});

const exampleSchema = z.object({
  label: z.string().trim().min(1, 'Label is required').max(255),
  notes: optionalLongString,
  addressEntries: z
    .array(exampleAddressEntrySchema)
    .min(1, 'Add at least one address field'),
});

export const AddressLocaleFormSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(64),
  country: z
    .string()
    .trim()
    .length(2, 'Use ISO 3166-1 alpha-2')
    .transform((value) => value.toUpperCase()),
  regionName: z.string().trim().min(1, 'Region name is required').max(255),
  description: optionalLongString,
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'Tag cannot be empty')
        .max(64, 'Tag too long')
    )
    .optional(),
  formatSpec: z.object({
    displayTemplate: optionalLongString,
    levels: z.array(localeLevelSchema).min(1, 'Add at least one level'),
    metadata: metadataSchema.optional(),
    postalCode: postalCodeSchema.partial().optional(),
  }),
  examples: z.array(exampleSchema).optional(),
});

export type AddressLocaleFormSchemaType = typeof AddressLocaleFormSchema;

