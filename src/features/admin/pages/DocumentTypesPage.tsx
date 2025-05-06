import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ActionIcon, Button, Card, Menu, Table, TableData, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import {
  EmptyState,
  ErrorState,
  launchWorkspace,
  TableContainer,
  TablerIcon,
  TablerIconName,
  TableSkeleton,
} from '@/components';
import CardHeader from '@/components/CardHeader/CardHeader';
import { handleApiErrors } from '@/lib/api';
import { DocumentTypeForm } from '../forms';
import { useDocumentTypes, useDocumentTypesApi } from '../hooks';
import { DocumentType } from '../types';

const DocumentTypesPage = () => {
  const { documentTypes, isLoading, error } = useDocumentTypes();
  const { deleteDocumentType, mutateDocumentTypes } = useDocumentTypesApi();
  const handleDelete = (documentType: DocumentType) => {
    modals.openConfirmModal({
      title: 'Delete your profile',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete {documentType.name}? This action is destructive and can
          only be reveredby admin users
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteDocumentType(documentType.id);
          showNotification({
            title: 'success',
            message: 'Document type deleted succesfully!',
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
  const tableData = useMemo<TableData>(
    () => ({
      caption: 'document types',

      head: [
        'Icon',
        'Name',
        'Created at',
        'Updated at',
        'Average Replacement Cost',
        'Required Verification',
        'Voided',
        'Actions',
      ],
      body: documentTypes.map((docType) => [
        docType.icon ? <TablerIcon name={docType.icon as TablerIconName} /> : '--',
        docType.name,
        new Date(docType.createdAt).toDateString(),
        new Date(docType.updatedAt).toDateString(),
        docType.averageReplacementCost,
        docType.requiredVerification,
        docType.voided,
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
    [documentTypes]
  );

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState headerTitle="Document types" error={error} />;
  if (documentTypes.length === 0)
    return <EmptyState headerTitle="Document types" message="No document types" onAdd={() => {}} />;
  return (
    <TableContainer
      title="Document types"
      actions={
        <>
          <Button
            leftSection={<TablerIcon name="plus" size={16} />}
            variant="transparent"
            onClick={() => handleLaunchFormWorkspace()}
          >
            Add document type
          </Button>
        </>
      }
    >
      <Table striped data={tableData} />
    </TableContainer>
  );
};

export default DocumentTypesPage;
