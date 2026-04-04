import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ActionIcon,
  Badge,
  Button,
  Menu,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';
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
import {
  FoundDocumentCaseForm,
  LostDocumentCaseForm,
  RejectFoundDocumentCaseForm,
  VerifyFoundDocumentCaseForm,
} from '../forms';
import { useDocumentCaseApi, useDocumentCases } from '../hooks';
import { DocumentCase, FoundDocumentCaseStatus, LostDocumentCaseStatus } from '../types';

type CaseTab = 'all' | 'lost' | 'found';

const LOST_STATUS_OPTIONS = [
  { label: 'Draft', value: LostDocumentCaseStatus.DRAFT },
  { label: 'Submitted', value: LostDocumentCaseStatus.SUBMITTED },
  { label: 'Completed', value: LostDocumentCaseStatus.COMPLETED },
];

const FOUND_STATUS_OPTIONS = [
  { label: 'Draft', value: FoundDocumentCaseStatus.DRAFT },
  { label: 'Submitted', value: FoundDocumentCaseStatus.SUBMITTED },
  { label: 'Verified', value: FoundDocumentCaseStatus.VERIFIED },
  { label: 'Rejected', value: FoundDocumentCaseStatus.REJECTED },
  { label: 'Completed', value: FoundDocumentCaseStatus.COMPLETED },
];

const DocumentCasesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('type') ?? 'all') as CaseTab;

  const {
    page,
    pageSize,
    status,
    search,
    searchInput,
    setSearchInput,
    setStatus,
    setPage,
    setPageSize,
  } = useTableUrlFilters();

  const handleTabChange = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value && value !== 'all') {
          prev.set('type', value);
        } else {
          prev.delete('type');
        }
        prev.delete('status');
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );
  };

  const vParam =
    activeTab === 'found'
      ? 'custom:include(foundDocumentCase,document:include(type),address)'
      : activeTab === 'lost'
        ? 'custom:include(lostDocumentCase,document:include(type),address)'
        : 'custom:include(foundDocumentCase,lostDocumentCase,document:include(type),address)';

  const documentCasesAsync = useDocumentCases({
    v: vParam,
    ...(activeTab !== 'all' && { caseType: activeTab.toUpperCase() }),
    page,
    limit: pageSize,
    ...(search && { search }),
    ...(status && { status }),
  });

  const { deleteDocumentCase } = useDocumentCaseApi();

  const statusOptions =
    activeTab === 'lost'
      ? LOST_STATUS_OPTIONS
      : activeTab === 'found'
        ? FOUND_STATUS_OPTIONS
        : null;

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
          if (e.detail) {
            showNotification({ title: 'Error', message: e.detail, color: 'red' });
          }
        }
      },
    });
  };

  const handleAddLost = () => {
    const close = launchWorkspace(<LostDocumentCaseForm closeWorkspace={() => close()} />, {
      expandable: true,
      width: 'wide',
      title: 'Report Lost Document',
    });
  };

  const handleAddFound = () => {
    const close = launchWorkspace(<FoundDocumentCaseForm closeWorkspace={() => close()} />, {
      expandable: true,
      width: 'wide',
      title: 'Report Found Document',
    });
  };

  const columns = useMemo<ColumnDef<DocumentCase>[]>(
    () => [
      {
        header: 'Case No.',
        accessorKey: 'caseNumber',
        enableHiding: false,
      },
      {
        header: 'Type',
        id: 'caseType',
        cell: ({ row: { original } }) => {
          const isLost = !!original.lostDocumentCase;
          return (
            <Badge color={isLost ? 'orange' : 'teal'} variant="light" size="sm">
              {isLost ? 'Lost' : 'Found'}
            </Badge>
          );
        },
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
        header: activeTab === 'lost' ? 'Lost Date' : activeTab === 'found' ? 'Found Date' : 'Date',
        accessorKey: 'eventDate',
        cell: ({ row: { original } }) => formatDate(original.eventDate),
      },
      {
        header: 'Status',
        id: 'status',
        cell: ({ row: { original } }) => {
          const caseStatus =
            original.lostDocumentCase?.status ?? original.foundDocumentCase?.status;
          return <StatusBadge status={caseStatus} />;
        },
      },
      {
        header: 'Reported',
        accessorKey: 'createdAt',
        cell: ({ row: { original } }) => formatDate(original.createdAt),
      },
    ],
    [activeTab]
  );

  const actionsColumn: ColumnDef<DocumentCase> = {
    id: 'actions',
    size: 40,
    cell: ({ row: { original: report } }) => {
      const isFound = !!report.foundDocumentCase;
      return (
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
            {isFound && (
              <>
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
              </>
            )}
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
      );
    },
  };

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Cases"
        subTitle="Manage lost and found document cases"
        icon="files"
      />
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<TablerIcon name="files" size={14} />}>
            All Cases
          </Tabs.Tab>
          <Tabs.Tab value="lost" leftSection={<TablerIcon name="fileSearch" size={14} />}>
            Lost
          </Tabs.Tab>
          <Tabs.Tab value="found" leftSection={<TablerIcon name="fileCheck" size={14} />}>
            Found
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <StateFullDataTable
        {...documentCasesAsync}
        data={documentCasesAsync.reports}
        columns={[...columns, actionsColumn]}
        renderActions={() => (
          <>
            <Button
              leftSection={<TablerIcon name="fileSearch" size={14} />}
              variant="light"
              size="xs"
              onClick={handleAddLost}
            >
              Report Lost
            </Button>
            <Button
              leftSection={<TablerIcon name="fileCheck" size={14} />}
              variant="light"
              size="xs"
              onClick={handleAddFound}
            >
              Log Found
            </Button>
            <TextInput
              placeholder="Search cases..."
              leftSection={<TablerIcon name="search" size={14} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="xs"
              w={200}
            />
            {statusOptions && (
              <Select
                placeholder="Status"
                data={statusOptions}
                value={status}
                onChange={setStatus}
                size="xs"
                clearable
                w={140}
              />
            )}
          </>
        )}
        pagination={{
          totalCount: documentCasesAsync.totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </Stack>
  );
};

export default DocumentCasesPage;
