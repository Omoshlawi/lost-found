import { z } from 'zod';
import { User as SessionUser } from '@/lib/global-store';
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

export interface User extends SessionUser {
  accounts?: Account[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  refresh_expire_at?: string;
  access_token?: string;
  expires_at?: string;
  token_type?: string;
  scope?: string;
  voided: boolean;
  id_token?: string;
  createdAt: string;
  updatedAt: string;
}
