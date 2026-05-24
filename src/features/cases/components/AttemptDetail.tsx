import React from 'react';
import { Alert, Badge, Divider, Grid, Group, Stack, Text } from '@mantine/core';
import { SectionTitle, TablerIcon } from '@/components';
import { AIExtraction } from '../types';
import StagesPanel from './StagesPanel';

interface AttemptDetailProps {
  extraction: AIExtraction;
}

const AttemptDetail: React.FC<AttemptDetailProps> = ({ extraction }) => (
  <Stack gap="lg">
    <Grid gutter="md">
      {extraction.ocrConfidence != null && (
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text size="xs" fw={600} c="dimmed" mb={4}>OCR Confidence</Text>
          <Text size="sm">{Math.round(extraction.ocrConfidence * 100)}%</Text>
        </Grid.Col>
      )}
      {extraction.extractionConfidence != null && (
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text size="xs" fw={600} c="dimmed" mb={4}>Data Confidence</Text>
          <Text size="sm">{Math.round(extraction.extractionConfidence * 100)}%</Text>
        </Grid.Col>
      )}
      {extraction.documentTypeCode && (
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Text size="xs" fw={600} c="dimmed" mb={4}>Detected Type</Text>
          <Text size="sm" ff="monospace">{extraction.documentTypeCode}</Text>
        </Grid.Col>
      )}
    </Grid>

    {extraction.warnings && extraction.warnings.length > 0 && (
      <Group gap="xs" wrap="wrap">
        {extraction.warnings.map((w) => (
          <Badge
            key={w}
            color="orange"
            variant="light"
            size="xs"
            leftSection={<TablerIcon name="alertTriangle" size={10} />}
          >
            {w}
          </Badge>
        ))}
      </Group>
    )}

    {extraction.failureReason && (
      <Alert
        variant="light"
        color="red"
        icon={<TablerIcon name="alertCircle" size={14} />}
        title="Processing Failed"
      >
        <Text size="sm">{extraction.failureReason}</Text>
      </Alert>
    )}

    <Divider />

    <SectionTitle label="Processing Stages" />
    <StagesPanel
      docaiJobId={extraction.docaiJobId}
      extractionStatus={extraction.extractionStatus}
    />
  </Stack>
);

export default AttemptDetail;
