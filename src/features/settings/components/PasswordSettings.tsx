import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Box, Button, Group, PasswordInput, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { authClient } from '@/lib/api';

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof PasswordSchema>;

const PasswordSettings = () => {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const { error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(error.message);
      }

      showNotification({
        title: 'Success',
        message: 'Password changed successfully. Other sessions have been revoked.',
        color: 'green',
      });
      form.reset();
    } catch (error: any) {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to change password.',
        color: 'red',
      });
    }
  };

  return (
    <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="md">
        <PasswordInput
          label="Current Password"
          {...form.register('currentPassword')}
          error={form.formState.errors.currentPassword?.message}
        />
        <PasswordInput
          label="New Password"
          {...form.register('newPassword')}
          error={form.formState.errors.newPassword?.message}
        />
        <PasswordInput
          label="Confirm Password"
          {...form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword?.message}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" color="dark" loading={form.formState.isSubmitting}>
            Save Password
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default PasswordSettings;
