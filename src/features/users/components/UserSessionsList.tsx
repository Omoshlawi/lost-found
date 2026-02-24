import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, Button, Card, Group, Loader, Paper, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { StateFullDataTable, TablerIcon } from '@/components';
import { useUsersApi, useUserSessions } from '../hooks';
import { UserSession } from '../types';

type UserSessionsListProps = {
  userId: string;
};

const UserSessionsList: React.FC<UserSessionsListProps> = ({ userId }) => {
  const sessionsAsync = useUserSessions(userId);
  const { revokeUserSession, revokeAllUserSessions } = useUsersApi();

  const handleRevoke = (session: UserSession) => {
    modals.openConfirmModal({
      title: 'Revoke Session',
      children: <Text size="sm">Are you sure you want to revoke this device session?</Text>,
      labels: { confirm: 'Revoke', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const { error } = await revokeUserSession(session.token);
          if (error) {
            throw new Error(error.message);
          }
          showNotification({
            title: 'Success',
            message: 'Session revoked successfully',
            color: 'green',
          });
          sessionsAsync.mutate();
        } catch (error: any) {
          showNotification({
            title: 'Error',
            message: error.message || 'Failed to revoke session',
            color: 'red',
          });
        }
      },
    });
  };

  const handleRevokeAll = () => {
    modals.openConfirmModal({
      title: 'Revoke All Sessions',
      children: <Text size="sm">Are you sure you want to revoke ALL sessions for this user?</Text>,
      labels: { confirm: 'Revoke All', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const { error } = await revokeAllUserSessions(userId);
          if (error) {
            throw new Error(error.message);
          }
          showNotification({
            title: 'Success',
            message: 'All sessions revoked successfully',
            color: 'green',
          });
          sessionsAsync.mutate();
        } catch (error: any) {
          showNotification({
            title: 'Error',
            message: error.message || 'Failed to revoke all sessions',
            color: 'red',
          });
        }
      },
    });
  };

  return (
    <Stack gap="md" p="sm">
      <Group justify="space-between">
        <Text fw={500}>Active Sessions</Text>
        <Button
          onClick={handleRevokeAll}
          variant="light"
          color="orange"
          leftSection={<TablerIcon name="logout" size={16} />}
          disabled={!sessionsAsync.sessions || sessionsAsync.sessions.length === 0}
        >
          Revoke All Sessions
        </Button>
      </Group>

      {sessionsAsync.isLoading ? (
        <Group justify="center" p="xl">
          <Loader />
        </Group>
      ) : sessionsAsync.sessions.length === 0 ? (
        <Card withBorder padding="xl" radius="md" ta="center">
          <Text c="dimmed">No active sessions found for this user.</Text>
        </Card>
      ) : (
        <Paper withBorder radius="md">
          <StateFullDataTable
            {...sessionsAsync}
            data={sessionsAsync.sessions}
            columns={[
              ...columns,
              {
                header: 'Actions',
                id: 'actions',
                cell: ({ row: { original: session } }: { row: { original: UserSession } }) => (
                  <Button
                    size="xs"
                    variant="outline"
                    color="red"
                    onClick={() => handleRevoke(session)}
                  >
                    Revoke
                  </Button>
                ),
              },
            ]}
          />
        </Paper>
      )}
    </Stack>
  );
};

export default UserSessionsList;

const columns: ColumnDef<UserSession>[] = [
  {
    header: 'Device / Browser',
    accessorKey: 'userAgent',
    cell: ({ row: { original: session } }: { row: { original: UserSession } }) => (
      <Text size="sm" lineClamp={1} title={session.userAgent || 'Unknown'}>
        {session.userAgent || (
          <Text span c="dimmed">
            Unknown Browser Device
          </Text>
        )}
      </Text>
    ),
  },
  {
    header: 'IP Address',
    accessorKey: 'ipAddress',
    cell: ({ row: { original: session } }: { row: { original: UserSession } }) => (
      <Text size="sm">{session.ipAddress || 'Unknown IP'}</Text>
    ),
  },
  {
    header: 'Created On',
    accessorKey: 'createdAt',
    cell: ({ row: { original: session } }: { row: { original: UserSession } }) => (
      <Text size="sm">{new Date(session.createdAt).toLocaleDateString()}</Text>
    ),
  },
  {
    header: 'Expires At',
    accessorKey: 'expiresAt',
    cell: ({ row: { original: session } }: { row: { original: UserSession } }) => {
      const isExpired = new Date(session.expiresAt) < new Date();
      return (
        <Badge color={isExpired ? 'red' : 'green'}>
          {isExpired ? 'Expired' : new Date(session.expiresAt).toLocaleDateString()}
        </Badge>
      );
    },
  },
];
