import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { DashboardPageHeader, launchWorkspace, TablerIcon } from '@/components';
import { UserInfoPanel, UserSessionsList } from '../components';
import BanUserForm from '../forms/BanUserForm';
import SetRoleForm from '../forms/SetRoleForm';
import { useUser } from '../hooks';

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading, error, mutate } = useUser(id);

  if (isLoading) {
    return (
      <Group justify="center" p="xl">
        <Loader />
      </Group>
    );
  }

  if (error || !user) {
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
      <SetRoleForm
        user={user}
        closeWorkspace={() => closeWorkspace()}
        onSuccess={() => mutate()}
      />,
      { title: 'Set User Role', width: 'narrow' }
    );
  };

  const handleBanUser = () => {
    const closeWorkspace = launchWorkspace(
      <BanUserForm
        user={user}
        closeWorkspace={() => closeWorkspace()}
        onSuccess={() => mutate()}
      />,
      { title: user.banned ? 'Unban User' : 'Ban User', width: 'narrow' }
    );
  };

  return (
    <Stack gap="xl">
      <DashboardPageHeader
        title="User Details"
        subTitle={`Managing user account: ${user.name}`}
        icon="user"
        traiiling={
          <Group>
            <Button
              variant="default"
              onClick={() => navigate('/dashboard/users')}
              leftSection={<TablerIcon name="arrowLeft" size={16} />}
            >
              Back
            </Button>
          </Group>
        }
      />

      <Tabs defaultValue="overview" variant="default">
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<TablerIcon name="infoCircle" size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="sessions" leftSection={<TablerIcon name="devices" size={16} />}>
            Sessions
          </Tabs.Tab>
          <Tabs.Tab value="cases" leftSection={<TablerIcon name="files" size={16} />}>
            Reported Cases
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Paper withBorder p="lg">
            <Stack gap="xl">
              <Group align="flex-start" justify="space-between">
                <Group gap="lg">
                  <Avatar
                    size={80}
                    src={user.image}
                    radius="none"
                    color="civicBlue"
                    variant="light"
                  >
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
                          <Badge color="civicBlue" variant="light" size="sm">
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
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="sessions" pt="md">
          <Paper withBorder p="lg">
            <UserSessionsList userId={user.id} />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="cases" pt="md">
          <Paper withBorder p="lg">
            <Stack gap="md">
              <Title order={5}>Reported Cases</Title>
              <Text c="dimmed" size="sm">
                This section will display document cases reported by this user. This feature is
                coming soon.
              </Text>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default UserDetailPage;
