import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .optional()
    .or(z.literal('')),
  phoneNumber: z
    .string()
    .regex(/^\d{6,12}$/, 'Enter subscriber digits only (e.g. 712345678)')
    .optional()
    .or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
});

export const BanUserSchema = z.object({
  userId: z.string(),
  banReason: z.string().optional(),
  banExpiresIn: z.number().optional(),
});

export const ChangePasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm the password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const SetRoleSchema = z.object({
  userId: z.string(),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
});
