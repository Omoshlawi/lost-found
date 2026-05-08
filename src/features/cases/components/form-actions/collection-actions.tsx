import React, { FC, ReactNode } from 'react';
import { closeModal, openModal } from '@mantine/modals';
import { launchWorkspace, SystemAuthorized } from '@/components';
import { CancelCollectionForm, ConfirmCollectionForm, InitiateCollectionForm } from '../../forms';
import RevokeCodeForm from '../../forms/RevokeCodeForm';
import { DocumentCase } from '../../types';

type ActionProps = {
  documentCase: DocumentCase;
  renderTrigger: (props: { onClick: () => void }) => ReactNode;
};
export const IssueDocumentCollectionCode: FC<ActionProps> = ({ documentCase, renderTrigger }) => {
  const openInitiate = (title = 'Initiate Document Collection') => {
    const close = launchWorkspace(
      <InitiateCollectionForm documentCase={documentCase} onClose={() => close()} />,
      { title }
    );
  };
  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      {renderTrigger({ onClick: () => openInitiate() })}
    </SystemAuthorized>
  );
};

export const VerifyDocumentCollectionCode: FC<ActionProps> = ({ documentCase, renderTrigger }) => {
  const openEnterCode = () => {
    const id = openModal({
      children: (
        <ConfirmCollectionForm documentCase={documentCase} onClose={() => closeModal(id)} />
      ),
      title: 'Enter Finder Code',
    });
  };

  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      {renderTrigger({ onClick: () => openEnterCode() })}
    </SystemAuthorized>
  );
};
export const CancelDocumentCollection: FC<ActionProps> = ({ documentCase, renderTrigger }) => {
  const openCancel = () => {
    const close = launchWorkspace(
      <CancelCollectionForm documentCase={documentCase} onClose={() => close()} />,
      { title: 'Cancel Collection' }
    );
  };

  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      {renderTrigger({ onClick: () => openCancel() })}
    </SystemAuthorized>
  );
};
export const RevokeDocumentCollection: FC<ActionProps> = ({ documentCase, renderTrigger }) => {
  const openRevokeCode = () => {
    const close = launchWorkspace(
      <RevokeCodeForm documentCase={documentCase} onClose={() => close()} />,
      { title: 'Revoke Verification Code' }
    );
  };

  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      {renderTrigger({ onClick: () => openRevokeCode() })}
    </SystemAuthorized>
  );
};
