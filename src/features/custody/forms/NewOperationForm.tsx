import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { CaseComboboxPicker, OperationTypeHeader } from '../components';
import { DocumentOperationType } from '../types';
import { useNewOperationForm } from './useNewOperationForm';

interface NewOperationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  preselectedType?: DocumentOperationType;
  defaultStationId?: string | null;
}

const NewOperationForm: React.FC<NewOperationFormProps> = ({
  onClose,
  onSuccess,
  preselectedType,
  defaultStationId,
}) => {
  const {
    form,
    selectedOpType,
    isRequisition,
    operationTypeOptions,
    stationOptions,
    caseSearch,
    setCaseSearch,
    casesLoading,
    availableCases,
    caseLabels,
    addCase,
    removeCase,
    watchedFoundCaseIds,
    watchedFromStationId,
    handleSubmit,
  } = useNewOperationForm({ preselectedType, defaultStationId, onClose, onSuccess });

  const { isSubmitting, errors } = form.formState;

  const caseOptions = availableCases.map((c) => ({
    foundCaseId: c.foundDocumentCase?.id ?? '',
    caseNumber: c.caseNumber,
    typeName: c.document?.type?.name ?? '—',
  }));

  return (
    <form
      onSubmit={handleSubmit}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Stack p="md" flex={1} style={{ overflow: 'hidden' }}>
        <ScrollArea flex={1} offsetScrollbars>
          <Stack gap="md">
            {/* Operation type — locked header or selectable dropdown */}
            {preselectedType ? (
              <OperationTypeHeader opType={preselectedType} />
            ) : (
              <>
                <Controller
                  control={form.control}
                  name="operationTypeId"
                  render={({ field, fieldState }) => (
                    <Select
                      label="Operation Type"
                      placeholder="Select operation type"
                      data={operationTypeOptions}
                      value={field.value || null}
                      onChange={(v) => field.onChange(v ?? '')}
                      error={fieldState.error?.message}
                      required
                      searchable
                    />
                  )}
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
              </>
            )}

            {/* Source station — REQUISITION: shown BEFORE document picker */}
            {isRequisition && (
              <Controller
                control={form.control}
                name="fromStationId"
                render={({ field, fieldState }) => (
                  <Select
                    label="Source Station"
                    description="Station currently holding the documents to be requested"
                    placeholder="Select source station"
                    data={stationOptions}
                    value={field.value ?? null}
                    onChange={(v) => {
                      field.onChange(v ?? null);
                      form.setValue('foundCaseIds', []);
                    }}
                    error={fieldState.error?.message}
                    required
                    searchable
                    clearable
                  />
                )}
              />
            )}

            {/* Document case multi-select */}
            <CaseComboboxPicker
              selectedIds={watchedFoundCaseIds}
              labels={caseLabels}
              options={caseOptions}
              isLoading={casesLoading}
              search={caseSearch}
              error={errors.foundCaseIds?.message}
              onSearchChange={setCaseSearch}
              onAdd={addCase}
              onRemove={removeCase}
              disabled={isRequisition && !watchedFromStationId}
            />

            {/* Destination station — TRANSFER_OUT (requiresDestinationStation) */}
            {selectedOpType?.requiresDestinationStation && (
              <Controller
                control={form.control}
                name="toStationId"
                render={({ field, fieldState }) => (
                  <Select
                    label="Destination Station"
                    description="Station the documents are being sent to"
                    placeholder="Select destination station"
                    data={stationOptions}
                    value={field.value ?? null}
                    onChange={(v) => field.onChange(v ?? null)}
                    error={fieldState.error?.message}
                    required
                    searchable
                    clearable
                  />
                )}
              />
            )}

            {/* Source station — TRANSFER_IN: shown after document picker */}
            {!isRequisition && selectedOpType?.requiresSourceStation && (
              <Controller
                control={form.control}
                name="fromStationId"
                render={({ field, fieldState }) => (
                  <Select
                    label="Source Station"
                    description="Station that dispatched the documents"
                    placeholder="Select source station"
                    data={stationOptions}
                    value={field.value ?? null}
                    onChange={(v) => field.onChange(v ?? null)}
                    error={fieldState.error?.message}
                    required
                    searchable
                    clearable
                  />
                )}
              />
            )}

            {/* Performing station */}
            <Controller
              control={form.control}
              name="stationId"
              render={({ field, fieldState }) => (
                <Select
                  label={preselectedType ? 'Performing Station' : 'Station'}
                  description={
                    isRequisition
                      ? 'Your active station (the requesting station)'
                      : preselectedType && defaultStationId
                        ? 'Defaulted to your active station'
                        : undefined
                  }
                  placeholder="Station performing this operation"
                  disabled={isRequisition}
                  data={stationOptions}
                  value={field.value ?? null}
                  onChange={(v) => field.onChange(v ?? null)}
                  error={fieldState.error?.message}
                  searchable
                  clearable
                />
              )}
            />

            {/* Notes */}
            <Controller
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <Textarea
                  label="Notes"
                  placeholder={
                    selectedOpType?.requiresNotes
                      ? 'Required for this operation type…'
                      : 'Optional notes…'
                  }
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  rows={3}
                  required={selectedOpType?.requiresNotes}
                />
              )}
            />

            {errors.root && (
              <Alert
                variant="light"
                color="red"
                icon={<TablerIcon name="alertTriangle" size={16} />}
              >
                {errors.root.message}
              </Alert>
            )}
          </Stack>
        </ScrollArea>
      </Stack>

      <Group gap={1} px="md" pb="md">
        <Button flex={1} variant="default" radius={0} onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          flex={1}
          radius={0}
          type="submit"
          leftSection={<TablerIcon name="plus" size={14} />}
          loading={isSubmitting}
        >
          Create Operation
        </Button>
      </Group>
    </form>
  );
};

export default NewOperationForm;
