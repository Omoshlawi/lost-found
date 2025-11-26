import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  ActionIcon,
  Badge,
  Box,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { useAppColors } from '@/hooks/useAppColors';
import { handleApiErrors } from '@/lib/api';
import { useAddressHierarchy, useAddressHierarchyApi } from '../hooks';
import { AddressHierarchyNode } from '../types';

const AddressHierarchyPage = () => {
  const hierarchyQuery = useAddressHierarchy();
  const { deleteHierarchyNode, restoreHierarchyNode, mutateAddressHierarchy } =
    useAddressHierarchyApi();
  const { bgColor } = useAppColors();

  const handleDeleteHierarchy = (node: AddressHierarchyNode) => {
    modals.openConfirmModal({
      title: 'Delete hierarchy entry',
      centered: true,
      children: (
        <Text size="sm">
          This hides the <Text span fw={600}>{node.label}</Text> label from use. Continue?
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
    <Stack gap="xl">
      <Box>
        <DashboardPageHeader
          title="Address hierarchy"
          subTitle="Manage locale-specific address labels"
          icon="layersLinked"
        />
      </Box>
      <Paper p="md" radius="md" bg={bgColor}>
        <StateFullDataTable
          {...hierarchyQuery}
          data={hierarchyQuery.hierarchy}
          title="Hierarchy labels"
          nothingFoundMessage="No hierarchy entries available."
          columns={hierarchyColumns}
          renderExpandedRow={({ original }) => <HierarchyDetails node={original} />}
        />
      </Paper>
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
    header: 'Level key',
    accessorKey: 'levelKey',
    cell: ({ row: { original } }) => original?.levelKey?.toUpperCase(),
  },
  {
    header: 'Label',
    accessorKey: 'label',
  },
  {
    header: 'Status',
    accessorKey: 'voided',
    cell: ({ row: { original } }) => (
      <Badge color={original.voided ? 'red' : 'green'} variant="light">
        {original.voided ? 'Voided' : 'Active'}
      </Badge>
    ),
  },
  {
    header: 'Updated',
    accessorKey: 'updatedAt',
    cell: ({ row: { original } }) => new Date(original.updatedAt).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="outline">
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
  },
];

const HierarchyDetails = ({ node }: { node: AddressHierarchyNode }) => (
  <Stack gap="xs">
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
      <Detail label="Country" value={node.country} />
      <Detail label="Level key" value={node.levelKey} />
      <Detail label="Label" value={node.label} />
      <Detail label="Status" value={node.voided ? 'Voided' : 'Active'} />
      <Detail label="Updated at" value={formatDate(node.updatedAt)} />
    </SimpleGrid>
    {node.description && (
      <Stack gap={0}>
        <Text size="sm" c="dimmed">
          Description
        </Text>
        <Text size="sm">{node.description}</Text>
      </Stack>
    )}
    {node.metadata && (
      <Stack gap="xs">
        <Text size="sm" fw={600}>
          Metadata
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
          {Object.entries(node.metadata).map(([key, value]) => (
            <Detail key={key} label={key} value={value ?? '—'} />
          ))}
        </SimpleGrid>
      </Stack>
    )}
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

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

