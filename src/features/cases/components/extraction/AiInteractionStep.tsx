import React from 'react';
import { Badge, Box, Group, Paper, Spoiler, Stack, Tabs, Text } from '@mantine/core';
import { TablerIcon } from '@/components';
import { cleanAiResponseText } from '@/lib/utils';
import { AiInteraction } from '../../types';

type AiInteractionStepProps<T extends object> = {
  aiInteraction: AiInteraction;
  renderParsedResponse?: (response: T) => React.ReactNode;
};

const AiInteractionStep = <T extends object>({
  aiInteraction: aiData,
  renderParsedResponse,
}: AiInteractionStepProps<T>) => {
  return (
    <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
      <Tabs defaultValue={typeof renderParsedResponse === 'function' ? 'data' : 'json'}>
        <Tabs.List>
          {typeof renderParsedResponse === 'function' && (
            <Tabs.Tab value="data" leftSection={<TablerIcon name="database" size={12} />}>
              Data
            </Tabs.Tab>
          )}
          <Tabs.Tab value="json" leftSection={<TablerIcon name="json" size={12} />}>
            JSON
          </Tabs.Tab>
          <Tabs.Tab value="ai" leftSection={<TablerIcon name="ai" size={12} />}>
            AI Interaction Details
          </Tabs.Tab>
        </Tabs.List>

        {typeof renderParsedResponse === 'function' && (
          <Tabs.Panel value="data">
            {renderParsedResponse(JSON.parse(cleanAiResponseText(aiData.response)))}
          </Tabs.Panel>
        )}

        <Tabs.Panel value="json">
          <Paper
            p="md"
            mt="sm"
            withBorder
            style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
          >
            {JSON.stringify(JSON.parse(cleanAiResponseText(aiData.response)), null, 2)}
          </Paper>
        </Tabs.Panel>
        <Tabs.Panel value="ai">
          <Paper p="md" mt="sm" withBorder>
            <Text size="sm" fw={500} mb="xs">
              AI Interaction Details:
            </Text>

            <Group gap="xs">
              <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                Model:
              </Text>
              <Text size="sm" fw={500}>
                {aiData.aiModel} ({aiData.modelVersion})
              </Text>
            </Group>

            <Group gap="xs">
              <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                Interaction Type:
              </Text>
              <Text size="sm" fw={500}>
                {aiData.interactionType}
              </Text>
            </Group>

            {aiData.tokenUsage && (
              <Box mt="xs">
                <Text size="sm" c="dimmed" mb="xs">
                  Token Usage:
                </Text>
                <Stack gap={4}>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                      Total Tokens:
                    </Text>
                    <Text size="sm" fw={500}>
                      {aiData.tokenUsage.totalTokenCount.toLocaleString()}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                      Prompt Tokens:
                    </Text>
                    <Text size="sm" fw={500}>
                      {aiData.tokenUsage.promptTokenCount.toLocaleString()}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                      Response Tokens:
                    </Text>
                    <Text size="sm" fw={500}>
                      {aiData.tokenUsage.candidatesTokenCount.toLocaleString()}
                    </Text>
                  </Group>
                </Stack>
              </Box>
            )}

            {aiData.processingTime && (
              <Group gap="xs">
                <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                  Processing Time:
                </Text>
                <Text size="sm" fw={500}>
                  {aiData.processingTime}
                </Text>
              </Group>
            )}

            {aiData.estimatedCost && (
              <Group gap="xs">
                <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                  Estimated Cost:
                </Text>
                <Text size="sm" fw={500}>
                  {aiData.estimatedCost}
                </Text>
              </Group>
            )}

            <Group gap="xs">
              <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                Status:
              </Text>
              <Badge color={aiData.success ? 'green' : 'red'} variant="light">
                {aiData.success ? 'Success' : 'Failed'}
              </Badge>
            </Group>

            {aiData.errorMessage && (
              <Box mt="xs">
                <Text size="sm" c="dimmed" mb="xs">
                  Error Message:
                </Text>
                <Text size="sm" c="red">
                  {aiData.errorMessage}
                </Text>
              </Box>
            )}

            {aiData.retryCount > 0 && (
              <Group gap="xs">
                <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                  Retry Count:
                </Text>
                <Text size="sm" fw={500}>
                  {aiData.retryCount}
                </Text>
              </Group>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Spoiler>
  );
};

export default AiInteractionStep;
