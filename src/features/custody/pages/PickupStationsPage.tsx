import React, { useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ActionIcon, Badge, Stack, Text } from '@mantine/core';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { usePickupStations } from '../hooks/usePickupStations';
import { Station } from '../types';
import { StationOperationsPanel } from '../components';

const PickupStationsPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTableUrlFilters();
  const { stations, totalCount, isLoading, error } = usePickupStations({ page, limit: pageSize });

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
          <Text size="sm" ff="monospace" fw={600}>{getValue() as string}</Text>
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
        title="Pickup Stations"
        subTitle="Configure which operations are available at each station"
        icon="buildingStore"
      />
      <StateFullDataTable
        data={stations}
        isLoading={isLoading}
        error={error}
        columns={columns}
        renderExpandedRow={(row: Row<Station>) => (
          <StationOperationsPanel station={row.original} />
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
