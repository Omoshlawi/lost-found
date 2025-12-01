import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { ActionIcon, Box, Menu, Paper, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { useAppColors } from '@/hooks/useAppColors';
import { handleApiErrors } from '@/lib/api';
import FoundDocumentCaseForm from '../forms/FoundDocumentCaseForm';
import { useDocumentCaseApi, useDocumentCases } from '../hooks';
import { DocumentCase } from '../types';

const FoundDocumentCasesPage = () => {
  const documentreportAsync = useDocumentCases({
    v: 'custom:include(foundDocumentCase,document:include(type),address)',
    caseType: 'FOUND',
  });
  const { deleteDocumentCase } = useDocumentCaseApi();
  const { bgColor } = useAppColors();
  const handleDelete = (report: DocumentCase) => {
    modals.openConfirmModal({
      title: 'Delete your profile',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete document report? This action is destructive and can only
          be reveredby admin users
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteDocumentCase(report.id);
          showNotification({
            title: 'success',
            message: 'Document type deleted succesfully!',
            color: 'green',
          });
        } catch (error) {
          const e = handleApiErrors<{}>(error);
          if (e.detail) {
            showNotification({
              title: 'Error deleting document type',
              message: e.detail,
              color: 'red',
              position: 'top-right',
            });
          }
        }
      },
    });
  };
  const handleLaunchReportForm = (report?: DocumentCase) => {
    const close = launchWorkspace(
      <FoundDocumentCaseForm case={report} closeWorkspace={() => close()} />,
      {
        expandable: true,
        width: 'wide',
        title: 'Found Document Case Form',
      }
    );
  };

  return (
    <Stack gap="xl">
      <Box>
        <DashboardPageHeader
          title="Found Documents"
          subTitle={`
          Manage found documents`}
          icon="listNumbers"
        />
      </Box>
      <Paper p="md" radius="md" bg={bgColor}>
        <StateFullDataTable
          {...documentreportAsync}
          data={documentreportAsync.reports}
          columns={[
            ...columns,
            {
              header: 'Actions',
              id: 'actions',
              cell: ({ row: { original: docType } }) => (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon variant="outline" aria-label="Settings">
                      <TablerIcon
                        name="dotsVertical"
                        style={{ width: '70%', height: '70%' }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<TablerIcon name="eye" size={14} />}
                      component={Link}
                      to={`${docType.id}`}
                    >
                      View Details
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<TablerIcon name="edit" size={14} />}
                      color="green"
                      onClick={() => handleLaunchReportForm(docType)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<TablerIcon name="trash" size={14} />}
                      color="red"
                      onClick={() => handleDelete(docType)}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ),
            },
          ]}
          onAdd={() => handleLaunchReportForm()}
        />
      </Paper>
    </Stack>
  );
};

export default FoundDocumentCasesPage;

const columns: ColumnDef<DocumentCase>[] = [
  {
    header: 'No',
    accessorKey: 'id',
  },
  {
    header: 'Owner name',
    accessorKey: 'document.ownerName',
  },
  {
    header: 'Document Type',
    accessorKey: 'document.type.name',
  },
  {
    header: 'Found date',
    accessorKey: 'lostOrFoundDate',
    cell: ({ row: { original: docType } }) => new Date(docType.lostOrFoundDate).toDateString(),
  },
  {
    header: 'County',
    accessorKey: 'county.name',
    cell: ({ row: { original: docType } }) => docType.county?.name ?? '--',
  },
  {
    header: 'Subcounty',
    accessorKey: 'subCounty.name',
    cell: ({ row: { original: docType } }) => docType.subCounty?.name ?? '--',
  },
  {
    header: 'Ward',
    accessorKey: 'ward.name',
    cell: ({ row: { original: docType } }) => docType.ward?.name ?? '--',
  },
  {
    header: 'Landmark',
    accessorKey: 'landMark',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row: { original: docType } }) => docType.status ?? '--',
  },
  {
    header: 'Handover preference',
    accessorKey: 'foundReport.handoverPreference',
    cell: ({ row: { original: docType } }) => docType?.foundReport?.handoverPreference ?? '--',
  },
  {
    header: 'Created at',
    accessorKey: 'createdAt',
    cell: ({ row: { original: docType } }) => new Date(docType.createdAt).toDateString(),
  },
  {
    header: 'Updated at',
    accessorKey: 'updatedAt',
    cell: ({ row: { original: docType } }) => new Date(docType.updatedAt).toDateString(),
  },
];
