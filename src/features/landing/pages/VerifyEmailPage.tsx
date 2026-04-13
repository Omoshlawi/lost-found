import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Button, Loader, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { authClient } from '@/lib/api';
import { TablerIcon } from '@/components';

type Status = 'verifying' | 'success' | 'error';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorMessage('This verification link is invalid or has expired. Please request a new one.');
      setStatus('error');
      return;
    }

    authClient.verifyEmail({ query: { token } }).then(({ error }) => {
      if (error) {
        setErrorMessage(error.message || 'This verification link is invalid or has expired.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    });
  }, [token]);

  return (
    <Stack gap="xl" align="center" py="xl">
      {status === 'verifying' && (
        <>
          <ThemeIcon size={64} variant="light" color="civicBlue">
            <Loader size="md" color="civicBlue" />
          </ThemeIcon>
          <Stack gap="xs" align="center">
            <Title order={2} fw={700} ta="center">
              Verifying Your Email
            </Title>
            <Text size="sm" c="dimmed" ta="center" maw={320}>
              Please wait while we verify your email address…
            </Text>
          </Stack>
        </>
      )}

      {status === 'success' && (
        <>
          <ThemeIcon size={64} variant="light" color="civicGreen">
            <TablerIcon name="circleCheck" size={32} stroke={1.5} />
          </ThemeIcon>
          <Stack gap="xs" align="center">
            <Title order={2} fw={700} ta="center">
              Email Verified!
            </Title>
            <Text size="sm" c="dimmed" ta="center" maw={320}>
              Your email address has been verified successfully. You can now sign in to your account.
            </Text>
          </Stack>
          <Button component={Link} to="/login" leftSection={<TablerIcon name="login" size={16} />}>
            Proceed to Sign In
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <ThemeIcon size={64} variant="light" color="red">
            <TablerIcon name="alertCircle" size={32} stroke={1.5} />
          </ThemeIcon>
          <Stack gap="xs" align="center">
            <Title order={2} fw={700} ta="center">
              Verification Failed
            </Title>
          </Stack>
          <Alert
            color="red"
            icon={<TablerIcon name="alertCircle" size={16} />}
            maw={360}
            w="100%"
          >
            {errorMessage}
          </Alert>
          <Text
            component={Link}
            to="/login"
            size="sm"
            c="civicBlue.6"
            style={{ textDecoration: 'none' }}
          >
            Back to Sign In
          </Text>
        </>
      )}
    </Stack>
  );
};

export default VerifyEmailPage;
