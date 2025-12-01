import React from 'react';
import {
  Badge,
  Group,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { CaseType, FoundDocumentCase } from '../types';

interface ContactFooterProps {
  reportType: CaseType;
  foundDocumentCase?: FoundDocumentCase;
}

const ContactFooter: React.FC<ContactFooterProps> = ({ reportType, foundDocumentCase }) => {
  if (reportType === 'LOST') {
    return (
      <div>
        <Group justify="space-between">
          <Group>
            <ThemeIcon size="md" radius="xl" color="blue">
              <TablerIcon name="info-circle" size={16} />
            </ThemeIcon>
            <div>
              <Text size="sm" c="dimmed">Report Type</Text>
              <Text fw={700}>Lost Document</Text>
            </div>
          </Group>
          <Badge size="lg" variant="light" color="orange">
            Searching for Match
          </Badge>
        </Group>
      </div>
    );
  }

  if (reportType === 'FOUND') {
    const isReadyForClaim = foundDocumentCase?.status === 'VERIFIED' || 
                            foundDocumentCase?.status === 'MATCHED' ||
                            foundDocumentCase?.status === 'CLAIMED';

    return (
      <div>
        <Group justify="space-between">
          <Group>
            <ThemeIcon size="md" radius="xl" color="green">
              <TablerIcon name="check" size={16} />
            </ThemeIcon>
            <div>
              <Text size="sm" c="dimmed">Report Type</Text>
              <Text fw={700}>Found Document</Text>
            </div>
          </Group>
          {isReadyForClaim && (
            <Badge size="lg" variant="light" color="green">
              Ready for Claim
            </Badge>
          )}
          {foundDocumentCase && foundDocumentCase.pointAwarded > 0 && (
            <Badge size="lg" variant="outline" color="green">
              {foundDocumentCase.pointAwarded} Points
            </Badge>
          )}
        </Group>
      </div>
    );
  }

  return null;
};

export default ContactFooter;
