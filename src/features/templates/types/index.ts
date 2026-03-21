import { z } from 'zod';
import { templateShema } from '../utils/validation';

export interface BaseTemplate {
  id: string;
  key: string;
  name: string;
  description?: string;
  engine: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
export enum TemplateType {
  Notification = 'notification',
  Prompt = 'prompt',
  Invoice = 'invoice',
}

export interface TemplateSchema<T extends string> {
  required: Array<T>;
  optional: Array<T>;
}

// Notification interfaces
export interface NotificationTemplateSlots {
  email_subject: string;
  email_body: string;
  sms_body: string;
  push_title: string;
  push_body: string;
  push_data: string;
  push_channel: string;
}

export interface NotificationTemplateMetadata {
  channels: {
    email: true;
    sms: true;
    push: true;
  };
}

export interface NotificationTemplate extends BaseTemplate {
  type: TemplateType.Notification;
  slots: NotificationTemplateSlots;
  schema: TemplateSchema<keyof NotificationTemplateSlots>;
  metadata: NotificationTemplateMetadata;
}

// Prompts interface
export interface PromptTemplateSlots {
  system: string;
  user: string;
  assistant: string;
}

export interface PromptTemplateMetadata {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  parts: {
    user: boolean;
    system: boolean;
    assistant: boolean;
  };
}

export interface PromptTemplate extends BaseTemplate {
  type: TemplateType.Prompt;
  slots: PromptTemplateSlots;
  schema: TemplateSchema<keyof PromptTemplateSlots>;
  metadata: PromptTemplateMetadata;
}

// Invoice interfaces
export interface InvoiceTemplateSlots {
  invoice_template: string;
}

export interface InvoiceTemplateMetadata {
  currency: string;
  locale: string;
}

export interface InvoiceTemplate extends BaseTemplate {
  type: TemplateType.Invoice;
  slots: InvoiceTemplateSlots;
  schema: TemplateSchema<keyof InvoiceTemplateSlots>;
  metadata: InvoiceTemplateMetadata;
}

// Union type for all templates
export type Template = NotificationTemplate | PromptTemplate | InvoiceTemplate;
export type TemplateFormData = z.infer<typeof templateShema>;
