import React from 'react';
import { Button, Menu, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useDocumentCaseApi } from '../hooks/useDocumentCases';
import { CaseType, FoundDocumentCaseStatus, LostDocumentCaseStatus } from '../types';

interface DocumentCaseActionsProps {
  caseId: string;
  reportType: CaseType;
  status: string;
  onUpdateReportDetails?: () => void;
}

const DocumentCaseActions: React.FC<DocumentCaseActionsProps> = ({
  caseId,
  reportType,
  status,
  onUpdateReportDetails,
}) => {
  const { submitDocumentCase } = useDocumentCaseApi();

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
          <Menu.Item
            leftSection={<TablerIcon name="check" size={14} />}
            onClick={handleSubmitDocumentCase}
            disabled={status !== FoundDocumentCaseStatus.DRAFT}
          >
            Submit Case
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default DocumentCaseActions;
