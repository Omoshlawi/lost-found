import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, MultiSelect, PasswordInput, Stack, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useRoles } from '@/features/admin/hooks';
import { handleApiErrors } from '@/lib/api';
import { useUsersApi } from '../hooks';
import { CreateUserFormData } from '../types';
import { CreateUserSchema } from '../utils';

type CreateUserFormProps = {
  onSuccess?: () => void;
  closeWorkspace?: () => void;
};

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess, closeWorkspace }) => {
  const form = useForm<CreateUserFormData>({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      phoneNumber: '',
      password: '',
      roles: ['user'],
    },
    resolver: zodResolver(CreateUserSchema),
  });

  const { roles } = useRoles();
  const { createUser } = useUsersApi();

  const handleSubmit: SubmitHandler<CreateUserFormData> = async (data) => {
    try {
      const { error } = await createUser(data);
      if (error) {
        showNotification({ title: 'Error', color: 'red', message: error.message || 'Failed to create user' });
        return;
      }
      onSuccess?.();
      showNotification({ title: 'User created', color: 'green', message: `${data.name} has been added successfully.` });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<CreateUserFormData>(error);
      if (e.detail) {
        showNotification({ title: 'Error creating user', message: e.detail, color: 'red', position: 'top-right' });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof CreateUserFormData, { message: val })
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
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Full Name"
                placeholder="Jane Doe"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Username"
                placeholder="janedoe"
                description="Optional. Must be at least 3 characters."
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Email Address"
                placeholder="jane@example.com"
                type="email"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Phone Number"
                placeholder="712345678"
                description="Optional. Subscriber digits only, no country code."
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                label="Password"
                placeholder="Min. 8 characters"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="roles"
            render={({ field, fieldState }) => (
              <MultiSelect
                data={roles}
                label="Role(s)"
                placeholder="Select roles"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                ref={field.ref}
                clearable
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
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Create User
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CreateUserForm;
