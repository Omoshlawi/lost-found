import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ActionIcon, Badge, Box, Paper, Stack } from '@mantine/core';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
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
                <ActionIcon
                  component={Link}
                  to={`${docType.id}`}
                  variant="subtle"
                  aria-label="Settings"
                >
                  <TablerIcon name="eye" size={14} />
                </ActionIcon>
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
