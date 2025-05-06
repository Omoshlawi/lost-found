import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Tabs } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors } from '@/lib/api';
import { useDocumentReportApi } from '../hooks';
import { DocumentReport, DocumentReportFormData } from '../types';
import { ReportLostOrFoundDocumentSchema } from '../utils';
import AddressInfoStep from './Steps/AddressInfoStep';
import BasicReportInfoStep from './Steps/BasicReportInfoStep';
import DocumentInfoSteps from './Steps/DocumentInfoSteps';

type DocumentReportFormProps = {
  report?: DocumentReport;
  onSuccess?: (report: DocumentReport) => void;
  closeWorkspase?: () => void;
};

const DocumentReportForm: React.FC<DocumentReportFormProps> = ({
  onSuccess,
  report,
  closeWorkspase,
}) => {
  const form = useForm<DocumentReportFormData>({
    defaultValues: {
      // countyCode: '',
      // description: '',
      // document: {
      //   expiryDate: new Date(),
      //   images: [],
      //   issuanceDate: new Date(),
      //   issuer: '',
      //   ownerName: '',
      //   serialNumber: '',
      //   typeId: '',
      // },
      // found: {
      //   handoverPreference: 'IN_PERSON',
      //   securityAnswer: '',
      //   securityQuestion: '',
      // },
      // landMark: '',
      // lost: {
      //   contactPreference: 'ANY' as const,
      //   identifyingMarks: '',
      //   urgencyLevel: 'CRITICAL' as const,
      // },
      // lostOrFoundDate: new Date(),
      // status: 'ACTIVE',
      // subCountyCode: '',
      // tags: [],
      type: 'FOUND',
      // wardCode: '',
    },
    resolver: zodResolver(ReportLostOrFoundDocumentSchema) as any,
  });
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [activeTab, setActiveTab] = useState<'basic' | 'document' | 'address' | null>('basic');
  const { createDocumentReport, updateDocumentReport, mutateDocumentReport } =
    useDocumentReportApi();
  useEffect(() => {
    if (form.formState.errors) {
      const fieldSteps = {
        basic: [
          'type',
          'description',
          'tags',
          'lostOrFoundDate',
          'found.handoverPreference',
          'lost.contactPreference',
          'lost.urgencyLevel',
          'lost.identifyingMarks',
        ],
        address: ['countyCode', 'subCountyCode', 'wardCode', 'landMark'],
        document: [
          'document.typeId',
          'document.expiryDate',
          'document.images',
          'document.issuanceDate',
          'document.issuer',
          'document.ownerName',
          'document.serialNumber',
        ],
      };
      for (const [step, fields] of Object.entries(fieldSteps)) {
        if (fields.some((field) => form.getFieldState(field as any).invalid)) {
          setActiveTab(step as 'basic' | 'document' | 'address');
          break;
        }
      }
    }
  }, [form.formState.errors, setActiveTab]);

  const handleSubmit: SubmitHandler<DocumentReportFormData> = async (data) => {
    try {
      const doc = report
        ? await updateDocumentReport(report.id, data)
        : await createDocumentReport(data);
      onSuccess?.(doc);
      showNotification({
        title: 'success',
        color: 'green',
        message: `Document report ${report ? 'updated' : 'created'} succesfully`,
      });
      mutateDocumentReport();
      closeWorkspase?.();
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
      <form style={{ height: '100%' }} onSubmit={form.handleSubmit(handleSubmit)}>
        <Box p={'sm'} h={'100%'}>
          <Tabs
            orientation={isMobile ? 'horizontal' : 'vertical'}
            variant="default"
            h={'100%'}
            value={activeTab}
            onChange={setActiveTab as any}
          >
            <Tabs.List justify={isMobile ? 'space-between' : undefined}>
              <Tabs.Tab value="basic" p={'lg'}>
                Basic Info
              </Tabs.Tab>
              <Tabs.Tab p={'lg'} value="address">
                Address
              </Tabs.Tab>
              <Tabs.Tab p={'lg'} value="document">
                Document
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basic" p={'sm'}>
              <BasicReportInfoStep
                onCancel={closeWorkspase}
                onNext={() => setActiveTab('address')}
              />
            </Tabs.Panel>
            <Tabs.Panel value="address" p={'sm'}>
              <AddressInfoStep
                onPrevious={() => setActiveTab('basic')}
                onNext={() => setActiveTab('document')}
              />
            </Tabs.Panel>
            <Tabs.Panel value="document" p={'sm'}>
              <DocumentInfoSteps onPrevious={() => setActiveTab('address')} />
            </Tabs.Panel>
          </Tabs>
        </Box>
      </form>
    </FormProvider>
  );
};

export default DocumentReportForm;
