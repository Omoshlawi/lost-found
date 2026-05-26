import { Alert, Badge, Button, Group, Loader, Stack, Text } from '@mantine/core';
import { launchWorkspace, TablerIcon } from '@/components';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import ResolveExtractionForm from '../forms/ResolveExtractionForm';
import UpdateDocumentinfoForm from '../forms/UpdateDocumentinfoForm';
import { AIExtraction, CaseType, DocumentCase, ExtractionResolutionType } from '../types';

const STEP_LABEL: Record<string, string> = {
  VISION: 'Image Scan',
  STRUCTURE: 'Data Reading',
};

const RESOLUTION_BADGE: Record<ExtractionResolutionType, { label: string; color: string }> = {
  [ExtractionResolutionType.RESUBMIT_IMAGE]: {
    label: 'Awaiting Image Resubmission',
    color: 'yellow',
  },
  [ExtractionResolutionType.SUBMIT_NEW_CASE]: { label: 'New Case Required', color: 'orange' },
  [ExtractionResolutionType.STAFF_HANDLING]: { label: 'Staff Handling', color: 'civicBlue' },
};

interface CaseExtractionAlertProps {
  extraction?: AIExtraction;
  reportType: CaseType;
  lostAuto?: boolean;
  documentCase: DocumentCase;
}

const CaseExtractionAlert = ({
  extraction,
  reportType,
  lostAuto,
  documentCase,
}: CaseExtractionAlertProps) => {
  const hasExtraction = reportType === 'FOUND' || lostAuto;
  const { hasAccess: canResolve } = useUserHasSystemAccess({ documentCase: ['resolveExtraction'] });

  if (!hasExtraction || !extraction) {
    return null;
  }

  const { extractionStatus, currentStep, resolutionType, resolvedById } = extraction;

  if (extractionStatus === 'COMPLETED') {
    return null;
  }

  if (extractionStatus === 'FAILED') {

    // Auto-resolved by the system (resolvedById is null) vs confirmed by a staff member
    const isAutoResolved = !!resolutionType && !resolvedById;
    const isStaffResolved = !!resolutionType && !!resolvedById;
    const badge = resolutionType ? RESOLUTION_BADGE[resolutionType] : null;
    const isStaffHandling = resolutionType === ExtractionResolutionType.STAFF_HANDLING;

    const STAFF_RESOLUTION_COPY: Record<ExtractionResolutionType, string> = {
      [ExtractionResolutionType.RESUBMIT_IMAGE]:
        'The citizen has been asked to resubmit clearer document images. No action required until they do.',
      [ExtractionResolutionType.SUBMIT_NEW_CASE]:
        'The citizen has been asked to submit a new case. No action required until they do.',
      [ExtractionResolutionType.STAFF_HANDLING]:
        'Automated extraction failed after two attempts. If the document images are readable, enter the fields manually. If the images are wrong or unusable, use "Review & Resolve" to request new images from the citizen.',
    };

    const openResolve = () => {
      const close = launchWorkspace(
        <ResolveExtractionForm documentCase={documentCase} onClose={() => close()} />,
        { title: 'Resolve Extraction Failure' }
      );
    };

    const openEnterFields = () => {
      const close = launchWorkspace(
        <UpdateDocumentinfoForm
          document={documentCase.document!}
          closeWorkspace={() => close()}
        />,
        { title: 'Enter Document Fields Manually' }
      );
    };

    // Auto-set STAFF_HANDLING: staff hasn't reviewed yet — show both actions
    if (isAutoResolved && isStaffHandling) {
      return (
        <Alert
          variant="light"
          color="yellow"
          icon={<TablerIcon name="alertTriangle" size={16} />}
          title={
            <Stack gap={4}>
              <Text size="sm" fw={600}>
                Extraction Failure — Awaiting Staff Action
              </Text>
              {badge && (
                <Badge color={badge.color} variant="light" size="xs">
                  {badge.label}
                </Badge>
              )}
            </Stack>
          }
        >
          <Stack gap="xs">
            <Text size="sm">{STAFF_RESOLUTION_COPY[ExtractionResolutionType.STAFF_HANDLING]}</Text>
            {canResolve && (
              <Group gap="xs">
                {documentCase.document && (
                  <Button
                    size="xs"
                    variant="outline"
                    color="civicBlue"
                    leftSection={<TablerIcon name="forms" size={13} />}
                    onClick={openEnterFields}
                  >
                    Enter Fields Manually
                  </Button>
                )}
                <Button
                  size="xs"
                  variant="outline"
                  color="yellow"
                  leftSection={<TablerIcon name="messageCircle" size={13} />}
                  onClick={openResolve}
                >
                  Review & Resolve
                </Button>
              </Group>
            )}
          </Stack>
        </Alert>
      );
    }

    return (
      <Alert
        variant="light"
        color={isStaffResolved ? 'civicBlue' : 'yellow'}
        icon={<TablerIcon name={isStaffResolved ? 'infoCircle' : 'alertTriangle'} size={16} />}
        title={
          isStaffResolved ? (
            <Stack gap={4}>
              <Text size="sm" fw={600}>
                Extraction Failure — Resolved
              </Text>
              {badge && (
                <Badge color={badge.color} variant="light" size="xs">
                  {badge.label}
                </Badge>
              )}
            </Stack>
          ) : (
            'Extraction Failed — Pending Review'
          )
        }
      >
        <Stack gap="xs">
          <Text size="sm">
            {isStaffResolved
              ? STAFF_RESOLUTION_COPY[resolutionType!]
              : 'Document processing failed. A staff member needs to review this case and notify the user.'}
          </Text>
          {canResolve && !isStaffResolved && (
            <Button
              size="xs"
              variant="outline"
              color="yellow"
              leftSection={<TablerIcon name="messageCircle" size={13} />}
              onClick={openResolve}
              w="fit-content"
            >
              Review & Resolve
            </Button>
          )}
        </Stack>
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
          ? `Processing In Progress${stepLabel ? ` — ${stepLabel}` : ''}`
          : 'Queued for Processing'
      }
    >
      {extractionStatus === 'IN_PROGRESS'
        ? 'The document is being analysed. Fields will populate automatically once complete.'
        : 'This document is queued for processing. Fields may be incomplete until processing finishes.'}
    </Alert>
  );
};

export default CaseExtractionAlert;
