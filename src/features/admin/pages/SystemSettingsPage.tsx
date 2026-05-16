import { ColumnDef } from '@tanstack/react-table';
import { ActionIcon, Badge, Menu, Text } from '@mantine/core';
import {
  DashboardPageHeader,
  launchWorkspace,
  StateFullDataTable,
  SystemAuthorized,
  TablerIcon,
} from '@/components';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { SystemSettingForm } from '../forms';
import { useSystemSettings } from '../hooks';
import { SystemSetting } from '../types';

const SystemSettingsPage = () => {
  const { page, pageSize, setPage, setPageSize } = useTableUrlFilters();
  const settingsAsync = useSystemSettings({ page, limit: pageSize });
  const { hasAccess } = useUserHasSystemAccess({ setting: ['manage-system'] });

  const handleLaunchForm = (setting?: SystemSetting) => {
    const closeWorkspace = launchWorkspace(
      <SystemSettingForm setting={setting} closeWorkspace={() => closeWorkspace()} />,
      { width: 'narrow', title: setting ? `Edit: ${setting.key}` : 'New Setting' }
    );
  };

  return (
    <div>
      <DashboardPageHeader
        title="System Settings"
        subTitle="View and edit runtime configuration variables"
        icon="adjustments"
      />
      <StateFullDataTable
        {...settingsAsync}
        data={settingsAsync.settings}
        columns={[
          ...columns,
          {
            header: '',
            id: 'actions',
            cell: ({ row: { original: setting } }: { row: { original: SystemSetting } }) => (
              <SystemAuthorized
                permissions={{ setting: ['manage-system'] }}
                unauthorizedAction={{ type: 'hide' }}
              >
                <Menu shadow="md" width={160}>
                  <Menu.Target>
                    <ActionIcon variant="subtle" aria-label="Actions">
                      <TablerIcon name="dots" style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Actions</Menu.Label>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<TablerIcon name="edit" size={14} />}
                      color="green"
                      onClick={() => handleLaunchForm(setting)}
                    >
                      Edit
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </SystemAuthorized>
            ),
            size: 0,
          },
        ]}
        onAdd={hasAccess ? () => handleLaunchForm() : undefined}
        pagination={{
          totalCount: settingsAsync.totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
};

export default SystemSettingsPage;

const columns: ColumnDef<SystemSetting>[] = [
  {
    header: 'Key',
    accessorKey: 'key',
    cell: ({ row: { original: s } }) => (
      <Badge variant="light" color="civicBlue" radius={0} tt="none" fw={500}>
        {s.key}
      </Badge>
    ),
  },
  {
    header: 'Value',
    accessorKey: 'value',
    cell: ({ row: { original: s } }) => (
      <Text size="sm" ff="monospace">
        {s.value}
      </Text>
    ),
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: ({ row: { original: s } }) => (
      <Text size="sm" c="dimmed">
        {s.description ?? '—'}
      </Text>
    ),
  },
  {
    header: 'Public',
    accessorKey: 'isPublic',
    cell: ({ row: { original: s } }) => (
      <TablerIcon
        name={s.isPublic ? 'circleDashedCheck' : 'circleDashedX'}
        color={s.isPublic ? 'green' : 'gray'}
      />
    ),
  },
  {
    header: 'Last Updated',
    accessorKey: 'updatedAt',
    cell: ({ row: { original: s } }) => new Date(s.updatedAt).toDateString(),
  },
];
