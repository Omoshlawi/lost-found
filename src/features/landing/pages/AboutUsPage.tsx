import { Container, Stack, Text, Title } from '@mantine/core';

export default function AboutUsPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title>About Citizen Link</Title>
        <Text>
          Citizen Link is a modern platform dedicated to helping people recover lost documents
          through advanced AI and community cooperation. Our mission is to bridge the gap between
          lost items and their rightful owners using state-of-the-art technology.
        </Text>
      </Stack>
    </Container>
  );
}
