import React from 'react';
import {
  Badge,
  Button,
  Group,
  Menu,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  useComputedColorScheme,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { TablerIcon, TablerIconName } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { useDocumentCaseApi } from '../hooks/useDocumentCases';
import { CaseType, FoundDocumentCaseStatus, LostDocumentCaseStatus } from '../types';
import { getStatusColor } from '../utils/reportUtils';

interface ReportHeaderProps {
  caseId: string;
  docType: string;
  docId: string;
  status: string;
  pointAwarded?: number;
  docTypeIcon: string;
  reportType: CaseType;
  onUpdateReportDetails?: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  caseId,
  docType,
  docId,
  status,
  pointAwarded,
  docTypeIcon,
  reportType,
  onUpdateReportDetails,
}) => {
  const colorScheme = useComputedColorScheme();
  const { submitDocumentCase } = useDocumentCaseApi();
  const handleSubmitDocumentCase = () => {
    openConfirmModal({
      title: 'Submit Document Case',
      children: (
        <Text>
          Are you sure you want to submit this document case? By submitting you verify that all case
          details are correct. You will not be able to edit the case details after submitting.
        </Text>
      ),
      labels: { confirm: 'Submit', cancel: 'Cancel' },
      confirmProps: { color: 'teal' },
      cancelProps: { color: 'red' },

      onConfirm: async () => {
        try {
          await submitDocumentCase(caseId);
          showNotification({
            title: 'Success',
            message: 'Document case submitted successfully',
            color: 'green',
          });
        } catch (error) {
          const e = handleApiErrors<{}>(error);
          if (e.detail) {
            showNotification({
              title: 'Error submitting document case',
              message: e.detail,
              color: 'red',
            });
          }
        }
      },
    });
  };
  return (
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <Group gap="md">
        <ThemeIcon size={60} radius="md" color="blue" variant="light">
          <TablerIcon name={docTypeIcon as TablerIconName} size={32} />
        </ThemeIcon>
        <Stack gap="xs">
          <Title order={2} mb={4}>
            {docType} Report
          </Title>
          <Group gap="sm">
            <Text size="sm" c="dimmed">
              Report ID: {docId}
            </Text>
            <Badge size="xs" variant="light">
              {reportType === 'FOUND' ? 'Found Document' : 'Lost Document'}
            </Badge>
            <Badge size="xs" color={getStatusColor(status, colorScheme)} variant="light">
              {status}
            </Badge>
            {reportType === 'FOUND' && pointAwarded && pointAwarded > 0 && (
              <Tooltip label="Points are awarded when document is reunited with owner successfully">
                <Badge
                  size="lg"
                  color={colorScheme === 'dark' ? 'green.7' : 'green'}
                  variant="light"
                >
                  {pointAwarded} Points
                </Badge>
              </Tooltip>
            )}
          </Group>
        </Stack>
      </Group>
      <Group gap="sm">
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <Button leftSection={<TablerIcon name="dotsVertical" size={14} />} variant="light">
              Actions
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Divider />
            {onUpdateReportDetails && (
              <Menu.Item
                leftSection={<TablerIcon name="edit" size={14} />}
                onClick={onUpdateReportDetails}
                disabled={
                  (reportType === 'FOUND' && status !== FoundDocumentCaseStatus.DRAFT) ||
                  (reportType === 'LOST' && status !== LostDocumentCaseStatus.SUBMITTED)
                }
              >
                Edit Case Details
              </Menu.Item>
            )}
            {reportType === 'FOUND' && (
              <Menu.Item
                leftSection={<TablerIcon name="check" size={14} />}
                onClick={handleSubmitDocumentCase}
                disabled={status !== FoundDocumentCaseStatus.DRAFT}
              >
                Submit Case
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default ReportHeader;
