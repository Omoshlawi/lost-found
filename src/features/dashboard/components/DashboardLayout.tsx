import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, Box } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useWorkspace } from '@/components/Workspace';
import SideNav from './SideNav';
import TopNavBar from './TopNavBar';

const DashboardLayout: FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const { workspace, width } = useWorkspace();
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: '50em',
        collapsed: { mobile: !opened },
      }}
      aside={{ collapsed: { mobile: !opened }, breakpoint: '50em', width: width ?? 50 }}
      footer={isMobile && workspace?.component ? { height: '100vh' } : undefined}
      styles={{
        aside: { transition: 'width 300ms ease' },
        footer: { transition: 'height 300ms ease' },
      }}
      padding="md"
    >
      <TopNavBar />
      <AppShell.Navbar>
        <SideNav />
      </AppShell.Navbar>
      <AppShell.Aside>
        {!workspace && <div>Aside</div>}
        {workspace?.component}
      </AppShell.Aside>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer component={isMobile && workspace?.component ? Box : undefined}>
        {isMobile && workspace?.component ? (
          workspace.component
        ) : (
          <p>lorem impsum with some interesting staff bana</p>
        )}
      </AppShell.Footer>
    </AppShell>
  );
};

export default DashboardLayout;
