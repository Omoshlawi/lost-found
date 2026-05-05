import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, PasswordInput, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useUsersApi } from '../hooks';
import { ChangePasswordFormData, User } from '../types';
import { ChangePasswordSchema } from '../utils';

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
  const form = useForm<ChangePasswordFormData>({
    defaultValues: { newPassword: '', confirmPassword: '' },
    resolver: zodResolver(ChangePasswordSchema),
  });

  const { setUserPassword } = useUsersApi();

  const handleSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
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
      const e = handleApiErrors<ChangePasswordFormData>(error);
      if (e.detail) {
        showNotification({
          title: 'Error changing password',
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof ChangePasswordFormData, { message: val })
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
          <Controller
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                label="New Password"
                placeholder="Min. 8 characters"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                label="Confirm Password"
                placeholder="Re-enter new password"
                error={fieldState.error?.message}
              />
            )}
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
