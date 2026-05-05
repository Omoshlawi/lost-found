import { z } from 'zod';
import { BanUserSchema, ChangePasswordSchema, CreateUserSchema, SetRoleSchema } from '../utils';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  username?: string;
  displayUsername?: string;
  role?: string;
  banned: boolean;
  banReason?: string;
  banExpires?: string;
  twoFactorEnabled: boolean;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
}

export interface UserSession {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  impersonatedBy?: string;
}

export type UserRolePayload = {
  userId: string;
  role: string | string[] | null;
};

export type CreateUserFormData = z.infer<typeof CreateUserSchema>;
export type BanUserFormData = z.infer<typeof BanUserSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
export type SetRoleFormData = z.infer<typeof SetRoleSchema>;

/** @deprecated Use BanUserFormData — kept for hook backwards compatibility */
export type BanUserPayload = BanUserFormData;
