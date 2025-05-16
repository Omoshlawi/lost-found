import React, { useState } from 'react';
import { Tabs, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { ErrorState, TablerIcon, When } from '@/components';
import { useImageScanResults } from '@/features/items/hooks';
import { ImageProcessFormValues, ImageScanResult } from '@/features/items/types';
import DocumentFilterForm from './DocumentFilterForm';
import DocumentScanExtractionResults from './DocumentScanExtractionResults';

type FiltersAndResultsProps = {
  onExtractionDone?: (extractionResults: ImageScanResult) => void;
  onApplyFilters?: (filters: ImageProcessFormValues) => void;
  file?: FileWithPath;
  currentFilters?: ImageProcessFormValues;
};

const FiltersAndResults: React.FC<FiltersAndResultsProps> = ({
  onExtractionDone,
  onApplyFilters,
  file,
  currentFilters,
}) => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();
  const scanned = true;
  const asyncImageScanResult = useImageScanResults(file, currentFilters);

  return (
    <Tabs
      defaultValue="filters"
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
        <Tabs.Tab value="filters" leftSection={<TablerIcon name="adjustments" size={16} />}>
          Image Filters
        </Tabs.Tab>
        {scanned && (
          <Tabs.Tab value="results" leftSection={<TablerIcon name="fileText" size={16} />}>
            Scan Results
          </Tabs.Tab>
        )}
      </Tabs.List>

      <Tabs.Panel value="filters" pt="md">
        <DocumentFilterForm onSubmit={onApplyFilters} />
      </Tabs.Panel>

      <When
        asyncState={asyncImageScanResult}
        loading={() => <></>}
        error={(e) => <ErrorState headerTitle="Error scanning docs" error={e} />}
        success={(data) => (
          <Tabs.Panel value="results" pt="md">
            <DocumentScanExtractionResults
              extractedText={data.text}
              extractedinfo={data.info}
            />
          </Tabs.Panel>
        )}
      />
    </Tabs>
  );
};

export default FiltersAndResults;
