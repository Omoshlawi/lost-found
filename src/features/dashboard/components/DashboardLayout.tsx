import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ActionIcon, AppShell, Box, Modal, Stack } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { TablerIcon } from '@/components';
import { useWorkspace } from '@/components/Workspace';
import SideNav from './SideNav';
import TopNavBar from './TopNavBar';

const DashboardLayout: FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const { workspace, width } = useWorkspace();
  const isMobile = useMediaQuery('(max-width: 48em)');
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
          collapsed: { mobile: !opened },
        }}
        aside={{ collapsed: { mobile: !opened }, breakpoint: '50em', width: width ?? 50 }}
        styles={{
          aside: { transition: 'width 300ms ease' },
        }}
        padding="md"
      >
        <TopNavBar />
        <AppShell.Navbar>
          <SideNav />
        </AppShell.Navbar>
        <AppShell.Aside>
          {!workspace && (
            <Stack align="center" py={'sm'}>
              <ActionIcon
                size={35}
                radius={'50%'}
                variant="outline"
                aria-label="ActionIcon with size as a number"
              >
                <TablerIcon name="plus" size={24} />
              </ActionIcon>
              <ActionIcon
                size={35}
                radius={'50%'}
                variant="outline"
                aria-label="ActionIcon with size as a number"
              >
                <TablerIcon name="bell" size={24} />
              </ActionIcon>
            </Stack>
          )}
          {workspace?.component}
        </AppShell.Aside>
        <AppShell.Main style={{ position: 'relative' }}>
          <Outlet />
        </AppShell.Main>
        <AppShell.Footer>
          <p>lorem impsum with some interesting staff bana</p>
        </AppShell.Footer>
      </AppShell>
      <Modal
        opened={modalOpened}
        onClose={modalClose}
        fullScreen
        radius={0}
        withCloseButton={false}
        transitionProps={{ transition: 'slide-up', duration: 200 }}
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
