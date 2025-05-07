import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Group, Select, Stack, TagsInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { parseDate } from '@/lib/utils';
import { useDocumentReportApi } from '../hooks';
import { DocumentReport, DocumentReportFormData, ReportType } from '../types';
import { DocumentReportSchema, ReportLostOrFoundDocumentSchema } from '../utils';
import AddressFormInputs from './Steps/AddressFormInputs';

type DocumentReportInfoFormProps = {
  report: DocumentReport;
  onSuccess?: (report: DocumentReport) => void;
  closeWorkspace?: () => void;
};

const DocumentReportInfoForm: React.FC<DocumentReportInfoFormProps> = ({
  report,
  onSuccess,
  closeWorkspace,
}) => {
  const isLostReport = report.lostReport !== null;
  const isFoundReport = report.foundReport !== null;
  const reportType: ReportType = isLostReport ? 'Lost' : isFoundReport ? 'Found' : 'Unknown';
  const { updateDocumentReport, mutateDocumentReport } = useDocumentReportApi();
  const form = useForm<DocumentReportFormData>({
    defaultValues: {
      tags: report.tags,
      description: report.description,
      lostOrFoundDate: parseDate(report.lostOrFoundDate),
      countyCode: report.countyCode,
      subCountyCode: report.countyCode,
      wardCode: report.wardCode,
      landMark: report.landMark,
      found:
        reportType === 'Found'
          ? {
              handoverPreference: (report.foundReport?.handoverPreference as any) ?? 'IN_PERSON',
              securityAnswer: report.foundReport?.securityAnswer ?? '',
              securityQuestion: report.foundReport?.securityQuestion ?? '',
            }
          : undefined,
      lost:
        reportType === 'Lost'
          ? {
              contactPreference: (report.lostReport?.contactPreference as any) ?? 'ANY',
              identifyingMarks: (report.lostReport?.identifyingMarks as any) ?? '',
              urgencyLevel: (report.lostReport?.urgencyLevel as any) ?? 'CRITICAL',
            }
          : undefined,
    },
    resolver: zodResolver(ReportLostOrFoundDocumentSchema),
  });

  const handleSubmit: SubmitHandler<DocumentReportFormData> = async (data) => {
    try {
      const doc = await updateDocumentReport(report.id, data);
      onSuccess?.(doc);
      showNotification({
        title: 'success',
        color: 'green',
        message: `Document report ${report ? 'updated' : 'created'} succesfully`,
      });
      mutateDocumentReport();
      closeWorkspace?.();
    } catch (error) {
      const e = handleApiErrors<DocumentReportFormData>(error);
      if (e.detail) {
        showNotification({
          title: `Error ${report ? 'updating' : 'creating'} document report`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof DocumentReportFormData, { message: val })
        );
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 8,
        }}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Stack>
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
              <DateInput
                {...field}
                label={'Date lost or found'}
                error={fieldState.error?.message}
              />
            )}
          />
          {reportType === 'Lost' && (
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
          {reportType === 'Found' && (
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
          <AddressFormInputs />
        </Stack>
        <Group gap={1}>
          <Button flex={1} variant="default" radius={0} onClick={closeWorkspace}>
            Cancel
          </Button>
          <Button flex={1} radius={0} type="submit" loading={form.formState.isSubmitting}>
            Submit
          </Button>
        </Group>
      </form>
    </FormProvider>
  );
};

export default DocumentReportInfoForm;
