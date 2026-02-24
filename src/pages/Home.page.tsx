import classes from '../components/Welcome/Welcome.module.scss';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  rem,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { Dots } from '../components/Welcome/Dots';

export function HomePage() {
  const features = [
    {
      icon: 'brain',
      title: 'AI Data Extraction',
      description:
        'Advanced Vision and LLM engines instantly classify, extract, and normalize document data with high confidence.',
    },
    {
      icon: 'id',
      title: 'Automated Classification',
      description:
        'Automatically identifies National IDs, Passports, Birth Certs, and Police Abstracts without manual tagging.',
    },
    {
      icon: 'shieldCheck',
      title: 'Secure & Structured Match',
      description:
        'Uses canonical data structures and confidence scores to securely find rightful owners of recovered documents.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box pos="relative" bg="dark.7" style={{ overflow: 'hidden' }}>
        {/* Abstract Background pattern replacing image for universal support */}
        <Box
          pos="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            backgroundImage:
              'radial-gradient(ellipse at top right, rgba(34, 139, 230, 0.4) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(21, 170, 191, 0.4) 0%, transparent 60%)',
            zIndex: 0,
          }}
        />

        <Container
          size="lg"
          pos="relative"
          style={{ zIndex: 1, paddingTop: rem(120), paddingBottom: rem(120) }}
        >
          <div className={classes.inner}>
            <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

            <Title
              order={1}
              ta="center"
              style={{
                fontSize: rem(65),
                fontWeight: 900,
                lineHeight: 1.1,
                color: 'white',
                letterSpacing: '-1px',
              }}
            >
              The AI-Powered{' '}
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'indigo' }}
                inherit
              >
                Citizen Link
              </Text>{' '}
              Platform
            </Title>

            <Text
              ta="center"
              c="gray.3"
              size="xl"
              maw={680}
              mx="auto"
              mt="xl"
              mb={rem(50)}
              style={{ lineHeight: 1.6 }}
            >
              A beautifully designed, highly secure platform bridging the gap for lost and recovered
              documents. We utilize precise AI structuring, vision extraction, and deterministic NLP
              to match your missing identity documents.
            </Text>

            <Group justify="center" gap="lg">
              <Button
                component={Link}
                to="/register"
                size="xl"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'indigo' }}
                style={{
                  transition: 'transform 200ms ease',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                Join the Network
              </Button>
              <Button
                component={Link}
                to="/login"
                size="xl"
                radius="xl"
                variant="white"
                color="dark"
                style={{
                  transition: 'transform 200ms ease',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                Sign in to Account
              </Button>
            </Group>
          </div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container size="lg" py={rem(100)}>
        <Title order={2} ta="center" mb="xl" style={{ fontSize: rem(36), fontWeight: 800 }}>
          Why Choose Citizen Link?
        </Title>
        <Text c="dimmed" ta="center" maw={600} mx="auto" mb={rem(60)} size="lg">
          Our platform is engineered to simplify recovery, maximize reach, and protect your data
          throughout the entire process.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          {features.map((feature, index) => (
            <Card
              key={index}
              shadow="lg"
              radius="lg"
              padding="xl"
              withBorder
              style={{
                transition: 'transform 200ms ease, box-shadow 200ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
              }}
            >
              <ThemeIcon
                size={60}
                radius="xl"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'indigo' }}
                mb="lg"
              >
                <TablerIcon name={feature.icon as any} size={30} stroke={1.5} />
              </ThemeIcon>
              <Text fz="xl" fw={700} mb="sm">
                {feature.title}
              </Text>
              <Text fz="md" c="dimmed" style={{ lineHeight: 1.6 }}>
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Supported Documents Section */}
      <Box bg="dark.7" py={rem(100)} c="white">
        <Container size="lg">
          <Title order={2} ta="center" mb="xl" style={{ fontSize: rem(36), fontWeight: 800 }}>
            Supported Identity Documents
          </Title>
          <Text c="gray.4" ta="center" maw={600} mx="auto" mb={rem(60)} size="lg">
            Our AI engine natively parses, validates, and normalizes the following documents with
            strict structures for perfect matching.
          </Text>

          <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="lg">
            {[
              { label: 'National ID', icon: 'id' },
              { label: 'Passport', icon: 'book' },
              { label: 'Birth Certificate', icon: 'certificate' },
              { label: 'Police Abstract', icon: 'fileDescription' },
              { label: 'Student ID', icon: 'school' },
              { label: 'NHIF Card', icon: 'heartbeat' },
            ].map((doc) => (
              <Card
                key={doc.label}
                bg="dark.6"
                radius="md"
                ta="center"
                padding="lg"
                withBorder
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <ThemeIcon size={50} radius="xl" variant="light" color="cyan" mx="auto" mb="md">
                  <TablerIcon name={doc.icon as any} size={26} />
                </ThemeIcon>
                <Text fw={600} size="xs" tt="uppercase" ls={1}>
                  {doc.label}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Mini CTA Footer */}
      <Box bg="gray.0" py={rem(80)}>
        <Container size="md" ta="center">
          <Title order={3} mb="md">
            Ready to get started?
          </Title>
          <Text c="dimmed" mb="xl">
            Join thousands of users reuniting items globally.
          </Text>
          <Button component={Link} to="/register" size="lg" radius="xl" color="dark">
            Create Free Account
          </Button>
        </Container>
      </Box>
    </>
  );
}
