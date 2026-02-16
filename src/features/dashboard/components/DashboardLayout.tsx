import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ActionIcon, AppShell, Burger, Group, Modal, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ColorSchemeToggle, Logo, TablerIcon } from '@/components';
import { useWorkspace } from '@/components/Workspace';
import SideNav from './SideNav';
import UserActionsMenu from './UserActionsMenu';

const DashboardLayout: FC = () => {
  const [opened] = useDisclosure();
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

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: '50em',
          collapsed: { mobile: !drawerOpened },
        }}
        aside={{ collapsed: { mobile: !opened }, breakpoint: '50em', width: width ?? 50 }}
        styles={{
          aside: {
            transition: 'width 300ms ease',
          },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group justify="space-between" align="center" flex={1} px="xs" h="100%">
            {isMobile && <Burger opened={drawerOpened} onClick={toggleOpenDrawer} size="sm" />}
            <Logo />
            <Group>
              <ColorSchemeToggle />
              <UserActionsMenu />
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <SideNav onClose={isMobile ? toggleOpenDrawer : undefined} />
        </AppShell.Navbar>
        <AppShell.Aside>
          {!workspace && (
            <Stack align="center" py="sm">
              <ActionIcon
                size={35}
                radius="50%"
                variant="outline"
                aria-label="ActionIcon with size as a number"
              >
                <TablerIcon name="plus" size={24} />
              </ActionIcon>
              <ActionIcon
                size={35}
                radius="50%"
                variant="outline"
                aria-label="ActionIcon with size as a number"
              >
                <TablerIcon name="bell" size={24} />
              </ActionIcon>
            </Stack>
          )}
          {workspace?.component}
        </AppShell.Aside>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        {/* <AppShell.Footer>
          <p>lorem impsum with some interesting staff bana</p>
        </AppShell.Footer> */}
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
