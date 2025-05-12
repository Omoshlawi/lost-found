import React from 'react';
import {
  Badge,
  Button,
  Flex,
  Group,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  useComputedColorScheme,
} from '@mantine/core';
import { TablerIcon, TablerIconName } from '@/components';
import { ReportType } from '../types';
import { getStatusColor } from '../utils/reportUtils';

interface ReportHeaderProps {
  docType: string;
  docId: string;
  status: string;
  pointAwarded?: number;
  docTypeIcon: string;
  reportType: ReportType;
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
      <Group w={'100%'}>
        <Badge size="lg" color={getStatusColor(status, colorScheme)} variant="filled">
          {status}
        </Badge>
        {/* {reportType === 'Lost' && (
          <Badge size="lg" color={colorScheme === 'dark' ? 'green.7' : 'green'} variant="outline">
            {pointAwarded} Points
          </Badge>
        )} */}
        {reportType === 'Found' && (
          <Tooltip label="Points are awarded when document is reunited with owner succesfully">
            <Badge size="lg" color={colorScheme === 'dark' ? 'green.7' : 'green'} variant="outline">
              {pointAwarded} Points
            </Badge>
          </Tooltip>
        )}
        <Flex flex={1} />
        <Tooltip label="Update Report Information">
          <Button
            variant="outline"
            color="blue"
            leftSection={<TablerIcon name="edit" size={16} />}
            onClick={onUpdateReportDetails}
          >
            Update Report
          </Button>
        </Tooltip>
      </Group>
    </Group>
  );
};

export default ReportHeader;
