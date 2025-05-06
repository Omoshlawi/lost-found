import { useMemo } from 'react';
import { ActionIcon, Button, Menu, Table, TableData, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { EmptyState, ErrorState, TableContainer, TablerIcon, TableSkeleton } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { handleApiErrors } from '@/lib/api';
import { DocumentReportForm } from '../forms';
import { useDocumentReportApi, useDocumentReports } from '../hooks';
import { DocumentReport } from '../types';

const FoundItemsPage = () => {
  const { isLoading, error, reports } = useDocumentReports({
    // v: 'custom:include(lostReport, foundReport, document:include(type),)',
  });
  const { deleteDocumentReport, mutateDocumentReport } = useDocumentReportApi();
  const handleLaunchFormWorkspace = (report?: DocumentReport) => {
    const closeWorkspace = launchWorkspace(
      <DocumentReportForm closeWorkspace={() => closeWorkspace()} report={report} />,
      {
        width: 'wide',
        expandable: true,
        title: 'Document type form',
      }
    );
  };
  const handleDelete = (report: DocumentReport) => {
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
          await deleteDocumentReport(report.id);
          showNotification({
            title: 'success',
            message: 'Document type deleted succesfully!',
            color: 'green',
          });
          mutateDocumentReport();
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
  const tableData = useMemo<TableData>(
    () => ({
      caption: 'Found documents',
      head: [
        '# No',
        'Owner name',
        'Found date',
        'County',
        'Subcounty',
        'Ward',
        'Landmark',
        'Status',
        'Handover preference',
        'Created at',
        'Updated at',
        'Actions',
      ],
      body: reports.map((docType, i) => [
        i + 1,
        docType.document?.ownerName ?? '--',
        new Date(docType.lostOrFoundDate).toDateString(),
        docType.county?.name ?? '--',
        docType.subCounty?.name ?? '--',
        docType.ward?.name ?? '--',
        docType.landMark ?? '--',
        docType.status ?? '--',
        docType?.foundReport?.handoverPreference ?? '--',
        new Date(docType.createdAt).toDateString(),
        new Date(docType.updatedAt).toDateString(),
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
              leftSection={<TablerIcon name="edit" size={14} />}
              color="green"
              onClick={() => handleLaunchFormWorkspace(docType)}
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
        </Menu>,
      ]),
    }),
    [reports]
  );
  const handleLaunchReportForm = () => {
    const close = launchWorkspace(<DocumentReportForm closeWorkspace={() => close()} />, {
      expandable: true,
      width: 'wide',
      title: 'Document report form',
    });
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState headerTitle="Found Items" error={error} />;
  if (!reports?.length)
    return (
      <EmptyState
        headerTitle="Found Items"
        message="No found items report"
        onAdd={handleLaunchReportForm}
      />
    );
  return (
    <TableContainer
      title="Found Items"
      actions={
        <>
          <Button>Add</Button>
        </>
      }
    >
      <Table striped data={tableData} />
    </TableContainer>
  );
};

export default FoundItemsPage;
