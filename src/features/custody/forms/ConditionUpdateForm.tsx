import React, { useState } from 'react';
import { Alert, Button, Group, Select, Stack, Textarea } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { recordConditionUpdate } from '../hooks/useCustody';
import { usePickupStations } from '../hooks/usePickupStations';

interface ConditionUpdateFormProps {
  foundCaseId: string;
  currentStationId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const ConditionUpdateForm: React.FC<ConditionUpdateFormProps> = ({
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
    if (!stationId || !notes.trim()) {return;}
    setError(null);
    setIsLoading(true);
    try {
      await recordConditionUpdate(foundCaseId, { stationId, notes });
      showNotification({ title: 'Condition updated', message: 'Document condition has been recorded.', color: 'teal' });
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      setError(e.detail ?? 'Failed to record condition update.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack p="md" h="100%" justify="space-between">
      <Stack gap="md">
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
          label="Condition notes"
          placeholder="Describe the current condition of the document (required)..."
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
          leftSection={<TablerIcon name="alertCircle" size={14} />}
          loading={isLoading}
          disabled={!stationId || !notes.trim()}
          onClick={handleSubmit}
        >
          Record Condition
        </Button>
      </Group>
    </Stack>
  );
};

export default ConditionUpdateForm;
