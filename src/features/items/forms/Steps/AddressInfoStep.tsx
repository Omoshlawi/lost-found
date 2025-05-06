import { InputSkeleton } from '@/components';
import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React, { useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useLocations } from '../../hooks';
import { DocumentReportFormData } from '../../types';

type AddressInfoStepProps = {
  onPrevious?: () => void;
  onNext?: () => void;
};
const AddressInfoStep: React.FC<AddressInfoStepProps> = ({ onPrevious, onNext }) => {
  const form = useFormContext<DocumentReportFormData>();
  const observableCounty = form.watch('countyCode');
  const observableSubCounty = form.watch('subCountyCode');
  const { locations, error, isLoading } = useLocations();
  const subCounties = useMemo(
    () => locations.find((l) => l.code === observableCounty)?.subCounties ?? [],
    [observableCounty, locations]
  );
  const wards = useMemo(
    () => subCounties.find((l) => l.code === observableSubCounty)?.wards ?? [],
    [observableSubCounty, subCounties]
  );

  useEffect(() => {
    form.setValue('subCountyCode', '');
    form.setValue('wardCode', '');
  }, [observableCounty, form.setValue]);

  useEffect(() => {
    form.setValue('wardCode', '');
  }, [observableSubCounty, form.setValue]);

  useEffect(() => {
    if (error) {
      showNotification({
        message: error?.message ?? 'An error ocuured while fetching locations',
        title: 'Error loading locations',
      });
    }
  }, [error]);

  return (
    <Stack justify="space-between" flex={1} h={'100%'}>
      <Stack>
        <Controller
          control={form.control}
          name="countyCode"
          render={({ field, fieldState }) =>
            isLoading ? (
              <InputSkeleton />
            ) : (
              <Select
                {...field}
                data={locations.map((l) => ({ value: l.code, label: l.name }))}
                label="County"
                error={fieldState.error?.message}
              />
            )
          }
        />
        <Controller
          control={form.control}
          name="subCountyCode"
          render={({ field, fieldState }) =>
            isLoading ? (
              <InputSkeleton />
            ) : (
              <Select
                {...field}
                data={subCounties.map((l) => ({ value: l.code, label: l.name }))}
                label="Sub county"
                error={fieldState.error?.message}
              />
            )
          }
        />
        <Controller
          control={form.control}
          name="wardCode"
          render={({ field, fieldState }) =>
            isLoading ? (
              <InputSkeleton />
            ) : (
              <Select
                {...field}
                data={wards.map((l) => ({ value: l.code, label: l.name }))}
                label="Ward"
                error={fieldState.error?.message}
              />
            )
          }
        />
        <Controller
          control={form.control}
          name="landMark"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="Landmark" error={fieldState.error?.message} />
          )}
        />
      </Stack>
      <Group gap={1}>
        <Button variant="default" radius={0} flex={1} onClick={onPrevious}>
          Previous
        </Button>
        <Button
          radius={0}
          flex={1}
          onClick={async () => {
            const isValid = await form.trigger(
              ['countyCode', 'subCountyCode', 'wardCode', 'landMark'],
              { shouldFocus: true }
            );
            if (isValid) onNext?.();
          }}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
};

export default AddressInfoStep;
