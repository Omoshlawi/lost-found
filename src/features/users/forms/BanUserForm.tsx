import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, NumberInput, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useUsersApi } from '../hooks';
import { BanUserFormData, User } from '../types';
import { BanUserSchema } from '../utils';

type BanUserFormProps = {
  user: User;
  onSuccess?: (user: User) => void;
  closeWorkspace?: () => void;
};

const BanUserForm: React.FC<BanUserFormProps> = ({ user, onSuccess, closeWorkspace }) => {
  const form = useForm<BanUserFormData>({
    defaultValues: {
      userId: user.id,
      banReason: user.banReason ?? '',
      banExpiresIn: undefined,
    },
    resolver: zodResolver(BanUserSchema),
  });

  const { banUser, unbanUser } = useUsersApi();

  const handleSubmit: SubmitHandler<BanUserFormData> = async (data) => {
    try {
      const { data: responseData, error } = await banUser(data);
      if (error) {
        showNotification({ title: 'Error', color: 'red', message: error.message || 'Failed to ban user' });
        return;
      }
      const updatedUser = (responseData as any)?.user || responseData;
      onSuccess?.(updatedUser);
      showNotification({ title: 'Success', color: 'green', message: `User ${user.name} banned successfully.` });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<BanUserFormData>(error);
      if (e.detail) {
        showNotification({ title: 'Error banning user', message: e.detail, color: 'red', position: 'top-right' });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof BanUserFormData, { message: val })
        );
      }
    }
  };

  const handleUnban = async () => {
    try {
      const { data: responseData, error } = await unbanUser(user.id);
      if (error) {
        showNotification({ title: 'Error', color: 'red', message: error.message || 'Failed to unban user' });
        return;
      }
      const updatedUser = (responseData as any)?.user || responseData;
      onSuccess?.(updatedUser);
      showNotification({ title: 'Success', color: 'green', message: `User ${user.name} unbanned successfully.` });
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<{}>(error);
      if (e.detail) {
        showNotification({ title: 'Error unbanning user', message: e.detail, color: 'red', position: 'top-right' });
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
            name="banReason"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Reason for banning"
                placeholder="Violation of terms of service"
                error={fieldState.error?.message}
                disabled={user.banned}
              />
            )}
          />
          <Controller
            control={form.control}
            name="banExpiresIn"
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                label="Ban duration (in seconds)"
                placeholder="Leave empty for permanent"
                error={fieldState.error?.message}
                disabled={user.banned}
              />
            )}
          />
        </Stack>
        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={closeWorkspace}>
            Cancel
          </Button>
          {user.banned ? (
            <Button flex={1} radius={0} onClick={handleUnban} color="green" variant="filled">
              Unban User
            </Button>
          ) : (
            <Button
              flex={1}
              radius={0}
              type="submit"
              color="red"
              variant="filled"
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
            >
              Ban User
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  );
};

export default BanUserForm;
