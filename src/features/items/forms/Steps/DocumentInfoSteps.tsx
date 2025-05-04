import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, Button, Group, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { DocumentReportFormData } from '../../types';

type DocumentInfoStepsProps = {
  onPrevious?: () => void;
};
const DocumentInfoSteps: React.FC<DocumentInfoStepsProps> = ({ onPrevious }) => {
  const form = useFormContext<DocumentReportFormData>();

  return (
    <Stack justify="space-between" flex={1} h={'100%'}>
      <Stack>
        <Controller
          control={form.control}
          name="document.typeId"
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              data={['type 1', 'type 2']}
              label="Document Type"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="document.ownerName"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="Owner name" error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={form.control}
          name="document.issuer"
          render={({ field, fieldState }) => (
            <TextInput {...field} label="Issuer" error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={form.control}
          name="document.serialNumber"
          render={({ field, fieldState }) => (
            <TextInput
              {...field}
              label="Unique document number"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="document.expiryDate"
          render={({ field, fieldState }) => (
            <DateInput {...field} label="Expiry date" error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={form.control}
          name="document.issuanceDate"
          render={({ field, fieldState }) => (
            <DateInput {...field} label="Issuance date" error={fieldState.error?.message} />
          )}
        />
      </Stack>
      <Group gap={1}>
        <Button variant="default" radius={0} flex={1} onClick={onPrevious}>
          Previous
        </Button>
        <Button radius={0} flex={1} type="submit">
          Submit
        </Button>
      </Group>
    </Stack>
  );
};

export default DocumentInfoSteps;
