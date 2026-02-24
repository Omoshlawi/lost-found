import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import useAuthClent from '@/lib/api/useAuthClent';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const form = useForm<ForgotPasswordFormData>({
    defaultValues: { email: '' },
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { forgetPassword } = useAuthClent();
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      const { error } = await forgetPassword({
        email: data.email,
        redirectTo: '/reset-password',
      });

      if (error) {
        showNotification({
          title: 'Error',
          message: error.message || 'Failed to send reset email',
          color: 'red',
        });
        return;
      }

      showNotification({
        title: 'Check your email',
        message: 'A password reset link has been sent to your email address.',
        color: 'green',
      });
      // Optionally navigate back to login or stay here and show a success message
      navigate('/login');
    } catch (e: any) {
      showNotification({
        title: 'Error sending reset email',
        message: e?.message || 'An unexpected error occurred',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Stack gap="md" p="md">
        <Stack align="center" gap={0} mb="md">
          <Title order={3}>Forgot your password?</Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Enter your email address to receive a link to reset your password.
          </Text>
        </Stack>

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Email"
              placeholder="hello@example.com"
              error={fieldState.error?.message}
              leftSection={<TablerIcon name="mail" size={16} />}
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
          Send reset link
        </Button>
        <Group justify="center" mt="md">
          <Text size="sm">Remembered your password?</Text>
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

export default ForgotPasswordForm;
