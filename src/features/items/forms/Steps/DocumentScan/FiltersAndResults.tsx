import React, { useState } from 'react';
import { Tabs, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { FileWithPath } from '@mantine/dropzone';
import { ErrorState, TablerIcon, When } from '@/components';
import { useImageScanResults } from '@/features/items/hooks';
import { ImageProcessFormValues, ImageScanResult } from '@/features/items/types';
import DocumentFilterForm from './DocumentFilterForm';
import DocumentScanExtractionResults from './DocumentScanExtractionResults';

// Mock data for demonstration
const mockExtractedText = `INVOICE
Invoice Number: INV-2023-0042
Date: May 13, 2023

Bill To:
John Smith
123 Main Street
Anytown, CA 12345

Description                 Quantity    Price    Amount
Web Development Services    40 hours    $75      $3,000
UI/UX Design                15 hours    $85      $1,275
Server Configuration        5 hours     $95      $475

Subtotal: $4,750
Tax (8%): $380
Total: $5,130

Payment due within 30 days.
Thank you for your business!`;

const mockJsonData = {
  invoiceNumber: 'INV-2023-0042',
  date: 'May 13, 2023',
  billTo: {
    name: 'John Smith',
    address: '123 Main Street',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
  },
  items: [
    {
      description: 'Web Development Services',
      quantity: '40 hours',
      price: '$75',
      amount: '$3,000',
    },
    {
      description: 'UI/UX Design',
      quantity: '15 hours',
      price: '$85',
      amount: '$1,275',
    },
    {
      description: 'Server Configuration',
      quantity: '5 hours',
      price: '$95',
      amount: '$475',
    },
  ],
  subtotal: '$4,750',
  tax: '$380',
  total: '$5,130',
};

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
              extractedinfo={{ data: data.info }}
            />
          </Tabs.Panel>
        )}
      />
    </Tabs>
  );
};

export default FiltersAndResults;
