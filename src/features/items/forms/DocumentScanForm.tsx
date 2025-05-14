import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconCheck, IconMoon, IconSun } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ActionIcon,
  Grid,
  Group,
  Paper,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { type FileWithPath } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { ImageProcessFormValues } from '../types';
import FiltersAndResults from './Steps/DocumentScan/FiltersAndResults';
import ImageUploadAndPreview from './Steps/DocumentScan/ImageUploadAndPreview';

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

const DocumentScanForm = () => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [imageFilters, setImageFilters] = useState<Partial<ImageProcessFormValues>>({});

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [jsonData, setJsonData] = useState<any>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const handleScan = () => {
    setScanning(true);

    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      setExtractedText(mockExtractedText);
      setJsonData(mockJsonData);

      // Set default selected fields
      setSelectedFields(['invoiceNumber', 'date', 'total']);

      showNotification({
        title: 'Scan Complete',
        message: 'Document has been successfully scanned and processed',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
    }, 1500);
  };

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
        <ActionIcon
          variant="outline"
          color={isDark ? 'yellow' : 'teal'}
          onClick={() => toggleColorScheme()}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>
      </Group>

      <Grid gutter="md">
        {/* Left column - Image upload and preview */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <ImageUploadAndPreview filters={imageFilters} />
        </Grid.Col>

        {/* Right column - Filters and results */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <FiltersAndResults
            extractedinfo={mockJsonData}
            extractedText={mockExtractedText}
            onApplyFilters={(f) => {
              setImageFilters(f);
            }}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default DocumentScanForm;
