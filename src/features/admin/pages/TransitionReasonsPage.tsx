import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { ActionIcon, Badge, Group, Menu, Select, Stack, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  DashboardPageHeader,
  launchWorkspace,
  StateFullDataTable,
  SystemAuthorized,
  TablerIcon,
} from '@/components';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { TransitionReasonForm } from '../forms/TransitionReasonForm';
import { useTransitionReasons, useTransitionReasonsApi, useTransitionReasonEntityTypes } from '../hooks/useTransitionReasons';
import { TransitionReason } from '../types';

const TransitionReasonsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, search, searchInput, setSearchInput, setPage, setPageSize } =
    useTableUrlFilters();

  const entityType = searchParams.get('entityType') || null;
  const auto = searchParams.get('auto') || null;
  const fromStatus = searchParams.get('fromStatus') || null;
  const toStatus = searchParams.get('toStatus') || null;

  const transitionReasonsAsync = useTransitionReasons({
    page,
    limit: pageSize,
    search,
    entityType,
    auto: auto === 'true' ? true : auto === 'false' ? false : undefined,
    fromStatus,
    toStatus,
  });

  const { entityTypes } = useTransitionReasonEntityTypes();

  const setFilter = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const { deleteTransitionReason, restoreTransitionReason, mutateTransitionReasons } = useTransitionReasonsApi();
  const { hasAccess } = useUserHasSystemAccess({ transitionReason: ['create'] });

  const handleDelete = (reason: TransitionReason) => {
    modals.openConfirmModal({
      title: 'Delete Transition Reason',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the reason <b>{reason.label}</b>? This may affect existing logs but new transitions won't be able to use it.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteTransitionReason(reason.id);
          showNotification({
            title: 'Success',
            message: 'Transition reason deleted successfully',
            color: 'green',
          });
          mutateTransitionReasons();
        } catch (error) {
          const e = handleApiErrors(error);
          showNotification({
            title: 'Error',
            message: e.detail || 'Failed to delete reason',
            color: 'red',
          });
        }
      },
    });
  };

  const handleRestore = async (reason: TransitionReason) => {
    try {
      await restoreTransitionReason(reason.id);
      showNotification({
        title: 'Success',
        message: 'Transition reason restored successfully',
        color: 'green',
      });
      mutateTransitionReasons();
    } catch (error) {
      const e = handleApiErrors(error);
      showNotification({
        title: 'Error',
        message: e.detail || 'Failed to restore reason',
        color: 'red',
      });
    }
  };

  const handleLaunchFormWorkspace = (reason?: TransitionReason) => {
    const closeWorkspace = launchWorkspace(
      <TransitionReasonForm closeWorkspace={() => closeWorkspace()} transitionReason={reason} />,
      {
        width: 'narrow',
        title: reason ? 'Edit Transition Reason' : 'Create Transition Reason',
      }
    );
  };

  const columns = useMemo<ColumnDef<TransitionReason>[]>(
    () => [
      {
        header: 'Label',
        accessorKey: 'label',
        cell: ({ row: { original } }) => (
          <Stack gap={0}>
            <Text size="sm" fw={600}>{original.label}</Text>
            <Text size="xs" c="dimmed" ff="monospace">{original.code}</Text>
          </Stack>
        ),
      },
      {
        header: 'Entity Type',
        accessorKey: 'entityType',
        cell: ({ row: { original } }) => (
          <Badge size="xs" variant="light">{original.entityType}</Badge>
        ),
      },
      {
        header: 'Transition',
        id: 'transition',
        cell: ({ row: { original } }) => (
          <Group gap={4}>
            <Badge size="xs" color="gray" variant="outline">{original.fromStatus}</Badge>
            <TablerIcon name="arrowRight" size={10} />
            <Badge size="xs" color="blue" variant="outline">{original.toStatus}</Badge>
          </Group>
        ),
      },
      {
        header: 'Auto',
        accessorKey: 'auto',
        cell: ({ row: { original } }) => (
          original.auto ? <Badge size="xs" color="teal">Auto</Badge> : <Badge size="xs" color="gray">Manual</Badge>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'voided',
        cell: ({ row: { original } }) => (
          original.voided ? <Badge size="xs" color="red">Voided</Badge> : <Badge size="xs" color="green">Active</Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row: { original } }) => (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <TablerIcon name="dots" size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Actions</Menu.Label>
              <Menu.Divider />
              <SystemAuthorized permissions={{ transitionReason: ['update'] }} unauthorizedAction={{ type: 'hide' }}>
                <Menu.Item leftSection={<TablerIcon name="edit" size={14} />} onClick={() => handleLaunchFormWorkspace(original)}>
                  Edit
                </Menu.Item>
              </SystemAuthorized>
              {!original.voided ? (
                <SystemAuthorized permissions={{ transitionReason: ['delete'] }} unauthorizedAction={{ type: 'hide' }}>
                  <Menu.Item color="red" leftSection={<TablerIcon name="trash" size={14} />} onClick={() => handleDelete(original)}>
                    Delete
                  </Menu.Item>
                </SystemAuthorized>
              ) : (
                <SystemAuthorized permissions={{ transitionReason: ['restore'] }} unauthorizedAction={{ type: 'hide' }}>
                  <Menu.Item color="green" leftSection={<TablerIcon name="history" size={14} />} onClick={() => handleRestore(original)}>
                    Restore
                  </Menu.Item>
                </SystemAuthorized>
              )}
            </Menu.Dropdown>
          </Menu>
        ),
        size: 0,
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Status Transition Reasons"
        subTitle="Manage pre-defined reasons for changing case or match statuses"
        icon="messageQuestion"
      />
      <StateFullDataTable
        {...transitionReasonsAsync}
        data={transitionReasonsAsync.transitionReasons}
        columns={columns}
        renderActions={() => (
           <Group gap="xs">
            <TextInput
              placeholder="Search reasons..."
              leftSection={<TablerIcon name="search" size={14} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="xs"
              w={200}
            />
            <Select
              placeholder="Entity Type"
              data={[
                { label: 'All Entities', value: '' },
                ...entityTypes.map((type) => ({
                  label: type === '*' ? 'Global (*)' : type,
                  value: type,
                })),
              ]}
              value={entityType}
              onChange={(v) => setFilter('entityType', v)}
              size="xs"
              w={140}
              clearable
            />
            <Select
              placeholder="Source"
              data={[
                { label: 'All Sources', value: '' },
                { label: 'System (Auto)', value: 'true' },
                { label: 'Staff (Manual)', value: 'false' },
              ]}
              value={auto}
              onChange={(v) => setFilter('auto', v)}
              size="xs"
              w={130}
              clearable
            />
            <TextInput
              placeholder="From Status"
              value={fromStatus || ''}
              onChange={(e) => setFilter('fromStatus', e.target.value)}
              size="xs"
              w={120}
            />
            <TextInput
              placeholder="To Status"
              value={toStatus || ''}
              onChange={(e) => setFilter('toStatus', e.target.value)}
              size="xs"
              w={120}
            />
          </Group>
        )}
        onAdd={hasAccess ? () => handleLaunchFormWorkspace() : undefined}
        pagination={{
            totalCount: transitionReasonsAsync.totalCount,
            currentPage: page,
            pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
      />
    </Stack>
  );
};

export default TransitionReasonsPage;
