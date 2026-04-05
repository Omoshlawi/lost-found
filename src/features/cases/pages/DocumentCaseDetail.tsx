import { useParams } from 'react-router-dom';
import { Alert, Badge, Button, Group, Loader, Paper, Stack, Tabs, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  DashboardPageHeader,
  ErrorState,
  StatusBadge,
  TablerIcon,
} from '@/components';
import { TablerIconName } from '@/components/TablerIcon';
import {
  AdditionalDetails,
  ContactFooter,
  DocumentCaseActions,
  DocumentImages,
  DocumentInformation,
  LocationInformation,
  ReportDetails,
} from '../components';
import ConfirmCollectionForm from '../forms/ConfirmCollectionForm';
import { useActiveCollection, useDocumentCase } from '../hooks';
import { AIExtraction, CaseType, FoundDocumentCaseStatus, LostDocumentCaseStatus } from '../types';
import DocumentCaseDetailSkeleton from './DocumentCaseDetailSkeleton';

const STEP_LABEL: Record<string, string> = {
  VISION: 'Image Analysis',
  TEXT: 'Data Extraction',
  POST_PROCESSING: 'Post Processing',
};

interface ExtractionAlertProps {
  extraction?: AIExtraction;
  reportType: CaseType;
  lostAuto?: boolean;
}

const ExtractionAlert = ({ extraction, reportType, lostAuto }: ExtractionAlertProps) => {
  const hasExtraction = reportType === 'FOUND' || lostAuto;
  if (!hasExtraction || !extraction) {
    return null;
  }

  const { extractionStatus, currentStep } = extraction;
  if (extractionStatus === 'COMPLETED') {
    return null;
  }

  if (extractionStatus === 'FAILED') {
    return (
      <Alert
        variant="light"
        color="red"
        icon={<TablerIcon name="alertTriangle" size={16} />}
        title="AI Extraction Failed"
      >
        Document data could not be extracted automatically. Please review and complete the document
        fields manually before submitting.
      </Alert>
    );
  }

  const stepLabel = currentStep ? STEP_LABEL[currentStep] : null;

  return (
    <Alert
      variant="light"
      color="civicBlue"
      icon={<Loader size={14} />}
      title={
        extractionStatus === 'IN_PROGRESS'
          ? `Extraction In Progress${stepLabel ? ` — ${stepLabel}` : ''}`
          : 'Extraction Queued'
      }
    >
      {extractionStatus === 'IN_PROGRESS'
        ? 'The AI pipeline is processing this document. Fields will populate automatically once complete.'
        : 'This document is queued for AI extraction. Fields may be incomplete until processing finishes.'}
    </Alert>
  );
};

const DocumentCaseDetail = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { error, isLoading, report: reportData } = useDocumentCase(reportId);

  // Must be before any early returns — SWR skips fetch when foundCaseId is undefined
  const foundCaseId = reportData?.foundDocumentCase?.id;
  const { hasActiveCollection } = useActiveCollection(foundCaseId);

  if (isLoading) {
    return <DocumentCaseDetailSkeleton />;
  }
  if (error || !reportData) {
    return <ErrorState error={error} message="No report data available" title="Report Detail" />;
  }

  // Determine report type — a report can't be both lost and found
  const isLostCase = !!reportData.lostDocumentCase;
  const reportType: CaseType = isLostCase ? 'LOST' : 'FOUND';

  // Extract common data
  const docType = reportData.document?.type?.name || 'Unknown';
  const docTypeIcon = reportData.document?.type?.icon || 'id';
  const caseNumber = reportData.caseNumber || 'Unknown';

  // Get status from the appropriate case type
  const status = isLostCase
    ? reportData.lostDocumentCase?.status || LostDocumentCaseStatus.SUBMITTED
    : reportData.foundDocumentCase?.status || FoundDocumentCaseStatus.DRAFT;

  const pointAwarded = reportData.foundDocumentCase?.pointAwarded ?? 0;

  return (
    <Stack gap="xl">
      <DashboardPageHeader
        icon={docTypeIcon as TablerIconName}
        title={`${docType} Report`}
        subTitle={() => (
          <Group gap="sm">
            <Text size="sm" c="dimmed" ff="monospace">
              {caseNumber}
            </Text>
            <Badge size="xs" variant="light">
              {reportType === 'FOUND' ? 'Found Document' : 'Lost Document'}
            </Badge>
            <StatusBadge status={status} />
            {reportType === 'FOUND' && pointAwarded > 0 && (
              <Badge size="xs" color="civicGreen" variant="light">
                {pointAwarded} pts
              </Badge>
            )}
          </Group>
        )}
        traiiling={
          <DocumentCaseActions
            caseId={reportData.id}
            documentCase={reportData}
            reportType={reportType}
            status={status}
          />
        }
      />

      <ExtractionAlert
        extraction={reportData.extraction}
        reportType={reportType}
        lostAuto={reportData.lostDocumentCase?.auto}
      />

      {hasActiveCollection && (
        <Alert
          variant="light"
          color="teal"
          icon={<TablerIcon name="keyframe" size={16} />}
          title="Collection in progress — code issued to finder"
        >
          <Stack gap="sm">
            <Text size="sm">
              A handover code has been sent to the finder. Ask them to share it and enter it below
              to confirm handover. Case editing is locked until confirmed or cancelled.
            </Text>
            <Group>
              <Button
                size="xs"
                color="teal"
                leftSection={<TablerIcon name="keyframe" size={13} />}
                onClick={() => {
                  const id = modals.open({
                    title: 'Enter Finder Code',
                    centered: true,
                    children: (
                      <ConfirmCollectionForm
                        documentCase={reportData}
                        onClose={() => modals.close(id)}
                      />
                    ),
                  });
                }}
              >
                Enter Code
              </Button>
            </Group>
          </Stack>
        </Alert>
      )}

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

        <Tabs.Panel value="document" pt="md">
          <Paper withBorder p="lg">
            <DocumentInformation
              document={reportData.document!}
              reportType={reportType}
              status={status}
            />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="images" pt="md">
          <Paper withBorder p="lg">
            <DocumentImages
              document={reportData.document!}
              reportType={reportType}
              status={status}
            />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="location" pt="md">
          <Paper withBorder p="lg">
            <LocationInformation
              documentCase={reportData}
              reportType={reportType}
              status={status}
            />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="details" pt="md">
          <Paper withBorder p="lg">
            <Stack gap="lg">
              <ReportDetails
                lostOrFoundDate={reportData.eventDate}
                createdAt={reportData.createdAt}
                description={reportData.description}
                tags={reportData.tags}
                lostDocumentCase={reportData.lostDocumentCase}
                foundDocumentCase={reportData.foundDocumentCase}
                documentCase={reportData}
              />
              <ContactFooter
                reportType={reportType}
                foundDocumentCase={reportData.foundDocumentCase}
              />
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="additional" pt="md">
          <Paper withBorder p="lg">
            <AdditionalDetails
              caseId={reportData.id}
              caseNumber={reportData.caseNumber}
              reportType={reportType}
              status={status}
              document={reportData.document}
              lostDocumentCase={reportData.lostDocumentCase}
              extraction={reportData.extraction}
            />
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default DocumentCaseDetail;
