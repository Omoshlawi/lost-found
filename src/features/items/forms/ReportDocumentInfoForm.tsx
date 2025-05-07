import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Group, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { parseDate } from '@/lib/utils';
import { useDocumentReportApi } from '../hooks';
import { DocumentReport, DocumentReportFormData } from '../types';
import { DocumentSchema, ReportLostOrFoundDocumentPartialSchema } from '../utils';
import DocumentFormInputs from './Steps/DocumentFormInputs';

type ReportDocumentInfoFormProps = {
  report: DocumentReport;
  onSuccess?: (report: DocumentReport) => void;
  closeWorkspace?: () => void;
};

const ReportDocumentInfoForm: React.FC<ReportDocumentInfoFormProps> = ({
  report,
  onSuccess,
  closeWorkspace,
}) => {
  const form = useForm<Partial<DocumentReportFormData>>({
    defaultValues: {
      document: {
        typeId: report.document?.typeId,
        expiryDate: parseDate(report.document?.expiryDate),
        issuanceDate: parseDate(report.document?.issuanceDate),
        issuer: report.document?.issuer,
        ownerName: report.document?.ownerName,
        serialNumber: report.document?.serialNumber,
      },
    },
    resolver: zodResolver(ReportLostOrFoundDocumentPartialSchema),
  });
  const { updateDocumentReport, mutateDocumentReport } = useDocumentReportApi();

  const handleSubmit: SubmitHandler<Partial<DocumentReportFormData>> = async (data) => {
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
          <DocumentFormInputs />
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

export default ReportDocumentInfoForm;
