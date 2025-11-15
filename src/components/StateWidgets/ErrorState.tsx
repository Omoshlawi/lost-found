import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { Button, Center, CenterProps, Stack, Text, ThemeIcon } from '@mantine/core';
import { handleApiErrors } from '@/lib/api';

interface ErrorStateProps extends CenterProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  error?: Error;
}

function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the data. Please try again.',
  onRetry,
  error,
  ...props
}: ErrorStateProps) {
  const _error = handleApiErrors(error ?? new Error(message));
  return (
    <Center py={60} {...props}>
      <Stack align="center" gap="md">
        <ThemeIcon size={64} radius="xl" variant="light" color="red">
          <IconAlertCircle size={32} />
        </ThemeIcon>
        <Stack align="center" gap="xs">
          <Text size="lg" fw={500} c="red">
            {title}
          </Text>
          <Text size="sm" c="dimmed" ta="center" maw={400}>
            {_error?.detail}
          </Text>
        </Stack>
        {onRetry && (
          <Button
            variant="light"
            color="red"
            leftSection={<IconRefresh size={16} />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </Stack>
    </Center>
  );
}

export default ErrorState;
