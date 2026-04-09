import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ActionIcon, Menu, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { useStaffStationOperations, revokeStaffStationOperation } from '../hooks/useCustody';
import { StaffStationOperation } from '../types';
import { formatDate } from '@/lib/utils/helpers';

const StaffStationOperationsPage: React.FC = () => {
  const { page, pageSize, setPage, setPageSize } = useTableUrlFilters();
  const { grants, totalCount, isLoading, mutate } = useStaffStationOperations({ page, limit: pageSize });

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
          showNotification({ title: 'Revoked', message: 'Operation grant revoked.', color: 'green' });
          void mutate();
        } catch (err) {
          const e = handleApiErrors<{}>(err);
          showNotification({ title: 'Error', message: e.detail ?? 'Failed to revoke grant.', color: 'red' });
        }
      },
    });
  };

  const columns = useMemo<ColumnDef<StaffStationOperation>[]>(
    () => [
      {
        header: 'Staff',
        id: 'user',
        cell: ({ row: { original } }) => original.user?.name ?? original.userId,
      },
      {
        header: 'Station',
        id: 'station',
        cell: ({ row: { original } }) =>
          original.station ? `${original.station.name} (${original.station.code})` : original.stationId,
      },
      {
        header: 'Operation',
        id: 'operation',
        cell: ({ row: { original } }) => original.operationType?.name ?? original.operationTypeId,
      },
      {
        header: 'Granted By',
        id: 'grantedBy',
        cell: ({ row: { original } }) => original.grantedBy?.name ?? original.grantedById,
      },
      {
        header: 'Granted At',
        id: 'createdAt',
        cell: ({ row: { original } }) => formatDate(original.createdAt),
      },
    ],
    []
  );

  const actionsColumn: ColumnDef<StaffStationOperation> = {
    id: 'actions',
    size: 40,
    cell: ({ row: { original } }) => (
      <Menu position="bottom-end" width={160}>
        <Menu.Target>
          <ActionIcon variant="subtle" size="sm">
            <TablerIcon name="dots" size={14} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<TablerIcon name="userMinus" size={14} />}
            color="red"
            onClick={() => handleRevoke(original)}
          >
            Revoke
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
  };

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Staff Station Operations"
        subTitle="Manage which operations each staff member can perform at each station"
        icon="userCog"
      />
      <StateFullDataTable
        data={grants}
        isLoading={isLoading}
        columns={[...columns, actionsColumn]}
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
