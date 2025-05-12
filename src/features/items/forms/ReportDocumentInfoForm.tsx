import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Group, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { parseDate } from '@/lib/utils';
import { useDocumentReportApi } from '../hooks';
import { DocumentReport, DocumentReportFormData } from '../types';
import { _ReportLostOrFoundDocumentSchema } from '../utils';
import DocumentFormInputs from './Steps/DocumentFormInputs';

type ReportDocumentInfoFormProps = {
  report: DocumentReport;
  onSuccess?: (report: DocumentReport) => void;
  closeWorkspace?: () => void;
};

const ReportDocumentInfoFormSchema = _ReportLostOrFoundDocumentSchema.pick({
  document: true,
});
type ReportDocumentInfoFormData = z.infer<typeof ReportDocumentInfoFormSchema>;

const ReportDocumentInfoForm: React.FC<ReportDocumentInfoFormProps> = ({
  report,
  onSuccess,
  closeWorkspace,
}) => {
  const form = useForm<ReportDocumentInfoFormData>({
    defaultValues: {
      document: {
        typeId: report.document?.typeId,
        expiryDate: parseDate(report.document?.expiryDate),
        issuanceDate: parseDate(report.document?.issuanceDate),
        issuer: report.document?.issuer ?? '',
        ownerName: report.document?.ownerName ?? '',
        serialNumber: report.document?.serialNumber ?? '',
        placeOfIssue: report.document?.placeOfIssue ?? '',
        placeOfBirth: report.document?.placeOfBirth ?? '',
        batchNumber: report.document?.batchNumber ?? '',
        bloodGroup: report.document?.bloodGroup ?? '',
        documentNumber: report.document?.documentNumber ?? '',
        gender: report.document?.gender ?? 'Unknown',
        dateOfBirth: parseDate(report.document?.dateOfBirth),
        nationality: report.document?.nationality ?? '',
        note: report.document?.note ?? '',
        additionalFields: report.document?.additionalFields ?? [],
      },
    },
    resolver: zodResolver(ReportDocumentInfoFormSchema),
  });
  const { updateDocumentReport, mutateDocumentReport } = useDocumentReportApi();

  const handleSubmit: SubmitHandler<ReportDocumentInfoFormData> = async (data) => {
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
          form.setError(key as keyof ReportDocumentInfoFormData, { message: val })
        );
      }
    }
  };

  return (
    <FormProvider {...form}>
      <Stack
        component={'form'}
        onSubmit={form.handleSubmit(handleSubmit)}
        justify="space-between"
        p={'sm'}
        flex={1}
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
      </Stack>
    </FormProvider>
  );
};

export default ReportDocumentInfoForm;
