import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Button,
  Group,
  SegmentedControl,
  Select,
  Stack,
  TagsInput,
  Text,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { DocumentCaseFormData } from '../../types';

type BasicReportInfoStepProps = {
  onCancel?: () => void;
  onNext?: () => void;
};
const BasicReportInfoStep: React.FC<BasicReportInfoStepProps> = ({ onCancel, onNext }) => {
  const form = useFormContext<DocumentCaseFormData>();
  const observableReportType = form.watch('type');
  useEffect(() => {
    if (observableReportType === 'FOUND') {
      form.setValue('lost', undefined);
    }
    if (observableReportType === 'LOST') {
      form.setValue('found', undefined);
    }
  }, [observableReportType, form.setValue]);
  return (
    <Stack justify="space-between" flex={1} h={'100%'}>
      <Stack>
        <Controller
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <Stack gap={1}>
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
          name="lostOrFoundDate"
          render={({ field, fieldState }) => (
            <DateInput {...field} label={'Date lost or found'} error={fieldState.error?.message} />
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
      </Stack>
      <Group gap={1}>
        <Button variant="default" radius={0} flex={1} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          radius={0}
          flex={1}
          onClick={async () => {
            const isValid = await form.trigger(
              [
                'type',
                'description',
                'tags',
                'lostOrFoundDate',
                ...((observableReportType === 'FOUND' ? ['found.handoverPreference'] : []) as any),
                ...(observableReportType === 'LOST'
                  ? ['lost.contactPreference', 'lost.urgencyLevel', 'lost.identifyingMarks']
                  : []),
              ],
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

export default BasicReportInfoStep;
