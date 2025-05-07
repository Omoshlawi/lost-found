import React, { useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, TextInput } from '@mantine/core';
import { InputSkeleton } from '@/components';
import { useLocations } from '../../hooks';
import { DocumentReportFormData } from '../../types';
import { showNotification } from '@mantine/notifications';

const AddressFormInputs = () => {
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
    <>
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
    </>
  );
};

export default AddressFormInputs;
