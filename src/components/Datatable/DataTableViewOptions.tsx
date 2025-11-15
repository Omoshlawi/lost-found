import { Button, Menu } from "@mantine/core";
import { IconCheck, IconSettings2 } from "@tabler/icons-react";
import { Column, Table } from "@tanstack/react-table";
import React from "react";

export function DataTableViewOptions<TData>({
  table,
  getOptionLabel,
}: {
  table: Table<TData>;
  getOptionLabel?: (column: Column<TData>) => string;
}) {
  return (
    <Menu>
      <Menu.Target>
        <Button
          variant="default"
          size="sm"
          leftSection={<IconSettings2 size={16} />}
        >
          View
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Toggle columns</Menu.Label>
        <Menu.Divider />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            const visible = column.getIsVisible();
            const label = getOptionLabel?.(column) ?? column.id;
            return (
              <Menu.Item
                key={column.id}
                onClick={() => column.toggleVisibility(!visible)}
                leftSection={visible ? <IconCheck size={16} /> : undefined}
              >
                {label}
              </Menu.Item>
            );
          })}
      </Menu.Dropdown>
    </Menu>
  );
}
