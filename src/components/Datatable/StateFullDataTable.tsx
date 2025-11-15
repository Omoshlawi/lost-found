import React, { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import { Button, SegmentedControl } from '@mantine/core';
import { TableSkeleton } from '../ComponentSkeletons';
import { EmptyState, ErrorState } from '../StateWidgets';
import { DataTable, DataTableProps } from './DataTable';

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
  ...props
}: StateFullDataTableProps<TData, TValue>) => {
  const _views = ['table', ...Object.keys(views)];
  const [currentVeiw, setCurrentVeiw] = useState<string>(
    _views.includes(defaultView) ? defaultView : 'table'
  );
  const renderContent = () => {
    if (isLoading) {
      return () => <TableSkeleton />;
    }
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
    if (currentVeiw !== 'table') {
      return views[currentVeiw];
    }
    return undefined;
  };

  return (
    <DataTable
      {...props}
      renderTable={renderContent()}
      renderActions={(table) => (
        <>
          {typeof onAdd === 'function' && (
            <Button leftSection={<IconPlus size={16} />} variant="light" onClick={onAdd}>
              Add
            </Button>
          )}
          {renderActions?.(table)}
          {Object.keys(views).length > 0 && (
            <SegmentedControl
              value={currentVeiw}
              onChange={setCurrentVeiw}
              data={_views.map((v) => ({
                label: renderViewTabItem?.(v) ?? v,
                value: v,
              }))}
            />
          )}
        </>
      )}
    />
  );
};

export default StateFullDataTable;
