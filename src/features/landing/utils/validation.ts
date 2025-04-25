import { boolean, z } from 'zod';
import { PHONE_NUMBER_REGEX } from '@/constants';

export const LoginValidationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
  rememberMe: boolean().optional(),
});
export const RegistrationValidationSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    // phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, 'Invalid phone number'),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
    confirmPassword: z.string().min(4, 'Password must be at least 4 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });
export const PasswordResetValidationSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });
export const PasswordChangeValidationSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password is required'),
    newPassword: z.string().min(8, 'New password is required'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
  });
export const EmailChangeValidationSchema = z
  .object({
    currentEmail: z.string().email('Invalid email address'),
    newEmail: z.string().email('Invalid email address'),
    confirmEmail: z.string().email('Invalid email address'),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    message: "Emails don't match",
  });
