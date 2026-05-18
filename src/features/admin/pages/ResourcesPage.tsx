import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  DashboardPageHeader,
  launchWorkspace,
  StateFullDataTable,
  SystemAuthorized,
  TablerIcon,
} from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { ResourceForm } from '../forms/ResourceForm';
import { useResources, useResourcesApi } from '../hooks/useRoleRecords';
import { Resource } from '../types';

const ResourcesPage = () => {
  const { page, pageSize, search } = useTableUrlFilters();
  const resourcesAsync = useResources({ page, limit: pageSize, search, includeVoided: true });
  const { deleteResource, restoreResource, mutateResources } = useResourcesApi();

  const handleDelete = (resource: Resource) => {
    modals.openConfirmModal({
      title: 'Delete Resource',
      centered: true,
      children: (
        <Text size="sm">
          Delete <b>{resource.name}</b>? All associated actions and role permissions will also be removed.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteResource(resource.id);
          showNotification({ title: 'Success', message: 'Resource deleted', color: 'green' });
          mutateResources();
        } catch (error) {
          const e = handleApiErrors(error);
          showNotification({ title: 'Error', message: e.detail || 'Failed to delete', color: 'red' });
        }
      },
    });
  };

  const handleRestore = async (resource: Resource) => {
    try {
      await restoreResource(resource.id);
      showNotification({ title: 'Success', message: 'Resource restored', color: 'green' });
      mutateResources();
    } catch (error) {
      const e = handleApiErrors(error);
      showNotification({ title: 'Error', message: e.detail || 'Failed to restore', color: 'red' });
    }
  };

  const handleEdit = (resource?: Resource) => {
    const close = launchWorkspace(
      <ResourceForm resource={resource} closeWorkspace={() => close()} />,
      { width: 'wide', title: resource ? 'Edit Resource' : 'Create Resource' }
    );
  };

  const columns = useMemo<ColumnDef<Resource>[]>(
    () => [
      {
        id: 'expand',
        header: ({ table }) => (
          <ActionIcon variant="subtle" color="gray" onClick={() => table.toggleAllRowsExpanded(!table.getIsAllRowsExpanded())}>
            <TablerIcon name={table.getIsAllRowsExpanded() ? 'chevronUp' : 'chevronDown'} size={16} />
          </ActionIcon>
        ),
        cell: ({ row }) => (
          <ActionIcon variant="subtle" color="gray" onClick={() => row.toggleExpanded(!row.getIsExpanded())}>
            <TablerIcon name={row.getIsExpanded() ? 'chevronUp' : 'chevronDown'} size={16} />
          </ActionIcon>
        ),
        enableSorting: false,
        size: 0,
      },
      {
        header: 'Resource',
        accessorKey: 'name',
        cell: ({ row: { original } }) => (
          <Stack gap={0}>
            <Text size="sm" fw={600}>{original.name}</Text>
            <Text size="xs" c="dimmed" ff="monospace">{original.slug}</Text>
          </Stack>
        ),
      },
      {
        header: 'Type',
        id: 'type',
        cell: ({ row: { original } }) =>
          original.isBuiltIn ? (
            <Badge size="xs" variant="dot" color="gray">Built-in</Badge>
          ) : (
            <Badge size="xs" variant="dot" color="blue">Custom</Badge>
          ),
      },
      {
        header: 'Actions',
        id: 'actions_count',
        cell: ({ row: { original } }) => (
          <Badge variant="light">{original.actions.filter((a) => !a.voided).length}</Badge>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'voided',
        cell: ({ row: { original } }) =>
          original.voided ? (
            <Badge size="xs" color="red">Voided</Badge>
          ) : (
            <Badge size="xs" color="green">Active</Badge>
          ),
      },
      {
        id: 'actions',
        header: '',
        size: 0,
        cell: ({ row: { original } }) => (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle"><TablerIcon name="dots" size={16} /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Actions</Menu.Label>
              <Menu.Divider />
              <SystemAuthorized permissions={{ setting: ['manage-system'] }} unauthorizedAction={{ type: 'hide' }}>
                <Menu.Item leftSection={<TablerIcon name="edit" size={14} />} onClick={() => handleEdit(original)}>
                  Edit
                </Menu.Item>
              </SystemAuthorized>
              {!original.voided && !original.isBuiltIn && (
                <SystemAuthorized permissions={{ setting: ['manage-system'] }} unauthorizedAction={{ type: 'hide' }}>
                  <Menu.Item color="red" leftSection={<TablerIcon name="trash" size={14} />} onClick={() => handleDelete(original)}>
                    Delete
                  </Menu.Item>
                </SystemAuthorized>
              )}
              {original.voided && (
                <SystemAuthorized permissions={{ setting: ['manage-system'] }} unauthorizedAction={{ type: 'hide' }}>
                  <Menu.Item color="green" leftSection={<TablerIcon name="history" size={14} />} onClick={() => handleRestore(original)}>
                    Restore
                  </Menu.Item>
                </SystemAuthorized>
              )}
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
        title="Resources"
        subTitle="Manage permission resources and their actions"
        icon="apiApp"
        traiiling={
          <SystemAuthorized permissions={{ setting: ['manage-system'] }} unauthorizedAction={{ type: 'hide' }}>
            <ActionIcon variant="filled" onClick={() => handleEdit()} aria-label="Create resource">
              <TablerIcon name="plus" size={16} />
            </ActionIcon>
          </SystemAuthorized>
        }
      />
      <StateFullDataTable
        title="Resources"
        data={resourcesAsync.resources}
        isLoading={resourcesAsync.isLoading}
        error={resourcesAsync.error as Error}
        columns={columns}
        renderExpandedRow={({ original }) => (
          <Paper p="sm">
            <Stack gap="xs">
              <Text size="sm" fw={600}>{original.name} Actions</Text>
              {original.actions.length === 0 ? (
                <Text size="sm" c="dimmed">No actions defined.</Text>
              ) : (
                original.actions.map((action) => (
                  <Box key={action.id}>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">└─</Text>
                      <Text size="sm">{action.name}</Text>
                      <Text size="xs" ff="monospace" c="dimmed">{action.slug}</Text>
                      {action.isBuiltIn && (
                        <Badge size="xs" variant="dot" color="gray">Built-in</Badge>
                      )}
                      {action.voided && (
                        <Badge size="xs" color="red">Voided</Badge>
                      )}
                    </Group>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        )}
        nothingFoundMessage="No resources configured."
      />
    </Stack>
  );
};

export default ResourcesPage;
