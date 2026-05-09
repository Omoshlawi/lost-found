import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Button, Group, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { z } from 'zod';
import { useExchangeApi } from '@/features/exchange';
import { Claim } from '@/features/claims/types';

const schema = z.object({
  reason: z.string().min(5, 'Please provide a reason (at least 5 characters)'),
});

type FormData = z.infer<typeof schema>;

type RevokeOutboundCodeFormProps = {
  claim: Claim;
  exchangeNumber: string;
  onClose: () => void;
  onSuccess?: () => void;
};

const RevokeOutboundCodeForm: React.FC<RevokeOutboundCodeFormProps> = ({
  exchangeNumber,
  onClose,
  onSuccess,
}) => {
  const form = useForm<FormData>({
    defaultValues: { reason: '' },
    resolver: zodResolver(schema),
  });
  const { cancelOutboundVerification } = useExchangeApi();

  const handleSubmit: SubmitHandler<FormData> = async ({ reason }) => {
    try {
      await cancelOutboundVerification(exchangeNumber, { reason });
      showNotification({
        title: 'Code revoked',
        message: 'The claimant code has been cancelled. The exchange remains scheduled.',
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
            icon={<TablerIcon name="keyOff" size={16} />}
            title="Revoke claimant code"
          >
            This voids the current code and notifies the claimant. The exchange stays SCHEDULED —
            issue a new code when ready.
          </Alert>
          <Controller
            control={form.control}
            name="reason"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Reason"
                placeholder="e.g. Claimant not yet present, code sent in error..."
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
            leftSection={<TablerIcon name="keyOff" size={14} />}
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

export default RevokeOutboundCodeForm;
