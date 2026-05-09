import React, { useState } from 'react';
import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useExchangeApi } from '@/features/exchange';
import { Claim } from '@/features/claims/types';

type IssueOutboundCodeFormProps = {
  claim: Claim;
  exchangeNumber: string;
  onClose: () => void;
  onSuccess?: () => void;
};

const IssueOutboundCodeForm: React.FC<IssueOutboundCodeFormProps> = ({
  claim,
  exchangeNumber,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { issueOutboundCode } = useExchangeApi();

  const doc = claim.foundDocumentCase?.case?.document;
  const fields = [
    { label: 'Full Name', value: doc?.fullName || '—' },
    { label: 'Document Number', value: doc?.documentNumber || '—' },
    { label: 'Serial Number', value: doc?.serialNumber || '—' },
    { label: 'Date of Birth', value: doc?.dateOfBirth || '—' },
  ];

  const handleIssue = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await issueOutboundCode(exchangeNumber);
      showNotification({
        title: 'Code sent to claimant',
        message: 'Ask the claimant to show you the code from their app.',
        color: 'green',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      setError(e.detail ?? 'Failed to issue code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack p="md" h="100%" justify="space-between">
      <Stack gap="md">
        <Alert
          variant="light"
          color="teal"
          icon={<TablerIcon name="alertCircle" size={16} />}
          title="Verify claimant identity before issuing code"
        >
          Confirm the document fields below match the physical document and the claimant's ID.
          Only issue the code once the identity is verified — the claimant will see it in their
          app immediately.
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
          color="teal"
          leftSection={<TablerIcon name="packageExport" size={14} />}
          loading={isLoading}
          onClick={handleIssue}
        >
          Issue Code
        </Button>
      </Group>
    </Stack>
  );
};

export default IssueOutboundCodeForm;
