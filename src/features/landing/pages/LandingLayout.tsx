import { Link, Outlet } from 'react-router-dom';
import { AppShell, Box, Burger, Button, Flex, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle, Logo } from '@/components';

const LandingLayout = () => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !opened, desktop: true },
      }}
    >
      <AppShell.Header
        withBorder={false}
        bg="transparent"
        style={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Flex align="center" justify="space-between" h="100%" px="xl" maw={1400} mx="auto">
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
            <Button variant="subtle" color="gray.3" component={Link} to="/login">
              Sign In
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: 'citizenTeal.7', to: 'citizenNavy.7' }}
              component={Link}
              to="/register"
              radius="xl"
              px="xl"
              visibleFrom="xs"
            >
              Get Started
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
          <Button
            variant="subtle"
            component={Link}
            to="/how-it-works"
            onClick={close}
            fullWidth
            justify="flex-start"
          >
            How it works
          </Button>
          <Button
            variant="subtle"
            component={Link}
            to="/contact"
            onClick={close}
            fullWidth
            justify="flex-start"
          >
            Contact us
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      {/* TODO: Add footer */}
      {/* <FooterCentered /> */}
    </AppShell>
  );
};

export default LandingLayout;
