import { Alert, Loader } from '@mantine/core';
import { TablerIcon } from '@/components';
import { AIExtraction, CaseType } from '../types';

const STEP_LABEL: Record<string, string> = {
  VISION: 'Image Analysis',
  TEXT: 'Data Extraction',
  POST_PROCESSING: 'Post Processing',
};

interface CaseExtractionAlertProps {
  extraction?: AIExtraction;
  reportType: CaseType;
  lostAuto?: boolean;
}

const CaseExtractionAlert = ({ extraction, reportType, lostAuto }: CaseExtractionAlertProps) => {
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

export default CaseExtractionAlert;
