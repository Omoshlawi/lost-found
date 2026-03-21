import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ActionIcon, Anchor, Badge, Box, Button, Menu, Paper, Stack } from '@mantine/core';
import {
  DashboardPageHeader,
  launchWorkspace,
  StateFullDataTable,
  SystemAuthorized,
  TablerIcon,
} from '@/components';
import { useAppColors } from '@/hooks/useAppColors';
import { formatDate } from '@/lib/utils';
import TemplateForm from '../forms/TemplateForm';
import { useTemplates } from '../hooks';
import { Template } from '../types';

const TemplatesPage = () => {
  const templatesAsync = useTemplates();
  const { bgColor } = useAppColors();

  const handleLauchTemplateForm = (template?: Template) => {
    const close = launchWorkspace(<TemplateForm template={template} onClose={() => close()} />, {
      title: template ? `Edit Template: ${template.name}` : 'Create Template',
      expandable: true,
      width: 'extra-wide',
    });
  };

  return (
    <Stack gap="xl">
      <Box>
        <DashboardPageHeader
          title="Templates"
          subTitle={`
          Manage templates`}
          icon="listNumbers"
        />
      </Box>
      <Paper p="md" radius="md" bg={bgColor}>
        <StateFullDataTable
          {...templatesAsync}
          data={templatesAsync.templates}
          columns={[
            ...columns,
            {
              id: 'actions',
              cell: ({ row: { original: template } }) => (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="transparent" aria-label="Settings">
                      <TablerIcon
                        name="dots"
                        style={{ width: '70%', height: '70%' }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Actions</Menu.Label>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<TablerIcon name="eye" size={14} />}
                      component={Link}
                      to={`${template.id}`}
                    >
                      View Details
                    </Menu.Item>
                    <SystemAuthorized
                      permissions={{ templates: ['update'] }}
                      unauthorizedAction={{ type: 'hide' }}
                    >
                      <Menu.Item
                        leftSection={<TablerIcon name="check" size={14} />}
                        onClick={() => handleLauchTemplateForm(template)}
                        color="green"
                      >
                        Update
                      </Menu.Item>
                    </SystemAuthorized>
                    <SystemAuthorized
                      permissions={{ templates: ['delete'] }}
                      unauthorizedAction={{ type: 'hide' }}
                    >
                      <Menu.Item
                        leftSection={<TablerIcon name="x" size={14} />}
                        // onClick={() => {
                        //   const dismiss = launchWorkspace(
                        //     <RejectFoundDocumentCaseForm
                        //       documentCase={docCase}
                        //       onClose={() => dismiss()}
                        //     />,
                        //     {
                        //       title: 'Reject Found Document Case',
                        //     }
                        //   );
                        // }}
                        color="red"
                      >
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
              <SystemAuthorized
                permissions={{ templates: ['create'] }}
                unauthorizedAction={{ type: 'hide' }}
              >
                <Button variant="light" onClick={() => handleLauchTemplateForm()}>
                  Create Template
                </Button>
              </SystemAuthorized>
            </>
          )}
        />
      </Paper>
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
      <Anchor variant="subtle" component={Link} to={`${original.id}`} style={{ color: 'inherit' }}>
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
              : 'green'
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
    header: 'Created at',
    accessorKey: 'createdAt',
    cell: ({ row: { original } }) => formatDate(original.createdAt),
  },
  {
    header: 'Updated at',
    accessorKey: 'updatedAt',
    cell: ({ row: { original } }) => formatDate(original.updatedAt),
  },
];
