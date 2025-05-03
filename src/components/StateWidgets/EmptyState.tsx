import React from 'react';
import { Button, Card, Flex, Group, Stack, Text, useComputedColorScheme } from '@mantine/core';
import { TablerIcon } from '../TablerIcon';

type EmptyStateProps = {
  headerTitle: string;
  message?: string;
  onAdd?: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  headerTitle,
  message = 'No data found',
  onAdd,
}) => {
  const theme = useComputedColorScheme();
  return (
    <Card withBorder>
      <Card.Section p={'xs'} bg={'transparent'} pl={'lg'}>
        <Group>
          <Text fw={'bold'}>{headerTitle}</Text>
          <Flex flex={1} />
          {typeof onAdd === 'function' && (
            <Button
              w={'fit-content'}
              leftSection={<TablerIcon name="plus" />}
              variant="subtle"
              onClick={onAdd}
            >
              Add
            </Button>
          )}
        </Group>
      </Card.Section>
      <Card.Section p={'xs'} flex={1} bg={theme === 'light' ? 'gray.0' : 'gray.8'}>
        <Stack align="center">
          <TablerIcon name="clipboard" size={100} opacity={0.5} />
          <Text opacity={0.5}>{message}</Text>
          {typeof onAdd === 'function' && (
            <Button
              variant="transparent"
              leftSection={<TablerIcon name="plus" size={15} />}
              onClick={onAdd}
            >
              Add
            </Button>
          )}
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default EmptyState;
