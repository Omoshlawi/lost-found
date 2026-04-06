import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ActionIcon, Badge, Menu, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { useAddressHierarchy, useAddressHierarchyApi } from '../hooks';
import { AddressHierarchyNode } from '../types';

const LEVEL_OPTIONS = [
  { label: 'Level 1', value: '1' },
  { label: 'Level 2', value: '2' },
  { label: 'Level 3', value: '3' },
  { label: 'Level 4', value: '4' },
  { label: 'Level 5', value: '5' },
];

const AddressHierarchyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, search, searchInput, setSearchInput, setPage, setPageSize } =
    useTableUrlFilters();

  const level = searchParams.get('level');

  const setLevel = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('level', value);
        } else {
          prev.delete('level');
        }
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  };

  const hierarchyQuery = useAddressHierarchy({
    page,
    limit: pageSize,
    search,
    level: level ? Number(level) : undefined,
  });
  const { deleteHierarchyNode, restoreHierarchyNode, mutateAddressHierarchy } =
    useAddressHierarchyApi();

  const handleDeleteHierarchy = (node: AddressHierarchyNode) => {
    modals.openConfirmModal({
      title: 'Delete hierarchy entry',
      centered: true,
      children: (
        <Text size="sm">
          This hides the{' '}
          <Text span fw={600}>
            {node.name}
          </Text>{' '}
          label from use. Continue?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteHierarchyNode(node.id);
          showNotification({
            title: 'Hierarchy removed',
            message: 'Entry deleted successfully',
            color: 'green',
          });
          mutateAddressHierarchy();
        } catch (error) {
          const validation = handleApiErrors<Record<string, string>>(error);
          showNotification({
            title: 'Failed to delete hierarchy entry',
            message: validation.detail ?? 'Unknown error occurred',
            color: 'red',
          });
        }
      },
    });
  };

  const handleRestoreHierarchy = async (node: AddressHierarchyNode) => {
    try {
      await restoreHierarchyNode(node.id);
      showNotification({
        title: 'Hierarchy restored',
        message: 'Entry restored successfully',
        color: 'green',
      });
      mutateAddressHierarchy();
    } catch (error) {
      const validation = handleApiErrors<Record<string, string>>(error);
      showNotification({
        title: 'Failed to restore entry',
        message: validation.detail ?? 'Unknown error occurred',
        color: 'red',
      });
    }
  };

  const hierarchyColumns = buildHierarchyColumns({
    onDelete: handleDeleteHierarchy,
    onRestore: handleRestoreHierarchy,
  });

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Address Hierarchy"
        subTitle="Manage locale-specific address labels"
        icon="layersLinked"
      />
      <StateFullDataTable
        {...hierarchyQuery}
        data={hierarchyQuery.hierarchy}
        nothingFoundMessage="No hierarchy entries available."
        columns={hierarchyColumns}
        renderExpandedRow={({ original }) => <HierarchyDetails node={original} />}
        pagination={{
          totalCount: hierarchyQuery.totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        renderActions={() => (
          <>
            <TextInput
              placeholder="Search by name..."
              leftSection={<TablerIcon name="search" size={14} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="xs"
              w={200}
            />
            <Select
              placeholder="Level"
              data={LEVEL_OPTIONS}
              value={level}
              onChange={setLevel}
              size="xs"
              clearable
              w={120}
            />
          </>
        )}
      />
    </Stack>
  );
};

export default AddressHierarchyPage;

type HierarchyHandlers = {
  onDelete: (node: AddressHierarchyNode) => void;
  onRestore: (node: AddressHierarchyNode) => void;
};

const buildHierarchyColumns = (handlers: HierarchyHandlers): ColumnDef<AddressHierarchyNode>[] => [
  {
    header: 'Country',
    accessorKey: 'country',
  },
  {
    header: 'Level',
    accessorKey: 'level',
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Name local',
    accessorKey: 'nameLocal',
    cell: ({ row: { original } }) => original?.nameLocal ?? '—',
  },

  {
    header: 'Status',
    accessorKey: 'voided',
    cell: ({ row: { original } }) => (
      <Badge color={original.voided ? 'red' : 'green'} variant="light" size="xs">
        {original.voided ? 'Voided' : 'Active'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle">
            <TablerIcon name="dotsVertical" size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {!original.voided ? (
            <Menu.Item
              color="red"
              leftSection={<TablerIcon name="trash" size={14} />}
              onClick={() => handlers.onDelete(original)}
            >
              Delete
            </Menu.Item>
          ) : (
            <Menu.Item
              color="green"
              leftSection={<TablerIcon name="history" size={14} />}
              onClick={() => handlers.onRestore(original)}
            >
              Restore
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    ),
    size: 0,
  },
];

const HierarchyDetails = ({ node }: { node: AddressHierarchyNode }) => (
  <Stack gap="xs">
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
      <Detail label="Country" value={node.country} />
      <Detail label="Level" value={node.level} />
      <Detail label="Name" value={node.name} />
      <Detail label="Status" value={node.voided ? 'Voided' : 'Active'} />
    </SimpleGrid>
  </Stack>
);

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Stack gap={0}>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
    <Text size="sm">{value ?? '—'}</Text>
  </Stack>
);
