import React from 'react';
import { Badge, Button, Grid, Group, Stack, Text } from '@mantine/core';
import { SectionTitle, StatusBadge, TablerIcon, launchWorkspace } from '@/components';
import { useUserHasSystemAccessSync } from '@/hooks/useSystemAccess';
import VerifyFoundDocumentCaseForm from '../forms/VerifyFoundDocumentCaseForm';
import RejectFoundDocumentCaseForm from '../forms/RejectFoundDocumentCaseForm';
import {
  DocumentCase,
  FoundDocumentCase,
  FoundDocumentCaseStatus,
  LostDocumentCase,
} from '../types';
import { formatDate } from '../utils/reportUtils';

interface ReportDetailsProps {
  lostOrFoundDate?: string;
  createdAt?: string;
  description?: string;
  tags?: string[];
  lostDocumentCase?: LostDocumentCase;
  foundDocumentCase?: FoundDocumentCase;
  documentCase?: DocumentCase;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  lostOrFoundDate,
  createdAt,
  description,
  tags,
  lostDocumentCase,
  foundDocumentCase,
  documentCase,
}) => {
  const { hasAccess: canVerify } = useUserHasSystemAccessSync({ documentCase: ['verify'] });
  const { hasAccess: canReject } = useUserHasSystemAccessSync({ documentCase: ['reject'] });

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
    const foundStatus = foundDocumentCase?.status;
    return (
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <SectionTitle label="Found Report Details" />
          <Group gap="xs">
            {foundStatus === FoundDocumentCaseStatus.SUBMITTED && canVerify && documentCase && (
              <Button
                size="xs"
                variant="light"
                color="civicGreen"
                leftSection={<TablerIcon name="circleCheck" size={14} />}
                onClick={() => {
                  const dismiss = launchWorkspace(
                    <VerifyFoundDocumentCaseForm documentCase={documentCase} onClose={() => dismiss()} />,
                    { title: 'Verify Found Document Case' }
                  );
                }}
              >
                Verify
              </Button>
            )}
            {foundStatus === FoundDocumentCaseStatus.SUBMITTED && canReject && documentCase && (
              <Button
                size="xs"
                variant="light"
                color="red"
                leftSection={<TablerIcon name="circleX" size={14} />}
                onClick={() => {
                  const dismiss = launchWorkspace(
                    <RejectFoundDocumentCaseForm documentCase={documentCase} onClose={() => dismiss()} />,
                    { title: 'Reject Found Document Case' }
                  );
                }}
              >
                Reject
              </Button>
            )}
          </Group>
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
