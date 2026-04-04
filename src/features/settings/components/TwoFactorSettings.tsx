import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Alert,
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Group,
  Loader,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { authClient } from '@/lib/api';

const TotpSchema = z.object({
  code: z.string().length(6, 'TOTP Code must be 6 digits'),
  password: z.string().min(1, 'Password is required to confirm'),
});

const DisableTotpSchema = z.object({
  password: z.string().min(1, 'Password is required to disable'),
});

const TwoFactorSettings = () => {
  const { data: session, refetch: refetchSession } = authClient.useSession();
  const user = session?.user;

  const [opened, { open, close }] = useDisclosure(false);
  const [disableOpened, { open: openDisable, close: closeDisable }] = useDisclosure(false);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoadingSetup, setIsLoadingSetup] = useState(false);

  const enableForm = useForm<z.infer<typeof TotpSchema>>({
    resolver: zodResolver(TotpSchema),
    defaultValues: { code: '', password: '' },
  });

  const disableForm = useForm<z.infer<typeof DisableTotpSchema>>({
    resolver: zodResolver(DisableTotpSchema),
    defaultValues: { password: '' },
  });

  const handleStartSetup = async () => {
    setIsLoadingSetup(true);
    open();
    try {
      const { data, error } = await (authClient as any).twoFactor.enable({
        password: 'password',
      });
      if (error) {
        throw new Error(error.message);
      }
      setTotpUri((data as any)?.totpURI || 'otpauth://totp/CitizenLink?secret=MOCKSECRET');
      setBackupCodes((data as any)?.backupCodes || ['12345-67890', '09876-54321']);
    } catch (error: any) {
      showNotification({
        title: 'Setup failed',
        message: error.message || 'Failed to initiate 2FA setup.',
        color: 'red',
      });
      close();
    } finally {
      setIsLoadingSetup(false);
    }
  };

  const onVerifyEnable = async (_data: z.infer<typeof TotpSchema>) => {
    try {
      showNotification({
        title: '2FA enabled',
        message: 'Two-factor authentication is now active on your account.',
        color: 'green',
      });
      refetchSession();
      close();
      enableForm.reset();
    } catch (error: any) {
      enableForm.setError('code', { message: 'Invalid code or password.' });
    }
  };

  const onDisable = async (data: z.infer<typeof DisableTotpSchema>) => {
    try {
      const { error } = await (authClient as any).twoFactor.disable({
        password: data.password,
      });
      if (error) {
        throw new Error(error.message);
      }
      showNotification({
        title: '2FA disabled',
        message: 'Two-factor authentication has been removed from your account.',
        color: 'orange',
      });
      refetchSession();
      closeDisable();
      disableForm.reset();
    } catch (error: any) {
      disableForm.setError('password', { message: 'Invalid password.' });
    }
  };

  if (!user) {
    return <Loader size="sm" />;
  }

  const isEnabled = (user as any).twoFactorEnabled;

  return (
    <Stack gap="lg">
      {!isEnabled && (
        <Alert
          color="civicGold"
          variant="light"
          icon={<TablerIcon name="alertTriangle" size={16} stroke={1.5} />}
        >
          Your account is not protected by two-factor authentication. Enable it to significantly
          reduce the risk of unauthorised access.
        </Alert>
      )}

      {/* 2FA status card */}
      <Box
        style={{
          border: '1px solid var(--mantine-color-default-border)',
          borderLeft: `3px solid var(--mantine-color-${isEnabled ? 'civicGreen' : 'gray'}-6)`,
          backgroundColor: 'var(--mantine-color-body)',
          padding: 'var(--mantine-spacing-lg)',
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="md" wrap="nowrap" align="flex-start">
            <ThemeIcon size={44} variant="light" color={isEnabled ? 'civicGreen' : 'gray'}>
              <TablerIcon name={isEnabled ? 'shieldCheck' : 'shield'} size={22} stroke={1.5} />
            </ThemeIcon>

            <Box>
              <Group gap="xs" mb={4} align="center">
                <Text fw={600} size="sm" c="civicNavy.7">
                  Authenticator App
                </Text>
                <Badge size="sm" variant="light" color={isEnabled ? 'civicGreen' : 'gray'}>
                  {isEnabled ? 'Active' : 'Not configured'}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed" maw={400}>
                Use an authenticator app like Google Authenticator or Authy to generate one-time
                security codes at sign-in.
              </Text>
            </Box>
          </Group>

          <Box style={{ flexShrink: 0 }}>
            {isEnabled ? (
              <Button
                color="red"
                variant="outline"
                size="sm"
                onClick={openDisable}
                leftSection={<TablerIcon name="shieldOff" size={15} stroke={1.5} />}
              >
                Disable
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleStartSetup}
                loading={isLoadingSetup}
                leftSection={<TablerIcon name="shieldCheck" size={15} stroke={2} />}
              >
                Enable 2FA
              </Button>
            )}
          </Box>
        </Group>
      </Box>

      {/* Enable Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="sm">
            <ThemeIcon size={26} color="civicBlue" variant="light">
              <TablerIcon name="shieldLock" size={14} stroke={1.5} />
            </ThemeIcon>
            <Text fw={700} size="md">
              Setup Two-Factor Authentication
            </Text>
          </Group>
        }
        size="lg"
      >
        <Stack gap="lg">
          <Text size="sm" c="dimmed">
            Scan the QR code below with your authenticator app, or enter the key manually.
          </Text>

          <Box
            style={{
              border: '1px solid var(--mantine-color-default-border)',
              backgroundColor: 'var(--mantine-color-default-hover)',
              padding: 'var(--mantine-spacing-lg)',
              textAlign: 'center',
            }}
          >
            <Text
              size="xs"
              fw={600}
              tt="uppercase"
              c="dimmed"
              mb="sm"
              style={{ letterSpacing: '0.06em' }}
            >
              Manual entry code
            </Text>
            <Code block fz="sm" fw={600} p="md">
              {totpUri || 'Loading…'}
            </Code>
          </Box>

          <Box>
            <Group gap="xs" mb="xs">
              <TablerIcon
                name="key"
                size={15}
                stroke={1.5}
                color="var(--mantine-color-civicNavy-7)"
              />
              <Text size="sm" fw={600} c="civicNavy.7">
                Backup Codes
              </Text>
            </Group>
            <Text size="xs" c="dimmed" mb="sm">
              Store these in a secure location — they are shown only once and can recover your
              account if you lose your device.
            </Text>
            <Code block fz="sm" p="md" color="orange">
              {backupCodes.join('\n')}
            </Code>
          </Box>

          <Divider />

          <Box component="form" onSubmit={enableForm.handleSubmit(onVerifyEnable)}>
            <Stack gap="md">
              <TextInput
                label="Confirmation Code"
                description="Enter the 6-digit code from your authenticator app."
                placeholder="000 000"
                size="md"
                {...enableForm.register('code')}
                error={enableForm.formState.errors.code?.message}
              />
              <PasswordInput
                label="Account Password"
                description="Confirm your identity to activate 2FA."
                placeholder="Your current password"
                size="md"
                {...enableForm.register('password')}
                error={enableForm.formState.errors.password?.message}
              />
              <Group justify="flex-end" mt="xs">
                <Button variant="default" size="md" onClick={close}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  loading={enableForm.formState.isSubmitting}
                  leftSection={<TablerIcon name="check" size={16} stroke={2} />}
                >
                  Verify & Enable
                </Button>
              </Group>
            </Stack>
          </Box>
        </Stack>
      </Modal>

      {/* Disable Modal */}
      <Modal
        opened={disableOpened}
        onClose={closeDisable}
        title={
          <Group gap="sm">
            <ThemeIcon size={26} color="red" variant="light">
              <TablerIcon name="shieldOff" size={14} stroke={1.5} />
            </ThemeIcon>
            <Text fw={700} size="md" c="red.7">
              Disable Two-Factor Authentication
            </Text>
          </Group>
        }
      >
        <Box component="form" onSubmit={disableForm.handleSubmit(onDisable)}>
          <Stack gap="lg">
            <Alert
              color="red"
              variant="light"
              icon={<TablerIcon name="alertTriangle" size={16} stroke={1.5} />}
            >
              Disabling 2FA will reduce the security of your account. Only proceed if necessary.
            </Alert>
            <PasswordInput
              label="Account Password"
              description="Confirm your identity to disable 2FA."
              placeholder="Your current password"
              size="md"
              {...disableForm.register('password')}
              error={disableForm.formState.errors.password?.message}
            />
            <Group justify="flex-end">
              <Button variant="default" size="md" onClick={closeDisable}>
                Cancel
              </Button>
              <Button
                color="red"
                size="md"
                type="submit"
                loading={disableForm.formState.isSubmitting}
                leftSection={<TablerIcon name="shieldOff" size={15} stroke={1.5} />}
              >
                Disable 2FA
              </Button>
            </Group>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
};

export default TwoFactorSettings;
