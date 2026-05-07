import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  ScrollArea,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { UserSelect } from '@/components/form-components';
import { SubmissionMethod } from '@/features/cases/types';
import { TargetAreaSeletor } from '../../../components/form-components';
import { CaseComboboxPicker, OperationTypeHeader } from '../components';
import { DocumentOperationType, DocumentOperationTypeCode } from '../types';
import { getCounterpartLabel } from '../utils/operationLabels';
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
    watchedCounterpartStationId,
    watchedReceiptMethod,
    handleSubmit,
    watchedTargetArea,
    sessionUserEmail,
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
                      {selectedOpType.requiresCounterpartStation && (
                        <Badge size="xs" variant="outline" color="orange">
                          Requires {getCounterpartLabel(selectedOpType.code).toLowerCase()}
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
            {selectedOpType?.code === DocumentOperationTypeCode.REQUISITION && (
              <Controller
                control={form.control}
                name="counterpartStationId"
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

            {/* Target area — HANDOVER / RECEIPT */}
            {selectedOpType?.requiresTargetArea && (
              <TargetAreaSeletor
                control={form.control}
                name="targetArea"
                label="Target Area"
                description="Geographic zone for this operation (e.g. Westlands, Juja)."
                placeholder="e.g. Westlands"
              />
            )}
            {/* RECEIPT: submission method toggle + area filter */}
            {selectedOpType?.code === DocumentOperationTypeCode.RECEIPT && (
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Collection Method
                </Text>
                <Controller
                  control={form.control}
                  name="receiptSubmissionMethod"
                  render={({ field }) => (
                    <SegmentedControl
                      data={[
                        { label: 'Drop-off at Station', value: SubmissionMethod.DROPOFF },
                        { label: 'Pickup at Address', value: SubmissionMethod.PICKUP },
                      ]}
                      value={field.value ?? ''}
                      onChange={(v) => {
                        field.onChange(v || null);
                        form.setValue('foundCaseIds', []);
                      }}
                    />
                  )}
                />
                <Text size="xs" c="dimmed">
                  {watchedReceiptMethod === 'DROPOFF'
                    ? 'Showing drop-off cases assigned to your active station.'
                    : 'Showing pick-up cases within the target area'}
                </Text>
              </Stack>
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
              disabled={
                (selectedOpType?.code === DocumentOperationTypeCode.REQUISITION &&
                  !watchedCounterpartStationId) ||
                (selectedOpType?.code === DocumentOperationTypeCode.RECEIPT &&
                  (!watchedReceiptMethod || !watchedTargetArea))
              }
              placeholder={
                selectedOpType?.code === DocumentOperationTypeCode.RECEIPT &&
                (!watchedReceiptMethod || !watchedTargetArea)
                  ? 'Select target area/collection method first'
                  : undefined
              }
            />

            {/* Counterpart station — TRANSFER_OUT (destination) and TRANSFER_IN (source) */}
            {selectedOpType?.requiresCounterpartStation &&
              selectedOpType?.code !== DocumentOperationTypeCode.REQUISITION && (
                <Controller
                  control={form.control}
                  name="counterpartStationId"
                  render={({ field, fieldState }) => (
                    <Select
                      label={getCounterpartLabel(selectedOpType.code)}
                      description={
                        selectedOpType.code === DocumentOperationTypeCode.TRANSFER_OUT
                          ? 'Station the documents are being sent to'
                          : 'Station that dispatched the documents'
                      }
                      placeholder={`Select ${getCounterpartLabel(selectedOpType.code).toLowerCase()}`}
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
                    selectedOpType?.code === DocumentOperationTypeCode.REQUISITION
                      ? 'Your active station (the requesting station)'
                      : preselectedType && defaultStationId
                        ? 'Defaulted to your active station'
                        : undefined
                  }
                  placeholder="Station performing this operation"
                  disabled={selectedOpType?.code === DocumentOperationTypeCode.REQUISITION}
                  data={stationOptions}
                  value={field.value ?? null}
                  onChange={(v) => field.onChange(v ?? null)}
                  error={fieldState.error?.message}
                  searchable
                  clearable
                  readOnly
                />
              )}
            />

            {/* Responsible person */}
            {sessionUserEmail && (
              <UserSelect
                control={form.control}
                name="responsiblePersonId"
                label="Responsible Person"
                description="Staff member physically executing this operation. Defaults to you."
                placeholder="Search by email…"
                defaultSearch={sessionUserEmail}
              />
            )}

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
