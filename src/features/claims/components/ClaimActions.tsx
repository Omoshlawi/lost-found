import { FC } from 'react';
import { Button, Menu, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { launchWorkspace, SystemAuthorized, TablerIcon } from '@/components';
import { RejectClaimForm, VerifyClaimForm } from '../forms';
import { Claim, ClaimStatus } from '../types';

type ClaimActionsProps = {
  claim: Claim;
};

const ClaimActions: FC<ClaimActionsProps> = ({ claim }) => {
  const handleReject = () => {
    const dismiss = launchWorkspace(<RejectClaimForm claim={claim} onClose={() => dismiss()} />, {
      title: 'Reject Claim',
    });
  };
  const handleVerify = () => {
    const dismiss = launchWorkspace(<VerifyClaimForm claim={claim} onClose={() => dismiss()} />, {
      title: 'Verify Claim',
    });
  };
  const handleDelete = () => {
    openConfirmModal({
      title: 'Confirm Delete',
      children: (
        <Text size="sm">
          This action will permanently delete the claim. Are you sure you want to proceed?
        </Text>
      ),
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
      confirmProps: {
        color: 'red',
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: () => {
        // Hit delete endpoint
      },
    });
  };
  const verifyableStatuses: ClaimStatus[] = [
    ClaimStatus.PENDING,
    ClaimStatus.REJECTED,
    ClaimStatus.DISPUTED,
  ];
  const rejectableStatuses: ClaimStatus[] = [
    ClaimStatus.PENDING,
    ClaimStatus.VERIFIED,
    ClaimStatus.DISPUTED,
  ];
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant="light"
          aria-label="Actions"
          leftSection={
            <TablerIcon name="dotsVertical" style={{ width: '70%', height: '70%' }} stroke={1.5} />
          }
        >
          Actions
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Divider />
        {verifyableStatuses.includes(claim.status) && (
          <SystemAuthorized
            permissions={{ claim: ['verify'] }}
            unauthorizedAction={{ type: 'hide' }}
          >
            <Menu.Item
              leftSection={<TablerIcon name="check" size={14} />}
              onClick={handleVerify}
              color="green"
            >
              Verify
            </Menu.Item>
          </SystemAuthorized>
        )}
        {rejectableStatuses.includes(claim.status) && (
          <SystemAuthorized
            permissions={{ claim: ['reject'] }}
            unauthorizedAction={{ type: 'hide' }}
          >
            <Menu.Item
              leftSection={<TablerIcon name="x" size={14} />}
              onClick={handleReject}
              color="red"
            >
              Reject
            </Menu.Item>
          </SystemAuthorized>
        )}
        <SystemAuthorized permissions={{ claim: ['delete'] }} unauthorizedAction={{ type: 'hide' }}>
          <Menu.Item
            leftSection={<TablerIcon name="trash" size={14} />}
            color="red"
            onClick={handleDelete}
          >
            Delete
          </Menu.Item>
        </SystemAuthorized>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ClaimActions;
