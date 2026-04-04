import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Button, Group, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { z } from 'zod';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase } from '../types';

const schema = z.object({
  reason: z.string().min(5, 'Please provide a reason (at least 5 characters)'),
});

type FormData = z.infer<typeof schema>;

type CancelCollectionFormProps = {
  documentCase: DocumentCase;
  onClose: () => void;
  onSuccess?: () => void;
};

const CancelCollectionForm: React.FC<CancelCollectionFormProps> = ({
  documentCase,
  onClose,
  onSuccess,
}) => {
  const form = useForm<FormData>({
    defaultValues: { reason: '' },
    resolver: zodResolver(schema),
  });
  const { cancelCollection } = useDocumentCaseApi();

  const handleSubmit: SubmitHandler<FormData> = async ({ reason }) => {
    try {
      await cancelCollection(documentCase.foundDocumentCase!.id, {
        collectionId: documentCase.foundDocumentCase!.activeCollection!.id,
        reason,
      });
      showNotification({
        title: 'Collection cancelled',
        message: 'The collection has been cancelled. Case editing is now unlocked.',
        color: 'orange',
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      const e = handleApiErrors<FormData>(error);
      if (e.detail) {
        showNotification({
          title: 'Error cancelling collection',
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
            title="Cancel collection in progress"
          >
            This will void the current handover code and notify the finder. A reason is required for
            the audit trail.
          </Alert>
          <Controller
            control={form.control}
            name="reason"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Reason for cancellation"
                placeholder="e.g. Finder was unavailable, document field discrepancy found..."
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
            color="red"
            variant="filled"
            leftSection={<TablerIcon name="circleX" size={14} />}
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Cancel Collection
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CancelCollectionForm;
