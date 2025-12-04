import React from 'react';
import { ActionIcon, Badge, Grid, Group, Text, Title } from '@mantine/core';
import { TablerIcon } from '@/components';
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

  const Common = () => (
    <>
      <Grid.Col span={6}>
        <Text fw={700}>Report Created:</Text>
        <Text>{formatDate(createdAt)}</Text>
      </Grid.Col>
      <Grid.Col span={12}>
        <Text fw={700}>Description:</Text>
        <Text>{description || 'No description provided'}</Text>
      </Grid.Col>
      <Grid.Col span={12}>
        <Text fw={700}>Tags:</Text>
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
    </>
  );

  if (isLostReport) {
    return (
      <div>
        <Group mb="md" justify="space-between">
          <Title order={4}>Lost Report Details</Title>
          <ActionIcon
            onClick={onUpdateCaseDetails}
            disabled={lostDocumentCase?.status !== LostDocumentCaseStatus.SUBMITTED}
          >
            <TablerIcon name="edit" size={20} />
          </ActionIcon>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Text fw={700}>Date Lost:</Text>
            <Text>{formatDate(lostOrFoundDate)}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text fw={700}>Status:</Text>
            <Badge variant="light" color="orange">
              {lostDocumentCase?.status}
            </Badge>
          </Grid.Col>
          <Common />
        </Grid>
      </div>
    );
  }
  if (isFoundReport) {
    return (
      <div>
        <Group mb="md" justify="space-between">
          <Title order={4}>Found Report Details</Title>
          <ActionIcon
            onClick={onUpdateCaseDetails}
            disabled={foundDocumentCase?.status !== FoundDocumentCaseStatus.DRAFT}
          >
            <TablerIcon name="edit" size={20} />
          </ActionIcon>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Text fw={700}>Date Found:</Text>
            <Text>{formatDate(lostOrFoundDate)}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text fw={700}>Status:</Text>
            <Badge variant="light" color="orange">
              {foundDocumentCase?.status}
            </Badge>
          </Grid.Col>
          <Common />
        </Grid>
      </div>
    );
  }

  return null;
};

export default ReportDetails;
