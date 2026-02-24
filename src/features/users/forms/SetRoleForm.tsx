import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Group, Select, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useUsersApi } from '../hooks';
import { User, UserRolePayload } from '../types';

const SetRoleSchema = z.object({
  userId: z.string(),
  role: z.string().nullable(),
});

type SetRoleFormProps = {
  user: User;
  onSuccess?: (user: User) => void;
  closeWorkspace?: () => void;
};

const SetRoleForm: React.FC<SetRoleFormProps> = ({ user, onSuccess, closeWorkspace }) => {
  const form = useForm<UserRolePayload>({
    defaultValues: {
      userId: user.id,
      role: user.role ?? null,
    },
    resolver: zodResolver(SetRoleSchema),
  });

  const { setRole } = useUsersApi();

  const handleSubmit: SubmitHandler<UserRolePayload> = async (data) => {
    try {
      const { data: responseData, error } = await setRole(data);
      if (error) {
        showNotification({
          title: 'Error',
          color: 'red',
          message: error.message || 'Failed to set role',
        });
        return;
      }
      const updatedUser = (responseData as any)?.user || responseData;
      onSuccess?.(updatedUser);
      showNotification({
        title: 'Success',
        color: 'green',
        message: `Role for ${user.name} updated successfully.`,
      });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<UserRolePayload>(error);
      if (e.detail) {
        showNotification({
          title: 'Error updating role',
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof UserRolePayload, { message: val })
        );
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack p="md" h="100%" justify="space-between">
        <Stack gap="md">
          <Controller
            control={form.control}
            name="role"
            render={({ field, fieldState }) => (
              <Select
                data={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'user', label: 'User' },
                  // Add more roles here as needed depending on the backend definition
                ]}
                label={`Select Role for ${user.name}`}
                value={field.value}
                placeholder="User Role"
                onChange={(_value) => field.onChange(_value)}
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
            radius={0}
            flex={1}
            fullWidth
            type="submit"
            variant="filled"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default SetRoleForm;
