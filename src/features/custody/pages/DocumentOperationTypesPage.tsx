import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, Group, Stack, Text, TextInput, Select, ActionIcon } from '@mantine/core';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { useDocumentOperationTypes } from '../hooks/useCustody';
import { DocumentOperationType } from '../types';

const DocumentOperationTypesPage: React.FC = () => {
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    search,
    searchInput,
    setSearchInput,
    status,
    setStatus,
    searchParams,
    setFilter,
  } = useTableUrlFilters();

  const getBoolFilter = (key: string) => {
    const val = searchParams.get(key);
    return val === 'true' ? 'true' : val === 'false' ? 'false' : '';
  };

  const { operationTypes, totalCount, isLoading } = useDocumentOperationTypes({
    page,
    limit: pageSize,
    search,
    includeVoided: status === 'inactive' || status === 'all',
    isHighPrivilege: getBoolFilter('isHighPrivilege') === 'true' ? true : getBoolFilter('isHighPrivilege') === 'false' ? false : undefined,
    requiresDestinationStation: getBoolFilter('requiresDestinationStation') === 'true' ? true : getBoolFilter('requiresDestinationStation') === 'false' ? false : undefined,
    requiresSourceStation: getBoolFilter('requiresSourceStation') === 'true' ? true : getBoolFilter('requiresSourceStation') === 'false' ? false : undefined,
    requiresNotes: getBoolFilter('requiresNotes') === 'true' ? true : getBoolFilter('requiresNotes') === 'false' ? false : undefined,
    isFinalOperation: getBoolFilter('isFinalOperation') === 'true' ? true : getBoolFilter('isFinalOperation') === 'false' ? false : undefined,
  });

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
        renderActions={() => (
          <Group gap="xs">
            <TextInput
              placeholder="Search operations..."
              size="xs"
              leftSection={<IconSearch size={14} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.currentTarget.value)}
              rightSection={
                searchInput ? (
                  <ActionIcon size="xs" variant="transparent" onClick={() => setSearchInput('')}>
                    <IconX size={12} />
                  </ActionIcon>
                ) : null
              }
            />
            <Select
              size="xs"
              placeholder="Status"
              value={status}
              onChange={setStatus}
              data={[
                { label: 'Status: Active', value: '' },
                { label: 'Status: All', value: 'all' },
                { label: 'Status: Inactive', value: 'inactive' },
              ]}
              w={110}
              clearable
            />
            <Select
              size="xs"
              placeholder="Privilege"
              value={getBoolFilter('isHighPrivilege')}
              onChange={(v) => setFilter('isHighPrivilege', v)}
              data={[
                { label: 'Privilege: All', value: '' },
                { label: 'High', value: 'true' },
                { label: 'Standard', value: 'false' },
              ]}
              w={110}
            />
            <Select
              size="xs"
              placeholder="Source"
              value={getBoolFilter('requiresSourceStation')}
              onChange={(v) => setFilter('requiresSourceStation', v)}
              data={[
                { label: 'Source: All', value: '' },
                { label: 'Required', value: 'true' },
                { label: 'Not Req.', value: 'false' },
              ]}
              w={110}
            />
            <Select
              size="xs"
              placeholder="Destination"
              value={getBoolFilter('requiresDestinationStation')}
              onChange={(v) => setFilter('requiresDestinationStation', v)}
              data={[
                { label: 'Dest: All', value: '' },
                { label: 'Required', value: 'true' },
                { label: 'Not Req.', value: 'false' },
              ]}
              w={110}
            />
            <Select
              size="xs"
              placeholder="Notes"
              value={getBoolFilter('requiresNotes')}
              onChange={(v) => setFilter('requiresNotes', v)}
              data={[
                { label: 'Notes: All', value: '' },
                { label: 'Required', value: 'true' },
                { label: 'Not Req.', value: 'false' },
              ]}
              w={110}
            />
            <Select
              size="xs"
              placeholder="Final"
              value={getBoolFilter('isFinalOperation')}
              onChange={(v) => setFilter('isFinalOperation', v)}
              data={[
                { label: 'Final: All', value: '' },
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ]}
              w={110}
            />
          </Group>
        )}
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
