import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Loader,
  ScrollArea,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { useSearchUser } from '@/hooks/usesearchUser';
import { CaseComboboxPicker, OperationTypeHeader } from '../components';
import { DocumentOperationType, DocumentOperationTypeCode, SubmissionMethod } from '../types';
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
    watchedFromStationId,
    watchedReceiptMethod,
    handleSubmit,
  } = useNewOperationForm({ preselectedType, defaultStationId, onClose, onSuccess });

  const { isSubmitting, errors } = form.formState;

  const userSearch = useSearchUser();
  const [responsibleUserOption, setResponsibleUserOption] = React.useState<{
    value: string;
    label: string;
  } | null>(null);

  const responsibleUserOptions = [
    ...(responsibleUserOption ? [responsibleUserOption] : []),
    ...userSearch.users
      .filter((u) => u.id !== responsibleUserOption?.value)
      .map((u) => ({ value: u.id, label: u.name ?? u.email })),
  ];

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
            {selectedOpType?.code === DocumentOperationTypeCode.REQUISITION && (
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
                        form.setValue('receiptAreaValue', '');
                      }}
                    />
                  )}
                />
                {watchedReceiptMethod === 'PICKUP' && (
                  <Controller
                    control={form.control}
                    name="receiptAreaValue"
                    render={({ field, fieldState }) => (
                      <TextInput
                        label="Collection Area"
                        description="Filter by area (e.g. ward/neighbourhood). Matches the area level configured in system settings."
                        placeholder="e.g. Westlands"
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        onBlur={() => form.setValue('foundCaseIds', [])}
                      />
                    )}
                  />
                )}
                {watchedReceiptMethod === 'DROPOFF' && (
                  <Text size="xs" c="dimmed">
                    Showing drop-off cases assigned to your active station.
                  </Text>
                )}
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
                  !watchedFromStationId) ||
                (selectedOpType?.code === DocumentOperationTypeCode.RECEIPT &&
                  !watchedReceiptMethod)
              }
            />

            {/* Target area — HANDOVER / RECEIPT */}
            {selectedOpType?.requiresTargetArea && (
              <Controller
                control={form.control}
                name="targetArea"
                render={({ field, fieldState }) => (
                  <TextInput
                    label="Target Area"
                    description="Geographic zone for this operation batch (e.g. Westlands, CBD Zone A)."
                    placeholder="e.g. Westlands"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    required
                  />
                )}
              />
            )}

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
            {selectedOpType?.code !== DocumentOperationTypeCode.REQUISITION &&
              selectedOpType?.requiresSourceStation && (
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
                />
              )}
            />

            {/* Responsible person */}
            <Controller
              control={form.control}
              name="responsiblePersonId"
              render={({ field, fieldState }) => (
                <Select
                  label="Responsible Person"
                  description="Staff member physically executing this operation. Defaults to you."
                  placeholder="Search by email…"
                  data={responsibleUserOptions}
                  value={field.value ?? null}
                  onChange={(value, option) => {
                    field.onChange(value ?? null);
                    setResponsibleUserOption(value ? { value, label: option.label } : null);
                  }}
                  onSearchChange={(searchValue) =>
                    userSearch.setFilters(
                      searchValue ? { searchField: 'email', searchValue } : undefined
                    )
                  }
                  filter={({ options }) => options}
                  searchable
                  clearable
                  nothingFoundMessage={userSearch.isLoading ? 'Searching…' : 'No users found'}
                  rightSection={userSearch.isLoading ? <Loader size="xs" /> : undefined}
                  error={fieldState.error?.message}
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
