import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Divider } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ErrorState, launchWorkspace } from '@/components';
import {
  AdditionalDetails,
  ContactFooter,
  DocumentImages,
  DocumentInformation,
  LocationInformation,
  ReportDetails,
  ReportHeader,
} from '../components';
import {
  DocumentReportForm,
  ReportDocumentImageUploadForm,
  ReportDocumentInfoForm,
} from '../forms';
import { useDocumentReport } from '../hooks';
import { ReportType } from '../types';
import DocumentReportDetailSkeleton from './DocumentReportDetailSkeleton';

const DocumentReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { error, isLoading, report: reportData } = useDocumentReport(reportId || '');
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (isLoading) return <DocumentReportDetailSkeleton />;
  if (error || !reportData)
    return (
      <ErrorState headerTitle="Report Detail" error={error} message="No report data available" />
    );

  // Extract common data
  const docType = reportData.document?.type?.name || 'Unknown';
  const docTypeIcon = reportData.document?.type?.icon || 'id';
  const docId = reportData.id ? reportData.id.substring(0, 8) + '...' : 'Unknown';
  const status = reportData.status || 'PENDING';
  const urgencyLevel = reportData.lostReport?.urgencyLevel || 'MEDIUM';
  const contactPreference = reportData.lostReport?.contactPreference || 'EMAIL';
  const isLostReport = reportData.lostReport !== null;
  const isFoundReport = reportData.foundReport !== null;
  const reportType: ReportType = isLostReport ? 'Lost' : isFoundReport ? 'Found' : 'Unknown';
  const launchDocumentReportInfoForm = () => {
    const dispose = launchWorkspace(
      <DocumentReportForm report={reportData} closeWorkspace={() => dispose()} />,
      { title: 'Update Report', expandable: true, width: 'extra-wide' }
    );
  };
  const launchDocumentImageForm = () => {
    const modalId = modals.open({
      title: 'Upload Document Images',
      children: (
        <ReportDocumentImageUploadForm report={reportData} onClose={() => modals.close(modalId)} />
      ),
    });
  };
  const launchDocumentInfoForm = () => {
    const dispose = launchWorkspace(
      <ReportDocumentInfoForm report={reportData} closeWorkspace={() => dispose()} />,
      { title: 'Update report document infomation' }
    );
  };

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <ReportHeader
        docType={docType}
        docId={docId}
        status={status}
        urgencyLevel={urgencyLevel}
        docTypeIcon={docTypeIcon}
        reportType={reportType}
        onUpdateReportDetails={launchDocumentReportInfoForm}
      />

      <Divider my="md" />

      <DocumentImages
        // images={[{ url: 'https://picsum.photos/200/300' }, { url: 'https://picsum.photos/200' }]}
        images={reportData?.document?.images}
        onUploadImage={launchDocumentImageForm}
      />
      <DocumentInformation
        document={reportData.document}
        onUpdateReportDocument={launchDocumentInfoForm}
      />

      <LocationInformation
        county={reportData.county}
        subCounty={reportData.subCounty}
        ward={reportData.ward}
        landMark={reportData.landMark}
      />

      <ReportDetails
        lostOrFoundDate={reportData.lostOrFoundDate}
        createdAt={reportData.createdAt}
        description={reportData.description}
        tags={reportData.tags}
        lostReport={reportData?.lostReport}
        foundReport={reportData?.foundReport}
      />

      <AdditionalDetails
        isOpen={detailsOpen}
        toggleOpen={() => setDetailsOpen(!detailsOpen)}
        createdAt={reportData.createdAt}
        updatedAt={reportData.updatedAt}
        status={status}
        document={reportData.document}
      />

      <ContactFooter
        contactPreference={contactPreference}
        urgencyLevel={urgencyLevel}
        reportType={reportType}
        handoverPreference={reportData?.foundReport?.handoverPreference}
      />
    </Card>
  );
};

export default DocumentReportDetail;
