import { Link, Outlet } from 'react-router-dom';
import { Anchor, AppShell, Burger, Flex, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle, Logo } from '@/components';

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
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo />
          <Group w={'fit-content'}>
            <Anchor component={Link} to="/login" visibleFrom="sm">
              <span>Login</span>
            </Anchor>
            <Anchor component={Link} to="/register" visibleFrom="sm">
              <span>Register</span>
            </Anchor>
            <Anchor component={Link} to="/dashboard" visibleFrom="sm">
              <span>Dashboard</span>
            </Anchor>
            <ColorSchemeToggle />
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
