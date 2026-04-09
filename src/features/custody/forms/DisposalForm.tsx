import React, { useState } from 'react';
import { Alert, Button, Group, Select, Stack, Text, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { recordDisposal } from '../hooks/useCustody';
import { usePickupStations } from '../hooks/usePickupStations';

interface DisposalFormProps {
  foundCaseId: string;
  currentStationId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const DisposalForm: React.FC<DisposalFormProps> = ({
  foundCaseId,
  currentStationId,
  onClose,
  onSuccess,
}) => {
  const [stationId, setStationId] = useState<string | null>(currentStationId ?? null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { stations } = usePickupStations();
  const stationOptions = stations.map((s) => ({ label: `${s.name} (${s.code})`, value: s.id }));

  const handleSubmit = async () => {
    if (!stationId || !notes.trim()) {
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await recordDisposal(foundCaseId, { stationId, notes });
      showNotification({
        title: 'Document disposed',
        message: 'Document has been permanently removed from custody.',
        color: 'red',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      setError(e.detail ?? 'Failed to record disposal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack p="md" h="100%" justify="space-between">
      <Stack gap="md">
        <Alert
          variant="light"
          color="red"
          icon={<TablerIcon name="alertTriangle" size={16} />}
          title="Irreversible action"
        >
          <Text size="sm">
            Disposal permanently removes the document from custody. This action cannot be undone.
            Ensure you have proper authorisation before proceeding.
          </Text>
        </Alert>
        <Select
          label="Station"
          placeholder="Select station"
          data={stationOptions}
          value={stationId}
          onChange={setStationId}
          required
          searchable
        />
        <Textarea
          label="Reason for disposal"
          placeholder="Describe why this document is being disposed (required)..."
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          rows={4}
          required
        />
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
          color="red"
          leftSection={<TablerIcon name="trash" size={14} />}
          loading={isLoading}
          disabled={!stationId || !notes.trim()}
          onClick={handleSubmit}
        >
          Confirm Disposal
        </Button>
      </Group>
    </Stack>
  );
};

export default DisposalForm;
