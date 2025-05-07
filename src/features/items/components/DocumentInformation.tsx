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
}

const DocumentInformation: React.FC<DocumentProps> = ({ document }) => {
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
            >
              Edit Document
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={6}>
          <Text fw={700}>Owner:</Text>
          <Text>{document?.ownerName || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text fw={700}>Document Type:</Text>
          <Text>{document?.type?.name || 'Unknown'}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text fw={700}>Serial Number:</Text>
          <Text>{document?.serialNumber || 'Not available'}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text fw={700}>Issuer:</Text>
          <Text>{document?.issuer || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text fw={700}>Issuance Date:</Text>
          <Text>{formatDate(document?.issuanceDate)}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text fw={700}>Expiry Date:</Text>
          <Text>{formatDate(document?.expiryDate)}</Text>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default DocumentInformation;
