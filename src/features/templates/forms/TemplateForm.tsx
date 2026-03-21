import React, { FC, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { RichTextEditorInput, SectionTitle } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { usetemplateApi } from '../hooks';
import {
  NotificationTemplateMetadata,
  PromptTemplateMetadata,
  Template,
  TemplateFormData,
  TemplateType,
} from '../types';
import { templateShema } from '../utils/validation';

type TemplateFormProps = {
  template?: Template;
  onClose: () => void;
  onSuccess?: (template: Template) => void;
};

const TemplateForm: FC<TemplateFormProps> = ({ template, onClose, onSuccess }) => {
  const { createTemplate, updateTemplate } = usetemplateApi();
  const form = useForm({
    defaultValues: {
      key: template?.key || '',
      type: template?.type || undefined,
      name: template?.name || '',
      description: template?.description || '',
      slots: (template?.slots || {}) as unknown as Record<string, string>,
      schema: template?.schema || { required: [], optional: [] },
      metadata: {
        // ...template?.metadata,
        channels: (template?.metadata as NotificationTemplateMetadata)?.channels ?? {},
        parts: (template?.metadata as PromptTemplateMetadata)?.parts ?? {},
      } as Template['metadata'],
    },
    resolver: zodResolver(templateShema),
  });
  const reasons = useMemo(
    () => [
      { value: TemplateType.Notification, label: 'Notification' },
      { value: TemplateType.Invoice, label: 'Invoice' },
      { value: TemplateType.Prompt, label: 'Prompt' },
    ],
    []
  );
  const selectedType = form.watch('type');

  const handleSubmit: SubmitHandler<TemplateFormData> = async (data) => {
    try {
      let templateRes;
      if (template) {
        templateRes = await updateTemplate(template.key, data);
      } else {
        templateRes = await createTemplate(data);
      }
      onSuccess?.(templateRes);
      showNotification({
        title: 'Claim rejected',
        message: 'Claim rejected successfully',
        color: 'green',
      });
      onClose();
    } catch (error) {
      const e = handleApiErrors<TemplateFormData>(error);
      if (e.detail) {
        showNotification({
          title: `Error rejecting claim`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof TemplateFormData, { message: val })
        );
      }
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack p="md" h="100%" justify="space-between">
        <Stack gap="md">
          <SectionTitle label="Basic Details" />
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Name"
                error={fieldState.error?.message}
                placeholder="Template name"
              />
            )}
          />
          <Controller
            control={form.control}
            name="key"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Key"
                error={fieldState.error?.message}
                placeholder="Template key"
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Description"
                error={fieldState.error?.message}
                placeholder="Add a description"
              />
            )}
          />
          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Select
                data={reasons}
                label="Template Type"
                value={field.value}
                placeholder="Select a template type"
                onChange={(_value, _option) => field.onChange(_value)}
                error={fieldState.error?.message}
                ref={field.ref}
                clearable
              />
            )}
          />

          {selectedType === TemplateType.Prompt && (
            <>
              <SectionTitle label="AI Options" />
              <Controller
                control={form.control}
                name="metadata.model"
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label="AI Model"
                    error={fieldState.error?.message}
                    placeholder="Enter model name"
                  />
                )}
              />
              <Controller
                control={form.control}
                name="metadata.temperature"
                render={({ field, fieldState }) => (
                  <NumberInput
                    {...field}
                    label="Temprature"
                    error={fieldState.error?.message}
                    placeholder="Enter temperature"
                  />
                )}
              />
              <Controller
                control={form.control}
                name="metadata.top_p"
                render={({ field, fieldState }) => (
                  <NumberInput
                    {...field}
                    label="Top p"
                    error={fieldState.error?.message}
                    placeholder=""
                  />
                )}
              />
              <Controller
                control={form.control}
                name="metadata.max_tokens"
                render={({ field, fieldState }) => (
                  <NumberInput
                    {...field}
                    label="Max tokens"
                    error={fieldState.error?.message}
                    placeholder=""
                  />
                )}
              />
            </>
          )}

          {selectedType === TemplateType.Notification && (
            <Paper p="sm" withBorder radius="md">
              <Text mb="sm">Channels:</Text>
              <Group gap="xs" style={{ flexWrap: 'wrap' }}>
                <Controller
                  control={form.control}
                  name="metadata.channels.email"
                  render={({ field, fieldState }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                      label="Email"
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="metadata.channels.push"
                  render={({ field, fieldState }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                      label="Push"
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="metadata.channels.sms"
                  render={({ field, fieldState }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                      label="SMS"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </Group>
            </Paper>
          )}
          {selectedType === TemplateType.Prompt && (
            <Paper p="sm" withBorder radius="md">
              <Text mb="sm">Parts:</Text>
              <Group gap="xs" style={{ flexWrap: 'wrap' }}>
                <Controller
                  control={form.control}
                  name="metadata.parts.system"
                  render={({ field, fieldState }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                      label="System"
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="metadata.parts.user"
                  render={({ field, fieldState }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                      label="User"
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="metadata.parts.assistant"
                  render={({ field, fieldState }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                      label="Assistant"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </Group>
            </Paper>
          )}

          {selectedType === TemplateType.Notification && form.watch('metadata.channels.email') && (
            <>
              <SectionTitle label="Email Channel" />
              <Controller
                control={form.control}
                name="slots.email_subject"
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label="Email Subject"
                    error={fieldState.error?.message}
                    placeholder="Enter subject"
                  />
                )}
              />
              <Controller
                control={form.control}
                name="slots.email_body"
                render={({ field }) => (
                  <RichTextEditorInput
                    content={field.value}
                    onContentChange={field.onChange}
                    label="Email Body"
                  />
                )}
              />
            </>
          )}
          {selectedType === TemplateType.Notification && form.watch('metadata.channels.push') && (
            <>
              <SectionTitle label="Push Channel" />
              <Controller
                control={form.control}
                name="slots.push_title"
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label="Push Title"
                    error={fieldState.error?.message}
                    placeholder="Enter title"
                  />
                )}
              />
              <Controller
                control={form.control}
                name="slots.push_body"
                render={({ field }) => (
                  <RichTextEditorInput
                    content={field.value}
                    onContentChange={field.onChange}
                    label="Push Body"
                  />
                )}
              />
            </>
          )}
          {selectedType === TemplateType.Notification && form.watch('metadata.channels.sms') && (
            <>
              <SectionTitle label="SMS Channel" />
              <Controller
                control={form.control}
                name="slots.sms_body"
                render={({ field }) => (
                  <RichTextEditorInput
                    content={field.value}
                    onContentChange={field.onChange}
                    label="SMS Body"
                  />
                )}
              />
            </>
          )}
          {selectedType === TemplateType.Prompt && form.watch('metadata.parts.system') && (
            <>
              <SectionTitle label="System Message" />
              <Controller
                control={form.control}
                name="slots.system"
                render={({ field }) => (
                  <RichTextEditorInput
                    content={field.value}
                    onContentChange={field.onChange}
                    label="System Prompt"
                  />
                )}
              />
            </>
          )}
          {selectedType === TemplateType.Prompt && form.watch('metadata.parts.user') && (
            <>
              <SectionTitle label="User Message" />
              <Controller
                control={form.control}
                name="slots.user"
                render={({ field }) => (
                  <RichTextEditorInput
                    content={field.value}
                    onContentChange={field.onChange}
                    label="User Prompt"
                  />
                )}
              />
            </>
          )}
          {selectedType === TemplateType.Prompt && form.watch('metadata.parts.assistant') && (
            <>
              <SectionTitle label="Assistant Message" />
              <Controller
                control={form.control}
                name="slots.assistant"
                render={({ field }) => (
                  <RichTextEditorInput
                    content={field.value}
                    onContentChange={field.onChange}
                    label="Assistant Prompt"
                  />
                )}
              />
            </>
          )}
          {selectedType === TemplateType.Invoice && (
            <>
              <SectionTitle label="Invoice" />
              <Controller
                control={form.control}
                name="slots.invoice_template"
                render={({ field }) => (
                  <RichTextEditorInput
                    content={field.value}
                    onContentChange={field.onChange}
                    label="Invoice Template"
                  />
                )}
              />
            </>
          )}
        </Stack>
        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={onClose}>
            Cancel
          </Button>
          <Button
            radius={0}
            flex={1}
            fullWidth
            type="submit"
            variant="filled"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default TemplateForm;
