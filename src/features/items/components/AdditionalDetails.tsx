import React from 'react';
import {
  ActionIcon,
  Box,
  Collapse,
  Divider,
  Grid,
  Group,
  Paper,
  Text,
  Timeline,
  useMantineTheme,
} from '@mantine/core';
import { 
  IconAlertCircle, 
  IconChevronDown, 
  IconChevronUp, 
  IconClock, 
  IconInfoCircle 
} from '@tabler/icons-react';
import { useComputedColorScheme } from '@mantine/core';
import { formatDate, getBackgroundColor } from '../utils/reportUtils';

interface DocumentType {
  name?: string;
  averageReplacementCost?: string | number;
  requiredVerification?: string;
}

interface AdditionalDetailsProps {
  isOpen: boolean;
  toggleOpen: () => void;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  document?: {
    type?: DocumentType;
  };
}

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  isOpen,
  toggleOpen,
  createdAt,
  updatedAt,
  status,
  document
}) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();

  return (
    <Box>
      <Group onClick={toggleOpen} style={{ cursor: 'pointer' }}>
        <Text fw={700}>Additional Details</Text>
        <ActionIcon>
          {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={isOpen}>
        <Paper
          p="md"
          radius="md"
          withBorder
          mt="md"
          style={{ backgroundColor: getBackgroundColor('gray', theme, colorScheme) }}
        >
          <Timeline active={1} bulletSize={24} lineWidth={2}>
            <Timeline.Item bullet={<IconClock size={12} />} title="Report Created">
              <Text c="dimmed" size="sm">
                {formatDate(createdAt)}
              </Text>
              <Text size="xs" mt={4}>
                Initial report was filed
              </Text>
            </Timeline.Item>

            <Timeline.Item bullet={<IconInfoCircle size={12} />} title="Last Updated">
              <Text color="dimmed" size="sm">
                {formatDate(updatedAt)}
              </Text>
              <Text size="xs" mt={4}>
                Report information was updated
              </Text>
            </Timeline.Item>

            <Timeline.Item
              bullet={<IconAlertCircle size={12} />}
              title="Status"
              lineVariant="dashed"
            >
              <Text c="dimmed" size="sm">
                Current: {status}
              </Text>
              <Text size="xs" mt={4}>
                Waiting for resolution
              </Text>
            </Timeline.Item>
          </Timeline>

          <Divider my="md" label="Document Details" labelPosition="center" />

          <Grid>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Replacement Cost:
              </Text>
              <Text size="sm">
                KES {document?.type?.averageReplacementCost || 'Unknown'}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700}>
                Verification Required:
              </Text>
              <Text size="sm">
                {document?.type?.requiredVerification || 'Unknown'}
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default AdditionalDetails;