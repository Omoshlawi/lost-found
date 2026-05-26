import { Alert, Badge, Button, Loader, Stack, Text } from '@mantine/core';
import { launchWorkspace, TablerIcon } from '@/components';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import ResolveExtractionForm from '../forms/ResolveExtractionForm';
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

  const { extractionStatus, currentStep, resolutionType, resolutionMessage } = extraction;

  if (extractionStatus === 'COMPLETED') {
    return null;
  }

  if (extractionStatus === 'FAILED') {
    const isResolved = !!resolutionType;
    const badge = resolutionType ? RESOLUTION_BADGE[resolutionType] : null;

    const openResolve = () => {
      const close = launchWorkspace(
        <ResolveExtractionForm documentCase={documentCase} onClose={() => close()} />,
        { title: 'Resolve Extraction Failure' }
      );
    };

    return (
      <Alert
        variant="light"
        color={isResolved ? 'civicBlue' : 'yellow'}
        icon={<TablerIcon name={isResolved ? 'infoCircle' : 'alertTriangle'} size={16} />}
        title={
          isResolved ? (
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
            {isResolved
              ? resolutionMessage
              : 'Document processing failed. A staff member needs to review this case and notify the user.'}
          </Text>
          {canResolve && !isResolved && (
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
