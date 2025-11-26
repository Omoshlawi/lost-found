import { z } from 'zod';
import type { DocumentCase } from '@/features/cases/types';
import { AddressSchema } from './utils/validation';

export type AddressTypeValue = 'HOME' | 'WORK' | 'BILLING' | 'SHIPPING' | 'OFFICE' | 'OTHER';

export type AddressLevelKey = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

export type LocaleFormat = Partial<Record<AddressLevelKey, string>>;

export interface AddressOwner {
  id: string;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface Address {
  id: string;
  userId: string;
  user?: AddressOwner | null;
  type: AddressTypeValue;
  label?: string | null;
  address1: string;
  address2?: string | null;
  landmark?: string | null;
  level1: string;
  level2?: string | null;
  level3?: string | null;
  level4?: string | null;
  level5?: string | null;
  cityVillage?: string | null;
  stateProvince?: string | null;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  plusCode?: string | null;
  startDate: string;
  endDate?: string | null;
  preferred: boolean;
  formatted?: string | null;
  localeFormat?: LocaleFormat | null;
  cases?: DocumentCase[];
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}

export interface AddressHierarchyNode {
  id: string;
  country: string;
  levelKey: AddressLevelKey | string;
  label: string;
  description?: string | null;
  metadata?: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  voided: boolean;
}

export type AddressFormData = z.input<typeof AddressSchema>;
