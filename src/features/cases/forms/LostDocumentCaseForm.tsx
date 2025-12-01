import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Select, Stack, TagsInput, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton, TablerIcon } from '@/components';
import { useAddresses } from '@/features/addresses/hooks';
import { useDocumentTypes } from '@/features/admin/hooks';
import { handleApiErrors } from '@/lib/api';
import { INPUT_WRAPPER_ORDER } from '@/lib/utils';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase, LostDocumentCaseFormData } from '../types';
import { LostDocumentCaseSchema } from '../utils';

type LostDocumentCaseFormProps = {
  closeWorkspace?: () => void;
  onSuccess?: (caseData: DocumentCase) => void;
};

const LostDocumentCaseForm = ({ closeWorkspace, onSuccess }: LostDocumentCaseFormProps) => {
  const form = useForm<LostDocumentCaseFormData>({
    defaultValues: {},
    resolver: zodResolver(LostDocumentCaseSchema),
  });
  const { addresses, isLoading } = useAddresses();
  const { documentTypes, isLoading: isDocumentTypesLoading } = useDocumentTypes();
  const { createLostDocumentCase } = useDocumentCaseApi();

  const handleSubmit: SubmitHandler<LostDocumentCaseFormData> = async (data) => {
    try {
      // Submit form with uploaded image URLs
      const doc = await createLostDocumentCase(data);
      onSuccess?.(doc);
      showNotification({
        title: 'Success',
        color: 'green',
        message: `Lost Document case created successfully`,
      });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<LostDocumentCaseFormData>(error);
      if ('detail' in e && e.detail) {
        showNotification({
          title: `Error creating lost document case`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof LostDocumentCaseFormData, { message: val as string })
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
        display: 'flex',
      }}
    >
      <Stack p="md" h="100%" justify="space-between" gap="lg">
        <Stack gap="md">
          <Controller
            control={form.control}
            name="typeId"
            render={({ field, fieldState }) =>
              isDocumentTypesLoading ? (
                <InputSkeleton />
              ) : (
                <Select
                  {...field}
                  data={documentTypes.map((d) => ({ value: d.id, label: d.name }))}
                  label="Document Type"
                  error={fieldState.error?.message}
                  placeholder="Select document type"
                  leftSection={<TablerIcon name="fileText" size={18} />}
                  searchable
                  nothingFoundMessage="Nothing found..."
                />
              )
            }
          />
          <Controller
            control={form.control}
            name="eventDate"
            render={({ field, fieldState }) => (
              <DateInput
                {...field}
                label="Date Lost"
                error={fieldState.error?.message}
                placeholder="Select date"
                leftSection={<TablerIcon name="calendar" size={18} />}
              />
            )}
          />

          <Controller
            control={form.control}
            name="ownerName"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value as string}
                placeholder="Enter owner name"
                label="Owner Name"
                error={fieldState.error?.message}
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The name of the owner of the document"
                leftSection={<TablerIcon name="user" size={18} />}
              />
            )}
          />

          <Controller
            control={form.control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <DateInput
                {...field}
                label="Date of Birth"
                error={fieldState.error?.message}
                placeholder="Select date"
                leftSection={<TablerIcon name="calendar" size={18} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="placeOfBirth"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Place of Birth"
                error={fieldState.error?.message}
                placeholder="Enter place of birth"
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The place where the document was born (if available)"
                leftSection={<TablerIcon name="mapPin" size={18} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="gender"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Gender"
                error={fieldState.error?.message}
                placeholder="Select gender"
                data={['Male', 'Female', 'Unknown']}
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The gender of the owner of the document"
                leftSection={<TablerIcon name="genderAgender" size={18} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="nationality"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Nationality"
                error={fieldState.error?.message}
                placeholder="Enter nationality"
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The nationality of the owner of the document"
                leftSection={<TablerIcon name="flag" size={18} />}
              />
            )}
          />

          <Controller
            control={form.control}
            name="documentNumber"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value as string}
                placeholder="Enter document number"
                label="Document Number"
                error={fieldState.error?.message}
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The number of the document (if available)"
                leftSection={<TablerIcon name="id" size={18} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="serialNumber"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value as string}
                placeholder="Enter serial number"
                label="Serial Number"
                error={fieldState.error?.message}
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The serial number of the document (if available)"
                leftSection={<TablerIcon name="barcode" size={18} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="batchNumber"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value as string}
                placeholder="Enter batch number"
                label="Batch Number"
                error={fieldState.error?.message}
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The batch number of the document (if available)"
                leftSection={<TablerIcon name="listNumbers" size={18} />}
              />
            )}
          />

          <Controller
            control={form.control}
            name="issuer"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value as string}
                placeholder="Enter issuer"
                label="Issuer"
                error={fieldState.error?.message}
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The issuer of the document (if available)"
                leftSection={<TablerIcon name="building" size={18} />}
              />
            )}
          />
          <Controller
            control={form.control}
            name="placeOfIssue"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                value={field.value as string}
                placeholder="Enter place of issue"
                label="Place of Issue"
                error={fieldState.error?.message}
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="The place where the document was issued (if available)"
                leftSection={<TablerIcon name="mapPin" size={18} />}
              />
            )}
          />

          <Controller
            control={form.control}
            name="issuanceDate"
            render={({ field, fieldState }) => (
              <DateInput
                {...field}
                label="Issuance Date"
                error={fieldState.error?.message}
                placeholder="Select date"
                leftSection={<TablerIcon name="calendar" size={18} />}
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
                inputWrapperOrder={INPUT_WRAPPER_ORDER}
                description="keywords to help find the document case"
                leftSection={<TablerIcon name="tag" size={18} />}
              />
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
                  placeholder="Select address"
                  leftSection={<TablerIcon name="mapPin" size={18} />}
                  inputWrapperOrder={INPUT_WRAPPER_ORDER}
                  description="The address where the document was lost"
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
                placeholder="Describe the found document..."
                label="Description"
                error={fieldState.error?.message}
                minRows={3}
                autosize
              />
            )}
          />
        </Stack>

        <Group gap="sm" mt="auto">
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
            Submit Lost Document Case
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default LostDocumentCaseForm;
