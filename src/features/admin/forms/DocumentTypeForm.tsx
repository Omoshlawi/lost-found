import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon, TablerIconName, TablerIconPicker } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useDocumentTypesApi } from '../hooks';
import { DocumentType, DocumentTypeFormData } from '../types';
import { DocumentTypeSchema } from '../utils';

type DocumentTypeFormProps = {
  documentType?: DocumentType;
  onSuccess?: (documentType: DocumentType) => void;
  closeWorkspace?: () => void;
};

const DocumentTypeForm: React.FC<DocumentTypeFormProps> = ({
  documentType,
  onSuccess,
  closeWorkspace,
}) => {
  const form = useForm<DocumentTypeFormData>({
    defaultValues: {
      name: documentType?.name ?? '',
      averageReplacementCost: documentType?.averageReplacementCost ?? 0,
      isActive: documentType?.isActive ?? true,
      description: documentType?.description ?? '',
      icon: documentType?.icon ?? '',
      replacementInstructions: documentType?.replacementInstructions ?? '',
      requiredVerification: documentType?.requiredVerification ?? 'STANDARD',
    },
    resolver: zodResolver(DocumentTypeSchema),
  });
  const { createDocumentType, updateDocumentType, mutateDocumentTypes } = useDocumentTypesApi();

  const navigate = useNavigate();
  const handleSubmit: SubmitHandler<DocumentTypeFormData> = async (data) => {
    try {
      const doc = documentType
        ? await updateDocumentType(documentType.id, data)
        : await createDocumentType(data);
      onSuccess?.(doc);
      showNotification({
        title: 'duccess',
        color: 'green',
        message: `Document type ${documentType ? 'updated' : 'created'} succesfully`,
      });
      mutateDocumentTypes();
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<DocumentTypeFormData>(error);
      if (e.detail) {
        showNotification({
          title: `Error ${documentType ? 'updating' : 'creating'} document type`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof DocumentTypeFormData, { message: val })
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
      <Stack p={'md'} h={'100%'} justify="space-between">
        <Stack gap={'md'}>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Name"
                error={fieldState.error?.message}
                placeholder="e.g certificate"
              />
            )}
          />
          <Controller
            control={form.control}
            name="averageReplacementCost"
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                label="Average replacement cost"
                error={fieldState.error?.message}
                placeholder=""
              />
            )}
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
          <Controller
            control={form.control}
            name="replacementInstructions"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                value={field.value as string}
                placeholder="instructions ..."
                label="Replacement instructions"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="requiredVerification"
            render={({ field, fieldState }) => (
              <Select
                data={[
                  { value: 'LOW', label: 'Low' },
                  { value: 'STANDARD', label: 'Standard' },
                  { value: 'HIGH', label: 'High' },
                  { value: 'INSTITUTIONAL', label: 'Institutional' },
                ]}
                label="Required verification"
                value={field.value}
                onChange={(_value, option) => field.onChange(_value)}
                error={fieldState.error?.message}
                ref={field.ref}
                clearable
              />
            )}
          />
          <Controller
            control={form.control}
            name="icon"
            render={({ field, fieldState }) => (
              <TablerIconPicker
                initialIcon={field.value as TablerIconName}
                onIconSelect={field.onChange}
                renderTriggerComponent={({ onTrigger }) => (
                  <Group>
                    <Text>Selected Icon: </Text>
                    {field.value && <TablerIcon name={field.value as TablerIconName} size={50} />}
                    <ActionIcon variant="filled" aria-label="Settings" onClick={onTrigger}>
                      <TablerIcon
                        name="search"
                        style={{ width: '70%', height: '70%' }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                    {!field.value && <Text>Search icon</Text>}
                    {fieldState.error?.message && (
                      <Text c={'red'}>{fieldState.error?.message}</Text>
                    )}
                  </Group>
                )}
              />
            )}
          />

          <Controller
            control={form.control}
            name="isActive"
            render={({ field, fieldState }) => (
              <Checkbox
                ref={field.ref}
                checked={field.value}
                onToggle={(e) => field.onChange(e.currentTarget.checked)}
                title="Is active"
                label="Is active"
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

export default DocumentTypeForm;
