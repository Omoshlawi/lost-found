import React from 'react';
import { Table } from '@tanstack/react-table';
import { Pagination } from '@mantine/core';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <Pagination
      total={table.getPageCount()}
      value={table.getState().pagination.pageIndex + 1}
      onChange={(page) => table.setPageIndex(page - 1)}
    />
  );
}
