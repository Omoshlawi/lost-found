import React, { useMemo } from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Code,
  Collapse,
  Divider,
  Grid,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SectionTitle, StatusBadge, TablerIcon } from '@/components';
import { AIExtraction, DocaiConversation, DocaiStage } from '../types';
import { useExtractionStages } from '../hooks';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STAGE_LABEL: Record<string, string> = {
  VISION: 'Image Scan',
  STRUCTURE: 'Data Reading',
};

const STAGE_ICON: Record<string, string> = {
  VISION: 'eye',
  STRUCTURE: 'textRecognition',
};

function formatDuration(startedAt: string | null, completedAt: string): string {
  if (!startedAt) return '—';
  const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// ─── Conversation message row ─────────────────────────────────────────────────

const SystemMessageRow: React.FC<{ content: string }> = ({ content }) => {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <Stack gap={4}>
      <UnstyledButton onClick={toggle}>
        <Group gap="xs">
          <TablerIcon name="settings" size={13} />
          <Text size="xs" c="dimmed" fw={500}>
            System {opened ? '▲' : '▼'}
          </Text>
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        <ScrollArea h={160} type="auto">
          <Code block style={{ fontSize: 11, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {content}
          </Code>
        </ScrollArea>
      </Collapse>
    </Stack>
  );
};

const MessageRow: React.FC<{ role: string; content: string }> = ({ role, content }) => {
  const isAssistant = role === 'assistant';
  return (
    <Stack gap={4}>
      <Group gap="xs">
        <TablerIcon name={isAssistant ? 'robot' : 'message'} size={13} />
        <Text size="xs" fw={600} c={isAssistant ? 'civicBlue' : 'dimmed'} tt="capitalize">
          {role}
        </Text>
      </Group>
      <ScrollArea h={200} type="auto">
        <Code block style={{ fontSize: 11, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {content || '—'}
        </Code>
      </ScrollArea>
    </Stack>
  );
};

// ─── Conversations grouped by round ──────────────────────────────────────────

const ConversationsView: React.FC<{ conversations: DocaiConversation[] }> = ({ conversations }) => {
  const rounds = useMemo(() => {
    const map = new Map<number, DocaiConversation[]>();
    for (const c of conversations) {
      const list = map.get(c.round) ?? [];
      list.push(c);
      map.set(c.round, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [conversations]);

  if (rounds.length === 0) {
    return (
      <Text size="xs" c="dimmed">
        No conversation records for this stage.
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <TablerIcon name="messages" size={14} />
        <Text size="xs" fw={600} c="dimmed">
          AI Conversations
        </Text>
      </Group>
      <Tabs defaultValue={String(rounds[0][0])} variant="outline">
        <Tabs.List>
          {rounds.map(([round]) => (
            <Tabs.Tab key={round} value={String(round)}>
              Round {round}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {rounds.map(([round, messages]) => (
          <Tabs.Panel key={round} value={String(round)} pt="sm">
            <Stack gap="md">
              {messages.map((msg) =>
                msg.role === 'system' ? (
                  <SystemMessageRow key={msg.conversation_id} content={msg.content} />
                ) : (
                  <MessageRow key={msg.conversation_id} role={msg.role} content={msg.content} />
                ),
              )}
            </Stack>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
};

// ─── Single stage panel ───────────────────────────────────────────────────────

const StageDetail: React.FC<{ stage: DocaiStage }> = ({ stage }) => {
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

      {stage.conversations.length > 0 && (
        <>
          <Divider />
          <ConversationsView conversations={stage.conversations} />
        </>
      )}
    </Stack>
  );
};

// ─── Stages panel (lazy SWR) ──────────────────────────────────────────────────

const StagesPanel: React.FC<{ docaiJobId?: string; extractionStatus: string }> = ({
  docaiJobId,
  extractionStatus,
}) => {
  const { stages, isLoading, error } = useExtractionStages(docaiJobId);

  if (!docaiJobId) {
    if (extractionStatus === 'PENDING') {
      return (
        <Text size="sm" c="dimmed">
          Processing has not started yet.
        </Text>
      );
    }
    return (
      <Text size="sm" c="dimmed">
        No stage data — job was never submitted to the processing pipeline.
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
                <Badge
                  color={success ? 'civicGreen' : 'red'}
                  variant="light"
                  size="xs"
                >
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

// ─── Single extraction attempt ────────────────────────────────────────────────

const AttemptDetail: React.FC<{ extraction: AIExtraction }> = ({ extraction }) => (
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
          <Badge key={w} color="orange" variant="light" size="xs"
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

// ─── Main component ───────────────────────────────────────────────────────────

interface ExtractionInteractionsPanelProps {
  extractions: AIExtraction[];
}

const ExtractionInteractionsPanel: React.FC<ExtractionInteractionsPanelProps> = ({
  extractions,
}) => {
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
              <Accordion.Control
                icon={<TablerIcon name="robot" size={16} />}
              >
                <Group gap="sm">
                  <Text size="sm" fw={600}>
                    Attempt {attemptNumber}
                  </Text>
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
