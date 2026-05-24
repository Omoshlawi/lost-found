import React from 'react';
import { Accordion, Alert, Badge, Group, Loader, Text } from '@mantine/core';
import { TablerIcon } from '@/components';
import { useExtractionStages } from '../hooks';
import StageDetail from './StageDetail';
import { formatDuration, STAGE_ICON, STAGE_LABEL } from './extraction-constants';

interface StagesPanelProps {
  docaiJobId?: string;
  extractionStatus: string;
}

const StagesPanel: React.FC<StagesPanelProps> = ({ docaiJobId, extractionStatus }) => {
  const { stages, isLoading, error } = useExtractionStages(docaiJobId);

  if (!docaiJobId) {
    return (
      <Text size="sm" c="dimmed">
        {extractionStatus === 'PENDING'
          ? 'Processing has not started yet.'
          : 'No stage data — job was never submitted to the processing pipeline.'}
      </Text>
    );
  }

  if (isLoading) {
    return (
      <Group gap="xs">
        <Loader size="xs" />
        <Text size="sm" c="dimmed">Fetching processing stages…</Text>
      </Group>
    );
  }

  if (error) {
    return (
      <Alert variant="light" color="orange" icon={<TablerIcon name="alertTriangle" size={14} />}>
        <Text size="sm">
          {(error as { status?: number })?.status === 403
            ? 'You do not have permission to view processing stages.'
            : 'Failed to load processing stages.'}
        </Text>
      </Alert>
    );
  }

  if (stages.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        No stage records found for this processing attempt.
      </Text>
    );
  }

  return (
    <Accordion variant="contained" defaultValue={stages[0]?.stage_id}>
      {stages.map((stage) => {
        const label = STAGE_LABEL[stage.stage] ?? stage.stage;
        const icon = STAGE_ICON[stage.stage] ?? 'cpu';
        const success = stage.status === 'SUCCESS';

        return (
          <Accordion.Item key={stage.stage_id} value={stage.stage_id}>
            <Accordion.Control icon={<TablerIcon name={icon as any} size={16} />}>
              <Group gap="sm">
                <Text size="sm" fw={600}>{label}</Text>
                <Badge color={success ? 'civicGreen' : 'red'} variant="light" size="xs">
                  {success ? 'Success' : 'Failed'}
                </Badge>
                {stage.started_at && (
                  <Text size="xs" c="dimmed">
                    {formatDuration(stage.started_at, stage.completed_at)}
                  </Text>
                )}
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <StageDetail stage={stage} />
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

export default StagesPanel;
