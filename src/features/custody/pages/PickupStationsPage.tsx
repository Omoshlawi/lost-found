import React, { useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Group, TextInput, ActionIcon, Badge, Stack, Text, Select } from '@mantine/core';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { StationOperationsPanel } from '../components';
import { usePickupStations } from '../hooks/usePickupStations';
import { Station } from '../types';

const PickupStationsPage: React.FC = () => {
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
  } = useTableUrlFilters();
  const { stations, totalCount, isLoading, error } = usePickupStations({
    page,
    limit: pageSize,
    search,
    includeVoided: status === 'inactive' || status === 'all',
  });

  const columns = useMemo<ColumnDef<Station>[]>(
    () => [
      {
        id: 'expand',
        size: 40,
        header: '',
        cell: ({ row }) => (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => row.toggleExpanded()}
            aria-label="Expand row"
          >
            <TablerIcon name={row.getIsExpanded() ? 'chevronUp' : 'chevronDown'} size={14} />
          </ActionIcon>
        ),
      },
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
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Location',
        id: 'location',
        cell: ({ row: { original } }) => (
          <Text size="sm" c="dimmed" truncate maw={260}>
            {[original.level2, original.level1].filter(Boolean).join(', ')}
          </Text>
        ),
      },
      {
        header: 'Address',
        id: 'address',
        cell: ({ row: { original } }) => (
          <Text size="sm" truncate maw={260}>
            {original.formatted ?? original.address1}
          </Text>
        ),
      },
      {
        header: 'Status',
        id: 'status',
        cell: ({ row: { original } }) => (
          <Badge size="sm" variant="light" color={original.voided ? 'gray' : 'civicGreen'}>
            {original.voided ? 'Inactive' : 'Active'}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Stations"
        subTitle="Configure which operations are available at each station"
        icon="buildingStore"
      />
      <StateFullDataTable
        data={stations}
        isLoading={isLoading}
        error={error}
        columns={columns}
        renderExpandedRow={(row: Row<Station>) => <StationOperationsPanel station={row.original} />}
        renderActions={() => (
          <Group gap="xs">
            <TextInput
              placeholder="Search stations..."
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
              placeholder="All Status"
              value={status}
              onChange={setStatus}
              data={[
                { label: 'Status: Active', value: '' },
                { label: 'Status: All', value: 'all' },
                { label: 'Status: Inactive', value: 'inactive' },
              ]}
              w={120}
              clearable
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

export default PickupStationsPage;
