import React from 'react';
import {
  Badge,
  Button,
  Group,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  useComputedColorScheme,
} from '@mantine/core';
import { TablerIcon, TablerIconName } from '@/components';
import { CaseType } from '../types';
import { getStatusColor } from '../utils/reportUtils';

interface ReportHeaderProps {
  docType: string;
  docId: string;
  status: string;
  pointAwarded?: number;
  docTypeIcon: string;
  reportType: CaseType;
  onUpdateReportDetails?: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  docType,
  docId,
  status,
  pointAwarded,
  docTypeIcon,
  reportType,
  onUpdateReportDetails,
}) => {
  const colorScheme = useComputedColorScheme();

  return (
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <Group gap="md">
        <ThemeIcon size={56} radius="md" color="blue" variant="light">
          <TablerIcon name={docTypeIcon as TablerIconName} size={32} />
        </ThemeIcon>
        <div>
          <Title order={2} mb={4}>
            {docType} Report
          </Title>
          <Text size="sm" c="dimmed">
            Report ID: {docId}
          </Text>
        </div>
      </Group>
      <Group gap="sm">
        <Badge size="lg" variant="light">
          {reportType === 'FOUND' ? 'Found Document' : 'Lost Document'}
        </Badge>
        <Badge size="lg" color={getStatusColor(status, colorScheme)} variant="light">
          {status}
        </Badge>
        {reportType === 'FOUND' && pointAwarded && pointAwarded > 0 && (
          <Tooltip label="Points are awarded when document is reunited with owner successfully">
            <Badge size="lg" color={colorScheme === 'dark' ? 'green.7' : 'green'} variant="light">
              {pointAwarded} Points
            </Badge>
          </Tooltip>
        )}
        {onUpdateReportDetails && (
          <Tooltip label="Update Case Information">
            <Button
              variant="light"
              color="blue"
              size="sm"
              leftSection={<TablerIcon name="edit" size={16} />}
              onClick={onUpdateReportDetails}
            >
              Edit
            </Button>
          </Tooltip>
        )}
      </Group>
    </Group>
  );
};

export default ReportHeader;
