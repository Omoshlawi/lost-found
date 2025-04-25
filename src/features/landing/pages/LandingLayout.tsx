import { Link, Outlet } from 'react-router-dom';
import { AppShell, Burger, Flex, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Logo } from '@/components';

const LandingLayout = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex justify={'space-between'} align={'center'} p={'xs'}>
          <Group w={'fit-content'}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Logo />
          </Group>
          <Group w={'fit-content'} visibleFrom="sm">
            <Link to="/login">
              <span>Login</span>
            </Link>
            <Link to="/register">
              <span>Register</span>
            </Link>
            <Link to="/dashboard">
              <span>Dashboard</span>
            </Link>
          </Group>
        </Flex>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default LandingLayout;
