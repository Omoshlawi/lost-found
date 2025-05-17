import React, { useMemo, useState } from 'react';
import { FieldPath, useFormContext } from 'react-hook-form';
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  MultiSelect,
  Stack,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { TablerIcon } from '@/components';
import { flattenObjectToPairs } from '@/lib/utils';
import { DocumentReportFormData } from '../../types';
import { DocumentSchema } from '../../utils';
import DocumentScanForm from '../DocumentScanForm';
import DocumentFormInputs from './DocumentFormInputs';

type DocumentInfoStepsProps = {
  onPrevious?: () => void;
};
const DocumentInfoSteps: React.FC<DocumentInfoStepsProps> = ({ onPrevious }) => {
  const form = useFormContext<DocumentReportFormData>();
  const fields = useMemo(() => DocumentSchema.keyof().options, []);
  const [enabledFields, setEnabledFields] = useState<
    Array<FieldPath<DocumentReportFormData['document']>>
  >([]);
  const handleFieldToggle = (field: FieldPath<DocumentReportFormData['document']>) => {
    setEnabledFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };
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
                const id = modals.open({
                  fullScreen: true,
                  title: 'Scan document',
                  children: (
                    <DocumentScanForm
                      onImport={(data) => {
                        flattenObjectToPairs(data).forEach(([field, value]) => {
                          if (!['typeId', 'images'].includes(field) && value) {
                            setEnabledFields((prev) => {
                              // if already enabled then do nothing
                              if (prev.includes(field as any)) return prev;
                              if (
                                field.startsWith('additionalFields') &&
                                prev.find((p) => p.startsWith('additionalFields'))
                              )
                                return prev;
                              if (field.startsWith('additionalFields'))
                                return [...prev, 'additionalFields'];
                              return [...prev, field as any];
                            });
                            form.setValue(`document.${field}` as any, value);
                          }
                        });
                        modals.close(id);
                      }}
                    />
                  ),
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
        <MultiSelect
          label="Enabled fields"
          placeholder="Pick fields"
          data={fields}
          value={enabledFields}
          clearable
          hidePickedOptions
          onChange={(value) =>
            setEnabledFields(value as Array<FieldPath<DocumentReportFormData['document']>>)
          }
        />
        <DocumentFormInputs enabledFields={enabledFields} />
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
