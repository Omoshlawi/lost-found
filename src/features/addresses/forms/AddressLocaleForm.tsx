import React, { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  Control,
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useAddressLocalesApi } from '../hooks';
import { AddressLocale, AddressLocaleFormData, AddressLevelKey } from '../types';
import { AddressLocaleFormSchema } from '../utils/validation';

type AddressLocaleFormProps = {
  locale?: AddressLocale;
  closeWorkspace?: () => void;
  onSuccess?: (locale: AddressLocale) => void;
};

const LEVEL_OPTIONS: { value: AddressLevelKey; label: string }[] = [
  { value: 'level1', label: 'Level 1' },
  { value: 'level2', label: 'Level 2' },
  { value: 'level3', label: 'Level 3' },
  { value: 'level4', label: 'Level 4' },
  { value: 'level5', label: 'Level 5' },
];

const AddressLocaleForm: React.FC<AddressLocaleFormProps> = ({ locale, closeWorkspace, onSuccess }) => {
  const defaultValues = useMemo(() => buildDefaultValues(locale), [locale]);
  const form = useForm<AddressLocaleFormData>({
    defaultValues,
    resolver: zodResolver(AddressLocaleFormSchema),
  });

  const levelArray = useFieldArray({
    control: form.control,
    name: 'formatSpec.levels',
  });

  const validationRulesArray = useFieldArray({
    control: form.control,
    name: 'formatSpec.metadata.validationRules',
  });

  const examplesArray = useFieldArray({
    control: form.control,
    name: 'examples',
  });

  const { createAddressLocale, updateAddressLocale, mutateAddressLocales, mutateAddressLocale } =
    useAddressLocalesApi();

  const onSubmit: SubmitHandler<AddressLocaleFormData> = async (values) => {
    try {
      const result = locale
        ? await updateAddressLocale(locale.id, values)
        : await createAddressLocale(values);

      showNotification({
        title: 'Success',
        message: `Address locale ${locale ? 'updated' : 'created'} successfully`,
        color: 'green',
      });
      onSuccess?.(result);
      mutateAddressLocales();
      if (locale) {
        mutateAddressLocale(locale.id);
      }
      closeWorkspace?.();
    } catch (error) {
      const validation = handleApiErrors<AddressLocaleFormData>(error);
      if (validation.detail) {
        showNotification({
          title: 'Error saving locale',
          message: validation.detail,
          color: 'red',
        });
        return;
      }
      Object.entries(validation).forEach(([field, message]) => {
        form.setError(field as keyof AddressLocaleFormData, { message: message as string });
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
      <Stack p="md" gap="lg" h="100%" justify="space-between">
        <Stack gap="lg" style={{ flex: 1, overflowY: 'auto' }}>
          {sectionTitle('Basics')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="Code" required error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Country"
                  maxLength={2}
                  onChange={(event) => field.onChange(event.currentTarget.value.toUpperCase())}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="regionName"
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label="Region name"
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="tags"
              render={({ field, fieldState }) => (
                <TagsInput
                  {...field}
                  data={field.value ?? []}
                  value={field.value ?? []}
                  label="Tags"
                  placeholder="Add tags"
                  error={fieldState.error?.message}
                  clearable
                />
              )}
            />
          </SimpleGrid>
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Textarea {...field} label="Description" minRows={2} error={fieldState.error?.message} />
            )}
          />

          {sectionTitle('Format levels')}
          <Stack gap="sm">
            {levelArray.fields.map((fieldItem, index) => (
              <Paper key={fieldItem.id} withBorder p="md" radius="md">
                <Stack gap="sm">
                  <Group justify="space-between" align="center">
                    <Text fw={600}>Level #{index + 1}</Text>
                    {levelArray.fields.length > 1 && (
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        aria-label="Remove level"
                        onClick={() => levelArray.remove(index)}
                      >
                        <TablerIcon name='trash' size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <Controller
                      control={form.control}
                      name={`formatSpec.levels.${index}.label`}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          label="Label"
                          required
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`formatSpec.levels.${index}.level`}
                      render={({ field, fieldState }) => (
                        <Select
                          label="Level key"
                          data={LEVEL_OPTIONS}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`formatSpec.levels.${index}.helperText`}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          label="Helper text"
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`formatSpec.levels.${index}.aliases`}
                      render={({ field, fieldState }) => (
                        <TagsInput
                          {...field}
                          data={field.value ?? []}
                          value={field.value ?? []}
                          label="Aliases"
                          placeholder="Add alias"
                          error={fieldState.error?.message}
                          clearable
                        />
                      )}
                    />
                  </SimpleGrid>
                  <Controller
                    control={form.control}
                    name={`formatSpec.levels.${index}.required`}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        label="Required level"
                        onChange={(event) => field.onChange(event.currentTarget.checked)}
                      />
                    )}
                  />
                </Stack>
              </Paper>
            ))}
            <Button
              leftSection={<TablerIcon name='plus' size={16} />}
              variant="light"
              onClick={() =>
                levelArray.append({
                  label: '',
                  level: 'level1',
                  required: true,
                  aliases: [],
                  helperText: '',
                })
              }
            >
              Add level
            </Button>
          </Stack>

          {sectionTitle('Metadata')}
          <Stack gap="md">
            <Controller
              control={form.control}
              name="formatSpec.metadata.instructions"
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  label="Instructions"
                  minRows={2}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="formatSpec.metadata.preferredFields"
              render={({ field, fieldState }) => (
                <TagsInput
                  {...field}
                  data={field.value ?? []}
                  value={field.value ?? []}
                  label="Preferred fields"
                  placeholder="Add field"
                  error={fieldState.error?.message}
                  clearable
                />
              )}
            />
            <Stack gap="xs">
              <Group justify="space-between" align="center">
                <Text fw={600}>Validation rules</Text>
                <Button
                  variant="subtle"
                  size="xs"
                  leftSection={<TablerIcon name='plus' size={14} />}
                  onClick={() =>
                    validationRulesArray.append({
                      field: '',
                      rule: '',
                    })
                  }
                >
                  Add rule
                </Button>
              </Group>
              <Stack gap="sm">
                {validationRulesArray.fields.length === 0 && (
                  <Text size="sm" c="dimmed">
                    No validation rules added yet.
                  </Text>
                )}
                {validationRulesArray.fields.map((fieldItem, index) => (
                  <Group key={fieldItem.id} align="flex-end">
                    <Controller
                      control={form.control}
                      name={`formatSpec.metadata.validationRules.${index}.field`}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          label="Field"
                          required
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                    <Controller
                      control={form.control}
                      name={`formatSpec.metadata.validationRules.${index}.rule`}
                      render={({ field, fieldState }) => (
                        <TextInput
                          {...field}
                          label="Regex / rule"
                          required
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      aria-label="Remove rule"
                      onClick={() => validationRulesArray.remove(index)}
                    >
                      <TablerIcon name='trash' size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Stack>

          {sectionTitle('Postal code')}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Controller
              control={form.control}
              name="formatSpec.postalCode.label"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="Label" error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="formatSpec.postalCode.description"
              render={({ field, fieldState }) => (
                <TextInput {...field} label="Description" error={fieldState.error?.message} />
              )}
            />
            <Controller
              control={form.control}
              name="formatSpec.postalCode.required"
              render={({ field }) => (
                <Switch
                  checked={Boolean(field.value)}
                  label="Postal code required"
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              )}
            />
          </SimpleGrid>

          {sectionTitle('Display template')}
          <Controller
            control={form.control}
            name="formatSpec.displayTemplate"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Template"
                minRows={2}
                error={fieldState.error?.message}
                description="Use handlebars-style tokens e.g. {{address1}}, {{level1}}"
              />
            )}
          />

          {sectionTitle('Examples')}
          <Stack gap="sm">
            {examplesArray.fields.length === 0 && (
              <Text size="sm" c="dimmed">
                No examples added yet.
              </Text>
            )}
            {examplesArray.fields.map((fieldItem, index) => (
              <ExampleCard
                key={fieldItem.id}
                index={index}
                form={form}
                onRemove={() => examplesArray.remove(index)}
              />
            ))}
            <Button
              variant="light"
              leftSection={<TablerIcon name='plus' size={16} />}
              onClick={() =>
                examplesArray.append({
                  label: '',
                  notes: '',
                  addressEntries: [],
                })
              }
            >
              Add example
            </Button>
          </Stack>
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
            {locale ? 'Update locale' : 'Create locale'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddressLocaleForm;

const ExampleCard = ({
  index,
  form,
  onRemove,
}: {
  index: number;
  form: UseFormReturn<AddressLocaleFormData>;
  onRemove: () => void;
}) => {
  const addressEntriesArray = useFieldArray({
    control: form.control as Control<AddressLocaleFormData>,
    name: `examples.${index}.addressEntries`,
  });

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text fw={600}>Example #{index + 1}</Text>
          <ActionIcon variant="subtle" color="red" aria-label="Remove example" onClick={onRemove}>
            <TablerIcon name='trash' size={16} />
          </ActionIcon>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Controller
            control={form.control}
            name={`examples.${index}.label`}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Label"
                required
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name={`examples.${index}.notes`}
            render={({ field, fieldState }) => (
              <TextInput {...field} label="Notes" error={fieldState.error?.message} />
            )}
          />
        </SimpleGrid>
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Text size="sm" fw={600}>
              Address fields
            </Text>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<TablerIcon name='plus' size={14} />}
              onClick={() =>
                addressEntriesArray.append({
                  field: '',
                  value: '',
                })
              }
            >
              Add field
            </Button>
          </Group>
          {addressEntriesArray.fields.length === 0 && (
            <Text size="sm" c="dimmed">
              No address fields yet.
            </Text>
          )}
          <Stack gap="xs">
            {addressEntriesArray.fields.map((fieldItem, entryIndex) => (
              <Group key={fieldItem.id} align="flex-end">
                <Controller
                  control={form.control}
                  name={`examples.${index}.addressEntries.${entryIndex}.field`}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label="Field key"
                      required
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name={`examples.${index}.addressEntries.${entryIndex}.value`}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label="Value"
                      required
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label="Remove field"
                  onClick={() => addressEntriesArray.remove(entryIndex)}
                >
                  <TablerIcon name='trash' size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const buildDefaultValues = (locale?: AddressLocale): AddressLocaleFormData => {
  const defaultLevels = [
    {
      label: 'Level 1',
      level: 'level1' as AddressLevelKey,
      required: true,
      aliases: [],
      helperText: '',
    },
  ];

  const metadata = locale?.formatSpec.metadata;
  const validationRules =
    metadata?.validation
      ? Object.entries(metadata.validation).map(([field, rule]) => ({ field, rule }))
      : [];

  const examples =
    locale?.examples?.map((example) => ({
      label: example.label,
      notes: example.notes ?? '',
      addressEntries: Object.entries(example.address ?? {}).map(([field, value]) => ({
        field,
        value: value ?? '',
      })),
    })) ?? [];

  const normalizedLevels = (locale?.formatSpec.levels ?? defaultLevels).map((level) => ({
    label: level.label,
    level: level.level,
    required: level.required,
    aliases: level.aliases ?? [],
    helperText: level.helperText ?? '',
  }));

  return {
    code: locale?.code ?? '',
    country: locale?.country ?? '',
    regionName: locale?.regionName ?? '',
    description: locale?.description ?? '',
    tags: locale?.tags ?? [],
    formatSpec: {
      displayTemplate: locale?.formatSpec.displayTemplate ?? '',
      levels: normalizedLevels,
      metadata: {
        instructions: metadata?.instructions ?? '',
        preferredFields: metadata?.preferredFields ?? [],
        validationRules,
      },
      postalCode: {
        label: locale?.formatSpec.postalCode?.label ?? '',
        required: locale?.formatSpec.postalCode?.required ?? true,
        description: locale?.formatSpec.postalCode?.description ?? '',
      },
    },
    examples,
  };
};

