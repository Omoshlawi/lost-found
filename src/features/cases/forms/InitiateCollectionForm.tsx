import React, { useState } from 'react';
import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase } from '../types';

type InitiateCollectionFormProps = {
  documentCase: DocumentCase;
  onClose: () => void;
  onSuccess?: () => void;
};

const InitiateCollectionForm: React.FC<InitiateCollectionFormProps> = ({
  documentCase,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initiateCollection } = useDocumentCaseApi();

  const doc = documentCase.document;

  const fields = [
    { label: 'Full Name', value: doc?.fullName || '—' },
    { label: 'Document Number', value: doc?.documentNumber || '—' },
    { label: 'Serial Number', value: doc?.serialNumber || '—' },
    { label: 'Date of Birth', value: doc?.dateOfBirth || '—' },
  ];

  const handleInitiate = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await initiateCollection(documentCase.foundDocumentCase!.id);
      showNotification({
        title: 'Collection initiated',
        message: 'Handover code sent to the finder. Ask them to share it with you.',
        color: 'green',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      setError(e.detail ?? 'Failed to initiate collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack p="md" h="100%" justify="space-between">
      <Stack gap="md">
        <Alert
          variant="light"
          color="civicBlue"
          icon={<TablerIcon name="alertCircle" size={16} />}
          title="Verify document fields before initiating"
        >
          Confirm the fields below match the physical document in hand. Only initiate collection
          once everything is correct — the finder cannot edit after a code is issued.
        </Alert>

        <Stack gap="xs">
          {fields.map(({ label, value }) => (
            <Group
              key={label}
              justify="space-between"
              py={6}
              style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
            >
              <Text size="sm" c="dimmed">
                {label}
              </Text>
              <Text size="sm" fw={600}>
                {value}
              </Text>
            </Group>
          ))}
        </Stack>

        {error && (
          <Alert variant="light" color="red" icon={<TablerIcon name="alertTriangle" size={16} />}>
            {error}
          </Alert>
        )}
      </Stack>

      <Group gap={1}>
        <Button flex={1} variant="default" radius={0} onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          flex={1}
          radius={0}
          variant="filled"
          leftSection={<TablerIcon name="keyframe" size={14} />}
          loading={isLoading}
          onClick={handleInitiate}
        >
          Initiate Collection
        </Button>
      </Group>
    </Stack>
  );
};

export default InitiateCollectionForm;
