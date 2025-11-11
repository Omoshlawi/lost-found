import { Link, Outlet } from 'react-router-dom';
import { AppShell, Box, Burger, Button, Flex, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle, Logo } from '@/components';

const LandingLayout = () => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !opened, desktop: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex align="center" justify="space-between" h="100%" px="md">
          <Group gap="md" style={{ flex: '0 0 auto' }}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
            <Button variant="transparent" component={Link} to="/about" visibleFrom="md">
              About us
            </Button>
          </Group>

          <Box style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center' }}>
            <Logo />
          </Box>

          <Group gap="sm" style={{ flex: '0 0 auto' }}>
            <Button variant="outline" component={Link} to="/login">
              Sign In
            </Button>
            <ColorSchemeToggle />
          </Group>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <Button
            variant="subtle"
            component={Link}
            to="/about"
            onClick={close}
            fullWidth
            justify="flex-start"
          >
            About us
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default LandingLayout;
