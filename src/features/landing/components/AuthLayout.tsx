import { Outlet } from 'react-router-dom';
import {
  AppShell,
  Box,
  Center,
  Container,
  Grid,
  Group,
  Paper,
  rem,
  Text,
  Title,
} from '@mantine/core';
import { ColorSchemeToggle, Logo } from '@/components';

const AuthLayout = () => {
  return (
    <AppShell>
      <AppShell.Main p={0}>
        <Grid gutter={0} style={{ minHeight: '100vh' }}>
          {/* Left Side: Premium Branding / Background */}
          <Grid.Col
            span={{ base: 12, md: 5, lg: 6 }}
            style={{
              background:
                'linear-gradient(135deg, var(--mantine-color-citizenNavy-7) 0%, var(--mantine-color-citizenNavy-9) 100%)',
              color: 'white',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '2.5rem',
            }}
            visibleFrom="md"
          >
            {/* Elegant Background pattern */}
            <Box
              pos="absolute"
              style={{
                top: '-15%',
                left: '-10%',
                width: rem(600),
                height: rem(600),
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, var(--mantine-color-citizenTeal-7) 0%, transparent 70%)',
                opacity: 0.15,
                zIndex: 0,
              }}
            />

            <Box style={{ zIndex: 1, position: 'relative' }}>
              <Logo />
            </Box>

            <Box style={{ zIndex: 1, position: 'relative', paddingBottom: '5rem' }}>
              <Title
                order={1}
                style={{
                  fontSize: rem(52),
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                  fontWeight: 800,
                }}
              >
                Secure Identity <br />
                <Text
                  component="span"
                  inherit
                  style={{ color: 'var(--mantine-color-citizenTeal-7)' }}
                >
                  Management.
                </Text>
              </Title>
              <Text size="xl" style={{ color: 'rgba(255,255,255,0.85)' }} maw={520} lh={1.6}>
                Join Citizen Link today to instantly find, claim, or report identity documents using
                cutting-edge Vision and AI capabilities. Enterprise-grade security for your data.
              </Text>
            </Box>

            <Box style={{ zIndex: 1, position: 'relative' }}>
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                &copy; {new Date().getFullYear()} Citizen Link Platform. All rights reserved.
              </Text>
            </Box>
          </Grid.Col>

          {/* Right Side: Form Content Outlet */}
          <Grid.Col span={{ base: 12, md: 7, lg: 6 }} style={{ position: 'relative' }}>
            {/* Theme Toggle pinned to top right */}
            <Box pos="absolute" top={rem(20)} right={rem(20)} style={{ zIndex: 10 }}>
              <ColorSchemeToggle />
            </Box>

            <Center
              style={{
                height: '100vh',
                padding: 'var(--mantine-spacing-md)',
                backgroundColor: 'var(--mantine-color-body)',
              }}
            >
              <Container size="sm" w="100%">
                {/* Mobile view Logo fallback */}
                <Box hiddenFrom="md" mb="sm" ta="center">
                  <Group justify="center">
                    <Logo />
                  </Group>
                </Box>

                {/* Minimalist container for forms */}
                <Paper radius="lg" p={{ base: '0', sm: 'xl' }} bg="transparent">
                  <Outlet />
                </Paper>
              </Container>
            </Center>
          </Grid.Col>
        </Grid>
      </AppShell.Main>
    </AppShell>
  );
};

export default AuthLayout;
