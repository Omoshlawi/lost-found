import React from 'react';
import { ActionIcon, Badge, Grid, Group, Stack, Text } from '@mantine/core';
import { SectionTitle, StatusBadge, TablerIcon } from '@/components';
import {
  FoundDocumentCase,
  FoundDocumentCaseStatus,
  LostDocumentCase,
  LostDocumentCaseStatus,
} from '../types';
import { formatDate } from '../utils/reportUtils';

interface ReportDetailsProps {
  lostOrFoundDate?: string;
  createdAt?: string;
  description?: string;
  tags?: string[];
  lostDocumentCase?: LostDocumentCase;
  foundDocumentCase?: FoundDocumentCase;
  onUpdateCaseDetails?: () => void;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  lostOrFoundDate,
  createdAt,
  description,
  tags,
  lostDocumentCase,
  foundDocumentCase,
  onUpdateCaseDetails,
}) => {
  const isLostReport = !!lostDocumentCase;
  const isFoundReport = !!foundDocumentCase;

  const CaseNotes = () => (
    <>
      <SectionTitle label="Case Notes" />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Report Created
          </Text>
          <Text>{formatDate(createdAt)}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Description
          </Text>
          <Text>{description || 'No description provided'}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Tags
          </Text>
          <Group gap="xs">
            {tags?.length ? (
              tags.map((tag, index) => (
                <Badge key={index} variant="outline" color="gray">
                  {tag}
                </Badge>
              ))
            ) : (
              <Text size="sm" c="dimmed">
                No tags
              </Text>
            )}
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );

  if (isLostReport) {
    return (
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <SectionTitle label="Lost Report Details" />
          <ActionIcon
            variant="subtle"
            onClick={onUpdateCaseDetails}
            disabled={lostDocumentCase?.status !== LostDocumentCaseStatus.SUBMITTED}
          >
            <TablerIcon name="edit" size={20} />
          </ActionIcon>
        </Group>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Date Lost
            </Text>
            <Text>{formatDate(lostOrFoundDate)}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Status
            </Text>
            <StatusBadge status={lostDocumentCase?.status} />
          </Grid.Col>
        </Grid>
        <CaseNotes />
      </Stack>
    );
  }

  if (isFoundReport) {
    return (
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <SectionTitle label="Found Report Details" />
          <ActionIcon
            variant="subtle"
            onClick={onUpdateCaseDetails}
            disabled={foundDocumentCase?.status !== FoundDocumentCaseStatus.DRAFT}
          >
            <TablerIcon name="edit" size={20} />
          </ActionIcon>
        </Group>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Date Found
            </Text>
            <Text>{formatDate(lostOrFoundDate)}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Status
            </Text>
            <StatusBadge status={foundDocumentCase?.status} />
          </Grid.Col>
        </Grid>
        <CaseNotes />
      </Stack>
    );
  }

  return null;
};

export default ReportDetails;
