import React, { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useTransitionReasons } from '@/features/status-transitions/hooks';
import { StatusTransitionReasonFormData } from '@/features/status-transitions/types';
import { statusTransitionReasonsSchema } from '@/features/status-transitions/utils/validation';
import { handleApiErrors } from '@/lib/api';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase, FoundDocumentCaseStatus } from '../types';

type RejectFoundDocumentCaseFormProps = {
  documentCase: DocumentCase;
  onClose: () => void;
  onSuccess?: (documentCase: DocumentCase) => void;
};

const RejectFoundDocumentCaseForm: FC<RejectFoundDocumentCaseFormProps> = ({
  documentCase,
  onClose,
  onSuccess,
}) => {
  const form = useForm<StatusTransitionReasonFormData>({
    defaultValues: {},
    resolver: zodResolver(statusTransitionReasonsSchema),
  });
  const { rejectFoundDocumentCase } = useDocumentCaseApi();
  const { reasons } = useTransitionReasons({
    entityType: 'FoundDocumentCase',
    fromStatus: documentCase.foundDocumentCase!.status,
    toStatus: FoundDocumentCaseStatus.REJECTED,
    auto: 'false',
  });
  const handleSubmit: SubmitHandler<StatusTransitionReasonFormData> = async (data) => {
    try {
      const updatedDocumentCase = await rejectFoundDocumentCase(
        documentCase.foundDocumentCase!.id,
        data
      );
      onSuccess?.(updatedDocumentCase);
      showNotification({
        title: 'Document case rejected',
        message: 'Document case rejected successfully',
        color: 'green',
      });
      onClose();
    } catch (error) {
      const e = handleApiErrors<StatusTransitionReasonFormData>(error);
      if (e.detail) {
        showNotification({
          title: `Error rejecting document case`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof StatusTransitionReasonFormData, { message: val })
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
          <Controller
            control={form.control}
            name="reason"
            render={({ field, fieldState }) => (
              <Select
                data={reasons.map((reason) => ({ value: reason.id, label: reason.label }))}
                label="Reject reason"
                value={field.value}
                placeholder="Select a reason"
                onChange={(_value, _option) => field.onChange(_value)}
                error={fieldState.error?.message}
                ref={field.ref}
                clearable
              />
            )}
          />
          <Controller
            control={form.control}
            name="comment"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Comment"
                error={fieldState.error?.message}
                placeholder="Add a comment"
              />
            )}
          />
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

export default RejectFoundDocumentCaseForm;
