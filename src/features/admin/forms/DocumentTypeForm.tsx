import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { TablerIcon, TablerIconName, TablerIconPicker } from '@/components';
import { mutate } from '@/lib/api';
import handleAPIErrors from '@/lib/api/handleApiErrors';
import { useDocumentType, useDocumentTypesApi } from '../hooks';
import { DocumentTypeFormData } from '../types';
import { DocumentTypeSchema } from '../utils';

const DocumentTypeForm = () => {
  const form = useForm<DocumentTypeFormData>({
    defaultValues: {
      name: '',
      averageReplacementCost: 0,
      isActive: true,
      description: '',
      icon: '',
      replacementInstructions: '',
      requiredVerification: 'STANDARD',
    },
    resolver: zodResolver(DocumentTypeSchema),
  });
  const { createDocumentType, updateDocumentType, mutateDocumentTypes } = useDocumentTypesApi();
  const params = useParams<{ documentTypeId: string }>();
  const { documentTypeId } = params ?? {};
  const { isLoading, documentType, error } = useDocumentType(documentTypeId);
  const [visible, { close, open }] = useDisclosure(isLoading);

  const navigate = useNavigate();
  const handleSubmit: SubmitHandler<DocumentTypeFormData> = async (data) => {
    try {
      const doc = documentTypeId
        ? await updateDocumentType(documentTypeId, data)
        : await createDocumentType(data);
      showNotification({
        title: 'duccess',
        color: 'green',
        message: `Document type ${documentTypeId ? 'updated' : 'created'} succesfully`,
      });
      mutateDocumentTypes();
      navigate(-1);
    } catch (error) {
      const e = handleAPIErrors<DocumentTypeFormData>(error);
      if (e.detail) {
        showNotification({
          title: 'Login Failed',
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

  useEffect(() => {
    if (isLoading) open();
    else close();
  }, [isLoading, open, close]);

  useEffect(() => {
    if (documentType) {
      form.setValue('averageReplacementCost', documentType.averageReplacementCost);
      form.setValue('description', documentType.description);
      form.setValue('icon', documentType.icon);
      form.setValue('isActive', documentType.isActive);
      form.setValue('name', documentType.name);
      form.setValue('replacementInstructions', documentType.replacementInstructions);
      form.setValue('requiredVerification', documentType.requiredVerification);
    }
  }, [documentType, form]);

  return (
    <Box pos="relative">
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      {/* ...other content */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap={'md'}>
          <Box>
            <Text variant="gradient" size="xl" mb="md" style={{ textWrap: 'wrap' }} fw={700}>
              Document types
            </Text>
            <Text c={'gray'}>Some description</Text>
          </Box>
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
          <Button
            type="submit"
            variant="gradient"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default DocumentTypeForm;
