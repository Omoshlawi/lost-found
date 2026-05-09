import React, { FC, ReactNode } from 'react';
import { closeModal, openModal } from '@mantine/modals';
import { launchWorkspace, SystemAuthorized } from '@/components';
import {
  ConfirmOutboundCodeForm,
  IssueOutboundCodeForm,
  RevokeOutboundCodeForm,
} from '../../forms';
import { Claim } from '@/features/claims/types';

type OutboundActionProps = {
  claim: Claim;
  exchangeNumber: string;
  renderTrigger: (props: { onClick: () => void }) => ReactNode;
};

export const IssueOutboundCollectionCode: FC<OutboundActionProps> = ({
  claim,
  exchangeNumber,
  renderTrigger,
}) => {
  const open = () => {
    const close = launchWorkspace(
      <IssueOutboundCodeForm
        claim={claim}
        exchangeNumber={exchangeNumber}
        onClose={() => close()}
      />,
      { title: 'Issue Claimant Code' }
    );
  };
  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      {renderTrigger({ onClick: open })}
    </SystemAuthorized>
  );
};

export const VerifyOutboundCollectionCode: FC<OutboundActionProps> = ({
  claim,
  exchangeNumber,
  renderTrigger,
}) => {
  const open = () => {
    const id = openModal({
      children: (
        <ConfirmOutboundCodeForm
          claim={claim}
          exchangeNumber={exchangeNumber}
          onClose={() => closeModal(id)}
        />
      ),
      title: 'Enter Claimant Code',
    });
  };
  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      {renderTrigger({ onClick: open })}
    </SystemAuthorized>
  );
};

export const RevokeOutboundCollectionCode: FC<OutboundActionProps> = ({
  claim,
  exchangeNumber,
  renderTrigger,
}) => {
  const open = () => {
    const close = launchWorkspace(
      <RevokeOutboundCodeForm
        claim={claim}
        exchangeNumber={exchangeNumber}
        onClose={() => close()}
      />,
      { title: 'Revoke Claimant Code' }
    );
  };
  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      {renderTrigger({ onClick: open })}
    </SystemAuthorized>
  );
};
