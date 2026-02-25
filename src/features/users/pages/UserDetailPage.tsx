import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, launchWorkspace, TablerIcon } from '@/components';
import { UserSessionsList } from '../components';
import BanUserForm from '../forms/BanUserForm';
import SetRoleForm from '../forms/SetRoleForm';
import { useUsers, useUsersApi } from '../hooks';

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, isLoading } = useUsers();
  const { removeUser } = useUsersApi();

  const user = users.find((u) => u.id === id);

  if (isLoading) {
    return (
      <Group justify="center" p="xl">
        <Loader />
      </Group>
    );
  }

  if (!user) {
    return (
      <Stack align="center" p="xl" gap="md">
        <Title order={3}>User not found</Title>
        <Button variant="outline" onClick={() => navigate('/dashboard/users')}>
          Back to Users
        </Button>
      </Stack>
    );
  }

  const handleSetRole = () => {
    const closeWorkspace = launchWorkspace(
      <SetRoleForm user={user} closeWorkspace={() => closeWorkspace()} />,
      { title: 'Set User Role' }
    );
  };

  const handleBanUser = () => {
    const closeWorkspace = launchWorkspace(
      <BanUserForm user={user} closeWorkspace={() => closeWorkspace()} />,
      { title: 'Ban/Unban User' }
    );
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="start">
        <DashboardPageHeader
          title="User Details"
          subTitle={`Managing user: ${user.name}`}
          icon="user"
        />
        <Button
          variant="default"
          onClick={() => navigate('/dashboard/users')}
          leftSection={<TablerIcon name="arrowLeft" size={16} />}
        >
          Back
        </Button>
      </Group>

      <Paper p="md" radius="md" withBorder>
        <Tabs defaultValue="overview" variant="outline" radius="md">
          <Tabs.List mb="md">
            <Tabs.Tab value="overview" leftSection={<TablerIcon name="clipboardText" size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="sessions" leftSection={<TablerIcon name="devices" size={16} />}>
              Sessions
            </Tabs.Tab>
            <Tabs.Tab value="actions" leftSection={<TablerIcon name="settings" size={16} />}>
              Actions
            </Tabs.Tab>
            <Tabs.Tab value="cases" leftSection={<TablerIcon name="listNumbers" size={16} />}>
              Cases
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview">
            <Stack gap="md" p="sm">
              <Group>
                <Avatar size="xl" src={user.image} radius="md" />
                <Stack gap={0}>
                  <Title order={4}>{user.name}</Title>
                  <Text c="dimmed">{user.email}</Text>
                  <Group gap="xs" mt="xs">
                    <Badge color={user.role === 'admin' ? 'blue' : 'gray'}>
                      {user.role || 'user'}
                    </Badge>
                    {user.banned && <Badge color="red">Banned</Badge>}
                  </Group>
                </Stack>
              </Group>

              <Divider />

              <Box>
                <Text fw={500} mb="xs">
                  Account Information
                </Text>
                <Group grow>
                  <Card withBorder padding="sm" radius="md">
                    <Text size="xs" c="dimmed">
                      User ID
                    </Text>
                    <Text size="sm">{user.id}</Text>
                  </Card>
                  <Card withBorder padding="sm" radius="md">
                    <Text size="xs" c="dimmed">
                      Username
                    </Text>
                    <Text size="sm">{user.username || 'N/A'}</Text>
                  </Card>
                  <Card withBorder padding="sm" radius="md">
                    <Text size="xs" c="dimmed">
                      Phone Number
                    </Text>
                    <Text size="sm">{user.phoneNumber || 'N/A'}</Text>
                  </Card>
                </Group>
              </Box>

              <Box mt="xs">
                <Text fw={500} mb="xs">
                  Security Status
                </Text>
                <Group grow>
                  <Card withBorder padding="sm" radius="md">
                    <Text size="xs" c="dimmed">
                      Email Verified
                    </Text>
                    <Badge color={user.emailVerified ? 'green' : 'gray'} mt={4}>
                      {user.emailVerified ? 'Yes' : 'No'}
                    </Badge>
                  </Card>
                  <Card withBorder padding="sm" radius="md">
                    <Text size="xs" c="dimmed">
                      Two Factor
                    </Text>
                    <Badge color={user.twoFactorEnabled ? 'green' : 'gray'} mt={4}>
                      {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </Card>
                </Group>
              </Box>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="sessions">
            <UserSessionsList userId={user.id} />
          </Tabs.Panel>

          <Tabs.Panel value="actions">
            <Stack gap="md" p="sm">
              <Text fw={500}>Management Actions</Text>

              <Group>
                <Button
                  onClick={handleSetRole}
                  variant="light"
                  leftSection={<TablerIcon name="userShield" size={16} />}
                >
                  Change Role
                </Button>

                <Button
                  onClick={handleBanUser}
                  variant="light"
                  color={user.banned ? 'green' : 'red'}
                  leftSection={<TablerIcon name="lock" size={16} />}
                >
                  {user.banned ? 'Unban User' : 'Ban User'}
                </Button>
              </Group>

              <Divider my="sm" />

              <Text fw={500} c="red">
                Danger Zone
              </Text>
              <Group>
                <Button
                  variant="outline"
                  color="red"
                  leftSection={<TablerIcon name="trash" size={16} />}
                  onClick={() => {
                    modals.openConfirmModal({
                      title: 'Delete User',
                      children: (
                        <Text size="sm">
                          Are you absolutely sure you want to delete this user? This action cannot
                          be undone.
                        </Text>
                      ),
                      labels: { confirm: 'Delete User', cancel: 'Cancel' },
                      confirmProps: { color: 'red' },
                      onConfirm: async () => {
                        try {
                          const { error } = await removeUser(user.id);
                          if (error) {
                            throw new Error(error.message);
                          }
                          showNotification({
                            title: 'Success',
                            message: 'User deleted successfully',
                            color: 'green',
                          });
                          navigate('/dashboard/users');
                        } catch (error: any) {
                          showNotification({
                            title: 'Error',
                            message: error.message || 'Failed to delete user',
                            color: 'red',
                          });
                        }
                      },
                    });
                  }}
                >
                  Delete User Account
                </Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="cases">
            <Stack gap="md" p="sm">
              <Text fw={500} mb="xs">
                Recent Cases
              </Text>
              <Text c="dimmed" size="sm">
                This feature is under development. A list of cases reported by or associated with
                this user will be displayed here.
              </Text>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
};

export default UserDetailPage;
