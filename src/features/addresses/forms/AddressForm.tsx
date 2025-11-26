import React, { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import {
  Button,
  Divider,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { handleApiErrors } from '@/lib/api';
import { useAddressesApi } from '../hooks';
import { Address, AddressFormData, AddressLevelKey } from '../types';
import { AddressSchema } from '../utils/validation';

type AddressFormProps = {
  address?: Address;
  onSuccess?: (address: Address) => void;
  closeWorkspace?: () => void;
};

const LEVEL_FIELDS: AddressLevelKey[] = ['level1', 'level2', 'level3', 'level4', 'level5'];
type LocaleFormatFieldPath = `localeFormat.${AddressLevelKey}`;

const AddressForm: React.FC<AddressFormProps> = ({ address, onSuccess, closeWorkspace }) => {
  const defaultValues = useMemo<AddressFormData>(
    () => ({
      type: address?.type ?? 'OTHER',
      label: address?.label ?? '',
      address1: address?.address1 ?? '',
      address2: address?.address2 ?? '',
      landmark: address?.landmark ?? '',
      level1: address?.level1 ?? '',
      level2: address?.level2 ?? '',
      level3: address?.level3 ?? '',
      level4: address?.level4 ?? '',
      level5: address?.level5 ?? '',
      cityVillage: address?.cityVillage ?? '',
      stateProvince: address?.stateProvince ?? '',
      country: address?.country ?? '',
      postalCode: address?.postalCode ?? '',
      latitude: address?.latitude ?? null,
      longitude: address?.longitude ?? null,
      plusCode: address?.plusCode ?? '',
      startDate: address?.startDate ?? undefined,
      endDate: address?.endDate ?? undefined,
      preferred: address?.preferred ?? false,
      formatted: address?.formatted ?? '',
      localeFormat: {
        level1: address?.localeFormat?.level1 ?? '',
        level2: address?.localeFormat?.level2 ?? '',
        level3: address?.localeFormat?.level3 ?? '',
        level4: address?.localeFormat?.level4 ?? '',
        level5: address?.localeFormat?.level5 ?? '',
      },
    }),
    [address]
  );

  const form = useForm<AddressFormData>({
    defaultValues,
    resolver: zodResolver(AddressSchema),
  });

  const { createAddress, updateAddress, mutateAddresses, mutateAddress } = useAddressesApi();

  const onSubmit: SubmitHandler<AddressFormData> = async (values) => {
    try {
      const result = address ? await updateAddress(address.id, values) : await createAddress(values);
      showNotification({
        title: 'Success',
        message: `Address ${address ? 'updated' : 'created'} successfully`,
        color: 'green',
      });
      onSuccess?.(result);
      mutateAddresses();
      mutateAddress(result.id);
      closeWorkspace?.();
    } catch (error) {
      const validation = handleApiErrors<AddressFormData>(error);
      if (validation.detail) {
        showNotification({
          title: 'Error saving address',
          message: validation.detail,
          color: 'red',
        });
        return;
      }
      Object.entries(validation).forEach(([field, message]) => {
        form.setError(field as keyof AddressFormData, { message: message as string });
      });
    }
  };

  const sectionTitle = (label: string) => (
    <Divider
      labelPosition="left"
      label={
        <Text size="sm" fw={600}>
          {label}
        </Text>
      }
    />
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} style={{ height: '100%' }}>
      <Stack gap="lg" p="md" h="100%" justify="space-between">
        <Stack gap="md" style={{ flex: 1, overflowY: 'auto' }}>
          {sectionTitle('General')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Select
                  label="Type"
                  data={[
                    { value: 'HOME', label: 'Home' },
                    { value: 'WORK', label: 'Work' },
                    { value: 'BILLING', label: 'Billing' },
                    { value: 'SHIPPING', label: 'Shipping' },
                    { value: 'OFFICE', label: 'Office' },
                    { value: 'OTHER', label: 'Other' },
                  ]}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  error={fieldState.error?.message}
                  placeholder="Select type"
                />
              )}
            />
            <Controller
              control={form.control}
              name="label"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="Label" error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="address1"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Address line 1"
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="address2"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="Address line 2" error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="landmark"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="Landmark" error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="preferred"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  label="Preferred address"
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              )}
            />
          </SimpleGrid>

          {sectionTitle('Administrative levels')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {LEVEL_FIELDS.map((level) => (
              <Controller
                key={level}
                control={form.control}
                name={level}
                render={({ field, fieldState }) => (
                  <TextInput
                    value={field.value ?? ''}
                    onChange={(event) => field.onChange(event.currentTarget.value)}
                    label={level.toUpperCase()}
                    required={level === 'level1'}
                    error={fieldState.error?.message}
                  />
                )}
              />
            ))}
          </SimpleGrid>

          {sectionTitle('Legacy & Contact')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              control={form.control}
              name="cityVillage"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="City or Village" error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="stateProvince"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="State / Province" error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Country (ISO alpha-2)"
                  maxLength={2}
                  onChange={(event) => field.onChange(event.currentTarget.value.toUpperCase())}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="postalCode"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="Postal code" error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="plusCode"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="Plus code" error={fieldState.error?.message} />
              )}
            />
          </SimpleGrid>

          {sectionTitle('Geolocation')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              control={form.control}
              name="latitude"
              render={({ field, fieldState }) => (
                <NumberInput
                  value={field.value ?? undefined}
                  onChange={(value) => field.onChange(value === '' ? null : value)}
                  label="Latitude"
                  error={fieldState.error?.message}
                  step={0.000001}
                  min={-90}
                  max={90}
                />
              )}
            />
            <Controller
              control={form.control}
              name="longitude"
              render={({ field, fieldState }) => (
                <NumberInput
                  value={field.value ?? undefined}
                  onChange={(value) => field.onChange(value === '' ? null : value)}
                  label="Longitude"
                  error={fieldState.error?.message}
                  step={0.000001}
                  min={-180}
                  max={180}
                />
              )}
            />
          </SimpleGrid>

          {sectionTitle('Locale format')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {LEVEL_FIELDS.map((level) => {
              const fieldName = `localeFormat.${level}` as LocaleFormatFieldPath;
              return (
                <Controller
                  key={`locale-${level}`}
                  control={form.control}
                  name={fieldName}
                  render={({ field, fieldState }) => (
                    <TextInput
                      value={field.value ?? ''}
                      onChange={(event) => field.onChange(event.currentTarget.value)}
                      label={`${level.toUpperCase()} label`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              );
            })}
          </SimpleGrid>

          {sectionTitle('Metadata')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              control={form.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <DateInput
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) => field.onChange(value ? value.toISOString() : undefined)}
                  label="Start date"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <DateInput
                  value={field.value ? new Date(field.value) : null}
                  onChange={(value) => field.onChange(value ? value.toISOString() : undefined)}
                  label="End date"
                  error={fieldState.error?.message}
                />
              )}
            />
          </SimpleGrid>
          <Controller
            control={form.control}
            name="formatted"
            render={({ field, fieldState }) => (
              <Textarea {...field} label="Formatted (cached)" error={fieldState.error?.message} />
            )}
          />
        </Stack>

        <Group gap="sm">
          <Button variant="default" flex={1} onClick={closeWorkspace}>
            Cancel
          </Button>
          <Button
            type="submit"
            flex={1}
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {address ? 'Update Address' : 'Create Address'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddressForm;

