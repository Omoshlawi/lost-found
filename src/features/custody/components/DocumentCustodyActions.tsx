import React from 'react';
import { Button, Group, Menu } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { handleApiErrors } from '@/lib/api';
import ConditionUpdateForm from '../forms/ConditionUpdateForm';
import DisposalForm from '../forms/DisposalForm';
import TransferOutForm from '../forms/TransferOutForm';
import { recordAudit } from '../hooks/useCustody';
import { CustodyStatus } from '../types';

interface DocumentCustodyActionsProps {
  foundCaseId: string;
  custodyStatus: CustodyStatus | string;
  currentStationId?: string | null;
  onActionComplete?: () => void;
}

const DocumentCustodyActions: React.FC<DocumentCustodyActionsProps> = ({
  foundCaseId,
  custodyStatus,
  currentStationId,
  onActionComplete,
}) => {
  const isInCustody = custodyStatus === CustodyStatus.IN_CUSTODY;
  const isInTransit = custodyStatus === CustodyStatus.IN_TRANSIT;
  const isTerminal =
    custodyStatus === CustodyStatus.HANDED_OVER || custodyStatus === CustodyStatus.DISPOSED;

  const handleAudit = async () => {
    if (!currentStationId) {
      return;
    }
    try {
      await recordAudit(foundCaseId, { stationId: currentStationId });
      showNotification({
        title: 'Audit recorded',
        message: 'Location audit confirmed.',
        color: 'teal',
      });
      onActionComplete?.();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      showNotification({
        title: 'Error',
        message: e.detail ?? 'Failed to record audit.',
        color: 'red',
      });
    }
  };

  const openTransferOut = () => {
    const close = launchWorkspace(
      <TransferOutForm
        foundCaseId={foundCaseId}
        currentStationId={currentStationId}
        onClose={() => close()}
        onSuccess={onActionComplete}
      />,
      { title: 'Initiate Transfer' }
    );
  };

  const openDisposal = () => {
    const close = launchWorkspace(
      <DisposalForm
        foundCaseId={foundCaseId}
        currentStationId={currentStationId}
        onClose={() => close()}
        onSuccess={onActionComplete}
      />,
      { title: 'Dispose Document' }
    );
  };

  const openConditionUpdate = () => {
    const close = launchWorkspace(
      <ConditionUpdateForm
        foundCaseId={foundCaseId}
        currentStationId={currentStationId}
        onClose={() => close()}
        onSuccess={onActionComplete}
      />,
      { title: 'Record Condition' }
    );
  };

  if (isTerminal) {
    return null;
  }

  return (
    <Group gap="xs" wrap="nowrap">
      {isInCustody && (
        <Button
          leftSection={<TablerIcon name="arrowRight" size={14} />}
          variant="light"
          size="sm"
          onClick={openTransferOut}
        >
          Transfer
        </Button>
      )}

      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          <Button
            leftSection={<TablerIcon name="dotsVertical" size={14} />}
            variant="light"
            size="sm"
          >
            Actions
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Custody Operations</Menu.Label>

          {isInCustody && (
            <Menu.Item
              leftSection={<TablerIcon name="clipboardCheck" size={14} />}
              onClick={handleAudit}
              disabled={!currentStationId}
            >
              Confirm Location (Audit)
            </Menu.Item>
          )}

          {!isTerminal && (
            <Menu.Item
              leftSection={<TablerIcon name="alertCircle" size={14} />}
              onClick={openConditionUpdate}
            >
              Record Condition
            </Menu.Item>
          )}

          {isInCustody && (
            <>
              <Menu.Divider />
              <Menu.Item
                leftSection={<TablerIcon name="trash" size={14} />}
                color="red"
                onClick={openDisposal}
              >
                Dispose Document
              </Menu.Item>
            </>
          )}

          {isInTransit && (
            <Menu.Item
              leftSection={<TablerIcon name="arrowBack" size={14} />}
              color="orange"
              onClick={() => {
                showNotification({
                  title: 'Use Return form',
                  message: 'Record a return from the custody detail page.',
                  color: 'orange',
                });
              }}
            >
              Mark as Return
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default DocumentCustodyActions;
