import { Controller, useFormContext } from 'react-hook-form';
import {
  Autocomplete,
  SegmentedControl,
  Select,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { DocumentReportFormData } from '../../types';

const BasicReportInfoStep = () => {
  const form = useFormContext<DocumentReportFormData>();
  const observableReportType = form.watch('type');
  return (
    <Stack>
      <Controller
        control={form.control}
        name="type"
        render={({ field, fieldState }) => (
          <Stack>
            <SegmentedControl
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
              data={[
                { label: 'Found Item Report', value: 'FOUND' },
                { label: 'Lost Item Report', value: 'LOST' },
              ]}
            />
            {fieldState.error?.message && <Text c={'red'}>{fieldState.error?.message}</Text>}
          </Stack>
        )}
      />
      {observableReportType === 'LOST' && (
        <>
          <Controller
            control={form.control}
            name="lost.contactPreference"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Contact preference"
                data={[
                  { label: 'App', value: 'APP' },
                  { label: 'Email', value: 'EMAIL' },
                  { label: 'Phone', value: 'PHONE' },
                  { label: 'Any', value: 'ANY' },
                ]}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="lost.urgencyLevel"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Ugency level"
                data={[
                  { label: 'Low', value: 'LOW' },
                  { label: 'Normal', value: 'NORMAL' },
                  { label: 'High', value: 'HIGH' },
                  { label: 'Critical', value: 'CRITICAL' },
                ]}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="lost.identifyingMarks"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                value={field.value as string}
                label="Identifying marks"
                error={fieldState.error?.message}
              />
            )}
          />
        </>
      )}
      {observableReportType === 'FOUND' && (
        <>
          <Controller
            control={form.control}
            name="found.handoverPreference"
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Handover preference"
                data={[
                  { label: 'In person', value: 'IN_PERSON' },
                  { label: 'Through authority', value: 'THROUGH_AUTHORITY' },
                  { label: 'Through third party', value: 'THIRD_PARTY' },
                  { label: 'Through mail', value: 'MAIL' },
                ]}
                error={fieldState.error?.message}
              />
            )}
          />
        </>
      )}
      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Textarea {...field} label="Description" error={fieldState.error?.message} />
        )}
      />
      <Controller
        control={form.control}
        name="tags"
        render={({ field, fieldState }) => (
          <TagsInput {...field} label="Tags" error={fieldState.error?.message} />
        )}
      />
      <Controller
        control={form.control}
        name="countyCode"
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            data={['React', 'Angular', 'Vue', 'Svelte']}
            label="County"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="subCountyCode"
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            data={['React', 'Angular', 'Vue', 'Svelte']}
            label="Sub county"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="wardCode"
        render={({ field, fieldState }) => (
          <Autocomplete
            {...field}
            data={['React', 'Angular', 'Vue', 'Svelte']}
            label="Ward"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="landMark"
        render={({ field, fieldState }) => (
          <TextInput {...field} label="Landmark" error={fieldState.error?.message} />
        )}
      />
      <Controller
        control={form.control}
        name="lostOrFoundDate"
        render={({ field, fieldState }) => (
          <DateInput {...field} label={'Date lost or found'} error={fieldState.error?.message} />
        )}
      />
    </Stack>
  );
};

export default BasicReportInfoStep;
