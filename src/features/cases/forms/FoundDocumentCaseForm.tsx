import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton } from '@/components';
import { useAddresses } from '@/features/addresses/hooks';
import { handleApiErrors } from '@/lib/api';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase, FoundDocumentCaseFormData } from '../types';
import { FoundDocumentCaseSchema } from '../utils';

type DocumentCaseFormProps = {
  case?: DocumentCase;
  closeWorkspace?: () => void;
  onSuccess?: (caseData: DocumentCase) => void;
};

const FoundDocumentCaseForm = ({
  case: docCase,
  closeWorkspace,
  onSuccess,
}: DocumentCaseFormProps) => {
  const form = useForm<FoundDocumentCaseFormData>({
    defaultValues: {},
    resolver: zodResolver(FoundDocumentCaseSchema),
  });
  const { addresses, isLoading } = useAddresses();
  const { createFoundDocumentCase, updateFoundDocumentCase } = useDocumentCaseApi();
  const handleSubmit: SubmitHandler<FoundDocumentCaseFormData> = async (data) => {
    try {
      const doc = docCase
        ? await updateFoundDocumentCase(docCase.id, data)
        : await createFoundDocumentCase(data);
      onSuccess?.(doc);
      showNotification({
        title: 'Success',
        color: 'green',
        message: `Document report ${docCase ? 'updated' : 'created'} successfully`,
      });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<FoundDocumentCaseFormData>(error);
      if ('detail' in e && e.detail) {
        showNotification({
          title: `Error ${docCase ? 'updating' : 'creating'} document report`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof FoundDocumentCaseFormData, { message: val as string })
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
            name="eventDate"
            render={({ field, fieldState }) => (
              <DateInput {...field} label="Date Found" error={fieldState.error?.message} />
            )}
          />
          <Controller
            control={form.control}
            name="addressId"
            render={({ field, fieldState }) =>
              isLoading ? (
                <InputSkeleton />
              ) : (
                <Select
                  {...field}
                  value={field.value || null}
                  data={addresses.map((l) => ({ value: l.id, label: l.label ?? '' }))}
                  label="Address"
                  error={fieldState.error?.message}
                  nothingFoundMessage="Nothing found..."
                  searchable
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
                placeholder="Description ..."
                label="Description"
                error={fieldState.error?.message}
              />
            )}
          />
        </Stack>
        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={closeWorkspace}>
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

export default FoundDocumentCaseForm;
