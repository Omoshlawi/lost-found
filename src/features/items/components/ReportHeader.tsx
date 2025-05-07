import React from 'react';
import { Badge, Group, Text, ThemeIcon, Title, useComputedColorScheme } from '@mantine/core';
import { TablerIcon, TablerIconName } from '@/components';
import { ReportType } from '../types';
import { getStatusColor, getUrgencyColor } from '../utils/reportUtils';

interface ReportHeaderProps {
  docType: string;
  docId: string;
  status: string;
  urgencyLevel?: string;
  docTypeIcon: string;
  reportType: ReportType;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  docType,
  docId,
  status,
  urgencyLevel,
  docTypeIcon,
  reportType,
}) => {
  const colorScheme = useComputedColorScheme();

  return (
    <Group mb="md">
      <Group>
        <ThemeIcon size={50} radius="md" color="blue.6">
          <TablerIcon name={docTypeIcon as TablerIconName} size={30} />
        </ThemeIcon>
        <div>
          <Title order={3}>{docType} Report</Title>
          <Text size="sm" c="dimmed">
            Report ID: {docId}
          </Text>
        </div>
      </Group>
      <Group>
        <Badge size="lg" color={getStatusColor(status, colorScheme)} variant="filled">
          {status}
        </Badge>
        {reportType === 'Lost' && (
          <Badge
            size="lg"
            color={getUrgencyColor(urgencyLevel, colorScheme) as any}
            variant="outline"
          >
            {urgencyLevel} Urgency
          </Badge>
        )}
        {reportType === 'Found' && (
          <Badge size="lg" color="green" variant="outline">
            Ready for Handover
          </Badge>
        )}
      </Group>
    </Group>
  );
};

export default ReportHeader;
