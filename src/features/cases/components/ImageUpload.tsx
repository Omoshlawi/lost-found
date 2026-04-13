import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Image,
  InputWrapper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { modals } from '@mantine/modals';
import { TablerIcon } from '@/components';

export interface ImageUploadProps {
  label?: string;
  description?: string;
  maxSize?: number;
  multiple?: boolean;
  onFilesChange?: (files: FileWithPath[]) => void;
  uploading?: boolean;
  accept?: string[];
  maxFiles?: number;
  withBorder?: boolean;
  error?: string;
}

export interface ImageUploadRef {
  getFiles: () => FileWithPath[];
  clearFiles: () => void;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  (
    {
      label = 'Document Images',
      description = 'Upload images of the document. Max 2 files, 5 MB each.',
      maxSize = 5 * 1024 * 1024,
      multiple = true,
      onFilesChange,
      uploading = false,
      accept = IMAGE_MIME_TYPE,
      maxFiles = 2,
      error,
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

    const handleDrop = useCallback(
      (newFiles: FileWithPath[]) => {
        const merged = multiple ? [...files, ...newFiles].slice(0, maxFiles) : newFiles.slice(0, 1);
        setFiles(merged);
        onFilesChange?.(merged);
      },
      [files, multiple, maxFiles, onFilesChange]
    );

    const handleRemove = useCallback(
      (index: number) => {
        const next = files.filter((_, i) => i !== index);
        setFiles(next);
        onFilesChange?.(next);
      },
      [files, onFilesChange]
    );

    const handlePreview = useCallback((url: string) => {
      modals.open({
        size: '90vw',
        centered: true,
        withCloseButton: true,
        padding: 'xs',
        styles: {
          content: { maxHeight: '96vh', display: 'flex', flexDirection: 'column' },
          body: { flex: 1, padding: 0 },
        },
        children: (
          <Image
            src={url}
            height="100%"
            fit="contain"
            radius="sm"
            fallbackSrc="https://placehold.co/600x400?text=Image"
          />
        ),
      });
    }, []);

    const previewUrls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

    useEffect(() => {
      return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
    }, [previewUrls]);

    const atLimit = files.length >= maxFiles;

    return (
      <InputWrapper label={label} description={description} error={error}>
        <Stack gap="xs" mt={4}>
          {!atLimit && (
            <Dropzone
              accept={accept}
              onDrop={handleDrop}
              loading={uploading}
              disabled={uploading || atLimit}
              maxSize={maxSize}
              multiple={multiple}
              maxFiles={maxFiles - files.length}
              styles={{
                root: {
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderRadius: 'var(--mantine-radius-sm)',
                },
              }}
            >
              <Group justify="center" gap="sm" py="md" style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <TablerIcon
                    name="circleCheck"
                    size={28}
                    style={{ color: 'var(--mantine-color-blue-6)' }}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <TablerIcon
                    name="circleX"
                    size={28}
                    style={{ color: 'var(--mantine-color-red-6)' }}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <TablerIcon
                    name="photo"
                    size={28}
                    style={{ color: 'var(--mantine-color-dimmed)' }}
                  />
                </Dropzone.Idle>
                <Box>
                  <Text size="sm" fw={500}>
                    Drag images here or click to browse
                  </Text>
                  <Text size="xs" c="dimmed">
                    {maxFiles - files.length} slot{maxFiles - files.length !== 1 ? 's' : ''}{' '}
                    remaining · max {Math.round(maxSize / (1024 * 1024))} MB each
                  </Text>
                </Box>
              </Group>
            </Dropzone>
          )}

          {files.length > 0 && (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
              {files.map((_, index) => {
                const url = previewUrls[index];
                return (
                  <Box
                    key={index}
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--mantine-radius-sm)',
                      overflow: 'hidden',
                      border: '1px solid var(--mantine-color-default-border)',
                    }}
                  >
                    <Image
                      src={url}
                      height={160}
                      fit="cover"
                      fallbackSrc="https://placehold.co/300x160?text=Image"
                    />
                    <Group
                      gap={4}
                      style={{ position: 'absolute', top: 6, right: 6 }}
                    >
                      <Tooltip label="Preview" withArrow>
                        <ActionIcon
                          size="sm"
                          color="blue"
                          variant="filled"
                          onClick={() => handlePreview(url)}
                        >
                          <TablerIcon name="windowMaximize" size={13} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Remove" withArrow>
                        <ActionIcon
                          size="sm"
                          color="red"
                          variant="filled"
                          onClick={() => handleRemove(index)}
                          disabled={uploading}
                        >
                          <TablerIcon name="trash" size={13} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                    <Badge
                      size="xs"
                      variant="filled"
                      color="dark"
                      style={{ position: 'absolute', bottom: 6, left: 6, opacity: 0.85 }}
                    >
                      {index + 1} / {maxFiles}
                    </Badge>
                  </Box>
                );
              })}
            </SimpleGrid>
          )}
        </Stack>
      </InputWrapper>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
