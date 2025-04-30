import React from 'react';
import { Button, Card, Stack, Text } from '@mantine/core';
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
  return (
    <Card>
      <Card.Section withBorder p={'xs'}>
        {headerTitle}
      </Card.Section>
      <Card.Section withBorder p={'xs'} flex={1}>
        <Stack align="center">
          <TablerIcon name="clipboard" size={100} />
          <Text>{message}</Text>
          {typeof onAdd === 'function' && (
            <Button variant="transparent" leftSection={<TablerIcon name="plus" size={15} />}>
              Add
            </Button>
          )}
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default EmptyState;
