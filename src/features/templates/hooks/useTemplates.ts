import useSWR from 'swr';
import { apiFetch, APIFetchResponse, constructUrl, mutate } from '@/lib/api';
import {
  InvoiceTemplateMetadata,
  InvoiceTemplateSlots,
  NotificationTemplateMetadata,
  NotificationTemplateSlots,
  PromptTemplateMetadata,
  PromptTemplateSlots,
  Template,
  TemplateFormData,
  TemplateType,
} from '../types';

export const useTemplates = () => {
  const url = constructUrl('/templates');
  const { data, error, isLoading } = useSWR<APIFetchResponse<{ results: Array<Template> }>>(url);
  return {
    templates: data?.data?.results || [],
    isLoading,
    error,
  };
};

const getSlots = (
  type: Template['type'],
  metadata: Template['metadata'],
  slots: Template['slots']
): Partial<Template['slots']> => {
  switch (type) {
    case TemplateType.Invoice:
      return {
        invoice_template: (slots as InvoiceTemplateSlots).invoice_template,
      } as InvoiceTemplateSlots;
    case TemplateType.Notification:
      return {
        email_body: (metadata as NotificationTemplateMetadata).channels.email
          ? (slots as NotificationTemplateSlots).email_body
          : undefined,
        email_subject: (metadata as NotificationTemplateMetadata).channels.email
          ? (slots as NotificationTemplateSlots).email_subject
          : undefined,
        sms_body: (metadata as NotificationTemplateMetadata).channels.sms
          ? (slots as NotificationTemplateSlots).sms_body
          : undefined,
        push_body: (metadata as NotificationTemplateMetadata).channels.push
          ? (slots as NotificationTemplateSlots).push_body
          : undefined,
        push_title: (metadata as NotificationTemplateMetadata).channels.push
          ? (slots as NotificationTemplateSlots).push_title
          : undefined,
      } as NotificationTemplateSlots;
    case TemplateType.Prompt:
      return {
        assistant: (metadata as PromptTemplateMetadata).parts.assistant
          ? (slots as PromptTemplateSlots).assistant
          : undefined,
        user: (metadata as PromptTemplateMetadata).parts.user
          ? (slots as PromptTemplateSlots).user
          : undefined,
        system: (metadata as PromptTemplateMetadata).parts.system
          ? (slots as PromptTemplateSlots).system
          : undefined,
      } as PromptTemplateSlots;
    default:
      return {};
  }
};

const getMetadata = (
  type: Template['type'],
  metadata: Template['metadata']
): Partial<Template['metadata']> => {
  switch (type) {
    case TemplateType.Invoice:
      return {
        currency: (metadata as InvoiceTemplateMetadata).currency,
        locale: (metadata as InvoiceTemplateMetadata).locale,
      } as InvoiceTemplateMetadata;
    case TemplateType.Notification:
      return {
        channels: (metadata as NotificationTemplateMetadata).channels,
      } as NotificationTemplateMetadata;
    case TemplateType.Prompt:
      return {
        max_tokens: (metadata as PromptTemplateMetadata).max_tokens,
        model: (metadata as PromptTemplateMetadata).model,
        parts: (metadata as PromptTemplateMetadata).parts,
        temperature: (metadata as PromptTemplateMetadata).temperature,
        top_p: (metadata as PromptTemplateMetadata).top_p,
      } as PromptTemplateMetadata;
    default:
      return {};
  }
};

const createTemplate = async (data: TemplateFormData) => {
  const url = constructUrl('/templates');
  const res = await apiFetch<Template>(url, {
    method: 'POST',
    data: {
      key: data.key,
      name: data.name,
      type: data.type,
      description: data.description,
      slots: getSlots(data.type, data.metadata as any, data.slots as any),
      metadata: getMetadata(data.type, data.metadata as any),
      schema: data.schema,
    } as TemplateFormData,
  });
  mutate('/templates');
  return res.data;
};

const updateTemplate = async (templateKey: string, data: Partial<TemplateFormData>) => {
  const url = constructUrl(`/templates/key/${templateKey}`);

  const res = await apiFetch<Template>(url, {
    method: 'PATCH',
    data: {
      key: data.key,
      name: data.name,
      type: data.type,
      description: data.description,
      slots:
        data.type && data.metadata
          ? getSlots(data.type, data.metadata as any, data.slots as any)
          : undefined,
      metadata:
        data.type && data.metadata ? getMetadata(data.type, data.metadata as any) : undefined,
      schema: data.schema,
    } as TemplateFormData,
  });
  mutate('/templates');
  return res.data;
};

export const usetemplateApi = () => {
  return {
    createTemplate,
    updateTemplate,
  };
};
