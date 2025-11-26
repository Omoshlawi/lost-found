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
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { useAppColors } from '@/hooks/useAppColors';
import { handleApiErrors } from '@/lib/api';
import { AddressForm } from '../forms';
import {
  useAddressHierarchy,
  useAddressHierarchyApi,
  useAddresses,
  useAddressesApi,
} from '../hooks';
import { Address, AddressFormData, AddressHierarchyNode } from '../types';

const AddressesPage = () => {
  const addressQuery = useAddresses();
  const hierarchyQuery = useAddressHierarchy();
  const { deleteAddress, restoreAddress, mutateAddresses } = useAddressesApi();
  const { deleteHierarchyNode, restoreHierarchyNode, mutateAddressHierarchy } =
    useAddressHierarchyApi();
  const { bgColor } = useAppColors();

  const handleLaunchForm = (address?: Address) => {
    const dispose = launchWorkspace(
      <AddressForm address={address} closeWorkspace={() => dispose()} />,
      {
        title: address ? 'Edit address' : 'New address',
        width: 'wide',
        expandable: true,
      }
    );
  };

  const handleDeleteAddress = (address: Address) => {
    modals.openConfirmModal({
      title: 'Delete address',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the address{' '}
          <Text span fw={600}>
            {address.label ?? address.address1}
          </Text>
          ? This action can be reverted using restore.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteAddress(address.id);
          showNotification({
            title: 'Address deleted',
            message: 'The address was deleted successfully.',
            color: 'green',
          });
          mutateAddresses();
        } catch (error) {
          const validation = handleApiErrors<AddressFormData>(error);
          showNotification({
            title: 'Failed to delete address',
            message: validation.detail ?? 'Unknown error occurred',
            color: 'red',
          });
        }
      },
    });
  };

  const handleRestoreAddress = async (address: Address) => {
    try {
      await restoreAddress(address.id);
      showNotification({
        title: 'Address restored',
        message: 'The address was restored successfully.',
        color: 'green',
      });
      mutateAddresses();
    } catch (error) {
      const validation = handleApiErrors<AddressFormData>(error);
      showNotification({
        title: 'Failed to restore address',
        message: validation.detail ?? 'Unknown error occurred',
        color: 'red',
      });
    }
  };

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

  const addressColumns = buildAddressColumns({
    onEdit: handleLaunchForm,
    onDelete: handleDeleteAddress,
    onRestore: handleRestoreAddress,
  });

  const hierarchyColumns = buildHierarchyColumns({
    onDelete: handleDeleteHierarchy,
    onRestore: handleRestoreHierarchy,
  });

  return (
    <Stack gap="xl">
      <Box>
        <DashboardPageHeader
          title="Addresses"
          subTitle="Manage user addresses and locale formats"
          icon="mapPin"
        />
      </Box>
      <Paper p="md" radius="md" bg={bgColor}>
        <StateFullDataTable
          {...addressQuery}
          data={addressQuery.addresses}
          title="Addresses"
          nothingFoundMessage="No addresses found. Click add to create one."
          renderExpandedRow={({ original }) => <AddressDetails address={original} />}
          columns={addressColumns}
          onAdd={() => handleLaunchForm()}
        />
      </Paper>
      <Stack gap="sm">
        <Title order={4}>Address hierarchy</Title>
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
    </Stack>
  );
};

export default AddressesPage;

type AddressColumnHandlers = {
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onRestore: (address: Address) => void;
};

const buildAddressColumns = (handlers: AddressColumnHandlers): ColumnDef<Address>[] => [
  {
    id: 'expand',
    header: ({ table }) => {
      const expanded = table.getIsAllRowsExpanded();
      return (
        <ActionIcon variant="subtle" onClick={() => table.toggleAllRowsExpanded(!expanded)}>
          <TablerIcon name={expanded ? 'chevronUp' : 'chevronDown'} size={16} />
        </ActionIcon>
      );
    },
    cell: ({ row }) => {
      const expanded = row.getIsExpanded();
      return (
        <ActionIcon variant="subtle" onClick={() => row.toggleExpanded(!expanded)}>
          <TablerIcon name={expanded ? 'chevronUp' : 'chevronDown'} size={16} />
        </ActionIcon>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 0,
  },
  {
    header: 'Label',
    accessorKey: 'label',
    cell: ({ row: { original } }) => original.label ?? '—',
  },
  {
    header: 'Type',
    accessorKey: 'type',
  },
  {
    header: 'Level 1',
    accessorKey: 'level1',
  },
  {
    header: 'Country',
    accessorKey: 'country',
  },
  {
    header: 'Preferred',
    accessorKey: 'preferred',
    cell: ({ row: { original } }) => (
      <Badge color={original.preferred ? 'green' : 'gray'} variant="light">
        {original.preferred ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    header: 'Updated',
    accessorKey: 'updatedAt',
    cell: ({ row: { original } }) => new Date(original.updatedAt).toLocaleString(),
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
          <Menu.Label>Manage</Menu.Label>
          <Menu.Item
            leftSection={<TablerIcon name="edit" size={14} />}
            onClick={() => handlers.onEdit(original)}
          >
            Edit
          </Menu.Item>
          {!original.voided && (
            <Menu.Item
              color="red"
              leftSection={<TablerIcon name="trash" size={14} />}
              onClick={() => handlers.onDelete(original)}
            >
              Delete
            </Menu.Item>
          )}
          {original.voided && (
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

const AddressDetails = ({ address }: { address: Address }) => (
  <Stack gap="sm">
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
      <Detail label="Label" value={address.label ?? '—'} />
      <Detail label="Type" value={address.type} />
      <Detail label="Address1" value={address.address1} />
      <Detail label="Address2" value={address.address2 ?? '—'} />
      <Detail label="Landmark" value={address.landmark ?? '—'} />
      <Detail label="Level 1" value={address.level1} />
      <Detail label="Level 2" value={address.level2 ?? '—'} />
      <Detail label="Level 3" value={address.level3 ?? '—'} />
      <Detail label="Level 4" value={address.level4 ?? '—'} />
      <Detail label="Level 5" value={address.level5 ?? '—'} />
      <Detail label="City / Village" value={address.cityVillage ?? '—'} />
      <Detail label="State / Province" value={address.stateProvince ?? '—'} />
      <Detail label="Country" value={address.country} />
      <Detail label="Postal code" value={address.postalCode ?? '—'} />
      <Detail label="Plus code" value={address.plusCode ?? '—'} />
      <Detail label="Latitude" value={address.latitude ?? '—'} />
      <Detail label="Longitude" value={address.longitude ?? '—'} />
      <Detail label="Preferred" value={address.preferred ? 'Yes' : 'No'} />
      <Detail label="Voided" value={address.voided ? 'Yes' : 'No'} />
      <Detail label="Start date" value={formatDate(address.startDate)} />
      <Detail label="End date" value={address.endDate ? formatDate(address.endDate) : '—'} />
      <Detail label="Updated at" value={formatDate(address.updatedAt)} />
    </SimpleGrid>
    {address.formatted && (
      <Stack gap={0}>
        <Text size="sm" c="dimmed">
          Formatted
        </Text>
        <Text size="sm">{address.formatted}</Text>
      </Stack>
    )}
    {address.localeFormat && (
      <Stack gap={4}>
        <Text size="sm" fw={600}>
          Locale labels
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
          {Object.entries(address.localeFormat).map(([key, value]) => (
            <Detail key={key} label={key} value={value ?? '—'} />
          ))}
        </SimpleGrid>
      </Stack>
    )}
  </Stack>
);

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

