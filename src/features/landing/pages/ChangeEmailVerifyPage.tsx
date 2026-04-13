import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, Loader, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { authClient } from '@/lib/api';
import { TablerIcon } from '@/components';

type Status = 'verifying' | 'success' | 'error';

const ChangeEmailVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorMessage('This verification link is invalid or has expired.');
      setStatus('error');
      return;
    }

    authClient.verifyEmail({ query: { token } }).then(({ error }) => {
      if (error) {
        setErrorMessage(error.message || 'This verification link is invalid or has expired.');
        setStatus('error');
      } else {
        setStatus('success');
        showNotification({
          title: 'Email address updated',
          message: 'Your email address has been successfully changed.',
          color: 'green',
          position: 'top-right',
        });
        setTimeout(() => navigate('/dashboard/settings', { replace: true }), 2000);
      }
    });
  }, [token, navigate]);

  return (
    <Stack gap="xl" align="center" py="xl">
      {status === 'verifying' && (
        <>
          <ThemeIcon size={64} variant="light" color="civicBlue">
            <Loader size="md" color="civicBlue" />
          </ThemeIcon>
          <Stack gap="xs" align="center">
            <Title order={2} fw={700} ta="center">
              Verifying New Email
            </Title>
            <Text size="sm" c="dimmed" ta="center" maw={320}>
              Please wait while we verify your new email address…
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
              Email Updated!
            </Title>
            <Text size="sm" c="dimmed" ta="center" maw={320}>
              Your email address has been successfully changed. Redirecting you to settings…
            </Text>
          </Stack>
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
          <Button
            component={Link}
            to="/dashboard/settings"
            variant="subtle"
            leftSection={<TablerIcon name="arrowLeft" size={16} />}
          >
            Back to Settings
          </Button>
        </>
      )}
    </Stack>
  );
};

export default ChangeEmailVerifyPage;
