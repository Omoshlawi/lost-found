import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ActionIcon, Button, Card, Group, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { TablerIcon } from '@/components';
import { DocumentReportFormData } from '../../types';
import DocumentScanForm from '../DocumentScanForm';
import DocumentFormInputs from './DocumentFormInputs';

type DocumentInfoStepsProps = {
  onPrevious?: () => void;
};
const DocumentInfoSteps: React.FC<DocumentInfoStepsProps> = ({ onPrevious }) => {
  const form = useFormContext<DocumentReportFormData>();

  return (
    <Stack justify="space-between" flex={1} h={'100%'}>
      <Stack>
        <Card p={0}>
          <Stack gap={0} justify="center">
            <ActionIcon
              size="xxl"
              aria-label="Custom xxl size"
              variant="light"
              component={Stack}
              gap={'md'}
              onClick={() => {
                modals.open({
                  fullScreen: true,
                  title: 'Scan document',
                  children: <DocumentScanForm />,
                });
              }}
            >
              <TablerIcon name="scan" size={80} />
              <br />
            </ActionIcon>
            <Text style={{ textAlign: 'center' }} p={'sm'}>
              Scan Document
            </Text>
          </Stack>
        </Card>
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
