import React, { useState } from 'react';
import { Alert, Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { initiateTransfer } from '../hooks/useCustody';
import { usePickupStations } from '../hooks/usePickupStations';

interface TransferOutFormProps {
  foundCaseId: string;
  currentStationId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const TransferOutForm: React.FC<TransferOutFormProps> = ({
  foundCaseId,
  currentStationId,
  onClose,
  onSuccess,
}) => {
  const [toStationId, setToStationId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { stations } = usePickupStations();
  const stationOptions = stations
    .filter((s) => s.id !== currentStationId)
    .map((s) => ({ label: `${s.name} (${s.code})`, value: s.id }));

  const handleSubmit = async () => {
    if (!toStationId) {return;}
    setError(null);
    setIsLoading(true);
    try {
      await initiateTransfer(foundCaseId, { toStationId, notes: notes || undefined });
      showNotification({ title: 'Transfer initiated', message: 'Document is now in transit.', color: 'teal' });
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      setError(e.detail ?? 'Failed to initiate transfer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack p="md" h="100%" justify="space-between">
      <Stack gap="md">
        <Select
          label="Destination Station"
          placeholder="Select station"
          data={stationOptions}
          value={toStationId}
          onChange={setToStationId}
          required
          searchable
        />
        <Textarea
          label="Notes"
          placeholder="Optional transfer notes..."
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          rows={3}
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
          leftSection={<TablerIcon name="arrowRight" size={14} />}
          loading={isLoading}
          disabled={!toStationId}
          onClick={handleSubmit}
        >
          Initiate Transfer
        </Button>
      </Group>
    </Stack>
  );
};

export default TransferOutForm;
