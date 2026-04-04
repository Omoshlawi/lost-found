import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, Box, Burger, Divider, Group, Modal, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ColorSchemeToggle, Logo } from '@/components';
import { useWorkspace } from '@/components/Workspace';
import SideNav from './SideNav';
import UserActionsMenu from './UserActionsMenu';

const DashboardLayout: FC = () => {
  const [drawerOpened, { toggle: toggleOpenDrawer }] = useDisclosure();

  const { workspace, width } = useWorkspace();
  const isMobile = useMediaQuery('(max-width: 50em)');
  const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(
    isMobile && Boolean(workspace?.component)
  );

  useEffect(() => {
    if (isMobile && workspace?.component) {
      modalOpen();
    } else {
      modalClose();
    }
  }, [isMobile, workspace, modalClose, modalOpen]);

  const hasWorkspace = Boolean(workspace?.component);

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 260,
          breakpoint: '50em',
          collapsed: { mobile: !drawerOpened },
        }}
        aside={{
          collapsed: { mobile: true, desktop: !hasWorkspace },
          breakpoint: '50em',
          width: width ?? 400,
        }}
        styles={{
          aside: { transition: 'width 300ms ease' },
          navbar: { borderRight: '1px solid var(--mantine-color-default-border)' },
          header: { borderBottom: '1px solid var(--mantine-color-default-border)' },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group justify="space-between" align="center" h="100%" px="md">
            <Group gap="sm">
              {isMobile && (
                <Burger opened={drawerOpened} onClick={toggleOpenDrawer} size="sm" />
              )}
              <Logo />
            </Group>
            <Group gap="xs">
              <Text
                size="xs"
                fw={500}
                c="dimmed"
                visibleFrom="sm"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Staff Portal
              </Text>
              <Divider orientation="vertical" visibleFrom="sm" />
              <ColorSchemeToggle />
              <UserActionsMenu />
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p={0}>
          <SideNav onClose={isMobile ? toggleOpenDrawer : undefined} />
        </AppShell.Navbar>

        {hasWorkspace && (
          <AppShell.Aside>
            <Box h="100%">{workspace?.component}</Box>
          </AppShell.Aside>
        )}

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>

      <Modal
        opened={modalOpened}
        onClose={modalClose}
        fullScreen
        radius={0}
        withCloseButton={false}
        transitionProps={{ transition: 'slide-up', duration: 300 }}
        p={0}
        m={0}
        styles={{
          body: { padding: 0, width: '100%', height: '100%', flex: 1 },
        }}
      >
        {workspace?.component}
      </Modal>
    </>
  );
};

export default DashboardLayout;
