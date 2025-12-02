import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton, TablerIcon } from '@/components';
import { useDocumentTypes } from '@/features/admin/hooks';
import { handleApiErrors } from '@/lib/api';
import { INPUT_WRAPPER_ORDER } from '@/lib/utils';
import { useDocumentCaseApi } from '../hooks';
import { CaseDocumentFormData, Document } from '../types';
import { CaseDocumentSchema } from '../utils';

interface UpdateDocumentinfoFormProps {
  document: Document;
  onSuccess?: (document: Document) => void;
  closeWorkspace?: () => void;
}

const UpdateDocumentinfoForm: React.FC<UpdateDocumentinfoFormProps> = ({
  document,
  closeWorkspace,
  onSuccess,
}) => {
  const form = useForm<CaseDocumentFormData>({
    defaultValues: {
      typeId: document?.typeId ?? undefined,
      ownerName: document?.ownerName ?? undefined,
      serialNumber: document?.serialNumber ?? undefined,
      documentNumber: document?.documentNumber ?? undefined,
      batchNumber: document?.batchNumber ?? undefined,
      dateOfBirth: document?.dateOfBirth ? new Date(document?.dateOfBirth) : undefined,
      placeOfBirth: document?.placeOfBirth ?? undefined,
      placeOfIssue: document?.placeOfIssue ?? undefined,
      gender: document?.gender ?? undefined,
      nationality: document?.nationality ?? undefined,
      note: document?.note ?? undefined,
      images: document?.images?.map((img) => ({ url: img.url })) || [],
      additionalFields:
        document?.additionalFields?.map((field) => ({
          fieldName: field.fieldName,
          fieldValue: field.fieldValue,
        })) || [],
      issuanceDate: document?.issuanceDate ? new Date(document?.issuanceDate) : undefined,
      expiryDate: document?.expiryDate ? new Date(document?.expiryDate) : undefined,
      issuer: document?.issuer ?? undefined,
    },
    resolver: zodResolver(CaseDocumentSchema),
  });
  const { updateCaseDocument } = useDocumentCaseApi();
  const { documentTypes, isLoading: isDocumentTypesLoading } = useDocumentTypes();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'additionalFields',
  });

  const sectionTitle = (label: string) => (
    <Divider
      labelPosition="left"
      label={
        <Text size="sm" fw={600}>
          {label}
        </Text>
      }
    />
  );

  const onSubmit: SubmitHandler<CaseDocumentFormData> = async (data) => {
    try {
      const updatedCase = await updateCaseDocument(document.caseId, document.id, data);
      // Extract document from the returned case
      const updatedDocument = updatedCase.document || document;
      onSuccess?.(updatedDocument);
      showNotification({
        title: 'Success',
        color: 'green',
        message: 'Document information updated successfully',
      });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<CaseDocumentFormData>(error);
      if ('detail' in e && e.detail) {
        showNotification({
          title: 'Error updating document',
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof CaseDocumentFormData, { message: val as string })
        );
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        display: 'flex',
      }}
    >
      <Stack p="md" h="100%" justify="space-between" gap="lg" style={{ overflowY: 'auto' }}>
        <Stack gap="lg">
          {/* Basic Information Section */}
          {sectionTitle('Basic Information')}
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
                    required
                  />
                )
              }
            />
          </Stack>

          {/* Owner Information Section */}
          {sectionTitle('Owner Information')}
          <Stack gap="md">
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
                  required
                />
              )}
            />
            <Group grow>
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
                    description="The place where the owner was born"
                    leftSection={<TablerIcon name="mapPin" size={18} />}
                  />
                )}
              />
            </Group>
            <Group grow>
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
                    description="The gender of the owner"
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
                    description="The nationality of the owner"
                    leftSection={<TablerIcon name="flag" size={18} />}
                  />
                )}
              />
            </Group>
          </Stack>

          {/* Document Details Section */}
          {sectionTitle('Document Details')}
          <Stack gap="md">
            <Group grow>
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
            </Group>
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
            <Group grow>
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
            </Group>
            <Group grow>
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
                name="expiryDate"
                render={({ field, fieldState }) => (
                  <DateInput
                    {...field}
                    label="Expiry Date"
                    error={fieldState.error?.message}
                    placeholder="Select date"
                    leftSection={<TablerIcon name="calendar" size={18} />}
                  />
                )}
              />
            </Group>
          </Stack>

          {/* Additional Fields Section */}
          {sectionTitle('Additional Fields')}
          <Paper p="md" withBorder radius="md">
            <Group justify="space-between" mb="md">
              <Text fw={600}>Custom Fields</Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<TablerIcon name="plus" size={16} />}
                onClick={() => append({ fieldName: '', fieldValue: '' })}
              >
                Add Field
              </Button>
            </Group>
            {fields.length === 0 ? (
              <Text c="dimmed" size="sm" ta="center" py="md">
                No additional fields added. Click "Add Field" to add custom fields.
              </Text>
            ) : (
              <Stack gap="md">
                {fields.map((field, index) => (
                  <Group key={field.id} align="flex-start" gap="sm">
                    <Controller
                      control={form.control}
                      name={`additionalFields.${index}.fieldName`}
                      render={({ field: fieldController, fieldState }) => (
                        <TextInput
                          {...fieldController}
                          placeholder="Field name"
                          label="Field Name"
                          error={fieldState.error?.message}
                          style={{ flex: 1 }}
                          required
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`additionalFields.${index}.fieldValue`}
                      render={({ field: fieldController, fieldState }) => (
                        <TextInput
                          {...fieldController}
                          placeholder="Field value"
                          label="Field Value"
                          error={fieldState.error?.message}
                          style={{ flex: 1 }}
                          required
                        />
                      )}
                    />
                    <ActionIcon
                      color="red"
                      variant="light"
                      mt={28}
                      onClick={() => remove(index)}
                      aria-label="Remove field"
                    >
                      <TablerIcon name="trash" size={18} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            )}
          </Paper>

          {/* Additional Notes Section */}
          {sectionTitle('Additional Notes')}
          <Stack gap="md">
            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  value={field.value as string}
                  placeholder="Enter additional notes..."
                  label="Notes"
                  error={fieldState.error?.message}
                  minRows={3}
                  autosize
                  description="Any additional information about the document"
                />
              )}
            />
          </Stack>
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
            Update Document
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default UpdateDocumentinfoForm;
