import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Group, MultiSelect, PasswordInput, Stack, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useRoles } from '@/features/admin/hooks';
import { handleApiErrors } from '@/lib/api';
import { useUsersApi } from '../hooks';

const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roles: z.array(z.string()).default(['user']),
});

type CreateUserFormProps = {
  onSuccess?: () => void;
  closeWorkspace?: () => void;
};

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess, closeWorkspace }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      roles: ['user'],
    },
    resolver: zodResolver(CreateUserSchema),
  });

  const { roles } = useRoles();
  const { createUser } = useUsersApi();

  const handleSubmit: SubmitHandler<z.infer<typeof CreateUserSchema>> = async (data) => {
    try {
      const { error } = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.roles.join(','),
      });
      if (error) {
        showNotification({
          title: 'Error',
          color: 'red',
          message: error.message || 'Failed to create user',
        });
        return;
      }
      onSuccess?.();
      showNotification({
        title: 'User created',
        color: 'green',
        message: `${data.name} has been added successfully.`,
      });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<z.infer<typeof CreateUserSchema>>(error);
      if (e.detail) {
        showNotification({
          title: 'Error creating user',
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof z.infer<typeof CreateUserSchema>, { message: val })
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
          <TextInput
            label="Full Name"
            placeholder="Jane Doe"
            {...form.register('name')}
            error={form.formState.errors.name?.message}
          />
          <TextInput
            label="Email Address"
            placeholder="jane@example.com"
            type="email"
            {...form.register('email')}
            error={form.formState.errors.email?.message}
          />
          <PasswordInput
            label="Password"
            placeholder="Min. 8 characters"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
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
