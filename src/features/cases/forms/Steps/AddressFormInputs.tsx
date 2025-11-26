import React, { useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { InputSkeleton } from '@/components';
import { useLocations } from '../../hooks';
import { DocumentReportFormData } from '../../types';

const AddressFormInputs = () => {
  const form = useFormContext<DocumentReportFormData>();
  const { watch, setValue } = form;

  const countyCode = watch('countyCode');
  const subCountyCode = watch('subCountyCode');
  const wardCode = watch('wardCode');

  const { locations, error, isLoading } = useLocations();

  const subCounties = useMemo(
    () => locations.find((l) => l.code === countyCode)?.subCounties ?? [],
    [countyCode, locations]
  );

  const wards = useMemo(
    () => subCounties.find((l) => l.code === subCountyCode)?.wards ?? [],
    [subCountyCode, subCounties]
  );

  // Only reset subCounty if county changes AND locations are loaded AND the current subCounty doesn't belong to the new county
  useEffect(() => {
    if (countyCode && subCountyCode && locations.length > 0) {
      const isValidSubCounty = subCounties.some((sc) => sc.code === subCountyCode);
      if (!isValidSubCounty) {
        setValue('subCountyCode', '');
      }
    }
  }, [countyCode, subCountyCode, subCounties, setValue, locations]);

  // Similar logic for ward, ensuring locations and subCounties are loaded
  useEffect(() => {
    if (subCountyCode && wardCode && subCounties.length > 0) {
      const isValidWard = wards.some((w) => w.code === wardCode);
      if (!isValidWard) {
        setValue('wardCode', '');
      }
    }
  }, [subCountyCode, wardCode, wards, setValue, subCounties]);

  useEffect(() => {
    if (error) {
      showNotification({
        message: error?.message ?? 'An error occurred while fetching locations',
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
              value={field.value || null}
              data={locations.map((l) => ({ value: l.code, label: l.name }))}
              label="County"
              error={fieldState.error?.message}
              nothingFoundMessage="Nothing found..."
              searchable
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
              value={field.value || null}
              data={subCounties.map((l) => ({ value: l.code, label: l.name }))}
              label="Sub county"
              error={fieldState.error?.message}
              searchable
              nothingFoundMessage="Nothing found..."
              disabled={!countyCode}
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
              value={field.value || null}
              data={wards.map((l) => ({ value: l.code, label: l.name }))}
              label="Ward"
              error={fieldState.error?.message}
              searchable
              nothingFoundMessage="Nothing found..."
              disabled={!subCountyCode}
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
