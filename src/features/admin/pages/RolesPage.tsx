import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ActionIcon, Badge, Box, Group, Paper, Stack, Text } from '@mantine/core';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import useRoles from '../hooks/useRoles';
import { SystemRole } from '../types';

const RolesPage = () => {
  const rolesAsync = useRoles();

  const columns = useMemo<ColumnDef<SystemRole>[]>(
    () => [
      {
        id: 'expand',
        header: ({ table }) => {
          const allRowsExpanded = table.getIsAllRowsExpanded();
          return (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => table.toggleAllRowsExpanded(!allRowsExpanded)}
              aria-label="Expand all roles"
            >
              <TablerIcon name={allRowsExpanded ? 'chevronUp' : 'chevronDown'} size={16} />
            </ActionIcon>
          );
        },
        cell: ({ row }) => {
          const rowExpanded = row.getIsExpanded();
          return (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => row.toggleExpanded(!rowExpanded)}
              aria-label="Expand role permissions"
            >
              <TablerIcon name={rowExpanded ? 'chevronUp' : 'chevronDown'} size={16} />
            </ActionIcon>
          );
        },
        enableSorting: false,
        enableHiding: false,
        size: 0,
      },
      {
        header: 'Role',
        accessorKey: 'name',
        cell: ({ row: { original } }) => (
          <Stack gap={0}>
            <Text size="sm" fw={600}>
              {original.name}
            </Text>
            <Text size="xs" c="dimmed" ff="monospace">
              {original.role}
            </Text>
          </Stack>
        ),
      },
      {
        header: 'Permission Groups',
        id: 'permissionGroups',
        cell: ({ row: { original } }) => {
          const resources = new Set(original.permissions.map((item) => item.resource));
          return <Badge variant="light">{resources.size}</Badge>;
        },
      },
      {
        header: 'Total Permissions',
        id: 'permissionCount',
        cell: ({ row: { original } }) => <Badge color="blue">{original.permissions.length}</Badge>,
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Role Permissions"
        subTitle="Review system roles and associated ACL permissions"
        icon="shieldLock"
      />
      <StateFullDataTable
        title="Roles"
        data={rolesAsync.roleRecords}
        isLoading={rolesAsync.isLoading}
        error={rolesAsync.error as Error}
        columns={columns}
        renderExpandedRow={({ original }) => {
          const permissionTree = original.permissions.reduce<
            Record<string, { resourceName: string; actions: typeof original.permissions }>
          >((acc, permission) => {
            if (!acc[permission.resource]) {
              acc[permission.resource] = {
                resourceName: permission.resourceName,
                actions: [],
              };
            }
            acc[permission.resource].actions.push(permission);
            return acc;
          }, {});

          return (
            <Paper p="sm">
              <Stack gap="xs">
                <Text size="sm" fw={600}>
                  {original.name} Permissions
                </Text>
                {original.permissions.length === 0 ? (
                  <Text size="sm" c="dimmed">
                    No permissions assigned.
                  </Text>
                ) : (
                  Object.entries(permissionTree).map(([resource, node]) => (
                    <Box key={resource}>
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">
                          ├─
                        </Text>
                        <Badge variant="default" color="gray" size="xs">
                          {node.resourceName}
                        </Badge>
                        <Text size="xs" ff="monospace" c="dimmed">
                          {resource}
                        </Text>
                      </Group>

                      <Stack gap={4} pl="lg" mt={4}>
                        {node.actions.map((permission) => (
                          <Group key={`${permission.resource}-${permission.action}`} gap="xs">
                            <Text size="sm" c="dimmed">
                              └─
                            </Text>
                            <Text size="sm">{permission.actionName}</Text>
                            <Text size="xs" ff="monospace" c="dimmed">
                              {permission.action}
                            </Text>
                          </Group>
                        ))}
                      </Stack>
                    </Box>
                  ))
                )}
              </Stack>
            </Paper>
          );
        }}
        nothingFoundMessage="No roles are configured."
      />
    </Stack>
  );
};

export default RolesPage;
