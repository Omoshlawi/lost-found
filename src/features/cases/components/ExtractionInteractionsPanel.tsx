import React, { useMemo } from 'react';
import { Accordion, Badge, Group, Stack, Text } from '@mantine/core';
import { StatusBadge, TablerIcon } from '@/components';
import { AIExtraction } from '../types';
import AttemptDetail from './AttemptDetail';

interface ExtractionInteractionsPanelProps {
  extractions: AIExtraction[];
}

const ExtractionInteractionsPanel: React.FC<ExtractionInteractionsPanelProps> = ({ extractions }) => {
  const sorted = useMemo(
    () => [...extractions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [extractions],
  );

  if (sorted.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        No processing attempts recorded for this case.
      </Text>
    );
  }

  return (
    <Stack gap="md">
      <Accordion variant="separated" defaultValue={sorted[0]?.id}>
        {sorted.map((extraction, index) => {
          const attemptNumber = sorted.length - index;
          const isPending =
            extraction.extractionStatus === 'PENDING' ||
            extraction.extractionStatus === 'IN_PROGRESS';

          return (
            <Accordion.Item key={extraction.id} value={extraction.id}>
              <Accordion.Control icon={<TablerIcon name="robot" size={16} />}>
                <Group gap="sm">
                  <Text size="sm" fw={600}>Attempt {attemptNumber}</Text>
                  <StatusBadge status={extraction.extractionStatus} />
                  {isPending && extraction.currentStep && (
                    <Badge color="civicBlue" variant="light" size="xs">
                      {{ VISION: 'Image Scan', STRUCTURE: 'Data Reading' }[extraction.currentStep] ?? extraction.currentStep}
                    </Badge>
                  )}
                  <Text size="xs" c="dimmed">
                    {new Date(extraction.createdAt).toLocaleString()}
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <AttemptDetail extraction={extraction} />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Stack>
  );
};

export default ExtractionInteractionsPanel;
