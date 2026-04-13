import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Group, PasswordInput, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useUsersApi } from '../hooks';
import { User } from '../types';

const ChangePasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm the password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangeUserPasswordFormProps = {
  user: User;
  onSuccess?: () => void;
  closeWorkspace?: () => void;
};

const ChangeUserPasswordForm: React.FC<ChangeUserPasswordFormProps> = ({
  user,
  onSuccess,
  closeWorkspace,
}) => {
  const form = useForm({
    defaultValues: { newPassword: '', confirmPassword: '' },
    resolver: zodResolver(ChangePasswordSchema),
  });

  const { setUserPassword } = useUsersApi();

  const handleSubmit: SubmitHandler<z.infer<typeof ChangePasswordSchema>> = async (data) => {
    try {
      const { error } = await setUserPassword(user.id, data.newPassword);
      if (error) {
        showNotification({
          title: 'Error',
          color: 'red',
          message: error.message || 'Failed to update password',
        });
        return;
      }
      onSuccess?.();
      showNotification({
        title: 'Password updated',
        color: 'green',
        message: `Password for ${user.name} has been changed. Their active sessions remain valid.`,
      });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<z.infer<typeof ChangePasswordSchema>>(error);
      if (e.detail) {
        showNotification({
          title: 'Error changing password',
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof z.infer<typeof ChangePasswordSchema>, { message: val })
        );
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <Stack p="md" h="100%" justify="space-between">
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Setting a new password for{' '}
            <Text span fw={600} c="inherit">
              {user.name}
            </Text>
            . Their existing sessions will remain active.
          </Text>
          <PasswordInput
            label="New Password"
            placeholder="Min. 8 characters"
            {...form.register('newPassword')}
            error={form.formState.errors.newPassword?.message}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter new password"
            {...form.register('confirmPassword')}
            error={form.formState.errors.confirmPassword?.message}
          />
        </Stack>
        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={closeWorkspace}>
            Cancel
          </Button>
          <Button
            flex={1}
            radius={0}
            type="submit"
            variant="filled"
            color="blue"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Set Password
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ChangeUserPasswordForm;
