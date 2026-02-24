import { Button, Container, Group, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';

export default function ContactUsPage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Title ta="center">Contact Us</Title>
        <Text ta="center" c="dimmed">
          Have questions or need assistance? Reach out to our team.
        </Text>

        <form onSubmit={(e) => e.preventDefault()}>
          <Stack gap="md">
            <TextInput label="Name" placeholder="Your name" required />
            <TextInput label="Email" placeholder="your@email.com" required />
            <Textarea label="Message" placeholder="How can we help?" minRows={4} required />
            <Group justify="flex-end">
              <Button type="submit">Send Message</Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
