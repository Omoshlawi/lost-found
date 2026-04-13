import React from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Code,
  Divider,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { SectionTitle, StatusBadge, TablerIcon } from '@/components';
import { AIExtraction, AIExtractionInteraction, AIExtractionInteractionType } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INTERACTION_LABEL: Record<AIExtractionInteractionType, string> = {
  VISION_EXTRACTION: 'Image Analysis',
  TEXT_EXTRACTION: 'Data Extraction',
};

const INTERACTION_ICON: Record<AIExtractionInteractionType, string> = {
  VISION_EXTRACTION: 'eye',
  TEXT_EXTRACTION: 'textRecognition',
};

function tryPrettyJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const InteractionDetail: React.FC<{ interaction: AIExtractionInteraction }> = ({
  interaction,
}) => {
  const ai = interaction.aiInteraction;

  return (
    <Stack gap="md">
      {/* Step-level metadata */}
      <Grid gutter="md">
        {ai && (
          <>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="xs" fw={600} c="dimmed" mb={2}>Model</Text>
              <Text size="sm" ff="monospace">{ai.aiModel}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="xs" fw={600} c="dimmed" mb={2}>Version</Text>
              <Text size="sm" ff="monospace">{ai.modelVersion}</Text>
            </Grid.Col>
          </>
        )}
        {interaction.confidence != null && (
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" fw={600} c="dimmed" mb={2}>Step Confidence</Text>
            <Text size="sm">{Math.round(interaction.confidence * 100)}%</Text>
          </Grid.Col>
        )}
        {ai && (
          <>
            {ai.processingTime && (
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Text size="xs" fw={600} c="dimmed" mb={2}>Processing Time</Text>
                <Text size="sm">{ai.processingTime}</Text>
              </Grid.Col>
            )}
            {ai.estimatedCost && (
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Text size="xs" fw={600} c="dimmed" mb={2}>Est. Cost</Text>
                <Text size="sm">{ai.estimatedCost}</Text>
              </Grid.Col>
            )}
            {ai.tokenUsage && (
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Text size="xs" fw={600} c="dimmed" mb={2}>Tokens</Text>
                <Text size="sm">
                  {ai.tokenUsage.totalTokenCount.toLocaleString()}
                  <Text span size="xs" c="dimmed">
                    {' '}({ai.tokenUsage.promptTokenCount.toLocaleString()} prompt / {ai.tokenUsage.candidatesTokenCount.toLocaleString()} response)
                  </Text>
                </Text>
              </Grid.Col>
            )}
            {ai.retryCount > 0 && (
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Text size="xs" fw={600} c="dimmed" mb={2}>Retries</Text>
                <Badge color="orange" variant="light" size="sm">{ai.retryCount}</Badge>
              </Grid.Col>
            )}
          </>
        )}
      </Grid>

      {/* Error at step level */}
      {interaction.errorMessage && (
        <Alert
          variant="light"
          color="red"
          icon={<TablerIcon name="alertCircle" size={14} />}
          title="Step Error"
        >
          <Text size="sm" ff="monospace" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {interaction.errorMessage}
          </Text>
        </Alert>
      )}

      {/* Prompt / Response / AI Error tabs */}
      {ai && (
        <Tabs defaultValue="prompt" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="prompt" leftSection={<TablerIcon name="message" size={13} />}>
              Prompt
            </Tabs.Tab>
            <Tabs.Tab value="response" leftSection={<TablerIcon name="messageReply" size={13} />}>
              Response
            </Tabs.Tab>
            {ai.errorMessage && (
              <Tabs.Tab
                value="error"
                leftSection={<TablerIcon name="alertTriangle" size={13} />}
                color="red"
              >
                Error
              </Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="prompt" pt="sm">
            <ScrollArea h={280} type="auto">
              <Code block style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {ai.prompt || '—'}
              </Code>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="response" pt="sm">
            <ScrollArea h={280} type="auto">
              <Code block style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {ai.response ? tryPrettyJson(ai.response) : '—'}
              </Code>
            </ScrollArea>
          </Tabs.Panel>

          {ai.errorMessage && (
            <Tabs.Panel value="error" pt="sm">
              <Alert variant="light" color="red" icon={<TablerIcon name="alertCircle" size={14} />}>
                <Text size="sm" ff="monospace" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {ai.errorMessage}
                </Text>
              </Alert>
            </Tabs.Panel>
          )}
        </Tabs>
      )}
    </Stack>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface ExtractionInteractionsPanelProps {
  extraction: AIExtraction;
}

const ExtractionInteractionsPanel: React.FC<ExtractionInteractionsPanelProps> = ({
  extraction,
}) => {
  const interactions = extraction.aiextractionInteractions ?? [];

  return (
    <Stack gap="xl">

      {/* ── Summary ─────────────────────────────────────────────────────── */}
      <Stack gap="md">
        <SectionTitle label="Pipeline Summary" />
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text size="xs" fw={600} c="dimmed" mb={4}>Status</Text>
            <StatusBadge status={extraction.extractionStatus} />
          </Grid.Col>
          {extraction.currentStep && (
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="xs" fw={600} c="dimmed" mb={4}>Current Step</Text>
              <Text size="sm">
                {{ VISION: 'Image Analysis', TEXT: 'Data Extraction', POST_PROCESSING: 'Post Processing' }[extraction.currentStep] ?? extraction.currentStep}
              </Text>
            </Grid.Col>
          )}
          {extraction.ocrConfidence != null && (
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="xs" fw={600} c="dimmed" mb={4}>OCR Confidence</Text>
              <Text size="sm">{Math.round(extraction.ocrConfidence * 100)}%</Text>
            </Grid.Col>
          )}
          {extraction.extractionConfidence != null && (
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text size="xs" fw={600} c="dimmed" mb={4}>Extraction Confidence</Text>
              <Text size="sm">{Math.round(extraction.extractionConfidence * 100)}%</Text>
            </Grid.Col>
          )}
          {extraction.fallbackTriggered && (
            <Grid.Col span={12}>
              <Badge
                variant="light"
                color="orange"
                leftSection={<TablerIcon name="alertTriangle" size={12} />}
              >
                Fallback extraction triggered — results may be less accurate
              </Badge>
            </Grid.Col>
          )}
        </Grid>
      </Stack>

      <Divider />

      {/* ── Interactions ─────────────────────────────────────────────────── */}
      <Stack gap="md">
        <SectionTitle label="AI Interactions" />

        {interactions.length === 0 ? (
          <Text size="sm" c="dimmed">
            No interaction data available.{' '}
            {extraction.extractionStatus === 'PENDING' || extraction.extractionStatus === 'IN_PROGRESS'
              ? 'The pipeline has not yet started or completed this step.'
              : 'Interaction records may not have been captured.'}
          </Text>
        ) : (
          <Accordion variant="separated" defaultValue={interactions[0]?.id}>
            {interactions.map((interaction) => {
              const label = INTERACTION_LABEL[interaction.extractionType] ?? interaction.extractionType;
              const icon = INTERACTION_ICON[interaction.extractionType] ?? 'robot';

              return (
                <Accordion.Item key={interaction.id} value={interaction.id}>
                  <Accordion.Control
                    icon={<TablerIcon name={icon as any} size={16} />}
                  >
                    <Group gap="sm">
                      <Text size="sm" fw={600}>{label}</Text>
                      {interaction.success ? (
                        <Badge color="civicGreen" variant="light" size="xs">Success</Badge>
                      ) : (
                        <Badge color="red" variant="light" size="xs">Failed</Badge>
                      )}
                      {interaction.aiInteraction?.aiModel && (
                        <Text size="xs" c="dimmed" ff="monospace">
                          {interaction.aiInteraction.aiModel}
                        </Text>
                      )}
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <InteractionDetail interaction={interaction} />
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </Stack>
    </Stack>
  );
};

export default ExtractionInteractionsPanel;
