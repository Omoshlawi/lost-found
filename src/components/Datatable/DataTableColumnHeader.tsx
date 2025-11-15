import { IconArrowDown, IconArrowUp, IconEyeOff } from '@tabler/icons-react';
import { Column } from '@tanstack/react-table';
import {
  Button,
  ButtonProps,
  Menu,
  MenuDividerProps,
  MenuDropdownProps,
  MenuItemProps,
  MenuProps,
  MenuTargetProps,
  Text,
} from '@mantine/core';
import { TablerIcon } from '../TablerIcon';

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  props?: {
    button?: ButtonProps;
    menu?: MenuProps;
    menuTargetProps?: MenuTargetProps;
    menuDropdownProps?: MenuDropdownProps;
    menuItemProps?: MenuItemProps;
    menuDividerProps?: MenuDividerProps;
  };
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  props,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <Text>{title}</Text>;
  }

  return (
    <Menu {...props?.menu}>
      <Menu.Target {...props?.menuTargetProps}>
        <Button
          {...props?.button}
          justify="start"
          p={0}
          m={0}
          ta="start"
          variant="transparent"
          size="sm"
          leftSection={
            <TablerIcon
              size={16}
              name={
                column.getIsSorted() === 'desc'
                  ? 'arrowDown'
                  : column.getIsSorted() === 'asc'
                    ? 'arrowUp'
                    : 'arrowsUpDown'
              }
            />
          }
        >
          {title}
        </Button>
      </Menu.Target>
      <Menu.Dropdown {...props?.menuDropdownProps}>
        <Menu.Item {...props?.menuItemProps} onClick={() => column.toggleSorting(false)}>
          <IconArrowUp size={16} />
          Asc
        </Menu.Item>
        <Menu.Item {...props?.menuItemProps} onClick={() => column.toggleSorting(true)}>
          <IconArrowDown size={16} />
          Desc
        </Menu.Item>
        <Menu.Divider {...props?.menuDividerProps} />
        <Menu.Item {...props?.menuItemProps} onClick={() => column.toggleVisibility(false)}>
          <IconEyeOff size={16} />
          Hide
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
