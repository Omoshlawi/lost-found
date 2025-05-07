import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Group, Stack } from '@mantine/core';
import { DocumentReportFormData } from '../../types';
import DocumentFormInputs from './DocumentFormInputs';

type DocumentInfoStepsProps = {
  onPrevious?: () => void;
};
const DocumentInfoSteps: React.FC<DocumentInfoStepsProps> = ({ onPrevious }) => {
  const form = useFormContext<DocumentReportFormData>();

  return (
    <Stack justify="space-between" flex={1} h={'100%'}>
      <Stack>
        <DocumentFormInputs />
      </Stack>
      <Group gap={1}>
        <Button variant="default" radius={0} flex={1} onClick={onPrevious}>
          Previous
        </Button>
        <Button radius={0} flex={1} type="submit" loading={form.formState.isSubmitting}>
          Submit
        </Button>
      </Group>
    </Stack>
  );
};

export default DocumentInfoSteps;
