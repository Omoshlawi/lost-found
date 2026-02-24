import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Box, Button, Group, Stack, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { authClient } from '@/lib/api';

const ProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

const ProfileSettings = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    values: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const { error } = await authClient.updateUser({
        name: data.name,
      });

      if (error) {
        throw new Error(error.message);
      }

      showNotification({
        title: 'Success',
        message: 'Profile updated successfully.',
        color: 'green',
      });
    } catch (error: any) {
      showNotification({
        title: 'Error',
        message: error.message || 'Failed to update profile.',
        color: 'red',
      });
    }
  };

  return (
    <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="Your full name"
          {...form.register('name')}
          error={form.formState.errors.name?.message}
        />
        <TextInput
          label="Email address"
          placeholder="your.email@example.com"
          disabled
          description="Email address cannot be changed currently."
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={form.formState.isSubmitting}>
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default ProfileSettings;
