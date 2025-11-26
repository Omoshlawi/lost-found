import classes from './Welcome.module.scss';
import { IconFileDescription, IconSearch, IconShieldCheck, IconUsers } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { LoginForm } from '@/features/landing/forms';
import { Dots } from './Dots';

export function Welcome() {
  return (
    <div>
      <Container className={classes.wrapper} size={1400}>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

        <div className={classes.inner}>
          <Title className={classes.title}>
            Lost &
            <Text component="span" className={classes.highlight} inherit>
              {' '}
              Found
            </Text>{' '}
            Platform
          </Title>

          <Container p={0} size={600}>
            <Text size="lg" c="dimmed" className={classes.description}>
              A platform that helps you find and return lost cases. Easily report lost cases, browse
              through found cases, and connect with others in your community to reunite belongings
              with their rightful owners.
            </Text>
          </Container>

          <div className={classes.controls}>
            <Button className={classes.control} size="lg" variant="default" color="gray">
              Learn More
            </Button>
            <Button className={classes.control} size="lg">
              Report an Item
            </Button>
          </div>
        </div>
      </Container>
      {/* <Container size="lg" py={80}>
        <Stack align="center" gap="xl" mb={80}>
          <Flex h={'100vh'} w={'100%'} display={'flex'} flex={1} pt={'xl'} justify={'center'}>
            <Paper
              mb={100}
              p={'xs'}
              h={'fit-content'}
              shadow="lg"
              withBorder
              w={'420px'}
              radius={'sm'}
            >
              <Container size={'xl'}>
                <LoginForm />
              </Container>
            </Paper>
          </Flex>
          <div style={{ textAlign: 'center' }}>
            <Text size="sm" fw={600} c="#228BE6" tt="uppercase" style={{ letterSpacing: '2px' }}>
              Lost & Found Platform
            </Text>
            <Text c="dimmed" size="xl" maw={680} mx="auto" mt="xl" style={{ lineHeight: 1.8 }}>
              A platform that helps you find and return lost cases. Easily report lost cases, browse
              through found cases, and connect with others in your community to reunite belongings
              with their rightful owners.
            </Text>
          </div>
        </Stack>
      </Container> */}
    </div>
  );
}
