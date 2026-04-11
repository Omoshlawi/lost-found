import React, { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
  useCombobox,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { useDocumentCases } from '@/features/cases/hooks';
import { handleApiErrors } from '@/lib/api';
import { createOperation, useDocumentOperationTypes } from '../hooks/useCustody';
import { usePickupStations } from '../hooks/usePickupStations';
import { DocumentOperationType } from '../types';

interface NewOperationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const NewOperationForm: React.FC<NewOperationFormProps> = ({ onClose, onSuccess }) => {
  const [operationTypeId, setOperationTypeId] = useState<string | null>(null);
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [selectedCaseLabels, setSelectedCaseLabels] = useState<Record<string, string>>({});
  const [stationId, setStationId] = useState<string | null>(null);
  const [toStationId, setToStationId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [caseSearch, setCaseSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() });

  const { operationTypes } = useDocumentOperationTypes({ limit: 50 });
  const { stations } = usePickupStations();

  const { reports: cases, isLoading: casesLoading } = useDocumentCases({
    caseType: 'FOUND',
    limit: 20,
    ...(caseSearch && { search: caseSearch }),
    v: 'custom:include(foundDocumentCase,document:include(type))',
  });

  const selectedOpType = useMemo<DocumentOperationType | undefined>(
    () => operationTypes.find((t) => t.id === operationTypeId),
    [operationTypes, operationTypeId],
  );

  const operationTypeOptions = operationTypes.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const stationOptions = stations.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.code})`,
  }));

  const availableCases = cases.filter((c) => !selectedCaseIds.includes(c.foundDocumentCase?.id ?? ''));

  const addCase = (foundCaseId: string, label: string) => {
    setSelectedCaseIds((prev) => [...prev, foundCaseId]);
    setSelectedCaseLabels((prev) => ({ ...prev, [foundCaseId]: label }));
    setCaseSearch('');
    combobox.closeDropdown();
  };

  const removeCase = (foundCaseId: string) => {
    setSelectedCaseIds((prev) => prev.filter((id) => id !== foundCaseId));
    setSelectedCaseLabels((prev) => {
      const next = { ...prev };
      delete next[foundCaseId];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!operationTypeId || selectedCaseIds.length === 0) return;
    setError(null);
    setIsLoading(true);
    try {
      await createOperation({
        operationTypeId,
        foundCaseIds: selectedCaseIds,
        ...(stationId && { stationId }),
        ...(toStationId && { toStationId }),
        notes: notes || undefined,
      });
      showNotification({
        title: 'Operation created',
        message: `Draft operation created with ${selectedCaseIds.length} document(s).`,
        color: 'teal',
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      setError(e.detail ?? 'Failed to create operation.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = !!operationTypeId && selectedCaseIds.length > 0;

  return (
    <Stack p="md" h="100%" justify="space-between">
      <ScrollArea flex={1} offsetScrollbars>
        <Stack gap="md">
          <Select
            label="Operation Type"
            placeholder="Select operation type"
            data={operationTypeOptions}
            value={operationTypeId}
            onChange={setOperationTypeId}
            required
            searchable
          />

          {selectedOpType && (
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {selectedOpType.description}
              </Text>
              <Group gap="xs">
                {selectedOpType.requiresDestinationStation && (
                  <Badge size="xs" variant="outline" color="orange">
                    Requires destination station
                  </Badge>
                )}
                {selectedOpType.isHighPrivilege && (
                  <Badge size="xs" variant="outline" color="red">
                    Requires approval
                  </Badge>
                )}
              </Group>
            </Box>
          )}

          {/* Document case multi-select */}
          <Input.Wrapper label="Documents" required>
            <Combobox store={combobox} onOptionSubmit={(val) => {
              const c = cases.find((c) => c.foundDocumentCase?.id === val);
              if (c) {
                addCase(val, `${c.caseNumber} · ${c.document?.type?.name ?? 'Unknown'}`);
              }
            }}>
              <Combobox.DropdownTarget>
                <PillsInput onClick={() => combobox.openDropdown()}>
                  <Pill.Group>
                    {selectedCaseIds.map((id) => (
                      <Pill key={id} withRemoveButton onRemove={() => removeCase(id)}>
                        {selectedCaseLabels[id] ?? id}
                      </Pill>
                    ))}
                    <Combobox.EventsTarget>
                      <PillsInput.Field
                        placeholder={selectedCaseIds.length === 0 ? 'Search by case number or document type…' : undefined}
                        value={caseSearch}
                        onChange={(e) => {
                          setCaseSearch(e.currentTarget.value);
                          combobox.openDropdown();
                        }}
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => combobox.closeDropdown()}
                      />
                    </Combobox.EventsTarget>
                  </Pill.Group>
                </PillsInput>
              </Combobox.DropdownTarget>

              <Combobox.Dropdown>
                <Combobox.Options>
                  {casesLoading ? (
                    <Combobox.Empty>Searching…</Combobox.Empty>
                  ) : availableCases.length === 0 ? (
                    <Combobox.Empty>No matching cases found</Combobox.Empty>
                  ) : (
                    availableCases.map((c) => (
                      <Combobox.Option key={c.foundDocumentCase?.id} value={c.foundDocumentCase?.id ?? ''}>
                        <Group gap="xs" wrap="nowrap">
                          <Text size="sm" fw={500}>{c.caseNumber}</Text>
                          <Text size="xs" c="dimmed">{c.document?.type?.name ?? '—'}</Text>
                        </Group>
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </Input.Wrapper>

          {selectedOpType?.requiresDestinationStation && (
            <Select
              label="Destination Station"
              placeholder="Select station"
              data={stationOptions}
              value={toStationId}
              onChange={setToStationId}
              required
              searchable
            />
          )}

          <Select
            label="From Station"
            placeholder="Station performing this operation"
            data={stationOptions}
            value={stationId}
            onChange={setStationId}
            searchable
            clearable
          />

          <Textarea
            label="Notes"
            placeholder={selectedOpType?.requiresNotes ? 'Required for this operation type…' : 'Optional notes…'}
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
            rows={3}
            required={selectedOpType?.requiresNotes}
          />

          {error && (
            <Alert variant="light" color="red" icon={<TablerIcon name="alertTriangle" size={16} />}>
              {error}
            </Alert>
          )}
        </Stack>
      </ScrollArea>

      <Group gap={1} pt="md">
        <Button flex={1} variant="default" radius={0} onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          flex={1}
          radius={0}
          leftSection={<TablerIcon name="plus" size={14} />}
          loading={isLoading}
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Create Operation
        </Button>
      </Group>
    </Stack>
  );
};

export default NewOperationForm;
