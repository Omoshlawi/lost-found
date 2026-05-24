import React from 'react';
import { Alert, Divider, Grid, Stack, Text } from '@mantine/core';
import { TablerIcon } from '@/components';
import { DocaiStage } from '../types';
import ConversationsView from './ConversationsView';
import { formatDuration } from './extraction-constants';

interface StageDetailProps {
  stage: DocaiStage;
}

const StageDetail: React.FC<StageDetailProps> = ({ stage }) => {
  const usage = stage.usage as Record<string, unknown> | null;
  const tokens = usage?.total_tokens ?? usage?.totalTokens;
  const duration = formatDuration(stage.started_at, stage.completed_at);

  return (
    <Stack gap="md">
      <Grid gutter="md">
        {duration !== '—' && (
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" fw={600} c="dimmed" mb={2}>Duration</Text>
            <Text size="sm" ff="monospace">{duration}</Text>
          </Grid.Col>
        )}
        {tokens != null && (
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" fw={600} c="dimmed" mb={2}>Tokens</Text>
            <Text size="sm" ff="monospace">{Number(tokens).toLocaleString()}</Text>
          </Grid.Col>
        )}
        {stage.completed_at && (
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" fw={600} c="dimmed" mb={2}>Completed</Text>
            <Text size="sm">{new Date(stage.completed_at).toLocaleString()}</Text>
          </Grid.Col>
        )}
      </Grid>

      {stage.error && (
        <Alert
          variant="light"
          color="red"
          icon={<TablerIcon name="alertCircle" size={14} />}
          title="Stage Error"
        >
          <Text size="sm" ff="monospace" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {stage.error}
          </Text>
        </Alert>
      )}

      <Divider />
      <ConversationsView
        conversations={stage.conversations}
        stageFailed={stage.status !== 'SUCCESS'}
      />
    </Stack>
  );
};

export default StageDetail;
