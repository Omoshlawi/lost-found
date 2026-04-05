import React from 'react';
import { Button, Group, Menu } from '@mantine/core';
import { closeModal, openModal } from '@mantine/modals';
import { launchWorkspace, TablerIcon } from '@/components';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import CancelCollectionForm from '../forms/CancelCollectionForm';
import ConfirmCollectionForm from '../forms/ConfirmCollectionForm';
import InitiateCollectionForm from '../forms/InitiateCollectionForm';
import RejectFoundDocumentCaseForm from '../forms/RejectFoundDocumentCaseForm';
import VerifyFoundDocumentCaseForm from '../forms/VerifyFoundDocumentCaseForm';
import { useActiveCollection } from '../hooks';
import { CaseType, DocumentCase, FoundDocumentCaseStatus, LostDocumentCaseStatus } from '../types';

interface DocumentCaseActionsProps {
  caseId: string;
  documentCase: DocumentCase;
  reportType: CaseType;
  status: string;
  onUpdateReportDetails?: () => void;
}

const DocumentCaseActions: React.FC<DocumentCaseActionsProps> = ({
  documentCase,
  reportType,
  status,
  onUpdateReportDetails,
}) => {
  const { hasAccess: canCollect } = useUserHasSystemAccess({ documentCase: ['collect'] });
  const { hasAccess: canVerify } = useUserHasSystemAccess({ documentCase: ['verify'] });
  const { hasAccess: canReject } = useUserHasSystemAccess({ documentCase: ['reject'] });

  const isSubmitted = status === FoundDocumentCaseStatus.SUBMITTED;
  const isDraft = status === FoundDocumentCaseStatus.DRAFT;
  const extractionComplete = documentCase.extraction?.extractionStatus === 'COMPLETED';
  const { hasActiveCollection: hasPendingCollection } = useActiveCollection(
    reportType === 'FOUND' ? documentCase.foundDocumentCase?.id : undefined
  );

  const openInitiate = (title = 'Initiate Document Collection') => {
    const close = launchWorkspace(
      <InitiateCollectionForm documentCase={documentCase} onClose={() => close()} />,
      { title }
    );
  };

  const openEnterCode = () => {
    const id = openModal({
      children: (
        <ConfirmCollectionForm documentCase={documentCase} onClose={() => closeModal(id)} />
      ),
      title: 'Enter Finder Code',
    });
  };

  const openCancel = () => {
    const close = launchWorkspace(
      <CancelCollectionForm documentCase={documentCase} onClose={() => close()} />,
      { title: 'Cancel Collection' }
    );
  };

  const openVerify = () => {
    const close = launchWorkspace(
      <VerifyFoundDocumentCaseForm documentCase={documentCase} onClose={() => close()} />,
      { title: 'Verify Found Document Case' }
    );
  };

  const openReject = () => {
    const close = launchWorkspace(
      <RejectFoundDocumentCaseForm documentCase={documentCase} onClose={() => close()} />,
      { title: 'Reject Found Document Case' }
    );
  };

  return (
    <Group gap="xs" wrap="nowrap">
      {/* Prominent Enter Code button — only shown when a collection is pending */}
      {reportType === 'FOUND' && canCollect && hasPendingCollection && (
        <Button
          leftSection={<TablerIcon name="keyframe" size={14} />}
          color="teal"
          variant="filled"
          size="sm"
          onClick={openEnterCode}
        >
          Enter Code
        </Button>
      )}

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
                (reportType === 'FOUND' &&
                  (status !== FoundDocumentCaseStatus.DRAFT || hasPendingCollection)) ||
                (reportType === 'LOST' && status !== LostDocumentCaseStatus.SUBMITTED)
              }
            >
              Edit Case Details
            </Menu.Item>
          )}

          {reportType === 'FOUND' && canCollect && (
            <>
              <Menu.Divider />
              {hasPendingCollection ? (
                <>
                  {/* Code already sent — offer to enter, resend, or cancel */}
                  <Menu.Item
                    leftSection={<TablerIcon name="keyframe" size={14} />}
                    onClick={openEnterCode}
                    color="teal"
                  >
                    Enter Code
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<TablerIcon name="send" size={14} />}
                    onClick={() => openInitiate('Resend Handover Code')}
                    color="civicBlue"
                  >
                    Resend Code
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<TablerIcon name="circleX" size={14} />}
                    onClick={openCancel}
                    color="orange"
                  >
                    Cancel Collection
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item
                  leftSection={<TablerIcon name="packageImport" size={14} />}
                  onClick={() => openInitiate()}
                  disabled={!isDraft || !extractionComplete}
                  color="civicBlue"
                >
                  Collect
                </Menu.Item>
              )}
            </>
          )}

          {reportType === 'FOUND' && (canVerify || canReject) && (
            <>
              <Menu.Divider />
              {canVerify && (
                <Menu.Item
                  leftSection={<TablerIcon name="circleCheck" size={14} />}
                  onClick={openVerify}
                  disabled={!isSubmitted}
                  color="civicGreen"
                >
                  Verify Case
                </Menu.Item>
              )}
              {canReject && (
                <Menu.Item
                  leftSection={<TablerIcon name="circleX" size={14} />}
                  onClick={openReject}
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
    </Group>
  );
};

export default DocumentCaseActions;
