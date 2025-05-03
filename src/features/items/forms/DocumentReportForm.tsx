import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  ScrollArea,
  SegmentedControl,
  Stack,
  Tabs,
  TagsInput,
  Text,
  Textarea,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { DocumentReport, DocumentReportFormData } from '../types';
import { ReportLostOrFoundDocumentSchema } from '../utils';
import BasicReportInfoStep from './Steps/BasicReportInfoStep';
import DocumentInfoSteps from './Steps/DocumentInfoSteps';

type DocumentReportFormProps = {
  report?: DocumentReport;
  onSuccess?: (report: DocumentReport) => void;
};

const DocumentReportForm: React.FC<DocumentReportFormProps> = ({ onSuccess, report }) => {
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
      // type: 'FOUND',
      // wardCode: '',
    },
    resolver: zodResolver(ReportLostOrFoundDocumentSchema) as any,
  });
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <FormProvider {...form}>
      <form style={{ height: '100%' }}>
        <Box p={'sm'} h={'100%'}>
          <Tabs
            defaultValue="basic"
            orientation={isMobile ? 'horizontal' : 'vertical'}
            variant="default"
            h={'100%'}
          >
            <Tabs.List justify={isMobile ? 'space-between' : undefined}>
              <Tabs.Tab value="basic" p={'lg'}>
                Basic Info
              </Tabs.Tab>
              <Tabs.Tab p={'lg'} value="document">
                Document
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basic" p={'sm'} h={'100%'}>
              <ScrollArea type="scroll">
                <BasicReportInfoStep />
              </ScrollArea>
            </Tabs.Panel>
            <Tabs.Panel value="document" p={'sm'} h={'100%'}>
              <DocumentInfoSteps />
            </Tabs.Panel>
          </Tabs>
        </Box>
      </form>
    </FormProvider>
  );
};

export default DocumentReportForm;
