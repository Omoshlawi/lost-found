import React from 'react';
import { Alert } from '@mantine/core';
import { TablerIcon } from '@/components';
import { CaseType, FoundDocumentCase } from '../types';

interface ContactFooterProps {
  reportType: CaseType;
  foundDocumentCase?: FoundDocumentCase;
}

const ContactFooter: React.FC<ContactFooterProps> = ({ reportType, foundDocumentCase }) => {
  if (reportType === 'LOST') {
    return (
      <Alert
        variant="light"
        color="civicBlue"
        icon={<TablerIcon name="infoCircle" size={16} />}
        title="Lost Document"
      >
        This report is being actively matched against found documents in the system.
      </Alert>
    );
  }

  if (reportType === 'FOUND') {
    const isReadyForClaim =
      foundDocumentCase?.status === 'VERIFIED' ||
      foundDocumentCase?.status === 'MATCHED' ||
      foundDocumentCase?.status === 'CLAIMED';

    if (isReadyForClaim) {
      return (
        <Alert
          variant="light"
          color="civicGreen"
          icon={<TablerIcon name="check" size={16} />}
          title="Found Document — Ready for Claim"
        >
          This document has been verified and is available for the owner to claim.
        </Alert>
      );
    }

    return (
      <Alert
        variant="light"
        color="gray"
        icon={<TablerIcon name="check" size={16} />}
        title="Found Document"
      >
        This document has been submitted and is pending verification.
      </Alert>
    );
  }

  return null;
};

export default ContactFooter;
