import React from 'react';
import { Button, Menu } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon, launchWorkspace } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useUserHasSystemAccessSync } from '@/hooks/useSystemAccess';
import CancelCollectionForm from '../forms/CancelCollectionForm';
import ConfirmCollectionForm from '../forms/ConfirmCollectionForm';
import InitiateCollectionForm from '../forms/InitiateCollectionForm';
import VerifyFoundDocumentCaseForm from '../forms/VerifyFoundDocumentCaseForm';
import RejectFoundDocumentCaseForm from '../forms/RejectFoundDocumentCaseForm';
import {
  CaseType,
  DocumentCase,
  DocumentCollectionStatus,
  FoundDocumentCaseStatus,
  LostDocumentCaseStatus,
} from '../types';

interface DocumentCaseActionsProps {
  caseId: string;
  documentCase: DocumentCase;
  reportType: CaseType;
  status: string;
  onUpdateReportDetails?: () => void;
}

const DocumentCaseActions: React.FC<DocumentCaseActionsProps> = ({
  caseId,
  documentCase,
  reportType,
  status,
  onUpdateReportDetails,
}) => {
  const { hasAccess: canCollect } = useUserHasSystemAccessSync({ documentCase: ['collect'] });
  const { hasAccess: canVerify } = useUserHasSystemAccessSync({ documentCase: ['verify'] });
  const { hasAccess: canReject } = useUserHasSystemAccessSync({ documentCase: ['reject'] });

  const isSubmitted = status === FoundDocumentCaseStatus.SUBMITTED;
  const isDraft = status === FoundDocumentCaseStatus.DRAFT;
  const extractionComplete = documentCase.extraction?.extractionStatus === 'COMPLETED';
  const activeCollection = documentCase.foundDocumentCase?.activeCollection;
  const hasPendingCollection = activeCollection?.status === DocumentCollectionStatus.PENDING;

  const handleInitiateCollection = () => {
    const close = launchWorkspace(
      <InitiateCollectionForm
        documentCase={documentCase}
        onClose={() => close()}
      />,
      { title: 'Initiate Document Collection' }
    );
  };

  const handleConfirmCollection = () => {
    const close = launchWorkspace(
      <ConfirmCollectionForm
        documentCase={documentCase}
        onClose={() => close()}
      />,
      { title: 'Enter Handover Code' }
    );
  };

  const handleCancelCollection = () => {
    const close = launchWorkspace(
      <CancelCollectionForm
        documentCase={documentCase}
        onClose={() => close()}
      />,
      { title: 'Cancel Collection' }
    );
  };

  const handleVerify = () => {
    const closeWorkspace = launchWorkspace(
      <VerifyFoundDocumentCaseForm
        documentCase={documentCase}
        onClose={() => closeWorkspace()}
      />,
      { title: 'Verify Found Document Case' }
    );
  };

  const handleReject = () => {
    const closeWorkspace = launchWorkspace(
      <RejectFoundDocumentCaseForm
        documentCase={documentCase}
        onClose={() => closeWorkspace()}
      />,
      { title: 'Reject Found Document Case' }
    );
  };

  return (
    <Menu shadow="md" position="bottom-end">
      <Menu.Target>
        <Button leftSection={<TablerIcon name="dotsVertical" size={14} />} variant="light">
          Actions
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Divider />
        {onUpdateReportDetails && (
          <Menu.Item
            leftSection={<TablerIcon name="edit" size={14} />}
            onClick={onUpdateReportDetails}
            disabled={
              (reportType === 'FOUND' && (status !== FoundDocumentCaseStatus.DRAFT || hasPendingCollection)) ||
              (reportType === 'LOST' && status !== LostDocumentCaseStatus.SUBMITTED)
            }
          >
            Edit Case Details
          </Menu.Item>
        )}
        {reportType === 'FOUND' && canCollect && (
          <>
            <Menu.Divider />
            {!hasPendingCollection && (
              <Menu.Item
                leftSection={<TablerIcon name="packageImport" size={14} />}
                onClick={handleInitiateCollection}
                disabled={!isDraft || !extractionComplete}
                color="civicBlue"
              >
                Initiate Collection
              </Menu.Item>
            )}
            {hasPendingCollection && (
              <>
                <Menu.Item
                  leftSection={<TablerIcon name="keyframe" size={14} />}
                  onClick={handleConfirmCollection}
                  color="civicGreen"
                >
                  Enter Handover Code
                </Menu.Item>
                <Menu.Item
                  leftSection={<TablerIcon name="circleX" size={14} />}
                  onClick={handleCancelCollection}
                  color="orange"
                >
                  Cancel Collection
                </Menu.Item>
              </>
            )}
          </>
        )}
        {reportType === 'FOUND' && (canVerify || canReject) && (
          <>
            <Menu.Divider />
            {canVerify && (
              <Menu.Item
                leftSection={<TablerIcon name="circleCheck" size={14} />}
                onClick={handleVerify}
                disabled={!isSubmitted}
                color="civicGreen"
              >
                Verify Case
              </Menu.Item>
            )}
            {canReject && (
              <Menu.Item
                leftSection={<TablerIcon name="circleX" size={14} />}
                onClick={handleReject}
                disabled={!isSubmitted}
                color="red"
              >
                Reject Case
              </Menu.Item>
            )}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default DocumentCaseActions;
