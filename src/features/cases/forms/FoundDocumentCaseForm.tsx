import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton, TablerIcon } from '@/components';
import { useAddresses } from '@/features/addresses/hooks';
import { handleApiErrors, uploadFile } from '@/lib/api';
import { ImageUpload, ImageUploadRef } from '../components';
import { useDocumentCaseApi } from '../hooks';
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
    defaultValues: {},
    resolver: zodResolver(FoundDocumentCaseSchema),
  });
  const { addresses, isLoading } = useAddresses();
  const { createFoundDocumentCase } = useDocumentCaseApi();

  const handleSubmit: SubmitHandler<FoundDocumentCaseFormData> = async (data) => {
    try {
      // First, upload all images if there are any
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
            setUploadingImages(false);
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
          setUploadingImages(false);
          return;
        } finally {
          setUploadingImages(false);
        }
      }

      // Submit form with uploaded image URLs
      const submitData = {
        ...data,
        images: imageUrls.length > 0 ? (imageUrls as [string, ...string[]]) : [],
      };

      const doc = await createFoundDocumentCase(submitData);
      onSuccess?.(doc);
      showNotification({
        title: 'Success',
        color: 'green',
        message: `Found Document case created successfully`,
      });
      navigate(`/dashboard/found-documents/${doc.id}`);
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<FoundDocumentCaseFormData>(error);
      if ('detail' in e && e.detail) {
        showNotification({
          title: `Error creating found document case`,
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
                label="Date Found"
                error={fieldState.error?.message}
                placeholder="Select date"
                leftSection={<TablerIcon name="calendar" size={18} />}
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

          <ImageUpload
            ref={imageUploadRef}
            title="Document Images"
            description="Select images of the found document (will be uploaded on submit)"
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
            Submit Found Document Case
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default FoundDocumentCaseForm;
