import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useTransitionReasonsApi } from '../hooks/useTransitionReasons';
import { TransitionReason, TransitionReasonFormData } from '../types';
import { TransitionReasonSchema } from '../utils';

interface TransitionReasonFormProps {
  transitionReason?: TransitionReason;
  closeWorkspace: () => void;
}

export const TransitionReasonForm: React.FC<TransitionReasonFormProps> = ({
  transitionReason,
  closeWorkspace,
}) => {
  const { createTransitionReason, updateTransitionReason, mutateTransitionReasons } = useTransitionReasonsApi();

  const form = useForm<TransitionReasonFormData>({
    defaultValues: {
      code: transitionReason?.code ?? '',
      entityType: transitionReason?.entityType ?? '*',
      fromStatus: transitionReason?.fromStatus ?? '*',
      toStatus: transitionReason?.toStatus ?? '*',
      auto: transitionReason?.auto ?? false,
      label: transitionReason?.label ?? '',
      description: transitionReason?.description ?? '',
    },
    resolver: zodResolver(TransitionReasonSchema),
  });

  const handleSubmit: SubmitHandler<TransitionReasonFormData> = async (data) => {
    try {
      if (transitionReason) {
        await updateTransitionReason(transitionReason.id, data);
        showNotification({
          title: 'Success',
          message: 'Transition reason updated successfully',
          color: 'green',
        });
      } else {
        await createTransitionReason(data);
        showNotification({
          title: 'Success',
          message: 'Transition reason created successfully',
          color: 'green',
        });
      }
      mutateTransitionReasons();
      closeWorkspace();
    } catch (error) {
      const e = handleApiErrors<TransitionReasonFormData>(error);
      if (e.detail) {
        showNotification({
            title: 'Error saving reason',
            message: e.detail,
            color: 'red',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
            form.setError(key as keyof TransitionReasonFormData, { message: val })
        );
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Stack gap="md" p="md">
        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Code"
              placeholder="e.g. USER_CANCELLED"
              error={fieldState.error?.message}
              required
            />
          )}
        />

        <Controller
          control={form.control}
          name="label"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Label"
              placeholder="e.g. User Cancelled"
              error={fieldState.error?.message}
              required
            />
          )}
        />

        <Controller
          control={form.control}
          name="entityType"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Entity Type"
              placeholder="e.g. Match, Claim, or * for all"
              error={fieldState.error?.message}
            />
          )}
        />

        <Group grow align="flex-start">
          <Controller
            control={form.control}
            name="fromStatus"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="From Status"
                placeholder="e.g. PENDING or *"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="toStatus"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="To Status"
                placeholder="e.g. REJECTED or *"
                error={fieldState.error?.message}
              />
            )}
          />
        </Group>

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              value={field.value ?? ''}
              label="Description"
              placeholder="Detailed explanation..."
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="auto"
          render={({ field }) => (
            <Checkbox
              label="Auto (System generated)"
              checked={field.value ?? false}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />

        <Divider />

        <Group justify="flex-end">
          <Button variant="default" onClick={closeWorkspace}>
            Cancel
          </Button>
          <Button type="submit" loading={form.formState.isSubmitting}>
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
