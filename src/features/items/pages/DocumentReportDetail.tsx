import React, { useState } from 'react';
import { TablerIcon } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import { Card, Divider, Loader } from '@mantine/core';
import { ErrorState } from '@/components';
import {
  AdditionalDetails,
  ContactFooter,
  DocumentImages,
  DocumentInformation,
  LocationInformation,
  ReportDetails,
  ReportHeader,
} from '../components';
import { useDocumentReport } from '../hooks';
import { ReportType } from '../types';

const DocumentReportDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { error, isLoading, report: reportData } = useDocumentReport(reportId || '');
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (isLoading) return <Loader size="md" />;
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

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <ReportHeader
        docType={docType}
        docId={docId}
        status={status}
        urgencyLevel={urgencyLevel}
        docTypeIcon={docTypeIcon}
        reportType={reportType}
      />

      <Divider my="md" />

      <DocumentImages
        images={[{ url: 'https://picsum.photos/200/300' }, { url: 'https://picsum.photos/200' }]}
        // images={reportData?.document?.images}
      />
      <DocumentInformation document={reportData.document} />

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
