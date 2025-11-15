import React from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { DataTableViewOptions } from './DataTableViewOptions';

interface DataTableHeaderProps<TData> {
  table: Table<TData>;
  title?: string;
  actions?: React.ReactNode;
  onAdd?: () => void;
  withColumnViewOptions?: boolean;
}

const DataTableHeader = <TData,>({
  table,
  title,
  actions,
  onAdd,
  withColumnViewOptions = false,
}: DataTableHeaderProps<TData>) => {
  return (
    <Stack
      mb="md"
      gap="sm"
      w="100%"
      justify="space-between"
      align="stretch"
      // Responsive Stack on mobile, Flex row on sm+
      styles={(theme) => ({
        root: {
          [`@media (minWidth: ${theme.breakpoints.sm})`]: {
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        },
      })}
    >
      {/* Title section */}
      {title && (
        <Box>
          <Text fw={700} size="xl">
            {title}
          </Text>
        </Box>
      )}

      {/* Actions section */}
      <Group justify="flex-start" gap="sm" wrap="wrap" style={{ flexWrap: 'wrap' }}>
        {withColumnViewOptions && (
          <Box>
            <DataTableViewOptions table={table} />
          </Box>
        )}

        {typeof onAdd === 'function' && (
          <Button
            leftSection={<IconPlus size={16} />}
            fullWidth
            visibleFrom="xs"
            maw={{ sm: 'unset' }}
          >
            Add
          </Button>
        )}

        {actions}
      </Group>
    </Stack>
  );
};

export default DataTableHeader;
