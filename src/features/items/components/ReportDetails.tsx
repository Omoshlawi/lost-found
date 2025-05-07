import React from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  Badge,
  Grid,
  Group,
  Paper,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { FoundReport, LostReport, ReportType } from '../types';
import { formatDate, getBackgroundColor } from '../utils/reportUtils';

interface ReportDetailsProps {
  lostOrFoundDate?: string;
  createdAt?: string;
  description?: string;
  tags?: string[];
  lostReport?: LostReport;
  foundReport?: FoundReport;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  lostOrFoundDate,
  createdAt,
  description,
  tags,
  lostReport,
  foundReport,
}) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const isLostReport = lostReport !== null;
  const isFoundReport = foundReport !== null;

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

  if (isLostReport)
    return (
      <Paper
        p="md"
        radius="md"
        withBorder
        mb="md"
        style={{ backgroundColor: getBackgroundColor('orange', theme, colorScheme) }}
      >
        <Group mb="xs">
          <Title order={4}>Lost Report Details</Title>
          <Group>
            <Badge size="md" variant="dot" color="blue">
              {lostReport?.contactPreference}
            </Badge>
            <ThemeIcon size="lg" radius="xl" color="orange">
              <IconInfoCircle size={20} />
            </ThemeIcon>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Text fw={700}>Date Lost:</Text>
            <Text>{formatDate(lostOrFoundDate)}</Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <Text fw={700}>Identifying Marks:</Text>
            <Text> {lostReport?.identifyingMarks || 'None specified'}</Text>
          </Grid.Col>
          <Common />
        </Grid>
      </Paper>
    );
  if (isFoundReport)
    return (
      <Paper
        p="md"
        radius="md"
        withBorder
        mb="md"
        style={{ backgroundColor: getBackgroundColor('orange', theme, colorScheme) }}
      >
        <Group mb="xs">
          <Title order={4}>Found Report Details</Title>
          <Group>
            <Badge size="md" variant="dot" color="blue">
              {foundReport?.handoverPreference}
            </Badge>
            <ThemeIcon size="lg" radius="xl" color="orange">
              <IconInfoCircle size={20} />
            </ThemeIcon>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Text fw={700}>Date Found:</Text>
            <Text>{formatDate(lostOrFoundDate)}</Text>
          </Grid.Col>
          <Common />
        </Grid>
      </Paper>
    );
};

export default ReportDetails;
