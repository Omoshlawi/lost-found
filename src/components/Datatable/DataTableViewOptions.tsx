import React from 'react';
import { Column, Table } from '@tanstack/react-table';
import { Button, Menu } from '@mantine/core';
import { TablerIcon } from '../TablerIcon';

export function DataTableViewOptions<TData>({
  table,
  getOptionLabel,
}: {
  table: Table<TData>;
  getOptionLabel?: (column: Column<TData>) => string;
}) {
  return (
    <Menu position="bottom-end" shadow="md">
      <Menu.Target>
        <Button
          variant="default"
          size="xs"
          leftSection={<TablerIcon name="layoutColumns" size={14} />}
        >
          Columns
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Toggle columns</Menu.Label>
        <Menu.Divider />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            const visible = column.getIsVisible();
            const headerDef = column.columnDef.header;
            const label =
              getOptionLabel?.(column) ??
              (typeof headerDef === 'string' ? headerDef : column.id);
            return (
              <Menu.Item
                key={column.id}
                onClick={() => column.toggleVisibility(!visible)}
                leftSection={
                  visible ? (
                    <TablerIcon name="eye" size={14} />
                  ) : (
                    <TablerIcon name="eyeOff" size={14} />
                  )
                }
              >
                {label}
              </Menu.Item>
            );
          })}
      </Menu.Dropdown>
    </Menu>
  );
}
