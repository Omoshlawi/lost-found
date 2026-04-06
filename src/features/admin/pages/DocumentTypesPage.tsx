import { ColumnDef } from '@tanstack/react-table';
import { ActionIcon, Menu, Paper, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  DashboardPageHeader,
  launchWorkspace,
  StateFullDataTable,
  SystemAuthorized,
  TablerIcon,
  TablerIconName,
} from '@/components';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { handleApiErrors } from '@/lib/api';
import { DocumentTypeForm } from '../forms';
import { useDocumentTypes, useDocumentTypesApi } from '../hooks';
import { DocumentType } from '../types';

const DocumentTypesPage = () => {
  const { page, pageSize, setPage, setPageSize } = useTableUrlFilters();
  const documentTypesAsync = useDocumentTypes({ page, limit: pageSize });
  const { deleteDocumentType, mutateDocumentTypes } = useDocumentTypesApi();
  const { hasAccess } = useUserHasSystemAccess({ documentType: ['create'] });
  const handleDelete = (documentType: DocumentType) => {
    modals.openConfirmModal({
      title: 'Delete Document Type',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete {documentType.name}? This action is destructive and can
          only be reversed by admin users.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteDocumentType(documentType.id);
          showNotification({
            title: 'Success',
            message: 'Document type deleted successfully!',
            color: 'green',
          });
          mutateDocumentTypes();
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

  const handleLaunchFormWorkspace = (documentType?: DocumentType) => {
    const closeWorkspace = launchWorkspace(
      <DocumentTypeForm closeWorkspace={() => closeWorkspace()} documentType={documentType} />,
      {
        width: 'narrow',
        title: 'Document type form',
      }
    );
  };

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Document Types"
        subTitle="Configure supported document categories"
        icon="idBadge2"
      />
      <StateFullDataTable
        {...documentTypesAsync}
        data={documentTypesAsync.documentTypes}
        renderExpandedRow={({ original: docType }) => {
          return (
            <Paper p="xs">
              <Text size="sm">{docType.name}</Text>
              <Text size="sm">{docType.description}</Text>
              <Text size="sm">{docType.createdAt}</Text>
              <Text size="sm">{docType.updatedAt}</Text>
              <Text size="sm">{docType.averageReplacementCost}</Text>
              <Text size="sm">{docType.replacementInstructions}</Text>
              <Text size="sm">{docType.description}</Text>
              <Text size="sm">{docType.voided}</Text>
            </Paper>
          );
        }}
        columns={[
          ...columns,
          {
            header: 'Actions',
            id: 'actions',
            cell: ({ row: { original: docType } }: { row: { original: DocumentType } }) => (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" aria-label="Settings">
                    <TablerIcon name="dots" style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Actions</Menu.Label>
                  <Menu.Divider />
                  <SystemAuthorized
                    permissions={{ documentType: ['update'] }}
                    unauthorizedAction={{ type: 'hide' }}
                  >
                    <Menu.Item
                      leftSection={<TablerIcon name="edit" size={14} />}
                      color="green"
                      onClick={() => handleLaunchFormWorkspace(docType)}
                    >
                      Edit
                    </Menu.Item>
                  </SystemAuthorized>
                  <SystemAuthorized
                    permissions={{ documentType: ['delete'] }}
                    unauthorizedAction={{ type: 'hide' }}
                  >
                    <Menu.Item
                      leftSection={<TablerIcon name="trash" size={14} />}
                      color="red"
                      onClick={() => handleDelete(docType)}
                    >
                      Delete
                    </Menu.Item>
                  </SystemAuthorized>
                </Menu.Dropdown>
              </Menu>
            ),
            size: 0,
          },
        ]}
        onAdd={hasAccess ? () => handleLaunchFormWorkspace() : undefined}
        pagination={{
          totalCount: documentTypesAsync.totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </Stack>
  );
};

export default DocumentTypesPage;

const columns: ColumnDef<DocumentType>[] = [
  {
    id: 'expand',
    header: ({ table }) => {
      const allRowsExpanded = table.getIsAllRowsExpanded();
      //   const someRowsExpanded = table.getIsSomeRowsExpanded();
      return (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => table.toggleAllRowsExpanded(!allRowsExpanded)}
          style={{ cursor: 'pointer' }}
          aria-label="Expand all"
        >
          <TablerIcon name={allRowsExpanded ? 'chevronUp' : 'chevronDown'} size={16} />
        </ActionIcon>
      );
    },
    cell: ({ row }) => {
      const rowExpanded = row.getIsExpanded();
      return (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => row.toggleExpanded(!rowExpanded)}
          style={{ cursor: 'pointer' }}
          aria-label="Expand Row"
        >
          <TablerIcon name={rowExpanded ? 'chevronUp' : 'chevronDown'} size={16} />
        </ActionIcon>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 0,
  },
  {
    header: 'Icon',
    accessorKey: 'icon',
    cell: ({ row: { original: docType } }: { row: { original: DocumentType } }) =>
      docType.icon ? <TablerIcon name={docType.icon as TablerIconName} /> : '--',
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row: { original: docType } }: { row: { original: DocumentType } }) => docType.name,
  },
  {
    header: 'Created at',
    accessorKey: 'createdAt',
    cell: ({ row: { original: docType } }: { row: { original: DocumentType } }) =>
      new Date(docType.createdAt).toDateString(),
  },
  {
    header: 'Updated at',
    accessorKey: 'updatedAt',
    cell: ({ row: { original: docType } }: { row: { original: DocumentType } }) =>
      new Date(docType.updatedAt).toDateString(),
  },
  {
    header: 'Average Replacement Cost',
    accessorKey: 'averageReplacementCost',
    cell: ({ row: { original: docType } }: { row: { original: DocumentType } }) =>
      docType.averageReplacementCost,
  },
  {
    header: 'Voided',
    accessorKey: 'voided',
    cell: ({ row: { original: docType } }: { row: { original: DocumentType } }) => (
      <TablerIcon
        name={docType.voided ? 'circleDashedCheck' : 'circleDashedX'}
        color={docType.voided ? 'green' : 'red'}
      />
    ),
  },
];
