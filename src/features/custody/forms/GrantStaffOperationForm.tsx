import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Loader, MultiSelect, Select, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { useSearchStation } from '@/hooks/useSearchStation';
import { useSearchUser } from '@/hooks/usesearchUser';
import { handleApiErrors } from '@/lib/api';
import { grantStaffStationOperation, useDocumentOperationTypes } from '../hooks/useCustody';
import { GrantStaffOperationFormData } from '../types';
import { GrantStaffOperationSchema } from '../utils/validation';

interface GrantStaffOperationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const GrantStaffOperationForm: React.FC<GrantStaffOperationFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const form = useForm<GrantStaffOperationFormData>({
    defaultValues: { userId: '', stationId: '', operationTypeIds: [] },
    resolver: zodResolver(GrantStaffOperationSchema),
  });

  const userSearch = useSearchUser();
  const stationSearch = useSearchStation();
  const { operationTypes } = useDocumentOperationTypes({ limit: 100 });

  // Keep selected options in state so labels persist after search clears
  const [selectedUserOption, setSelectedUserOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedStationOption, setSelectedStationOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const userOptions = [
    ...(selectedUserOption ? [selectedUserOption] : []),
    ...userSearch.users
      .filter((u) => u.id !== selectedUserOption?.value)
      .map((u) => ({ value: u.id, label: u.name ?? u.email })),
  ];

  const stationOptions = [
    ...(selectedStationOption ? [selectedStationOption] : []),
    ...stationSearch.stations
      .filter((s) => s.id !== selectedStationOption?.value)
      .map((s) => ({ value: s.id, label: `${s.name} (${s.code})` })),
  ];

  const operationTypeOptions = operationTypes
    .filter((o) => !o.voided)
    .map((o) => ({ label: o.name, value: o.id }));

  const handleSubmit: SubmitHandler<GrantStaffOperationFormData> = async (data) => {
    try {
      const grants = await grantStaffStationOperation(data);
      const count = grants?.length ?? data.operationTypeIds.length;
      showNotification({
        title: 'Granted',
        message: `${count} operation grant${count === 1 ? '' : 's'} created.`,
        color: 'green',
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      const e = handleApiErrors<GrantStaffOperationFormData>(error);
      if (e.detail) {
        showNotification({ title: 'Error', message: e.detail, color: 'red' });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof GrantStaffOperationFormData, { message: val as string })
        );
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} style={{ flex: 1, flexDirection: 'column' }}>
      <Stack p="md" h="100%" justify="space-between">
        <Stack gap="md">
          <Controller
            control={form.control}
            name="userId"
            render={({ field, fieldState }) => (
              <Select
                label="Staff Member"
                placeholder="Search by email..."
                data={userOptions}
                value={field.value || null}
                onChange={(value, option) => {
                  field.onChange(value ?? '');
                  setSelectedUserOption(value ? { value, label: option.label } : null);
                }}
                onSearchChange={(searchValue) =>
                  userSearch.setFilters(
                    searchValue ? { searchField: 'email', searchValue } : undefined
                  )
                }
                filter={({ options }) => options}
                searchable
                clearable
                nothingFoundMessage={userSearch.isLoading ? 'Searching...' : 'No users found'}
                rightSection={userSearch.isLoading ? <Loader size="xs" /> : undefined}
                error={fieldState.error?.message}
                required
              />
            )}
          />

          <Controller
            control={form.control}
            name="stationId"
            render={({ field, fieldState }) => (
              <Select
                label="Station"
                placeholder="Search by name or code..."
                data={stationOptions}
                value={field.value || null}
                onChange={(value, option) => {
                  field.onChange(value ?? '');
                  setSelectedStationOption(value ? { value, label: option.label } : null);
                }}
                onSearchChange={(searchValue) =>
                  stationSearch.setFilters(searchValue ? { search: searchValue } : undefined)
                }
                filter={({ options }) => options}
                searchable
                clearable
                nothingFoundMessage={stationSearch.isLoading ? 'Searching...' : 'No stations found'}
                rightSection={stationSearch.isLoading ? <Loader size="xs" /> : undefined}
                error={fieldState.error?.message}
                required
              />
            )}
          />

          <Controller
            control={form.control}
            name="operationTypeIds"
            render={({ field, fieldState }) => (
              <MultiSelect
                label="Operation Types"
                placeholder="Select one or more operations"
                data={operationTypeOptions}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                required
                searchable
                hidePickedOptions
              />
            )}
          />
        </Stack>

        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={onClose}>
            Cancel
          </Button>
          <Button
            flex={1}
            radius={0}
            type="submit"
            leftSection={<TablerIcon name="userPlus" size={14} />}
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Grant Access
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default GrantStaffOperationForm;
