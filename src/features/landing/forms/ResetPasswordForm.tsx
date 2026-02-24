import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button, Group, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import useAuthClent from '@/lib/api/useAuthClent';

const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordForm: React.FC = () => {
  const form = useForm<ResetPasswordFormData>({
    defaultValues: { password: '', confirmPassword: '' },
    resolver: zodResolver(ResetPasswordSchema),
  });

  const { resetPassword } = useAuthClent();
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      const { error } = await resetPassword({
        newPassword: data.password,
      });

      if (error) {
        showNotification({
          title: 'Error Resetting Password',
          message: error.message || 'Failed to reset password',
          color: 'red',
        });
        return;
      }

      showNotification({
        title: 'Success',
        message: 'Your password has been successfully reset.',
        color: 'green',
      });
      navigate('/login');
    } catch (e: any) {
      showNotification({
        title: 'Error Reseting Password',
        message: e?.message || 'An unexpected error occurred',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Stack gap="md" p="md">
        <Stack align="center" gap={0} mb="md">
          <Title order={3}>Reset your password</Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Enter your new password below.
          </Text>
        </Stack>

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <PasswordInput
              {...field}
              label="New Password"
              placeholder="Your new password"
              error={fieldState.error?.message}
              leftSection={<TablerIcon name="lock" size={16} />}
              required
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
              placeholder="Confirm your new password"
              error={fieldState.error?.message}
              leftSection={<TablerIcon name="lock" size={16} />}
              required
            />
          )}
        />

        <Button
          fullWidth
          type="submit"
          mt="xl"
          loading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          Reset Password
        </Button>
        <Group justify="center" mt="md">
          <Text
            component={Link}
            to="/login"
            size="sm"
            c="blue"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            Back to login
          </Text>
        </Group>
      </Stack>
    </form>
  );
};

export default ResetPasswordForm;
