import React from 'react';
import { Avatar, Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { launchWorkspace, TablerIcon } from '@/components';
import BanUserForm from '../forms/BanUserForm';
import ChangeUserPasswordForm from '../forms/ChangeUserPasswordForm';
import SetRoleForm from '../forms/SetRoleForm';
import { User } from '../types';
import UserInfoPanel from './UserInfoPanel';

type UserOverviewTabProps = {
  user: User;
  onUserMutate: () => void;
};

const UserOverviewTab: React.FC<UserOverviewTabProps> = ({ user, onUserMutate }) => {
  const handleSetRole = () => {
    const closeWorkspace = launchWorkspace(
      <SetRoleForm user={user} closeWorkspace={() => closeWorkspace()} onSuccess={onUserMutate} />,
      { title: 'Set User Role', width: 'narrow' }
    );
  };

  const handleBanUser = () => {
    const closeWorkspace = launchWorkspace(
      <BanUserForm user={user} closeWorkspace={() => closeWorkspace()} onSuccess={onUserMutate} />,
      { title: user.banned ? 'Unban User' : 'Ban User', width: 'narrow' }
    );
  };

  const handleChangePassword = () => {
    const closeWorkspace = launchWorkspace(
      <ChangeUserPasswordForm user={user} closeWorkspace={() => closeWorkspace()} />,
      { title: 'Change Password', width: 'narrow' }
    );
  };

  return (
    <Stack gap="xl">
      <Group align="flex-start" justify="space-between">
        <Group gap="lg">
          <Avatar size={80} src={user.image} radius="none" color="civicBlue" variant="light">
            {user.name?.charAt(0)}
          </Avatar>
          <Stack gap={4}>
            <Title order={4} style={{ fontWeight: 800 }}>
              {user.name}
            </Title>
            <Text c="dimmed" size="sm">
              {user.email}
            </Text>
            <Group gap="xs" mt={4}>
              {user.role
                ?.split(',')
                ?.filter(Boolean)
                ?.map((role) => (
                  <Badge key={role} color="civicBlue" variant="light" size="sm">
                    {role}
                  </Badge>
                ))}
              {user.banned && (
                <Badge color="red" variant="light" size="sm">
                  Banned
                </Badge>
              )}
              {user.emailVerified && (
                <Badge color="green" variant="light" size="sm">
                  Verified
                </Badge>
              )}
            </Group>
          </Stack>
        </Group>

        <Group gap="sm">
          <Button
            size="xs"
            variant="light"
            leftSection={<TablerIcon name="userShield" size={14} />}
            onClick={handleSetRole}
          >
            Set Role
          </Button>
          <Button
            size="xs"
            variant="light"
            color="blue"
            leftSection={<TablerIcon name="lock" size={14} />}
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
          <Button
            size="xs"
            variant="light"
            color={user.banned ? 'green' : 'orange'}
            leftSection={<TablerIcon name={user.banned ? 'lockOpen' : 'ban'} size={14} />}
            onClick={handleBanUser}
          >
            {user.banned ? 'Unban' : 'Ban'}
          </Button>
        </Group>
      </Group>

      <Group align="flex-start" wrap="wrap" gap={40}>
        <UserInfoPanel
          label="Account Identity"
          fields={[
            { label: 'User ID', value: user.id },
            { label: 'Username', value: user.username || '—' },
            { label: 'Display Name', value: user.displayUsername || '—' },
            { label: 'Joined', value: new Date(user.createdAt).toLocaleDateString() },
          ]}
        />

        <UserInfoPanel
          label="Contact Details"
          fields={[
            { label: 'Email', value: user.email },
            { label: 'Phone', value: user.phoneNumber || '—' },
            {
              label: 'Phone Verified',
              value: (
                <Badge
                  size="xs"
                  variant="outline"
                  color={user.phoneNumberVerified ? 'green' : 'gray'}
                >
                  {user.phoneNumberVerified ? 'Yes' : 'No'}
                </Badge>
              ),
            },
          ]}
        />

        <UserInfoPanel
          label="Security & Status"
          fields={[
            {
              label: 'Account Status',
              value: (
                <Badge size="xs" variant="light" color={user.banned ? 'red' : 'green'}>
                  {user.banned ? 'Banned' : 'Active'}
                </Badge>
              ),
            },
            {
              label: 'Two Factor',
              value: (
                <Badge
                  size="xs"
                  variant="outline"
                  color={user.twoFactorEnabled ? 'green' : 'gray'}
                >
                  {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              ),
            },
            { label: 'Last Updated', value: new Date(user.updatedAt).toLocaleDateString() },
          ]}
        />
      </Group>

      {user.banned && (
        <Card withBorder padding="md" radius="md" bg="red.0">
          <Group gap="sm" mb={4}>
            <TablerIcon name="alertTriangle" size={16} color="red" />
            <Text fw={700} c="red" size="sm">
              Ban Information
            </Text>
          </Group>
          <Text size="sm" mb={4}>
            <Text span fw={600}>
              Reason:
            </Text>{' '}
            {user.banReason || 'No reason provided'}
          </Text>
          {user.banExpires && (
            <Text size="sm">
              <Text span fw={600}>
                Expires:
              </Text>{' '}
              {new Date(user.banExpires).toLocaleString()}
            </Text>
          )}
        </Card>
      )}
    </Stack>
  );
};

export default UserOverviewTab;
