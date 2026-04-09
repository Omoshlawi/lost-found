import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, Stack, Text } from '@mantine/core';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { useDocumentOperationTypes } from '../hooks/useCustody';
import { DocumentOperationType } from '../types';

const DocumentOperationTypesPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTableUrlFilters();
  const { operationTypes, totalCount, isLoading } = useDocumentOperationTypes({ page, limit: pageSize });

  const columns = useMemo<ColumnDef<DocumentOperationType>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
        cell: ({ getValue }) => (
          <Text size="sm" ff="monospace" fw={600}>
            {getValue() as string}
          </Text>
        ),
      },
      {
        header: 'Prefix',
        accessorKey: 'prefix',
        cell: ({ getValue }) => (
          <Badge variant="light" color="civicBlue" size="sm">
            {getValue() as string}
          </Badge>
        ),
      },
      { header: 'Name', accessorKey: 'name' },
      { header: 'Description', accessorKey: 'description', cell: ({ getValue }) => (getValue() as string) ?? '—' },
      {
        header: 'Flags',
        id: 'flags',
        cell: ({ row: { original } }) => (
          <Stack gap={2}>
            {original.requiresNotes && <Badge size="xs" color="gray">Requires Notes</Badge>}
            {original.requiresDestinationStation && <Badge size="xs" color="gray">Req. Destination</Badge>}
            {original.requiresSourceStation && <Badge size="xs" color="gray">Req. Source</Badge>}
            {original.isHighPrivilege && <Badge size="xs" color="red">High Privilege</Badge>}
            {original.isFinalOperation && <Badge size="xs" color="orange">Final</Badge>}
          </Stack>
        ),
      },
      {
        header: 'Status',
        id: 'status',
        cell: ({ row: { original } }) => (
          <Badge size="sm" color={original.voided ? 'gray' : 'civicGreen'} variant="light">
            {original.voided ? 'Voided' : 'Active'}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Document Operation Types"
        subTitle="Configure available custody operations"
        icon="settingsAutomation"
      />
      <StateFullDataTable
        data={operationTypes}
        isLoading={isLoading}
        columns={columns}
        pagination={{
          totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </Stack>
  );
};

export default DocumentOperationTypesPage;
