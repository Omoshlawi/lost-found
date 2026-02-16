import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ActionIcon, Badge, Box, Menu, Paper, Stack } from '@mantine/core';
import {
  DashboardPageHeader,
  StateFullDataTable,
  SystemAuthorized,
  TablerIcon,
} from '@/components';
import { useAppColors } from '@/hooks/useAppColors';
import { formatDate } from '@/lib/utils';
import { useClaims } from '../hooks';
import { Claim } from '../types';

const ClaimsPage = () => {
  const { bgColor } = useAppColors();
  const claimsAsync = useClaims();
  return (
    <Stack gap="xl">
      <Box>
        <DashboardPageHeader title="Claims" subTitle="Manage document claims" icon="listNumbers" />
      </Box>
      <Paper p="md" radius="md" bg={bgColor}>
        <StateFullDataTable
          {...claimsAsync}
          data={claimsAsync.claims}
          columns={[
            ...columns,
            {
              id: 'actions',
              cell: ({ row: { original: docType } }) => (
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
                      to={`${docType.id}`}
                    >
                      View Details
                    </Menu.Item>
                    <SystemAuthorized
                      permissions={{ documentCase: ['verify'] }}
                      unauthorizedAction={{ type: 'hide' }}
                    >
                      <Menu.Item leftSection={<TablerIcon name="check" size={14} />} color="green">
                        Verify
                      </Menu.Item>
                    </SystemAuthorized>
                    <SystemAuthorized
                      permissions={{ documentCase: ['reject'] }}
                      unauthorizedAction={{ type: 'hide' }}
                    >
                      <Menu.Item leftSection={<TablerIcon name="x" size={14} />} color="red">
                        Reject
                      </Menu.Item>
                    </SystemAuthorized>
                    <Menu.Item leftSection={<TablerIcon name="trash" size={14} />} color="red">
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ),
            },
          ]}
          onAdd={() => {}}
        />
      </Paper>
    </Stack>
  );
};

export default ClaimsPage;

const columns: ColumnDef<Claim>[] = [
  {
    header: '#',
    id: 'no',
    cell: ({ row, table }) => (table.getSortedRowModel().rows.indexOf(row) + 1).toString(),
    enableSorting: false,
    enableHiding: false,
  },
  { header: 'Claimant', accessorKey: 'user.email' },
  { header: 'Claim Ref No', accessorKey: 'claimNumber' },
  { header: 'Match Ref No', accessorKey: 'match.matchNumber' },
  { header: 'Security Questions', accessorKey: 'verification.passed' },
  {
    header: 'Status',
    accessorKey: 'foundDocumentCase.status',
    cell: ({ row: { original: claim } }) => (
      <Badge
        variant="light" //color={getStatusColor(claim?.status)}
      >
        {claim?.status}
      </Badge>
    ),
  },
  {
    header: 'Created at',
    accessorKey: 'createdAt',
    cell: ({ row: { original: docType } }) => formatDate(docType.createdAt),
  },
  {
    header: 'Updated at',
    accessorKey: 'updatedAt',
    cell: ({ row: { original: docType } }) => formatDate(docType.updatedAt),
  },
];
