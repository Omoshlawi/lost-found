import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useResources, useRoleRecordsApi } from '../hooks/useRoleRecords';
import { RoleFormData, RoleRecord } from '../types';
import { RoleSchema } from '../utils';

interface RoleFormProps {
  role?: RoleRecord;
  closeWorkspace: () => void;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const RoleForm: React.FC<RoleFormProps> = ({ role, closeWorkspace }) => {
  const { createRole, updateRole, setRolePermissions, mutateRoles } = useRoleRecordsApi();
  const { resources } = useResources();

  // Selected resourceActionIds
  const initialSelected = useMemo(
    () => new Set(role?.permissions.map((p) => p.resourceActionId) ?? []),
    [role]
  );
  const [selected, setSelected] = useState<Set<string>>(initialSelected);

  const form = useForm<RoleFormData>({
    defaultValues: {
      name: role?.name ?? '',
      slug: role?.slug ?? '',
      description: role?.description ?? '',
    },
    resolver: zodResolver(RoleSchema),
  });

  // Auto-generate slug from name for new roles
  const nameValue = form.watch('name');
  useEffect(() => {
    if (!role) {
      form.setValue('slug', slugify(nameValue));
    }
  }, [nameValue, role, form]);

  const toggleAction = (actionId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };

  const handleSubmit: SubmitHandler<RoleFormData> = async (data) => {
    try {
      const saved = role ? await updateRole(role.id, data) : await createRole(data);

      await setRolePermissions(saved!.id, Array.from(selected));

      showNotification({
        title: 'Success',
        message: role ? 'Role updated' : 'Role created',
        color: 'green',
      });
      mutateRoles();
      closeWorkspace();
    } catch (error) {
      const e = handleApiErrors<RoleFormData>(error);
      if (e.detail) {
        showNotification({ title: 'Error', message: e.detail, color: 'red' });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof RoleFormData, { message: val })
        );
      }
    }
  };

  const isSystem = role && !role.canDelete;
  const canEditPerms = !role || role.canEditPermissions;

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
                label="Name"
                placeholder="e.g. Finance Officer"
                error={fieldState.error?.message}
                required
              />
            )}
          />
          <Controller
            control={form.control}
            name="slug"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Slug"
                placeholder="e.g. finance-officer"
                description="Used in user.role — must be kebab-case"
                error={fieldState.error?.message}
                readOnly={!!isSystem}
                required
              />
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                value={field.value ?? ''}
                label="Description"
                placeholder="What does this role do?"
                error={fieldState.error?.message}
              />
            )}
          />

          <Divider label="Permissions" labelPosition="left" />

          {!canEditPerms ? (
            <Text size="sm" c="dimmed">
              Permissions for this role are managed automatically.
            </Text>
          ) : (
            <ScrollArea h={360} offsetScrollbars>
              <Stack gap="sm">
                {resources.map((resource) => {
                  const activeActions = resource.actions.filter((a) => !a.voided);
                  if (activeActions.length === 0) {
                    return null;
                  }
                  return (
                    <Box key={resource.id}>
                      <Group gap="xs" mb={4}>
                        <Text size="sm" fw={600}>
                          {resource.name}
                        </Text>
                        <Text size="xs" ff="monospace" c="dimmed">
                          {resource.slug}
                        </Text>
                        {resource.isBuiltIn && (
                          <Tooltip label="Built-in resource">
                            <Badge size="xs" variant="dot" color="gray">
                              Built-in
                            </Badge>
                          </Tooltip>
                        )}
                      </Group>
                      <Stack gap={2} pl="sm">
                        {activeActions.map((action) => (
                          <Group key={action.id} gap="xs">
                            <Checkbox
                              size="xs"
                              checked={selected.has(action.id)}
                              onChange={() => toggleAction(action.id)}
                              label={
                                <Group gap={4}>
                                  <Text size="xs">{action.name}</Text>
                                  <Text size="xs" ff="monospace" c="dimmed">
                                    {action.slug}
                                  </Text>
                                  {action.isBuiltIn && (
                                    <TablerIcon name="lock" size={10} color="gray" />
                                  )}
                                </Group>
                              }
                            />
                          </Group>
                        ))}
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </ScrollArea>
          )}
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
            {role ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
