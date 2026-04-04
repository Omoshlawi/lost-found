import React, { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import { Button, Group, Pagination, SegmentedControl, Text } from '@mantine/core';
import { TableSkeleton } from '../ComponentSkeletons';
import { EmptyState, ErrorState } from '../StateWidgets';
import { DataTable, DataTableProps } from './DataTable';

export interface PaginationConfig {
  total: number;
  page: number;
  limit: number;
  onChange: (page: number) => void;
}

interface StateFullDataTableProps<TData, TValue>
  extends Omit<DataTableProps<TData, TValue>, 'renderTable'> {
  isLoading?: boolean;
  error?: Error;
  onAdd?: () => void;
  retryOnError?: () => void;
  nothingFoundMessage?: string;
  errorMessage?: string;
  views?: Record<string, (table: Table<TData>) => React.ReactNode>;
  renderViewTabItem?: (view: string) => React.ReactNode;
  defaultView?: string;
  pagination?: PaginationConfig;
}

const StateFullDataTable = <TData, TValue>({
  error,
  isLoading,
  onAdd,
  retryOnError,
  renderActions,
  nothingFoundMessage,
  errorMessage,
  views = {},
  renderViewTabItem,
  defaultView = 'table',
  pagination,
  ...props
}: StateFullDataTableProps<TData, TValue>) => {
  const _views = ['table', ...Object.keys(views)];
  const [currentView, setCurrentView] = useState<string>(
    _views.includes(defaultView) ? defaultView : 'table'
  );

  const renderContent = () => {
    if (isLoading) return () => <TableSkeleton />;
    if (error) {
      return () => (
        <ErrorState
          error={error}
          title={props.title}
          onRetry={retryOnError}
          message={errorMessage}
        />
      );
    }
    if (!props?.data?.length) {
      return () => <EmptyState title={props.title} message={nothingFoundMessage} onAdd={onAdd} />;
    }
    if (currentView !== 'table') return views[currentView];
    return undefined;
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 0;
  const rangeStart = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const rangeEnd = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  return (
    <>
      <DataTable
        {...props}
        renderTable={renderContent()}
        renderActions={(table) => (
          <>
            {typeof onAdd === 'function' && (
              <Button leftSection={<IconPlus size={14} />} variant="light" size="xs" onClick={onAdd}>
                Add
              </Button>
            )}
            {renderActions?.(table)}
            {Object.keys(views).length > 0 && (
              <SegmentedControl
                size="xs"
                value={currentView}
                onChange={setCurrentView}
                data={_views.map((v) => ({
                  label: renderViewTabItem?.(v) ?? v,
                  value: v,
                }))}
              />
            )}
          </>
        )}
      />
      {pagination && totalPages > 1 && (
        <Group justify="space-between" align="center" pt="sm">
          <Text size="xs" c="dimmed">
            {rangeStart}–{rangeEnd} of {pagination.total} records
          </Text>
          <Pagination
            total={totalPages}
            value={pagination.page}
            onChange={pagination.onChange}
            size="sm"
            withEdges
          />
        </Group>
      )}
    </>
  );
};

export default StateFullDataTable;
