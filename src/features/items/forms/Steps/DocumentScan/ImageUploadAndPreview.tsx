import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Group,
  Image,
  SegmentedControl,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { useFilteredImage } from '@/features/items/hooks';
import { ImageProcessFormValues } from '@/features/items/types';
import { handleApiErrors } from '@/lib/api';

type ImageUploadAndPreviewProps = {
  filters?: Partial<ImageProcessFormValues>;
  onScanDocument?: (file: FileWithPath) => void;
};
const ImageUploadAndPreview: React.FC<ImageUploadAndPreviewProps> = ({
  filters,
  onScanDocument,
}) => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [previewMode, setPreviewMode] = useState<'original' | 'filtered'>('original');
  const {
    image: filteredImage,
    error: filteredImageError,
    isLoading: isFilteredImageLoading,
    mutate: mutateFilter,
  } = useFilteredImage(files[0] ?? null, filters);
  // Generate image URLs
  const originalImageUrl = files.length > 0 ? URL.createObjectURL(files[0]) : '';

  // Simulate filtered image (in a real app, you would apply the filters)

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    };
  }, [originalImageUrl]);

  useEffect(() => {
    mutateFilter();
  }, [files]);

  useEffect(() => {
    if (filteredImageError) {
      const e = handleApiErrors<ImageProcessFormValues>(filteredImageError);
      if (e?.detail) {
        showNotification({
          title: 'Error applying image filters',
          message: JSON.stringify(e, null, 2),
          color: 'red',
        });
      }
      Object.entries(e).forEach(([key, val]) =>
        showNotification({ key, message: val, color: 'red' })
      );
    }
  }, [filteredImageError]);

  return (
    <Card withBorder radius="md" p="md" mb="md">
      <Card.Section p="md">
        <Title order={4} mb="md">
          Upload Document
        </Title>
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          onDrop={setFiles}
          maxFiles={1}
          onReject={(files) => {
            showNotification({
              title: 'Error selecting files',
              message: 'Please select a valid image file',
              color: 'red',
              icon: <TablerIcon name="x" size={16} />,
            });
          }}
          multiple={false}
          h={200}
        >
          <Group justify="center" gap="xl" mih={160} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <TablerIcon
                name="upload"
                size={50}
                stroke={1.5}
                color={theme.primaryColor[colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <TablerIcon
                name="x"
                size={50}
                stroke={1.5}
                color={theme.colors.red[colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <TablerIcon
                name="photo"
                size={50}
                stroke={1.5}
                color={colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7]}
              />
            </Dropzone.Idle>

            <Stack align="center">
              <Text size="xl" inline>
                Drag image here or click to select
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Only image files are accepted
              </Text>
            </Stack>
          </Group>
        </Dropzone>
      </Card.Section>

      {files.length > 0 && (
        <>
          <Card.Section p="md">
            <Title order={4} mb="md">
              Image Preview
            </Title>
            <SegmentedControl
              value={previewMode}
              onChange={(value: string) => setPreviewMode(value as 'original' | 'filtered')}
              data={[
                { label: 'Original', value: 'original' },
                { label: 'Filtered', value: 'filtered' },
              ]}
              fullWidth
              mb="md"
              color={theme.primaryColor}
            />
            <Box
              pos="relative"
              h={300}
              bg={colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]}
              style={{ borderRadius: theme.radius.md }}
            >
              <Image
                src={previewMode === 'original' ? originalImageUrl : filteredImage}
                alt="Document preview"
                fit="contain"
                h={300}
                w="100%"
                radius="md"
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
              />
            </Box>
          </Card.Section>

          <Card.Section p="md">
            <Group justify="center">
              <Button
                leftSection={<TablerIcon name="scan" size={20} />}
                size="md"
                fullWidth
                onClick={async () => {
                  onScanDocument?.(files[0]);
                }}
                loading={isFilteredImageLoading}
              >
                Scan Document
              </Button>
            </Group>
          </Card.Section>
        </>
      )}
    </Card>
  );
};

export default ImageUploadAndPreview;
