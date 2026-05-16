import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Checkbox, Group, Stack, Textarea, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useSystemSettingsApi } from '../hooks';
import { SystemSetting, SystemSettingFormData } from '../types';
import { SystemSettingSchema } from '../utils';

type SystemSettingFormProps = {
  setting?: SystemSetting;
  closeWorkspace?: () => void;
};

const SystemSettingForm: React.FC<SystemSettingFormProps> = ({ setting, closeWorkspace }) => {
  const isEditing = !!setting;
  const { updateSetting, mutateSettings } = useSystemSettingsApi();

  const form = useForm<SystemSettingFormData>({
    defaultValues: {
      key: setting?.key ?? '',
      value: setting?.value ?? '',
      description: setting?.description ?? '',
      isPublic: setting?.isPublic ?? false,
    },
    resolver: zodResolver(SystemSettingSchema),
  });

  const handleSubmit: SubmitHandler<SystemSettingFormData> = async (data) => {
    const key = setting?.key ?? data.key;
    try {
      await updateSetting(key, { value: data.value, description: data.description, isPublic: data.isPublic });
      showNotification({
        title: 'Success',
        message: `Setting ${isEditing ? 'updated' : 'created'} successfully`,
        color: 'green',
      });
      mutateSettings();
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<SystemSettingFormData>(error);
      if (e.detail) {
        showNotification({
          title: `Error ${isEditing ? 'updating' : 'creating'} setting`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([field, val]) =>
          form.setError(field as keyof SystemSettingFormData, { message: val })
        );
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <Stack p="md" h="100%" justify="space-between">
        <Stack gap="md">
          <Controller
            control={form.control}
            name="key"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Key"
                placeholder="e.g. collection.code_ttl_minutes"
                description="Use dot notation: namespace.property"
                error={fieldState.error?.message}
                disabled={isEditing}
                required
              />
            )}
          />

          <Controller
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Value"
                placeholder="Setting value"
                error={fieldState.error?.message}
                required
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
                placeholder="What this setting controls"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <Checkbox
                label="Expose in public config"
                description="When enabled, this value is returned by the public /config endpoint"
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
        </Stack>

        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={closeWorkspace}>
            Cancel
          </Button>
          <Button
            flex={1}
            radius={0}
            type="submit"
            variant="filled"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default SystemSettingForm;
