import React, { useState } from 'react';
import { Alert, Button, Group, PinInput, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { formatDate } from '@/lib/utils/helpers';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase } from '../types';

type ConfirmCollectionFormProps = {
  documentCase: DocumentCase;
  onClose: () => void;
  onSuccess?: () => void;
};

const ConfirmCollectionForm: React.FC<ConfirmCollectionFormProps> = ({
  documentCase,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { confirmCollection } = useDocumentCaseApi();

  const activeCollection = documentCase.foundDocumentCase?.activeCollection;

  const handleConfirm = async () => {
    if (code.length !== 6) return;
    setError(null);
    setIsLoading(true);
    try {
      await confirmCollection(documentCase.foundDocumentCase!.id, {
        collectionId: activeCollection!.id,
        code,
      });
      showNotification({
        title: 'Collection confirmed',
        message: 'Case submitted successfully. The finder has been notified.',
        color: 'green',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      setError(e.detail ?? 'Incorrect code. Please try again.');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const attemptsRemaining = activeCollection
    ? activeCollection.maxAttempts - activeCollection.attempts
    : null;

  return (
    <Stack p="md" h="100%" justify="space-between">
      <Stack gap="md">
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            Ask the finder to share the 6-digit code displayed in their app. Enter it below to
            confirm handover.
          </Text>
          {activeCollection && (
            <Text size="xs" c="dimmed">
              Expires {formatDate(activeCollection.expiresAt)} · {attemptsRemaining} attempt
              {attemptsRemaining !== 1 ? 's' : ''} remaining
            </Text>
          )}
        </Stack>

        <Group justify="center" pt="xs">
          <PinInput
            length={6}
            type="number"
            size="xl"
            value={code}
            onChange={setCode}
            autoFocus
            onComplete={handleConfirm}
          />
        </Group>

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
          leftSection={<TablerIcon name="circleCheck" size={14} />}
          loading={isLoading}
          disabled={code.length !== 6}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </Group>
    </Stack>
  );
};

export default ConfirmCollectionForm;
