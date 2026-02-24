import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Group, Paper, Stack, Tabs, Text, Title } from '@mantine/core';
import { DashboardPageHeader, TablerIcon } from '@/components';
import PasswordSettings from '../components/PasswordSettings';
import ProfileSettings from '../components/ProfileSettings';
import TwoFactorSettings from '../components/TwoFactorSettings';

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.includes('change-password')) return 'password';
    if (location.pathname.includes('two-factor')) return 'security';
    return 'profile';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    if (value === 'profile') navigate('/dashboard/settings/profile');
    if (value === 'password') navigate('/dashboard/settings/change-password');
    if (value === 'security') navigate('/dashboard/settings/two-factor');
  };

  return (
    <Stack gap="xl">
      <Box>
        <DashboardPageHeader
          title="Account Settings"
          subTitle="Manage your personal information, security, and preferences"
          icon="settings"
        />
      </Box>

      <Paper p="md" radius="md" withBorder>
        <Tabs value={activeTab} onChange={handleTabChange} variant="outline" radius="md">
          <Tabs.List mb="xl">
            <Tabs.Tab value="profile" leftSection={<TablerIcon name="user" size={16} />}>
              Profile Information
            </Tabs.Tab>
            <Tabs.Tab value="password" leftSection={<TablerIcon name="fingerprint" size={16} />}>
              Change Password
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<TablerIcon name="lock" size={16} />}>
              Two-Factor Authentication
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile">
            <Container size="sm" p={0} m={0}>
              <Title order={3} mb="sm">
                Profile Information
              </Title>
              <Text c="dimmed" mb="xl">
                Update your account's profile information and email address.
              </Text>
              <ProfileSettings />
            </Container>
          </Tabs.Panel>

          <Tabs.Panel value="password">
            <Container size="sm" p={0} m={0}>
              <Title order={3} mb="sm">
                Change Password
              </Title>
              <Text c="dimmed" mb="xl">
                Ensure your account is using a long, random password to stay secure.
              </Text>
              <PasswordSettings />
            </Container>
          </Tabs.Panel>

          <Tabs.Panel value="security">
            <Container size="sm" p={0} m={0}>
              <Title order={3} mb="sm">
                Two Factor Authentication
              </Title>
              <Text c="dimmed" mb="xl">
                Add additional security to your account using two factor authentication.
              </Text>
              <TwoFactorSettings />
            </Container>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
};

export default SettingsPage;
