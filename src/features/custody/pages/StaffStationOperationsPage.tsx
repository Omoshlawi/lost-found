import React, { useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ActionIcon, Badge, Menu, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, launchWorkspace, StateFullDataTable, TablerIcon } from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { formatDate } from '@/lib/utils/helpers';
import { ExpandedGrantRow } from '../components';
import GrantStaffOperationForm from '../forms/GrantStaffOperationForm';
import { revokeStaffStationOperation, useStaffStationOperations } from '../hooks/useCustody';
import { GroupedStaffGrant, StaffStationOperation } from '../types';

// ─── Grouping helper ──────────────────────────────────────────────────────────

function groupByUser(grants: StaffStationOperation[]): GroupedStaffGrant[] {
  const map = new Map<string, GroupedStaffGrant>();

  for (const grant of grants) {
    if (!map.has(grant.userId)) {
      map.set(grant.userId, {
        userId: grant.userId,
        user: grant.user,
        stations: [],
        totalOperations: 0,
        latestGrantedAt: grant.createdAt,
      });
    }

    const group = map.get(grant.userId)!;

    if (grant.createdAt > group.latestGrantedAt) {
      group.latestGrantedAt = grant.createdAt;
    }

    let stationGroup = group.stations.find((s) => s.stationId === grant.stationId);
    if (!stationGroup) {
      stationGroup = { stationId: grant.stationId, station: grant.station, operations: [] };
      group.stations.push(stationGroup);
    }

    stationGroup.operations.push(grant);
    group.totalOperations++;
  }

  return Array.from(map.values());
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const StaffStationOperationsPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTableUrlFilters();
  const { grants, totalCount, isLoading, mutate } = useStaffStationOperations({
    page,
    limit: pageSize,
  });

  const grouped = useMemo(() => groupByUser(grants), [grants]);

  const handleRevoke = (grant: StaffStationOperation) => {
    modals.openConfirmModal({
      title: 'Revoke Operation Grant',
      children: (
        <Text size="sm">
          Revoke <strong>{grant.operationType?.name}</strong> access at{' '}
          <strong>{grant.station?.name}</strong> for <strong>{grant.user?.name}</strong>?
        </Text>
      ),
      labels: { confirm: 'Revoke', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await revokeStaffStationOperation(grant.id);
          showNotification({
            title: 'Revoked',
            message: 'Operation grant revoked.',
            color: 'green',
          });
          void mutate();
        } catch (err) {
          const e = handleApiErrors<{}>(err);
          showNotification({
            title: 'Error',
            message: e.detail ?? 'Failed to revoke grant.',
            color: 'red',
          });
        }
      },
    });
  };

  const handleGrant = () => {
    const closeWorkspace = launchWorkspace(
      <GrantStaffOperationForm onClose={() => closeWorkspace()} onSuccess={() => void mutate()} />,
      { width: 'narrow', title: 'Grant Staff Operation' }
    );
  };

  const columns = useMemo<ColumnDef<GroupedStaffGrant>[]>(
    () => [
      {
        id: 'expand',
        size: 0,
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
        header: 'Staff Member',
        id: 'user',
        cell: ({ row: { original } }) => (
          <Text size="sm" fw={500}>
            {original.user?.name ?? original.userId}
          </Text>
        ),
      },
      {
        header: 'Stations',
        id: 'stations',
        cell: ({ row: { original } }) => (
          <Badge variant="light" color="teal" size="sm">
            {original.stations.length}
          </Badge>
        ),
      },
      {
        header: 'Operations',
        id: 'operations',
        cell: ({ row: { original } }) => (
          <Badge variant="light" color="civicBlue" size="sm">
            {original.totalOperations}
          </Badge>
        ),
      },
      {
        header: 'Last Granted',
        id: 'latestGrantedAt',
        cell: ({ row: { original } }) => formatDate(original.latestGrantedAt),
      },
      {
        id: 'actions',
        size: 0,
        cell: ({ row }) => (
          <Menu position="bottom-end" width={160}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <TablerIcon name="dots" size={14} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <TablerIcon name={row.getIsExpanded() ? 'chevronUp' : 'chevronDown'} size={14} />
                }
                onClick={() => row.toggleExpanded()}
              >
                {row.getIsExpanded() ? 'Collapse' : 'Expand'}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ),
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Staff Station Operations"
        subTitle="Manage which operations each staff member can perform at each station"
        icon="userCog"
      />
      <StateFullDataTable
        data={grouped}
        isLoading={isLoading}
        onAdd={handleGrant}
        columns={columns}
        renderExpandedRow={(row: Row<GroupedStaffGrant>) => (
          <ExpandedGrantRow group={row.original} onRevoke={handleRevoke} />
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

export default StaffStationOperationsPage;
