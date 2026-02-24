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
  role: string | null;
};

export type BanUserPayload = {
  userId: string;
  banReason?: string;
  banExpiresIn?: number;
};
