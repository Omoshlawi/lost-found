import { Button, Stack, Text } from '@mantine/core';
import React from 'react';
import { TableContainer } from '../TableContainer';
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
    <TableContainer
      title={headerTitle}
      actions={
        typeof onAdd === 'function' && (
          <Button
            w={'fit-content'}
            leftSection={<TablerIcon name="plus" />}
            variant="subtle"
            onClick={onAdd}
          >
            Add
          </Button>
        )
      }
    >
      <Stack align="center">
        <TablerIcon name="clipboard" size={100} opacity={0.5} />
        <Text c={'dimmed'}>{message}</Text>
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
    </TableContainer>
  );
};

export default EmptyState;
