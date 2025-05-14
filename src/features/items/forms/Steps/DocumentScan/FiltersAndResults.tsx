import React, { useState } from 'react';
import { Tabs, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { TablerIcon } from '@/components';
import { ImageProcessFormValues } from '@/features/items/types';
import DocumentFilterForm from './DocumentFilterForm';
import DocumentScanExtractionResults from './DocumentScanExtractionResults';

type FiltersAndResultsProps = {
  extractedText: string;
  extractedinfo: Record<string, any>;
  onApplyFilters?: (filters: Partial<ImageProcessFormValues>) => void;
};

const FiltersAndResults: React.FC<FiltersAndResultsProps> = ({
  extractedText,
  extractedinfo,
  onApplyFilters,
}) => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();
  const scanned = true;

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
        <DocumentFilterForm onSubmit={onApplyFilters}/>
      </Tabs.Panel>

      {scanned && (
        <Tabs.Panel value="results" pt="md">
          <DocumentScanExtractionResults
            extractedText={extractedText}
            extractedinfo={extractedinfo}
          />
        </Tabs.Panel>
      )}
    </Tabs>
  );
};

export default FiltersAndResults;
