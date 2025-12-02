import dayjs from 'dayjs';
import React, { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Select, Stack, TagsInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton, TablerIcon } from '@/components';
import { useAddresses } from '@/features/addresses/hooks';
import { handleApiErrors } from '@/lib/api';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase, FoundDocumentCaseFormData } from '../types';
import { FoundDocumentCaseSchema } from '../utils/validation';

type UpdateCasedetailsFormProps = {
  documentCase: DocumentCase;
  onSuccess?: (documentCase: DocumentCase) => void;
  closeWorkspace?: () => void;
};

const UpdateCasedetailsForm: FC<UpdateCasedetailsFormProps> = ({
  documentCase,
  onSuccess,
  closeWorkspace,
}) => {
  const form = useForm<FoundDocumentCaseFormData>({
    defaultValues: {
      eventDate: documentCase.eventDate ? dayjs(documentCase.eventDate).toDate() : undefined,
      description: documentCase.description ?? undefined,
      tags: documentCase.tags ?? undefined,
      addressId: documentCase.addressId ?? undefined,
    },
    resolver: zodResolver(FoundDocumentCaseSchema),
  });
  const { addresses, isLoading: isLoadingAddresses } = useAddresses();
  const { updateDocumentCase } = useDocumentCaseApi();

  const handleSubmit: SubmitHandler<FoundDocumentCaseFormData> = async (data) => {
    try {
      const { eventDate, ...rest } = data;
      const payload = {
        ...rest,
        eventDate: eventDate ? dayjs(eventDate).format('YYYY-MM-DD') : undefined,
      };
      const updatedCase = await updateDocumentCase(documentCase.id, payload as any);
      onSuccess?.(updatedCase);
      showNotification({
        title: 'Success',
        message: 'Case details updated successfully',
        color: 'green',
      });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<FoundDocumentCaseFormData>(error);
      if (e.detail) {
        showNotification({
          title: 'Error updating case details',
          message: e.detail,
          color: 'red',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof FoundDocumentCaseFormData, { message: val as string })
        );
      }
    }
  };

  const addressOptions = addresses.map((address) => ({
    value: address.id,
    label: address.label || address.address1 || address.formatted || address.id,
  }));

  const isLostCase = !!documentCase.lostDocumentCase;
  const dateLabel = isLostCase ? 'Date Lost' : 'Date Found';

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        display: 'flex',
      }}
    >
      <Stack p="md" h="100%" justify="space-between" gap="lg">
        <Stack gap="md">
          <Controller
            control={form.control}
            name="eventDate"
            render={({ field, fieldState }) => (
              <DateInput
                {...field}
                value={field.value || null}
                onChange={(value) => field.onChange(value)}
                label={dateLabel}
                error={fieldState.error?.message}
                placeholder="Select date"
                leftSection={<TablerIcon name="calendar" size={18} />}
                required
              />
            )}
          />
          <Controller
            control={form.control}
            name="addressId"
            render={({ field, fieldState }) =>
              isLoadingAddresses ? (
                <InputSkeleton />
              ) : (
                <Select
                  {...field}
                  value={field.value || null}
                  data={addressOptions}
                  label="Address"
                  error={fieldState.error?.message}
                  nothingFoundMessage="No addresses found"
                  searchable
                  placeholder="Select address"
                  leftSection={<TablerIcon name="mapPin" size={18} />}
                  required
                />
              )
            }
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                value={field.value as string}
                placeholder="Describe the case..."
                label="Description"
                error={fieldState.error?.message}
                minRows={3}
                autosize
              />
            )}
          />
          <Controller
            control={form.control}
            name="tags"
            render={({ field, fieldState }) => (
              <TagsInput
                {...field}
                data={field.value ?? []}
                value={field.value ?? []}
                label="Tags"
                error={fieldState.error?.message}
                placeholder="Add tags"
                clearable
                description="Keywords to help find the document case"
                leftSection={<TablerIcon name="tag" size={18} />}
              />
            )}
          />
        </Stack>

        <Group gap="sm">
          <Button
            flex={1}
            variant="default"
            onClick={closeWorkspace}
            leftSection={<TablerIcon name="x" size={18} />}
          >
            Cancel
          </Button>
          <Button
            flex={1}
            type="submit"
            variant="filled"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            leftSection={<TablerIcon name="check" size={18} />}
          >
            Update Details
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default UpdateCasedetailsForm;
