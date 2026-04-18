import React from 'react';
import { ActionIcon, Menu } from '@mantine/core';
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

  if (isTerminal) { return null; }

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
        operationId={operation.id}
        existingFoundCaseIds={existingIds}
        onClose={() => close()}
        onSuccess={onMutate}
      />,
      { title: `Add Documents — ${operation.operationNumber}` },
    );
  };

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
              onClick={() => handleAction(() => executeOperation(operation.id), 'Operation executed successfully.')}
            >
              Execute
            </Menu.Item>
            <Menu.Item
              leftSection={<TablerIcon name="send" size={14} />}
              onClick={() => handleAction(() => submitOperation(operation.id), 'Operation submitted for approval.')}
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
              onClick={() => handleAction(() => approveOperation(operation.id), 'Operation approved.')}
            >
              Approve
            </Menu.Item>
            <Menu.Item
              leftSection={<TablerIcon name="x" size={14} />}
              color="orange"
              onClick={() => handleAction(() => rejectOperation(operation.id, 'OTHER'), 'Operation rejected.')}
            >
              Reject
            </Menu.Item>
          </>
        )}
        {isApproved && (
          <Menu.Item
            leftSection={<TablerIcon name="bolt" size={14} />}
            onClick={() => handleAction(() => executeOperation(operation.id), 'Operation executed successfully.')}
          >
            Execute
          </Menu.Item>
        )}
        <>
          <Menu.Divider />
          <Menu.Item
            leftSection={<TablerIcon name="ban" size={14} />}
            color="red"
            onClick={() => handleAction(() => cancelOperation(operation.id, 'CREATED_IN_ERROR'), 'Operation cancelled.')}
          >
            Cancel
          </Menu.Item>
        </>
      </Menu.Dropdown>
    </Menu>
  );
};
