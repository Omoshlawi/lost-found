import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, Box, Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { authClient } from '@/lib/api';
import { getNameInitials } from '@/lib/utils';
import { TablerIcon } from '@/components';

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
    defaultValues: { name: user?.name || '', email: user?.email || '' },
    values: { name: user?.name || '', email: user?.email || '' },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const { error } = await authClient.updateUser({ name: data.name });
      if (error) throw new Error(error.message);
      showNotification({
        title: 'Profile updated',
        message: 'Your profile information has been saved.',
        color: 'green',
      });
    } catch (error: any) {
      showNotification({
        title: 'Update failed',
        message: error.message || 'Failed to update profile.',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="lg">
      {/* Identity summary */}
      <Box
        style={(theme) => ({
          border: `1px solid var(--mantine-color-default-border)`,
          borderLeft: `3px solid var(--mantine-color-civicBlue-6)`,
          padding: 'var(--mantine-spacing-md)',
          backgroundColor: 'var(--mantine-color-body)',
        })}
      >
        <Group gap="md">
          <Avatar
            size={48}
            color="civicBlue"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 }}
          >
            {user?.name ? getNameInitials(user.name) : '?'}
          </Avatar>
          <Box>
            <Text fw={600} size="sm" c="civicNavy.7">
              {user?.name || '—'}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.email || '—'}
            </Text>
          </Box>
        </Group>
      </Box>

      {/* Edit form */}
      <Box
        component="form"
        onSubmit={form.handleSubmit(onSubmit)}
        style={{
          border: '1px solid var(--mantine-color-default-border)',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <Stack gap="lg" p="xl">
          <TextInput
            label="Full Name"
            description="Your display name visible across the platform."
            placeholder="Your full name"
            size="md"
            {...form.register('name')}
            error={form.formState.errors.name?.message}
          />

          <Divider label="Account" labelPosition="left" />

          <TextInput
            label="Email Address"
            description="Email address cannot be changed at this time."
            placeholder="your.email@example.com"
            size="md"
            disabled
            leftSection={<TablerIcon name="lock" size={16} stroke={1.5} />}
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />
        </Stack>

        <Group
          justify="flex-end"
          px="xl"
          py="md"
          style={{
            borderTop: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <Button
            type="submit"
            size="md"
            loading={form.formState.isSubmitting}
            leftSection={<TablerIcon name="check" size={16} stroke={2} />}
          >
            Save Changes
          </Button>
        </Group>
      </Box>
    </Stack>
  );
};

export default ProfileSettings;
