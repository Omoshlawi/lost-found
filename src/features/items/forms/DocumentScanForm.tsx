import { useState } from 'react';
import {
  Grid,
  Group,
  Paper,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { type FileWithPath } from '@mantine/dropzone';
import { ImageProcessFormValues } from '../types';
import FiltersAndResults from './Steps/DocumentScan/FiltersAndResults';
import ImageUploadAndPreview from './Steps/DocumentScan/ImageUploadAndPreview';

const DocumentScanForm = () => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const isDark = colorScheme === 'dark';
  const [imageFilters, setImageFilters] = useState<Partial<ImageProcessFormValues>>({});
  const [file, setFile] = useState<FileWithPath>();

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      bg={isDark ? theme.colors.dark[7] : theme.white}
      style={{
        color: isDark ? theme.colors.dark[0] : theme.black,
      }}
    >
      <Group justify="space-between" mb="md">
        <Title order={2}>Document Scanner</Title>
      </Group>

      <Grid gutter="md">
        {/* Left column - Image upload and preview */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <ImageUploadAndPreview filters={imageFilters} onScanDocument={setFile} />
        </Grid.Col>

        {/* Right column - Filters and results */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <FiltersAndResults
            onApplyFilters={(f) => {
              setImageFilters(f);
            }}
            file={file}
            currentFilters={imageFilters}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default DocumentScanForm;
