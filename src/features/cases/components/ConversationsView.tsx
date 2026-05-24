import React, { useMemo } from 'react';
import { Code, Collapse, Group, ScrollArea, Stack, Tabs, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TablerIcon } from '@/components';
import { DocaiConversation } from '../types';

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

interface ConversationsViewProps {
  conversations: DocaiConversation[];
  stageFailed?: boolean;
}

const ConversationsView: React.FC<ConversationsViewProps> = ({ conversations, stageFailed }) => {
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
        {stageFailed
          ? 'No AI conversation was recorded — the stage failed before any LLM call was made.'
          : 'No conversation records for this stage.'}
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

export default ConversationsView;
