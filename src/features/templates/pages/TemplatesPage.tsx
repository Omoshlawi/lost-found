import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ActionIcon, Anchor, Badge, Button, Group, Menu, Select, Stack, TextInput } from '@mantine/core';
import {
  DashboardPageHeader,
  launchWorkspace,
  StateFullDataTable,
  SystemAuthorized,
  TablerIcon,
} from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { formatDate } from '@/lib/utils';
import TemplateForm from '../forms/TemplateForm';
import { useTemplates } from '../hooks';
import { Template } from '../types';

const TYPE_OPTIONS = [
  { value: 'notification', label: 'Notification' },
  { value: 'prompt', label: 'Prompt' },
  { value: 'print', label: 'Print' },
];

const TemplatesPage = () => {
  const { page, pageSize, search, searchInput, setSearchInput, searchParams, setFilter, setPage, setPageSize } =
    useTableUrlFilters();
  const typeFilter = searchParams.get('type') ?? null;

  const templatesAsync = useTemplates({
    page,
    limit: pageSize,
    search: search || undefined,
    type: typeFilter || undefined,
  });

  const handleLaunchTemplateForm = (template?: Template) => {
    const close = launchWorkspace(<TemplateForm template={template} onClose={() => close()} />, {
      title: template ? `Edit Template: ${template.name}` : 'Create Template',
      expandable: true,
      width: 'extra-wide',
    });
  };

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Templates"
        subTitle="Manage notification and prompt templates"
        icon="listNumbers"
      />
      <StateFullDataTable
        {...templatesAsync}
        data={templatesAsync.templates}
        columns={[
          ...columns,
          {
            id: 'actions',
            size: 40,
            cell: ({ row: { original: template } }) => (
              <Menu position="bottom-end" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="sm" aria-label="Row actions">
                    <TablerIcon name="dots" size={14} stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Actions</Menu.Label>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<TablerIcon name="eye" size={14} />}
                    component={Link}
                    to={template.key}
                  >
                    View Details
                  </Menu.Item>
                  <SystemAuthorized
                    permissions={{ templates: ['update'] }}
                    unauthorizedAction={{ type: 'hide' }}
                  >
                    <Menu.Item
                      leftSection={<TablerIcon name="edit" size={14} />}
                      onClick={() => handleLaunchTemplateForm(template)}
                    >
                      Edit
                    </Menu.Item>
                  </SystemAuthorized>
                  <SystemAuthorized
                    permissions={{ templates: ['delete'] }}
                    unauthorizedAction={{ type: 'hide' }}
                  >
                    <Menu.Divider />
                    <Menu.Item leftSection={<TablerIcon name="trash" size={14} />} color="red">
                      Delete
                    </Menu.Item>
                  </SystemAuthorized>
                </Menu.Dropdown>
              </Menu>
            ),
          },
        ]}
        renderActions={() => (
          <>
            <Group gap="xs">
              <TextInput
                placeholder="Search by name…"
                leftSection={<TablerIcon name="search" size={14} />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.currentTarget.value)}
                w={200}
              />
              <Select
                placeholder="All types"
                clearable
                data={TYPE_OPTIONS}
                value={typeFilter}
                onChange={(v) => setFilter('type', v)}
                w={150}
              />
            </Group>
            <SystemAuthorized
              permissions={{ templates: ['create'] }}
              unauthorizedAction={{ type: 'hide' }}
            >
              <Button
                variant="light"
                size="xs"
                leftSection={<TablerIcon name="plus" size={14} />}
                onClick={() => handleLaunchTemplateForm()}
              >
                Add
              </Button>
            </SystemAuthorized>
          </>
        )}
        pagination={{
          totalCount: templatesAsync.totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </Stack>
  );
};

export default TemplatesPage;

const columns: ColumnDef<Template>[] = [
  {
    header: '#',
    id: 'no',
    cell: ({ row, table }) => (table.getSortedRowModel().rows.indexOf(row) + 1).toString(),
    enableSorting: false,
    enableHiding: false,
    size: 0,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row: { original } }) => (
      <Anchor variant="subtle" component={Link} to={original.key} style={{ color: 'inherit' }}>
        {original.name}
      </Anchor>
    ),
  },
  {
    accessorKey: 'key',
    header: 'Key',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row: { original } }) => (
      <Badge
        variant="light"
        size="xs"
        color={
          original.type === 'notification'
            ? 'blue'
            : original.type === 'prompt'
              ? 'yellow'
              : original.type === 'print'
                ? 'teal'
                : 'gray'
        }
      >
        {original.type}
      </Badge>
    ),
  },
  {
    header: 'Version',
    accessorKey: 'version',
    cell: ({ row: { original } }) => original.version,
  },
  {
    header: 'Created',
    accessorKey: 'createdAt',
    cell: ({ row: { original } }) => formatDate(original.createdAt),
  },
  {
    header: 'Updated',
    accessorKey: 'updatedAt',
    cell: ({ row: { original } }) => formatDate(original.updatedAt),
  },
];
