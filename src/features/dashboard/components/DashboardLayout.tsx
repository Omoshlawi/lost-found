import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SideNav from './SideNav';
import TopNavBar from './TopNavBar';

const DashboardLayout: FC = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      aside={{ collapsed: { mobile: !opened }, breakpoint: 'sm', width: 50 }}
      padding="md"
    >
      <TopNavBar />
      <AppShell.Navbar>
        <SideNav />
      </AppShell.Navbar>
      <AppShell.Aside>
        <div>Aside</div>
      </AppShell.Aside>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  );
};

export default DashboardLayout;
