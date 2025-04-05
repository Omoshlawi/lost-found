import { z } from 'zod';
import {
  EmailChangeValidationSchema,
  LoginValidationSchema,
  PasswordChangeValidationSchema,
  PasswordResetValidationSchema,
  RegistrationValidationSchema,
} from '../utils/validation';

export type LoginFormData = z.infer<typeof LoginValidationSchema>;
export type RegistrationFormData = z.infer<typeof RegistrationValidationSchema>;
export type PasswordResetFormData = z.infer<typeof PasswordResetValidationSchema>;
export type PasswordChangeFormData = z.infer<typeof PasswordChangeValidationSchema>;
export type EmailChangeFormData = z.infer<typeof EmailChangeValidationSchema>;
