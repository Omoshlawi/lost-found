import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, Center, Divider, Group } from '@mantine/core';
import { ColorSchemeToggle, Logo } from '@/components';
import UserActionsMenu from '@/features/dashboard/components/UserActionsMenu';

/**
 * Minimal full-page layout used only for the station selection screen.
 * Header with logo + controls. No sidebar. Content is vertically centred.
 */
const StationSelectionLayout: FC = () => {
  return (
    <AppShell
      header={{ height: 60 }}
      styles={{
        header: { borderBottom: '1px solid var(--mantine-color-default-border)' },
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Logo />
          <Group gap="xs">
            <Divider orientation="vertical" />
            <ColorSchemeToggle />
            <UserActionsMenu />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Center mih="calc(100vh - 60px)" px="md">
          <Outlet />
        </Center>
      </AppShell.Main>
    </AppShell>
  );
};

export default StationSelectionLayout;
