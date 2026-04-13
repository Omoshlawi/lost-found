import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, launchWorkspace, StateFullDataTable, TablerIcon } from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { BanUserForm, CreateUserForm, SetRoleForm } from '../forms';
import { useUsers, useUsersApi } from '../hooks';
import { User } from '../types';

const UsersPage = () => {
  const { page, pageSize, search, searchInput, setSearchInput, setPage, setPageSize } =
    useTableUrlFilters({ searchDebounce: 200 });
  const offset = (page - 1) * pageSize;
  const usersAsync = useUsers({ limit: pageSize, offset, ...(search && { searchValue: search }) });
  const { removeUser, revokeAllUserSessions } = useUsersApi();
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

  const handleLaunchCreateUser = () => {
    const closeWorkspace = launchWorkspace(
      <CreateUserForm
        closeWorkspace={() => closeWorkspace()}
        onSuccess={() => usersAsync.mutate()}
      />,
      { width: 'narrow', title: 'Add New User' }
    );
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
    <Stack gap="md">
      <DashboardPageHeader
        title="Users"
        subTitle="Manage platform users and permissions"
        icon="users"
      />
      <StateFullDataTable
        {...usersAsync}
        data={usersAsync.users}
        renderActions={() => (
          <Group gap="xs">
            <TextInput
              placeholder="Search by name or email..."
              leftSection={<TablerIcon name="search" size={14} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="xs"
              w={240}
            />
            <Button
              size="xs"
              leftSection={<TablerIcon name="userPlus" size={14} />}
              onClick={handleLaunchCreateUser}
            >
              Add User
            </Button>
          </Group>
        )}
        renderExpandedRow={({ original: user }) => (
          <Box
            px="xl"
            py="md"
            style={{
              borderTop: '1px solid var(--mantine-color-default-border)',
              background: 'var(--mantine-color-default-hover)',
            }}
          >
            <Group gap="xl" align="flex-start" wrap="wrap">
              {/* Identity */}
              <Stack gap={4} miw={180}>
                <Text
                  size="xs"
                  fw={600}
                  tt="uppercase"
                  c="dimmed"
                  style={{ letterSpacing: '0.06em' }}
                >
                  Identity
                </Text>
                <Divider mb={4} />
                <Field label="Email" value={user.email} />
                {user.username && <Field label="Username" value={user.username} />}
                <Field label="Member since" value={new Date(user.createdAt).toDateString()} />
              </Stack>

              {/* Access */}
              <Stack gap={4} miw={160}>
                <Text
                  size="xs"
                  fw={600}
                  tt="uppercase"
                  c="dimmed"
                  style={{ letterSpacing: '0.06em' }}
                >
                  Access
                </Text>
                <Divider mb={4} />
                <Field label="Role" value={user.role ?? 'user'} />
                <Field
                  label="Status"
                  value={user.banned ? 'Banned' : 'Active'}
                  valueColor={user.banned ? 'red' : 'civicGreen.6'}
                />
              </Stack>

              {/* Ban details — only when banned */}
              {user.banned && (
                <Stack gap={4} miw={200}>
                  <Text
                    size="xs"
                    fw={600}
                    tt="uppercase"
                    c="dimmed"
                    style={{ letterSpacing: '0.06em' }}
                  >
                    Ban Details
                  </Text>
                  <Divider mb={4} />
                  <Field
                    label="Reason"
                    value={user.banReason ?? 'No reason provided'}
                    valueColor="red"
                  />
                  {user.banExpires && (
                    <Field
                      label="Expires"
                      value={new Date(user.banExpires).toLocaleString()}
                      valueColor="red"
                    />
                  )}
                </Stack>
              )}
            </Group>
          </Box>
        )}
        pagination={{
          totalCount: usersAsync.totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        columns={[
          ...columns,
          {
            header: '',
            id: 'actions',

            cell: ({ row: { original: user } }: { row: { original: User } }) => (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" aria-label="Settings">
                    <TablerIcon name="dots" style={{ width: '70%', height: '70%' }} stroke={1.5} />
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
            size: 0,
          },
        ]}
      />
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
    cell: ({ row: { original: user } }: { row: { original: User } }) => (
      <Group gap={4}>
        {user.role
          ?.split(',')
          .filter(Boolean)
          .map((role) => (
            <Badge color={role === 'admin' ? 'red' : 'blue'} size="xs">
              {role}
            </Badge>
          ))}
      </Group>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'banned',
    cell: ({ row: { original: user } }: { row: { original: User } }) =>
      user.banned ? (
        <Badge color="red" size="xs">
          Banned
        </Badge>
      ) : (
        <Badge color="green" size="xs">
          Active
        </Badge>
      ),
  },
];

// ─── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Group gap={6} wrap="nowrap" align="baseline">
      <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
        {label}
      </Text>
      <Text size="xs" fw={500} c={valueColor} truncate>
        {value}
      </Text>
    </Group>
  );
}
