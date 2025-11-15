import React, { useState } from 'react';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
  type Table as T,
} from '@tanstack/react-table';
import { Paper, Stack, Table } from '@mantine/core';
import DataTableHeader from './DataTableHeader';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
  renderPaginator?: (table: T<TData>) => React.ReactNode;
  withColumnViewOptions?: boolean;
  renderActions?: (table: T<TData>) => React.ReactNode;
  renderTable?: (table: T<TData>) => React.ReactNode;
  title?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderExpandedRow,
  renderPaginator,
  withColumnViewOptions = false,
  renderActions,
  renderTable,
  title,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      expanded,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    paginateExpandedRows: false,
  });

  const defaultRenderTable = (_table: T<TData>) => (
    <Table striped highlightOnHover>
      <Table.Thead>
        {_table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <Table.Th key={header.id} w={header?.getSize?.()}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </Table.Th>
              );
            })}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {_table.getRowModel().rows?.length ? (
          _table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <Table.Tr key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id} w={cell?.column?.getSize?.()}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
              {row.getIsExpanded() && typeof renderExpandedRow === 'function' && (
                <Table.Tr data-state={row.getIsExpanded() && 'expand'}>
                  <Table.Td colSpan={row.getVisibleCells().length} p="md">
                    {renderExpandedRow(row)}
                  </Table.Td>
                </Table.Tr>
              )}
            </React.Fragment>
          ))
        ) : (
          <Table.Tr>
            <Table.Td colSpan={columns.length}>No results.</Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
  const render = (_table: T<TData>) => {
    if (typeof renderTable === 'function') {
      return renderTable(_table);
    }
    return defaultRenderTable(_table);
  };
  return (
    <Stack gap="xs" m={0}>
      <DataTableHeader
        table={table}
        title={title}
        withColumnViewOptions={withColumnViewOptions}
        actions={renderActions?.(table)}
      />
      <Paper withBorder radius="xs" style={{ overflow: 'auto' }} component={Stack}>
        {render(table)}
        {renderPaginator && <>{renderPaginator(table)}</>}
        {/* {table.getFilteredSelectedRowModel()?.rows?.length > 0 && (
          <Text c={"dimmed"} size="sm" flex={1} fw={"bold"}>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </Text>
        )} */}
      </Paper>
    </Stack>
  );
}
