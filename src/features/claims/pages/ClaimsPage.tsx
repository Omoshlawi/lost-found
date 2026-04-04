import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ActionIcon, Select, Stack } from '@mantine/core';
import { DashboardPageHeader, StateFullDataTable, StatusBadge, TablerIcon } from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { formatDate } from '@/lib/utils';
import { useClaims } from '../hooks';
import { Claim, ClaimStatus } from '../types';

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { label: 'Pending', value: ClaimStatus.PENDING },
  { label: 'Under Review', value: ClaimStatus.UNDER_REVIEW },
  { label: 'Verified', value: ClaimStatus.VERIFIED },
  { label: 'Rejected', value: ClaimStatus.REJECTED },
  { label: 'Disputed', value: ClaimStatus.DISPUTED },
  { label: 'Cancelled', value: ClaimStatus.CANCELLED },
];

const ClaimsPage = () => {
  const { page, status, setStatus, setPage } = useTableUrlFilters();

  const claimsAsync = useClaims({
    page,
    limit: PAGE_SIZE,
    ...(status && { status }),
  });

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Claims"
        subTitle="Review and resolve document ownership claims"
        icon="filterQuestion"
      />
      <StateFullDataTable
        {...claimsAsync}
        data={claimsAsync.claims}
        columns={[
          ...columns,
          {
            id: 'actions',
            size: 40,
            cell: ({ row: { original: claim } }) => (
              <ActionIcon
                component={Link}
                to={`${claim.id}`}
                variant="subtle"
                size="sm"
                aria-label="View claim"
              >
                <TablerIcon name="eye" size={14} />
              </ActionIcon>
            ),
          },
        ]}
        renderActions={() => (
          <Select
            placeholder="Status"
            data={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            size="xs"
            clearable
            w={160}
          />
        )}
        pagination={{
          total: claimsAsync.total,
          page,
          limit: PAGE_SIZE,
          onChange: setPage,
        }}
      />
    </Stack>
  );
};

export default ClaimsPage;

const columns: ColumnDef<Claim>[] = [
  {
    header: 'Claim Ref',
    accessorKey: 'claimNumber',
    enableHiding: false,
  },
  {
    header: 'Claimant',
    accessorKey: 'user.email',
    cell: ({ row: { original } }) => original.user?.email ?? '—',
  },
  {
    header: 'Match Ref',
    accessorKey: 'match.matchNumber',
    cell: ({ row: { original } }) => original.match?.matchNumber ?? '—',
  },
  {
    header: 'Security Check',
    accessorKey: 'verification.passed',
    cell: ({ row: { original } }) =>
      original.verification ? (
        <StatusBadge status={original.verification.passed ? 'VERIFIED' : 'FAILED'} />
      ) : (
        '—'
      ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row: { original } }) => <StatusBadge status={original.status} />,
  },
  {
    header: 'Submitted',
    accessorKey: 'createdAt',
    cell: ({ row: { original } }) => formatDate(original.createdAt),
  },
];
