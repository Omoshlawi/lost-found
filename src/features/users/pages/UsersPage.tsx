import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { ActionIcon, Badge, Box, Menu, Paper, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, launchWorkspace, StateFullDataTable, TablerIcon } from '@/components';
import { useAppColors } from '@/hooks/useAppColors';
import { handleApiErrors } from '@/lib/api';
import { BanUserForm, SetRoleForm } from '../forms';
import { useUsers, useUsersApi } from '../hooks';
import { User } from '../types';

const UsersPage = () => {
  const usersAsync = useUsers();
  const { removeUser, revokeAllUserSessions } = useUsersApi();
  const { bgColor } = useAppColors();
  const navigate = useNavigate();

  const handleRemove = (user: User) => {
    modals.openConfirmModal({
      title: 'Remove User',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to remove {user.name}? This action is destructive.
        </Text>
      ),
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await removeUser(user.id);
          showNotification({
            title: 'Success',
            message: 'User removed successfully!',
            color: 'green',
          });
          usersAsync.mutate();
        } catch (error) {
          const e = handleApiErrors<{}>(error);
          if (e.detail) {
            showNotification({
              title: 'Error removing user',
              message: e.detail,
              color: 'red',
              position: 'top-right',
            });
          }
        }
      },
    });
  };

  const handleRevokeSessions = (user: User) => {
    modals.openConfirmModal({
      title: 'Revoke Sessions',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to revoke all active sessions for {user.name}? It will log them out
          immediately.
        </Text>
      ),
      labels: { confirm: 'Revoke', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await revokeAllUserSessions(user.id);
          showNotification({
            title: 'Success',
            message: `Sessions for ${user.name} revoked successfully!`,
            color: 'green',
          });
        } catch (error) {
          const e = handleApiErrors<{}>(error);
          if (e.detail) {
            showNotification({
              title: 'Error revoking sessions',
              message: e.detail,
              color: 'red',
              position: 'top-right',
            });
          }
        }
      },
    });
  };

  const handleLaunchSetRole = (user: User) => {
    const closeWorkspace = launchWorkspace(
      <SetRoleForm
        user={user}
        closeWorkspace={() => closeWorkspace()}
        onSuccess={() => usersAsync.mutate()}
      />,
      {
        width: 'narrow',
        title: `Set Role for ${user.name}`,
      }
    );
  };

  const handleLaunchBanUser = (user: User) => {
    const closeWorkspace = launchWorkspace(
      <BanUserForm
        user={user}
        closeWorkspace={() => closeWorkspace()}
        onSuccess={() => usersAsync.mutate()}
      />,
      {
        width: 'narrow',
        title: user.banned ? `Unban ${user.name}` : `Ban ${user.name}`,
      }
    );
  };

  return (
    <Stack gap="xl">
      <Box>
        <DashboardPageHeader
          title="Users"
          subTitle="Manage administrative tasks for users"
          icon="users"
        />
      </Box>
      <Paper p="md" radius="md" bg={bgColor}>
        <StateFullDataTable
          {...usersAsync}
          data={usersAsync.users}
          renderExpandedRow={({ original: user }) => {
            return (
              <Paper p="xs">
                <Text size="sm">
                  <strong>Email:</strong> {user.email}
                </Text>
                {user.username && (
                  <Text size="sm">
                    <strong>Username:</strong> {user.username}
                  </Text>
                )}
                <Text size="sm">
                  <strong>Joined:</strong> {new Date(user.createdAt).toDateString()}
                </Text>
                {user.banned && (
                  <>
                    <Text size="sm" c="red">
                      <strong>Banned Reason:</strong> {user.banReason || 'N/A'}
                    </Text>
                    {user.banExpires && (
                      <Text size="sm" c="red">
                        <strong>Ban Expires:</strong> {new Date(user.banExpires).toLocaleString()}
                      </Text>
                    )}
                  </>
                )}
              </Paper>
            );
          }}
          columns={[
            ...columns,
            {
              header: 'Actions',
              id: 'actions',
              cell: ({ row: { original: user } }: { row: { original: User } }) => (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="outline" aria-label="Settings">
                      <TablerIcon
                        name="dotsVertical"
                        style={{ width: '70%', height: '70%' }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Manage User</Menu.Label>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<TablerIcon name="eye" size={14} />}
                      onClick={() => navigate(`/dashboard/users/${user.id}`)}
                    >
                      View Details
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<TablerIcon name="userShield" size={14} />}
                      onClick={() => handleLaunchSetRole(user)}
                    >
                      Set Role
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<TablerIcon name="ban" size={14} />}
                      color={user.banned ? 'green' : 'orange'}
                      onClick={() => handleLaunchBanUser(user)}
                    >
                      {user.banned ? 'Unban User' : 'Ban User'}
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<TablerIcon name="logout" size={14} />}
                      color="orange"
                      onClick={() => handleRevokeSessions(user)}
                    >
                      Revoke Sessions
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<TablerIcon name="trash" size={14} />}
                      color="red"
                      onClick={() => handleRemove(user)}
                    >
                      Remove User
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ),
            },
          ]}
        />
      </Paper>
    </Stack>
  );
};

export default UsersPage;

const columns: ColumnDef<User>[] = [
  {
    id: 'expand',
    header: ({ table }) => {
      const allRowsExpanded = table.getIsAllRowsExpanded();
      return (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => table.toggleAllRowsExpanded(!allRowsExpanded)}
          style={{ cursor: 'pointer' }}
          aria-label="Expand all"
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
          style={{ cursor: 'pointer' }}
          aria-label="Expand Row"
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
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row: { original: user } }: { row: { original: User } }) => user.name,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row: { original: user } }: { row: { original: User } }) => user.email,
  },
  {
    header: 'Role',
    accessorKey: 'role',
    cell: ({ row: { original: user } }: { row: { original: User } }) =>
      user.role ? <Badge color="blue">{user.role}</Badge> : <Badge color="gray">User</Badge>,
  },
  {
    header: 'Status',
    accessorKey: 'banned',
    cell: ({ row: { original: user } }: { row: { original: User } }) =>
      user.banned ? <Badge color="red">Banned</Badge> : <Badge color="green">Active</Badge>,
  },
];
