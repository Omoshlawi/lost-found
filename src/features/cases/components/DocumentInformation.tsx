import React from 'react';
import {
  Avatar,
  Button,
  Grid,
  Group,
  Paper,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { Document } from '../types';
import { formatDate, getBackgroundColor } from '../utils/reportUtils';

interface DocumentProps {
  document?: Document;
  onUpdateReportDocument?: () => void;
}

const DocumentInformation: React.FC<DocumentProps> = ({ document, onUpdateReportDocument }) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      mb="md"
      style={{ backgroundColor: getBackgroundColor('blue', theme, colorScheme) }}
    >
      <Group mb="xs">
        <Title order={4}>Document Information</Title>
        <Group flex={1} justify="space-between">
          <Avatar size="md" radius="xl" color="blue">
            <TablerIcon name={document?.type?.icon as any} size={24} />
          </Avatar>
          <Tooltip label="Update Document Information">
            <Button
              variant="outline"
              color="blue"
              size="sm"
              leftSection={<TablerIcon name="pencil" size={16} />}
              onClick={onUpdateReportDocument}
            >
              Edit Document
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={4}>
          <Text fw={700}>Owner:</Text>
          <Text>{document?.ownerName || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Document Type:</Text>
          <Text>{document?.type?.name || 'Unknown'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Serial Number:</Text>
          <Text>{document?.serialNumber || 'Not available'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Document Number:</Text>
          <Text>{document?.documentNumber || 'Not available'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Batch Number:</Text>
          <Text>{document?.batchNumber || 'Not available'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Gender:</Text>
          <Text>{document?.gender || 'Unknown'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Place of birth:</Text>
          <Text>{document?.placeOfBirth || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Date of birth:</Text>
          <Text>{formatDate(document?.dateOfBirth)}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Issuer:</Text>
          <Text>{document?.issuer || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Place of issue:</Text>
          <Text>{document?.placeOfIssue || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Nationality:</Text>
          <Text>{document?.nationality || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Blood Group:</Text>
          <Text>{document?.bloodGroup || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Issuance Date:</Text>
          <Text>{formatDate(document?.issuanceDate)}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Expiry Date:</Text>
          <Text>{formatDate(document?.expiryDate)}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Expiry Date:</Text>
          <Text>{formatDate(document?.expiryDate)}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text fw={700}>Additional notes:</Text>
          <Text>{document?.note ?? 'Not available'}</Text>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default DocumentInformation;
