import { useNavigate, useParams } from 'react-router-dom';
import { Button, Group, Loader, Paper, Stack, Tabs, Title } from '@mantine/core';
import { DashboardPageHeader, TablerIcon } from '@/components';
import {
  UserAddresses,
  UserOverviewTab,
  UserReportedCases,
  UserSessionsList,
} from '../components';
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

  return (
    <Stack gap="xl">
      <DashboardPageHeader
        title="User Details"
        subTitle={`Managing user account: ${user.name}`}
        icon="user"
        traiiling={
          <Button
            variant="default"
            onClick={() => navigate('/dashboard/users')}
            leftSection={<TablerIcon name="arrowLeft" size={16} />}
          >
            Back
          </Button>
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
          <Tabs.Tab value="addresses" leftSection={<TablerIcon name="mapPin" size={16} />}>
            Addresses
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <Paper withBorder p="lg">
            <UserOverviewTab user={user} onUserMutate={mutate} />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="sessions" pt="md">
          <Paper withBorder p="lg">
            <UserSessionsList userId={user.id} />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="cases" pt="md">
          <Paper withBorder p="lg">
            <UserReportedCases userId={user.id} />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="addresses" pt="md">
          <Paper withBorder p="lg">
            <UserAddresses userId={user.id} />
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default UserDetailPage;
