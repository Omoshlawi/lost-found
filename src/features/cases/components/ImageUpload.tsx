import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  ActionIcon,
  Card,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { modals } from '@mantine/modals';
import { TablerIcon } from '@/components';

export interface ImageUploadProps {
  /** Title for the image upload section */
  title?: string;
  /** Description text below the title */
  description?: string;
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Whether multiple files can be selected */
  multiple?: boolean;
  /** Callback when files are selected */
  onFilesChange?: (files: FileWithPath[]) => void;
  /** Whether the upload is in progress */
  uploading?: boolean;
  /** Custom dropzone styles */
  dropzoneStyles?: React.CSSProperties;
  /** Grid columns for preview (default: { base: 1, sm: 2, md: 3 }) */
  previewCols?: { base?: number; sm?: number; md?: number; lg?: number };
  /** Preview image height (default: 200) */
  previewHeight?: number;
  /** Show preview section label */
  showPreviewLabel?: boolean;
  /** Custom accept MIME types */
  accept?: string[];
  /** Maximum number of files to upload */
  maxFiles?: number;
  withBorder?: boolean;
}

export interface ImageUploadRef {
  getFiles: () => FileWithPath[];
  clearFiles: () => void;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  (
    {
      title = 'Document Images',
      description = 'Select images (will be uploaded on submit)',
      maxSize = 5 * 1024 * 1024, // 5MB default
      multiple = true,
      onFilesChange,
      uploading = false,
      dropzoneStyles,
      previewCols = { base: 1, sm: 2, md: 3 },
      previewHeight = 200,
      showPreviewLabel = true,
      accept = IMAGE_MIME_TYPE,
      maxFiles = 2,
      withBorder = true,
    },
    ref
  ) => {
    const [files, setFiles] = useState<FileWithPath[]>([]);

    useImperativeHandle(ref, () => ({
      getFiles: () => files,
      clearFiles: () => {
        setFiles([]);
        onFilesChange?.([]);
      },
    }));

    const handleImageSelect = useCallback(
      (newFiles: FileWithPath[]) => {
        const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
      },
      [files, multiple, onFilesChange]
    );

    const handleRemoveImage = useCallback(
      (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesChange?.(newFiles);
      },
      [files, onFilesChange]
    );

    const handleViewImage = useCallback((url: string) => {
      modals.open({
        size: '90vw',
        centered: true,
        withCloseButton: true,
        padding: 'xs',
        styles: {
          inner: {
            padding: '2vh',
          },
          content: {
            maxHeight: '96vh',
            display: 'flex',
            flexDirection: 'column',
          },
          body: {
            flex: 1,
            padding: 0,
          },
        },
        children: (
          <Image
            src={url}
            height="100%"
            fit="contain"
            radius="md"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
          />
        ),
      });
    }, []);

    // Create object URLs for previews
    const previewUrls = useMemo(() => {
      return files.map((file) => URL.createObjectURL(file));
    }, [files]);

    // Clean up object URLs when component unmounts or files change
    useEffect(() => {
      return () => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }, [previewUrls]);

    const previews = files.map((_, index) => {
      const imageUrl = previewUrls[index];
      return (
        <Card key={index} p={0} radius="md" style={{ position: 'relative' }} withBorder>
          <Image
            src={imageUrl}
            height={previewHeight}
            fit="cover"
            radius="md"
            fallbackSrc="https://placehold.co/300x200?text=Image"
          />
          <Group
            gap="xs"
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              opacity: 0.9,
            }}
          >
            <Tooltip label="View full size">
              <ActionIcon
                color="blue"
                variant="filled"
                size="lg"
                onClick={() => handleViewImage(imageUrl)}
              >
                <TablerIcon name="windowMaximize" size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Remove image">
              <ActionIcon
                color="red"
                variant="filled"
                size="lg"
                onClick={() => handleRemoveImage(index)}
                disabled={uploading}
              >
                <TablerIcon name="trash" size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Card>
      );
    });

    return (
      <Paper p="md" radius="md" withBorder={withBorder}>
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={5} mb={4}>
              {title}
            </Title>
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          </div>
          {files.length > 0 && (
            <Text size="sm" fw={500} c="blue">
              {files.length} image{files.length !== 1 ? 's' : ''} selected
            </Text>
          )}
        </Group>

        <Dropzone
          accept={accept}
          onDrop={handleImageSelect}
          loading={uploading}
          disabled={uploading}
          maxSize={maxSize}
          multiple={multiple}
          maxFiles={maxFiles}
          styles={{
            root: {
              borderStyle: 'dashed',
              borderWidth: 2,
              transition: 'all 0.2s ease',
              ...dropzoneStyles,
            },
          }}
        >
          <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <TablerIcon name="check" size={52} style={{ color: 'var(--mantine-color-blue-6)' }} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <TablerIcon name="x" size={52} style={{ color: 'var(--mantine-color-red-6)' }} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <TablerIcon name="photo" size={52} style={{ color: 'var(--mantine-color-dimmed)' }} />
            </Dropzone.Idle>
            <div>
              <Text size="xl" inline>
                Drag images here or click to select
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach images as needed. Each file should not exceed{' '}
                {Math.round(maxSize / (1024 * 1024))}MB. Images will be uploaded when you submit the
                form.
              </Text>
            </div>
          </Group>
        </Dropzone>

        {previews.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {showPreviewLabel && (
              <Text size="sm" fw={500} mb="xs">
                Image Previews
              </Text>
            )}
            <SimpleGrid cols={previewCols} spacing="md">
              {previews}
            </SimpleGrid>
          </div>
        )}
      </Paper>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
