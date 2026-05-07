import React from 'react';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { handleApiErrors } from '@/lib/api';
import AddItemsForm from '../forms/AddItemsForm';
import {
  approveOperation,
  cancelOperation,
  executeOperation,
  rejectOperation,
  submitOperation,
} from '../hooks/useCustody';
import { DocumentOperation, DocumentOperationStatus } from '../types';

interface OperationActionsMenuProps {
  operation: DocumentOperation;
  onMutate: () => void;
}

export const OperationActionsMenu: React.FC<OperationActionsMenuProps> = ({
  operation,
  onMutate,
}) => {
  const isDraft = operation.status === DocumentOperationStatus.DRAFT;
  const isSubmitted = operation.status === DocumentOperationStatus.SUBMITTED;
  const isApproved = operation.status === DocumentOperationStatus.APPROVED;
  const isTerminal =
    operation.status === DocumentOperationStatus.COMPLETED ||
    operation.status === DocumentOperationStatus.CANCELLED;

  if (isTerminal) {
    return null;
  }

  const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    try {
      await actionFn();
      showNotification({ title: 'Done', message: successMsg, color: 'teal' });
      onMutate();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      showNotification({ title: 'Error', message: e.detail ?? 'Action failed.', color: 'red' });
    }
  };

  const openAddItems = () => {
    const existingIds = operation.items?.map((i) => i.foundCaseId) ?? [];
    const close = launchWorkspace(
      <AddItemsForm
        operation={operation}
        existingFoundCaseIds={existingIds}
        onClose={() => close()}
        onSuccess={onMutate}
      />,
      { title: `Add Documents — ${operation.operationNumber}` }
    );
  };

  const confirmExecute = () =>
    modals.openConfirmModal({
      title: 'Execute Operation',
      children: (
        <Text size="sm">
          Execute <strong>{operation.operationNumber}</strong>? This will process all pending
          items and apply custody transitions.
        </Text>
      ),
      labels: { confirm: 'Execute', cancel: 'Cancel' },
      onConfirm: () => handleAction(() => executeOperation(operation.id), 'Operation executed successfully.'),
    });

  const confirmSubmit = () =>
    modals.openConfirmModal({
      title: 'Submit for Approval',
      children: (
        <Text size="sm">
          Submit <strong>{operation.operationNumber}</strong> for supervisor approval? The
          operation will be locked for editing once submitted.
        </Text>
      ),
      labels: { confirm: 'Submit', cancel: 'Cancel' },
      onConfirm: () => handleAction(() => submitOperation(operation.id), 'Operation submitted for approval.'),
    });

  const confirmApprove = () =>
    modals.openConfirmModal({
      title: 'Approve Operation',
      children: (
        <Text size="sm">
          Approve <strong>{operation.operationNumber}</strong>? It will be ready for execution.
        </Text>
      ),
      labels: { confirm: 'Approve', cancel: 'Cancel' },
      confirmProps: { color: 'teal' },
      onConfirm: () => handleAction(() => approveOperation(operation.id), 'Operation approved.'),
    });

  const confirmReject = () =>
    modals.openConfirmModal({
      title: 'Reject Operation',
      children: (
        <Text size="sm">
          Reject <strong>{operation.operationNumber}</strong>? The creator will need to revise
          and resubmit.
        </Text>
      ),
      labels: { confirm: 'Reject', cancel: 'Cancel' },
      confirmProps: { color: 'orange' },
      onConfirm: () => handleAction(() => rejectOperation(operation.id, 'OTHER'), 'Operation rejected.'),
    });

  const confirmCancel = () =>
    modals.openConfirmModal({
      title: 'Cancel Operation',
      children: (
        <Text size="sm">
          Cancel <strong>{operation.operationNumber}</strong>? This cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Cancel Operation', cancel: 'Keep' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleAction(() => cancelOperation(operation.id, 'CREATED_IN_ERROR'), 'Operation cancelled.'),
    });

  return (
    <Menu position="bottom-end" width={180}>
      <Menu.Target>
        <ActionIcon variant="subtle" size="sm">
          <TablerIcon name="dots" size={14} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {isDraft && (
          <>
            <Menu.Item
              leftSection={<TablerIcon name="filePlus" size={14} />}
              onClick={openAddItems}
            >
              Add Documents
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<TablerIcon name="bolt" size={14} />}
              onClick={confirmExecute}
            >
              Execute
            </Menu.Item>
            <Menu.Item
              leftSection={<TablerIcon name="send" size={14} />}
              onClick={confirmSubmit}
            >
              Submit for Approval
            </Menu.Item>
          </>
        )}
        {isSubmitted && (
          <>
            <Menu.Item
              leftSection={<TablerIcon name="check" size={14} />}
              color="teal"
              onClick={confirmApprove}
            >
              Approve
            </Menu.Item>
            <Menu.Item
              leftSection={<TablerIcon name="x" size={14} />}
              color="orange"
              onClick={confirmReject}
            >
              Reject
            </Menu.Item>
          </>
        )}
        {isApproved && (
          <Menu.Item
            leftSection={<TablerIcon name="bolt" size={14} />}
            onClick={confirmExecute}
          >
            Execute
          </Menu.Item>
        )}
        <>
          <Menu.Divider />
          <Menu.Item
            leftSection={<TablerIcon name="ban" size={14} />}
            color="red"
            onClick={confirmCancel}
          >
            Cancel
          </Menu.Item>
        </>
      </Menu.Dropdown>
    </Menu>
  );
};
