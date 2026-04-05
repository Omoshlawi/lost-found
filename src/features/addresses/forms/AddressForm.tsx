import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Loader,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useAddressesApi, useAddressLocales } from '../hooks';
import { Address, AddressFormData, AddressLevelKey, AddressLocale } from '../types';
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
      name: address?.name ?? '', // Added Name
      phoneNumber: address?.phoneNumber ?? '', // Added Phone Number
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
      latitude: address?.latitude !== undefined ? Number(address.latitude) : null, // Handle string-to-number if needed
      longitude: address?.longitude !== undefined ? Number(address.longitude) : null,
      plusCode: address?.plusCode ?? '',
      startDate: address?.startDate ?? undefined,
      endDate: address?.endDate ?? undefined,
      preferred: address?.preferred ?? false,
      formatted: address?.formatted ?? '',
      localeId: address?.localeId ?? undefined, // Added Locale ID tracking
    }),
    [address]
  );

  const form = useForm<AddressFormData>({
    defaultValues,
    resolver: zodResolver(AddressSchema),
  });

  const { createAddress, updateAddress, mutateAddresses, mutateAddress } = useAddressesApi();
  const { locales, isLoading: isLoadingLocales } = useAddressLocales({ pageSize: 100 });
  const localeList: AddressLocale[] =
    (locales as any)?.results ?? (Array.isArray(locales) ? locales : []);

  const [selectedLocaleId, setSelectedLocaleId] = useState<string | null>(
    address?.localeId ?? null
  );
  const [appliedLocaleId, setAppliedLocaleId] = useState<string | null>(address?.localeId ?? null);
  const countryValue = form.watch('country');

  const selectedLocale = useMemo(
    () => localeList.find((locale) => locale.id === selectedLocaleId) ?? null,
    [localeList, selectedLocaleId]
  );

  const localeOptions = useMemo(() => {
    if (!localeList || !localeList.length) {
      return [];
    }
    const groups: Record<string, { value: string; label: string }[]> = {};
    localeList.forEach((locale: any) => {
      const key = locale.country || 'Other';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push({
        value: locale.id,
        label: `${locale.code.toUpperCase()} • ${locale.regionName}`,
      });
    });
    return Object.entries(groups).map(([group, items]) => ({ group, items }));
  }, [localeList]);

  const filteredLocaleOptions = useMemo(() => {
    if (!countryValue || !localeOptions.length) {
      return localeOptions;
    }
    const filtered = localeOptions.filter((groupObj) => groupObj.group === countryValue);
    return filtered.length ? filtered : localeOptions;
  }, [countryValue, localeOptions]);

  const preferredFieldSet = useMemo(
    () => new Set(selectedLocale?.formatSpec.metadata?.preferredFields ?? []),
    [selectedLocale]
  );

  const levelMeta = useMemo(() => {
    const base = LEVEL_FIELDS.reduce<
      Record<AddressLevelKey, { label: string; required: boolean; helperText?: string }>
    >(
      (acc, level) => {
        acc[level] = {
          label: level.toUpperCase(),
          required: level === 'level1',
        };
        return acc;
      },
      {} as Record<AddressLevelKey, { label: string; required: boolean; helperText?: string }>
    );

    if (selectedLocale) {
      selectedLocale.formatSpec.levels.forEach((spec) => {
        base[spec.level as AddressLevelKey] = {
          label: spec.label,
          required: spec.required,
          helperText: spec.helperText ?? undefined,
        };
      });
    }
    return base;
  }, [selectedLocale]);

  const postalSpec = selectedLocale?.formatSpec.postalCode;
  const localeInstructions = selectedLocale?.formatSpec.metadata?.instructions;
  const preferredFieldsList = selectedLocale?.formatSpec.metadata?.preferredFields ?? [];
  const localeTemplate = selectedLocale?.formatSpec.displayTemplate;

  const handleLocaleChange = (value: string | null) => {
    setSelectedLocaleId(value);
    form.setValue('localeId', value ?? undefined, { shouldDirty: true }); // Sync with form data
    if (!value) {
      setAppliedLocaleId(null);
    }
  };

  useEffect(() => {
    if (!selectedLocale) {
      return;
    }
    if (appliedLocaleId === selectedLocale.id) {
      return;
    }
    selectedLocale.formatSpec.levels.forEach((spec: any) => {
      form.setValue(`localeFormat.${spec.level}` as any, spec.label ?? '', { shouldDirty: true });
    });
    setAppliedLocaleId(selectedLocale.id);
  }, [selectedLocale, appliedLocaleId, form]);

  useEffect(() => {
    if (!selectedLocale || !countryValue) {
      return;
    }
    if (selectedLocale.country !== countryValue) {
      setSelectedLocaleId(null);
      form.setValue('localeId', undefined);
      setAppliedLocaleId(null);
    }
  }, [countryValue, selectedLocale, form]);

  useEffect(() => {
    if (address) {
      return;
    }
    if (selectedLocaleId || !countryValue) {
      return;
    }
    const match = localeList.find((locale) => !locale.voided && locale.country === countryValue);
    if (match) {
      setSelectedLocaleId(match.id);
      form.setValue('localeId', match.id);
    }
  }, [address, countryValue, localeList, selectedLocaleId, form]);

  useEffect(() => {
    if (countryValue) {
      return;
    }
    setSelectedLocaleId(null);
    form.setValue('localeId', undefined);
    setAppliedLocaleId(null);
  }, [countryValue, form]);

  const makeLabel = (labelText: string, fieldKey: string) => {
    if (!preferredFieldSet.has(fieldKey)) {
      return labelText;
    }
    return (
      <Group gap={4}>
        <Text>{labelText}</Text>
        <Badge size="xs" color="blue" variant="light">
          Preferred
        </Badge>
      </Group>
    );
  };

  const onSubmit: SubmitHandler<AddressFormData> = async (values) => {
    try {
      // Ensure latitude and longitude are correctly handled based on your API needs (e.g. converting toString if required)
      const { localeFormat, ...restValues } = values;
      const payload = {
        ...restValues,
        localeId: selectedLocaleId ?? undefined, // Ensure localeId is sent
      };

      const result = address
        ? await updateAddress(address.id, payload)
        : await createAddress(payload);

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
                <TextInput
                  {...field}
                  label="Label"
                  placeholder="e.g. Primary Office"
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Added Name field */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Name / Contact Person"
                  placeholder="e.g. Paul Kaara"
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Added Phone Number field */}
            <Controller
              control={form.control}
              name="phoneNumber"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Phone Number"
                  placeholder="e.g. 741072844"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="address1"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={makeLabel('Address line 1', 'address1')}
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="address2"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={makeLabel('Address line 2', 'address2')}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="landmark"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={makeLabel('Landmark', 'landmark')}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* Restored Address Locale Select */}
            <Select
              label="Address locale"
              placeholder={
                countryValue ? 'Select a locale for this country' : 'Set country to filter locales'
              }
              searchable
              data={filteredLocaleOptions || []}
              value={selectedLocaleId}
              onChange={handleLocaleChange}
              nothingFoundMessage={
                countryValue ? 'No locales available for this country' : 'No locales available'
              }
              clearable
              disabled={isLoadingLocales || (!filteredLocaleOptions.length && !selectedLocaleId)}
              rightSection={isLoadingLocales ? <Loader size="xs" /> : undefined}
            />

            <Controller
              control={form.control}
              name="preferred"
              render={({ field }) => (
                <Switch
                  mt="md"
                  checked={field.value}
                  label="Preferred address"
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              )}
            />
          </SimpleGrid>

          {selectedLocale && (
            <Paper withBorder p="md" radius="md">
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={0}>
                    <Text fw={600}>{selectedLocale.regionName}</Text>
                    <Text size="sm" c="dimmed">
                      {selectedLocale.country} • {selectedLocale.code}
                    </Text>
                  </Stack>
                  {selectedLocale.tags && selectedLocale.tags.length > 0 && (
                    <Group gap={4}>
                      {selectedLocale?.tags?.map((tag: string) => (
                        <Badge key={tag} variant="light" color="blue">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </Group>
                {localeInstructions && (
                  <Alert color="blue" variant="light" title="Locale instructions">
                    {localeInstructions}
                  </Alert>
                )}
                {localeTemplate && (
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed">
                      Display template
                    </Text>
                    <Text size="sm" ff="monospace">
                      {localeTemplate}
                    </Text>
                  </Stack>
                )}
                {preferredFieldsList.length > 0 && (
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      Preferred fields
                    </Text>
                    <Group gap={4}>
                      {preferredFieldsList?.map((field: string) => (
                        <Badge key={field} variant="outline">
                          {field}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Paper>
          )}

          {sectionTitle('Administrative levels')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {LEVEL_FIELDS?.map((level) => (
              <Controller
                key={level}
                control={form.control}
                name={level}
                render={({ field, fieldState }) => (
                  <TextInput
                    value={field.value ?? ''}
                    onChange={(event) => field.onChange(event.currentTarget.value)}
                    label={makeLabel(levelMeta[level].label, level)}
                    required={levelMeta[level].required}
                    description={levelMeta[level].helperText}
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
                <TextInput
                  {...field}
                  label={makeLabel(postalSpec?.label ?? 'Postal code', 'postalCode')}
                  required={postalSpec?.required ?? false}
                  description={postalSpec?.description ?? undefined}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="plusCode"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label={makeLabel('Plus code', 'plusCode')}
                  error={fieldState.error?.message}
                />
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
            {LEVEL_FIELDS?.map((level) => {
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
