import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useWorkspace } from '@/components/Workspace';
import SideNav from './SideNav';
import TopNavBar from './TopNavBar';

const DashboardLayout: FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const { workspace, width } = useWorkspace();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      aside={{ collapsed: { mobile: !opened }, breakpoint: 'sm', width: width ?? 50 }}
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
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  );
};

export default DashboardLayout;
