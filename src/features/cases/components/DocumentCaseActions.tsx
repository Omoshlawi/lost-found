import React from 'react';
import { Button, Menu, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { TablerIcon, launchWorkspace } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useUserHasSystemAccessSync } from '@/hooks/useSystemAccess';
import VerifyFoundDocumentCaseForm from '../forms/VerifyFoundDocumentCaseForm';
import RejectFoundDocumentCaseForm from '../forms/RejectFoundDocumentCaseForm';
import { useDocumentCaseApi } from '../hooks/useDocumentCases';
import { CaseType, DocumentCase, FoundDocumentCaseStatus, LostDocumentCaseStatus } from '../types';

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
  const { submitDocumentCase } = useDocumentCaseApi();
  const { hasAccess: canVerify } = useUserHasSystemAccessSync({ documentCase: ['verify'] });
  const { hasAccess: canReject } = useUserHasSystemAccessSync({ documentCase: ['reject'] });

  const handleSubmitDocumentCase = () => {
    openConfirmModal({
      title: 'Submit Document Case',
      children: (
        <Text>
          Are you sure you want to submit this document case? By submitting you verify that all case
          details are correct. You will not be able to edit the case details after submitting.
        </Text>
      ),
      labels: { confirm: 'Submit', cancel: 'Cancel' },
      confirmProps: { color: 'teal' },
      cancelProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await submitDocumentCase(caseId);
          showNotification({
            title: 'Success',
            message: 'Document case submitted successfully',
            color: 'green',
          });
        } catch (error) {
          const e = handleApiErrors<{}>(error);
          if (e.detail) {
            showNotification({
              title: 'Error submitting document case',
              message: e.detail,
              color: 'red',
            });
          }
        }
      },
    });
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

  const isSubmitted = status === FoundDocumentCaseStatus.SUBMITTED;

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
              (reportType === 'FOUND' && status !== FoundDocumentCaseStatus.DRAFT) ||
              (reportType === 'LOST' && status !== LostDocumentCaseStatus.SUBMITTED)
            }
          >
            Edit Case Details
          </Menu.Item>
        )}
        {reportType === 'FOUND' && (
          <>
            <Menu.Item
              leftSection={<TablerIcon name="send" size={14} />}
              onClick={handleSubmitDocumentCase}
              disabled={status !== FoundDocumentCaseStatus.DRAFT}
            >
              Submit Case
            </Menu.Item>
            {(canVerify || canReject) && <Menu.Divider />}
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
