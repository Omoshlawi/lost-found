import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton, TablerIcon } from '@/components';
import { useAddresses } from '@/features/addresses/hooks';
import { useDocumentTypes } from '@/features/admin/hooks';
import { handleApiErrors, uploadFile } from '@/lib/api';
import { ImageUpload, ImageUploadRef } from '../components';
import { createFoundDocumentCase } from '../hooks';
import { DocumentCase, FoundDocumentCaseFormData } from '../types';
import { FoundDocumentCaseSchema } from '../utils';

type DocumentCaseFormProps = {
  closeWorkspace?: () => void;
  onSuccess?: (caseData: DocumentCase) => void;
};

const FoundDocumentCaseForm = ({ closeWorkspace, onSuccess }: DocumentCaseFormProps) => {
  const [uploadingImages, setUploadingImages] = useState(false);
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const navigate = useNavigate();
  const form = useForm<FoundDocumentCaseFormData>({
    defaultValues: { images: [] },
    resolver: zodResolver(FoundDocumentCaseSchema),
  });
  const { addresses, isLoading: isLoadingAddresses } = useAddresses();
  const { documentTypes, isLoading: isLoadingTypes } = useDocumentTypes();

  const handleSubmit: SubmitHandler<FoundDocumentCaseFormData> = async (data) => {
    try {
      let imageUrls: string[] = [];
      const files = imageUploadRef.current?.getFiles() || [];

      if (files.length > 0) {
        setUploadingImages(true);
        try {
          const urls = await Promise.all(files.map((file) => uploadFile(file)));
          imageUrls = urls.filter((u): u is string => typeof u === 'string');

          if (imageUrls.length === 0) {
            showNotification({
              title: 'Error',
              message: 'Failed to upload images. Please try again.',
              color: 'red',
              position: 'top-right',
            });
            return;
          }
        } catch (error) {
          const e = handleApiErrors(error);
          showNotification({
            title: 'Error uploading images',
            message: e.detail || 'Failed to upload images',
            color: 'red',
            position: 'top-right',
          });
          return;
        } finally {
          setUploadingImages(false);
        }
      }

      const submitData = {
        ...data,
        images: imageUrls.length > 0 ? (imageUrls as [string, ...string[]]) : [],
      };

      const doc = await createFoundDocumentCase(submitData);
      onSuccess?.(doc);
      showNotification({
        title: 'Success',
        color: 'green',
        message: 'Found Document case created successfully',
      });
      navigate(`/dashboard/cases/${doc.id}`);
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<FoundDocumentCaseFormData>(error);
      if ('detail' in e && e.detail) {
        showNotification({
          title: 'Error creating found document case',
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
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', display: 'flex' }}
    >
      <Stack p="md" h="100%" justify="space-between" gap="lg">
        <Stack gap="md">
          <Controller
            control={form.control}
            name="typeId"
            render={({ field, fieldState }) =>
              isLoadingTypes ? (
                <InputSkeleton />
              ) : (
                <Select
                  {...field}
                  value={field.value || null}
                  data={documentTypes.map((d) => ({ value: d.id, label: d.name }))}
                  label="Document Type"
                  description="Type of the found document"
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
          <Controller
            control={form.control}
            name="eventDate"
            render={({ field, fieldState }) => (
              <DateInput
                {...field}
                label="Date Found"
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
                  data={addresses.map((l) => ({ value: l.id, label: l.label ?? '' }))}
                  label="Address"
                  description="Where the document was found"
                  error={fieldState.error?.message}
                  nothingFoundMessage="Nothing found..."
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
                placeholder="Add any notes about the found document..."
                label="Description"
                description="Optional additional details"
                error={fieldState.error?.message}
                minRows={3}
                autosize
              />
            )}
          />

          <ImageUpload
            ref={imageUploadRef}
            label="Document Images"
            description="Attach photos of the found document (max 2)"
            uploading={uploadingImages}
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
            loading={form.formState.isSubmitting || uploadingImages}
            disabled={form.formState.isSubmitting || uploadingImages}
            leftSection={<TablerIcon name="check" size={18} />}
          >
            Submit Found Case
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default FoundDocumentCaseForm;
