import React, { useState } from 'react';
import {
  Button,
  Paper,
  Stack,
  Tabs,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { ErrorState, TablerIcon, When } from '@/components';
import { useImageScanResults } from '@/features/items/hooks';
import { ImageProcessFormValues, ImageScanResult } from '@/features/items/types';
import DocumentFilterForm from './DocumentFilterForm';
import DocumentScanExtractionResults from './DocumentScanExtractionResults';
import ScanResultsSkeleton from './ScanResultsSkeleton';

type FiltersAndResultsProps = {
  onApplyFilters?: (filters: ImageProcessFormValues) => void;
  file?: FileWithPath;
  currentFilters?: ImageProcessFormValues;
  onImport?: (data: ImageScanResult['info']) => void;
};

const FiltersAndResults: React.FC<FiltersAndResultsProps> = ({
  onApplyFilters,
  file,
  currentFilters,
  onImport,
}) => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();
  const asyncImageScanResult = useImageScanResults(file, currentFilters);
  const [activeTab, setActiveTab] = useState<'filters' | 'results' | null>('results');

  const handleTabChange = (value: string | null) => {
    setActiveTab(value as 'filters' | 'results' | null);
  };

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      styles={{
        tab: {
          color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          '&[data-active]': {
            color: theme.colors.teal[colorScheme === 'dark' ? 4 : 7],
          },
        },
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="results" leftSection={<TablerIcon name="fileText" size={16} />}>
          Scan Results
        </Tabs.Tab>
        <Tabs.Tab value="filters" leftSection={<TablerIcon name="adjustments" size={16} />}>
          Image Filters
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="filters" pt="md">
        <DocumentFilterForm onSubmit={onApplyFilters} />
      </Tabs.Panel>

      <Tabs.Panel value="results" pt="md">
        <When
          asyncState={asyncImageScanResult}
          loading={() => <ScanResultsSkeleton />}
          error={(e) => <ErrorState title="Error scanning docs" error={e} />}
          success={(data) => (
            <DocumentScanExtractionResults
              extractedText={data.text}
              extractedinfo={data.info}
              onImport={onImport}
            />
          )}
          elseRender={() => (
            <Paper
              withBorder
              p="xl"
              radius="md"
              bg={colorScheme === 'dark' ? theme.colors.dark[8] : theme.white}
              style={{ backgroundColor: 'transparent', gap: 0 }}
              // ="Scan results"
              // message="No scanned data available yet. Please select an image to scan. For better results,
              //   you can apply image"
              // onAdd={() => handleTabChange('filters')}
            >
              <Stack p="xl" align="center">
                <Text>
                  No scanned data available yet. Please select an image to scan. For better results,
                  you can apply image filters
                </Text>
                <Button
                  w="fit-content"
                  variant="light"
                  onClick={() => handleTabChange('filters')}
                  leftSection={<TablerIcon name="adjustments" />}
                >
                  Filter
                </Button>
              </Stack>
            </Paper>
          )}
        />
      </Tabs.Panel>
    </Tabs>
  );
};

export default FiltersAndResults;
