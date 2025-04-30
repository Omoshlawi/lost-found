import { useMemo } from 'react';
import { ActionIcon, Button, Card, Menu, Table, TableData } from '@mantine/core';
import { EmptyState, ErrorState, TablerIcon, TableSkeleton } from '@/components';
import CardHeader from '@/components/CardHeader/CardHeader';
import { useDocumentTypes } from '../hooks';

const DocumentTypesPage = () => {
  const { documentTypes, isLoading, error } = useDocumentTypes();

  const tableData = useMemo<TableData>(
    () => ({
      caption: 'document types',
      foot: [
        'Name',
        'Description',
        'Icon',
        'Created at',
        'Updated at',
        'Average Replacement Cost',
        'Required Verification',
        'Voided',
        'Actions',
      ],
      head: [
        'Name',
        'Description',
        'Icon',
        'Created at',
        'Updated at',
        'Average Replacement Cost',
        'Required Verification',
        'Voided',
        'Actions',
      ],
      body: documentTypes.map((docType) => [
        docType.name,
        docType.description,
        docType.icon,
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
            <Menu.Item leftSection={<TablerIcon name="edit" size={14} />} color="green">
              Edit
            </Menu.Item>
            <Menu.Item leftSection={<TablerIcon name="trash" size={14} />} color="red">
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
    <Card>
      <CardHeader title="Document types">
        <Button leftSection={<TablerIcon name="plus" size={16} />} variant="transparent">
          Add document type
        </Button>
      </CardHeader>
      <Card.Section>
        <Table striped withTableBorder data={tableData} />
      </Card.Section>
    </Card>
  );
};

export default DocumentTypesPage;
