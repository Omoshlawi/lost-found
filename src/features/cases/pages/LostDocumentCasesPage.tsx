import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ActionIcon, Menu, Select, Stack, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, StateFullDataTable, StatusBadge, TablerIcon } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { formatDate } from '@/lib/utils/helpers';
import { LostDocumentCaseForm } from '../forms';
import { useDocumentCaseApi, useDocumentCases } from '../hooks';
import { DocumentCase, LostDocumentCaseStatus } from '../types';

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { label: 'Submitted', value: LostDocumentCaseStatus.SUBMITTED },
  { label: 'Completed', value: LostDocumentCaseStatus.COMPLETED },
];

const LostDocumentCasesPage = () => {
  const { page, status, search, searchInput, setSearchInput, setStatus, setPage } =
    useTableUrlFilters();

  const documentCasesAsync = useDocumentCases({
    v: 'custom:include(lostDocumentCase,document:include(type),address)',
    caseType: 'LOST',
    page,
    limit: PAGE_SIZE,
    ...(search && { search }),
    ...(status && { status }),
  });

  const { deleteDocumentCase } = useDocumentCaseApi();

  const handleDelete = (report: DocumentCase) => {
    modals.openConfirmModal({
      title: 'Delete Case',
      children: (
        <Text size="sm">
          Are you sure you want to delete this case? This action is destructive and can only be
          reversed by an admin.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteDocumentCase(report.id);
          showNotification({ title: 'Deleted', message: 'Case deleted.', color: 'green' });
        } catch (error) {
          const e = handleApiErrors<{}>(error);
          if (e.detail) showNotification({ title: 'Error', message: e.detail, color: 'red' });
        }
      },
    });
  };

  const handleAdd = () => {
    const close = launchWorkspace(<LostDocumentCaseForm closeWorkspace={() => close()} />, {
      expandable: true,
      width: 'wide',
      title: 'Report Lost Document',
    });
  };

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Lost Documents"
        subTitle="Review and manage lost document reports"
        icon="fileSearch"
      />
      <StateFullDataTable
        {...documentCasesAsync}
        data={documentCasesAsync.reports}
        columns={[
          ...columns,
          {
            id: 'actions',
            size: 40,
            cell: ({ row: { original: report } }) => (
              <Menu position="bottom-end" width={180}>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="sm" aria-label="Row actions">
                    <TablerIcon name="dots" size={14} stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<TablerIcon name="eye" size={14} />}
                    component={Link}
                    to={`${report.id}`}
                  >
                    View Details
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<TablerIcon name="trash" size={14} />}
                    color="red"
                    onClick={() => handleDelete(report)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ),
          },
        ]}
        onAdd={handleAdd}
        renderActions={() => (
          <>
            <TextInput
              placeholder="Search cases..."
              leftSection={<TablerIcon name="search" size={14} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="xs"
              w={200}
            />
            <Select
              placeholder="Status"
              data={STATUS_OPTIONS}
              value={status}
              onChange={setStatus}
              size="xs"
              clearable
              w={140}
            />
          </>
        )}
        pagination={{
          total: documentCasesAsync.total,
          page,
          limit: PAGE_SIZE,
          onChange: setPage,
        }}
      />
    </Stack>
  );
};

export default LostDocumentCasesPage;

const columns: ColumnDef<DocumentCase>[] = [
  {
    header: 'Case No.',
    accessorKey: 'caseNumber',
    enableHiding: false,
  },
  {
    header: 'Owner Name',
    accessorKey: 'document.fullName',
    cell: ({ row: { original } }) => original.document?.fullName ?? '—',
  },
  {
    header: 'Document Type',
    accessorKey: 'document.type.name',
    cell: ({ row: { original } }) => original.document?.type?.name ?? '—',
  },
  {
    header: 'Lost Date',
    accessorKey: 'eventDate',
    cell: ({ row: { original } }) => formatDate(original.eventDate),
  },
  {
    header: 'Status',
    accessorKey: 'lostDocumentCase.status',
    cell: ({ row: { original } }) => <StatusBadge status={original.lostDocumentCase?.status} />,
  },
  {
    header: 'Reported',
    accessorKey: 'createdAt',
    cell: ({ row: { original } }) => formatDate(original.createdAt),
  },
];
