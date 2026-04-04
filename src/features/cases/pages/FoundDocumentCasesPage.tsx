import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ActionIcon, Menu, Select, Stack, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  DashboardPageHeader,
  StateFullDataTable,
  StatusBadge,
  SystemAuthorized,
  TablerIcon,
} from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { formatDate } from '@/lib/utils/helpers';
import { RejectFoundDocumentCaseForm, VerifyFoundDocumentCaseForm } from '../forms';
import FoundDocumentCaseForm from '../forms/FoundDocumentCaseForm';
import { useDocumentCaseApi, useDocumentCases } from '../hooks';
import { DocumentCase, FoundDocumentCaseStatus } from '../types';

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { label: 'Draft', value: FoundDocumentCaseStatus.DRAFT },
  { label: 'Submitted', value: FoundDocumentCaseStatus.SUBMITTED },
  { label: 'Verified', value: FoundDocumentCaseStatus.VERIFIED },
  { label: 'Rejected', value: FoundDocumentCaseStatus.REJECTED },
  { label: 'Completed', value: FoundDocumentCaseStatus.COMPLETED },
];

const FoundDocumentCasesPage = () => {
  const { page, status, search, searchInput, setSearchInput, setStatus, setPage } =
    useTableUrlFilters();

  const documentCasesAsync = useDocumentCases({
    v: 'custom:include(foundDocumentCase,document:include(type),address)',
    caseType: 'FOUND',
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
    const close = launchWorkspace(<FoundDocumentCaseForm closeWorkspace={() => close()} />, {
      expandable: true,
      width: 'wide',
      title: 'Report Found Document',
    });
  };

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Found Documents"
        subTitle="Verify and manage found document reports"
        icon="fileCheck"
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
              <Menu position="bottom-end" width={200}>
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
                  <SystemAuthorized
                    permissions={{ documentCase: ['verify'] }}
                    unauthorizedAction={{ type: 'hide' }}
                  >
                    <Menu.Item
                      leftSection={<TablerIcon name="check" size={14} />}
                      color="green"
                      onClick={() => {
                        const dismiss = launchWorkspace(
                          <VerifyFoundDocumentCaseForm
                            documentCase={report}
                            onClose={() => dismiss()}
                          />,
                          { title: 'Verify Found Document Case' }
                        );
                      }}
                    >
                      Verify
                    </Menu.Item>
                  </SystemAuthorized>
                  <SystemAuthorized
                    permissions={{ documentCase: ['reject'] }}
                    unauthorizedAction={{ type: 'hide' }}
                  >
                    <Menu.Item
                      leftSection={<TablerIcon name="x" size={14} />}
                      color="red"
                      onClick={() => {
                        const dismiss = launchWorkspace(
                          <RejectFoundDocumentCaseForm
                            documentCase={report}
                            onClose={() => dismiss()}
                          />,
                          { title: 'Reject Found Document Case' }
                        );
                      }}
                    >
                      Reject
                    </Menu.Item>
                  </SystemAuthorized>
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

export default FoundDocumentCasesPage;

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
    header: 'Found Date',
    accessorKey: 'eventDate',
    cell: ({ row: { original } }) => formatDate(original.eventDate),
  },
  {
    header: 'Status',
    accessorKey: 'foundDocumentCase.status',
    cell: ({ row: { original } }) => <StatusBadge status={original.foundDocumentCase?.status} />,
  },
  {
    header: 'Reported',
    accessorKey: 'createdAt',
    cell: ({ row: { original } }) => formatDate(original.createdAt),
  },
];
