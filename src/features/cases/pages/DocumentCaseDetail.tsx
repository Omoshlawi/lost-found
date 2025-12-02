import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Tabs } from '@mantine/core';
import { ErrorState, TablerIcon } from '@/components';
import {
  AdditionalDetails,
  ContactFooter,
  DocumentImages,
  DocumentInformation,
  LocationInformation,
  ReportDetails,
  ReportHeader,
} from '../components';
import { useDocumentCase } from '../hooks';
import { CaseType, FoundDocumentCaseStatus, LostDocumentCaseStatus } from '../types';
import DocumentCaseDetailSkeleton from './DocumentCaseDetailSkeleton';

const DocumentCaseDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { error, isLoading, report: reportData } = useDocumentCase(reportId);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (isLoading) {
    return <DocumentCaseDetailSkeleton />;
  }
  if (error || !reportData) {
    return <ErrorState error={error} message="No report data available" title="Report Detail" />;
  }

  // Determine report type - a report can't be both lost and found
  const isLostCase = !!reportData.lostDocumentCase;
  const reportType: CaseType = isLostCase ? 'LOST' : 'FOUND';

  // Extract common data
  const docType = reportData.document?.type?.name || 'Unknown';
  const docTypeIcon = reportData.document?.type?.icon || 'id';
  const docId = reportData.id ? `${reportData.id.substring(0, 8)}...` : 'Unknown';

  // Get status from the appropriate case type
  const status = isLostCase
    ? reportData.lostDocumentCase?.status || LostDocumentCaseStatus.SUBMITTED
    : reportData.foundDocumentCase?.status || FoundDocumentCaseStatus.DRAFT;

  const pointAwarded = reportData.foundDocumentCase?.pointAwarded ?? 0;

  return (
    <Stack gap="xl">
      <ReportHeader
        docType={docType}
        docId={docId}
        status={status}
        pointAwarded={pointAwarded}
        docTypeIcon={docTypeIcon}
        reportType={reportType}
      />

      <Tabs defaultValue="document" variant="default">
        <Tabs.List>
          <Tabs.Tab value="document" leftSection={<TablerIcon name="id" size={16} />}>
            Document
          </Tabs.Tab>
          {reportType === 'FOUND' && (
            <Tabs.Tab value="images" leftSection={<TablerIcon name="photo" size={16} />}>
              Images
            </Tabs.Tab>
          )}
          <Tabs.Tab value="location" leftSection={<TablerIcon name="mapPin" size={16} />}>
            Location
          </Tabs.Tab>
          <Tabs.Tab value="details" leftSection={<TablerIcon name="infoCircle" size={16} />}>
            Report Details
          </Tabs.Tab>
          <Tabs.Tab value="additional" leftSection={<TablerIcon name="fileText" size={16} />}>
            Additional
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="document" pt="xl">
          <DocumentInformation document={reportData.document!} />
        </Tabs.Panel>

        <Tabs.Panel value="images" pt="xl">
          <DocumentImages document={reportData.document!} />
        </Tabs.Panel>

        <Tabs.Panel value="location" pt="xl">
          <LocationInformation documentCase={reportData} />
        </Tabs.Panel>

        <Tabs.Panel value="details" pt="xl">
          <Stack gap="lg">
            <ReportDetails
              lostOrFoundDate={reportData.eventDate}
              createdAt={reportData.createdAt}
              description={reportData.description}
              tags={reportData.tags}
              lostDocumentCase={reportData.lostDocumentCase}
              foundDocumentCase={reportData.foundDocumentCase}
            />
            <ContactFooter
              reportType={reportType}
              foundDocumentCase={reportData.foundDocumentCase}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="additional" pt="xl">
          <AdditionalDetails
            isOpen={detailsOpen}
            toggleOpen={() => setDetailsOpen(!detailsOpen)}
            createdAt={reportData.createdAt}
            updatedAt={reportData.updatedAt}
            status={status}
            document={reportData.document}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default DocumentCaseDetail;
