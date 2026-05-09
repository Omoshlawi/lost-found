import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Button, Group, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { z } from 'zod';
import { useExchangeApi } from '@/features/exchange';
import { DocumentCase } from '../types';

const schema = z.object({
  reason: z.string().min(5, 'Please provide a reason (at least 5 characters)'),
});

type FormData = z.infer<typeof schema>;

type RevokeCodeFormProps = {
  documentCase: DocumentCase;
  onClose: () => void;
  onSuccess?: () => void;
};

const RevokeCodeForm: React.FC<RevokeCodeFormProps> = ({ documentCase, onClose, onSuccess }) => {
  const form = useForm<FormData>({
    defaultValues: { reason: '' },
    resolver: zodResolver(schema),
  });
  const { cancelVerification } = useExchangeApi();

  const handleSubmit: SubmitHandler<FormData> = async ({ reason }) => {
    try {
      await cancelVerification(documentCase.foundDocumentCase!.id, { reason });
      showNotification({
        title: 'Code revoked',
        message: 'The verification code has been cancelled. The exchange remains scheduled.',
        color: 'orange',
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      const e = handleApiErrors<FormData>(error);
      if (e.detail) {
        showNotification({
          title: 'Error revoking code',
          message: e.detail,
          color: 'red',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof FormData, { message: val })
        );
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} style={{ flex: 1, flexDirection: 'column' }}>
      <Stack p="md" h="100%" justify="space-between">
        <Stack gap="md">
          <Alert
            variant="light"
            color="orange"
            icon={<TablerIcon name="alertTriangle" size={16} />}
            title="Revoke verification code"
          >
            This will void the current code and notify the finder. The exchange stays scheduled — you
            can issue a new code when ready.
          </Alert>
          <Controller
            control={form.control}
            name="reason"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Reason"
                placeholder="e.g. Code sent in error, finder not yet present..."
                error={fieldState.error?.message}
                minRows={3}
                autosize
              />
            )}
          />
        </Stack>
        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={onClose}>
            Go Back
          </Button>
          <Button
            flex={1}
            radius={0}
            type="submit"
            color="orange"
            variant="filled"
            leftSection={<TablerIcon name="circleX" size={14} />}
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Revoke Code
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default RevokeCodeForm;
