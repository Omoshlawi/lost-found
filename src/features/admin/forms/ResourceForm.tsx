import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useResourcesApi } from '../hooks/useRoleRecords';
import { Resource, ResourceActionFormData, ResourceFormData } from '../types';
import { ResourceActionSchema, ResourceSchema } from '../utils';

interface ResourceFormProps {
  resource?: Resource;
  closeWorkspace: () => void;
}

const ActionRow: React.FC<{
  action: Resource['actions'][0];
  onEdit: () => void;
  onDelete: () => void;
  onRestore: () => void;
}> = ({ action, onEdit, onDelete, onRestore }) => (
  <Group justify="space-between" wrap="nowrap">
    <Group gap="xs">
      <Stack gap={0}>
        <Text size="sm">{action.name}</Text>
        <Text size="xs" ff="monospace" c="dimmed">
          {action.slug}
        </Text>
      </Stack>
      {action.isBuiltIn && (
        <Tooltip label="Built-in — cannot delete">
          <Badge size="xs" variant="dot" color="gray">
            Built-in
          </Badge>
        </Tooltip>
      )}
      {action.voided && (
        <Badge size="xs" color="red">
          Voided
        </Badge>
      )}
    </Group>
    <Group gap={4}>
      {!action.isBuiltIn && !action.voided && (
        <ActionIcon size="sm" variant="subtle" onClick={onEdit}>
          <TablerIcon name="edit" size={14} />
        </ActionIcon>
      )}
      {!action.isBuiltIn && !action.voided && (
        <ActionIcon size="sm" variant="subtle" color="red" onClick={onDelete}>
          <TablerIcon name="trash" size={14} />
        </ActionIcon>
      )}
      {!action.isBuiltIn && action.voided && (
        <ActionIcon size="sm" variant="subtle" color="green" onClick={onRestore}>
          <TablerIcon name="history" size={14} />
        </ActionIcon>
      )}
    </Group>
  </Group>
);

const AddActionForm: React.FC<{ onSave: (data: ResourceActionFormData) => Promise<void> }> = ({
  onSave,
}) => {
  const form = useForm<ResourceActionFormData>({
    defaultValues: { name: '', slug: '', description: '' },
    resolver: zodResolver(ResourceActionSchema),
  });
  const nameValue = form.watch('name');
  useEffect(() => {
    form.setValue(
      'slug',
      nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    );
  }, [nameValue, form]);

  return (
    <Stack
      gap="xs"
      p="xs"
      style={{ border: '1px dashed var(--mantine-color-gray-4)', borderRadius: 4 }}
    >
      <Text size="xs" fw={600} c="dimmed">
        New Action
      </Text>
      <Group align="flex-start" grow>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <TextInput {...field} size="xs" placeholder="Name" error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <TextInput {...field} size="xs" placeholder="slug" error={fieldState.error?.message} />
          )}
        />
      </Group>
      <Group justify="flex-end">
        <Button size="xs" loading={form.formState.isSubmitting} onClick={form.handleSubmit(onSave)}>
          Add
        </Button>
      </Group>
    </Stack>
  );
};

export const ResourceForm: React.FC<ResourceFormProps> = ({ resource, closeWorkspace }) => {
  const {
    createResource,
    updateResource,
    createAction,
    deleteAction,
    restoreAction,
    mutateResources,
  } = useResourcesApi();
  const [actions, setActions] = useState<Resource['actions']>(resource?.actions ?? []);
  const [showAddAction, setShowAddAction] = useState(false);

  const form = useForm<ResourceFormData>({
    defaultValues: {
      name: resource?.name ?? '',
      slug: resource?.slug ?? '',
      description: resource?.description ?? '',
    },
    resolver: zodResolver(ResourceSchema),
  });

  const nameValue = form.watch('name');
  useEffect(() => {
    if (!resource) {
      form.setValue(
        'slug',
        nameValue
          .replace(/([a-z])([A-Z])/g, '$1$2')
          .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
          .replace(/\s/g, '')
      );
    }
  }, [nameValue, resource, form]);

  const handleSubmit: SubmitHandler<ResourceFormData> = async (data) => {
    try {
      if (resource) {
        await updateResource(resource.id, data);
      } else {
        await createResource(data);
      }
      showNotification({
        title: 'Success',
        message: resource ? 'Resource updated' : 'Resource created',
        color: 'green',
      });
      mutateResources();
      closeWorkspace();
    } catch (error) {
      const e = handleApiErrors<ResourceFormData>(error);
      if (e.detail) {
        showNotification({ title: 'Error', message: e.detail, color: 'red' });
      } else {
        Object.entries(e).forEach(([k, v]) =>
          form.setError(k as keyof ResourceFormData, { message: v })
        );
      }
    }
  };

  const handleAddAction = async (data: ResourceActionFormData) => {
    if (!resource) {
      return;
    }
    try {
      const created = await createAction(resource.id, data);
      setActions((prev) => [...prev, created!]);
      mutateResources();
      setShowAddAction(false);
    } catch (error) {
      const e = handleApiErrors(error);
      showNotification({
        title: 'Error',
        message: e.detail || 'Failed to add action',
        color: 'red',
      });
    }
  };

  const handleDeleteAction = (actionId: string) => {
    modals.openConfirmModal({
      title: 'Delete Action',
      children: (
        <Text size="sm">Delete this action? It will be removed from all role permissions.</Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteAction(actionId);
          setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, voided: true } : a)));
          mutateResources();
        } catch (error) {
          const e = handleApiErrors(error);
          showNotification({ title: 'Error', message: e.detail || 'Failed', color: 'red' });
        }
      },
    });
  };

  const handleRestoreAction = async (actionId: string) => {
    try {
      await restoreAction(actionId);
      setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, voided: false } : a)));
      mutateResources();
    } catch (error) {
      const e = handleApiErrors(error);
      showNotification({ title: 'Error', message: e.detail || 'Failed', color: 'red' });
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
                label="Name"
                placeholder="e.g. Document Case"
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
                placeholder="e.g. documentCase"
                description="camelCase — used in Better Auth"
                error={fieldState.error?.message}
                readOnly={resource?.isBuiltIn}
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
                placeholder="What does this resource represent?"
                error={fieldState.error?.message}
              />
            )}
          />

          {resource && (
            <>
              <Divider label="Actions" labelPosition="left" />
              <Stack gap="xs">
                {actions.map((action) => (
                  <ActionRow
                    key={action.id}
                    action={action}
                    onEdit={() => {}}
                    onDelete={() => handleDeleteAction(action.id)}
                    onRestore={() => handleRestoreAction(action.id)}
                  />
                ))}
                {showAddAction ? (
                  <AddActionForm onSave={handleAddAction} />
                ) : (
                  <Button
                    size="xs"
                    variant="subtle"
                    leftSection={<TablerIcon name="plus" size={14} />}
                    onClick={() => setShowAddAction(true)}
                  >
                    Add Action
                  </Button>
                )}
              </Stack>
            </>
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
            {resource ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
