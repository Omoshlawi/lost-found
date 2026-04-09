import React from 'react';
import { Box, Group, Stack, Text, Timeline } from '@mantine/core';
import { TablerIcon } from '@/components';
import { formatDate } from '@/lib/utils/helpers';
import { DocumentOperation } from '../types';
import { CustodyStatusBadge } from './CustodyStatusBadge';

interface OperationHistoryTimelineProps {
  operations: DocumentOperation[];
  isLoading?: boolean;
}

const OPERATION_ICON: Record<string, string> = {
  RECEIVED: 'packageImport',
  TRANSFER_OUT: 'arrowRight',
  TRANSFER_IN: 'arrowLeft',
  REQUISITION: 'fileText',
  HANDOVER: 'handStop',
  DISPOSAL: 'trash',
  RETURN: 'arrowBack',
  AUDIT: 'clipboardCheck',
  CONDITION_UPDATE: 'alertCircle',
};

export const OperationHistoryTimeline: React.FC<OperationHistoryTimelineProps> = ({
  operations,
}) => {
  if (operations.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="xl">
        No operations recorded yet.
      </Text>
    );
  }

  return (
    <Timeline active={operations.length - 1} bulletSize={28} lineWidth={2}>
      {operations.map((op) => {
        const iconName = OPERATION_ICON[op.operationType?.code ?? ''] ?? 'circle';
        const stationLabel =
          op.fromStation && op.toStation
            ? `${op.fromStation.name} → ${op.toStation.name}`
            : op.station?.name ?? null;

        return (
          <Timeline.Item
            key={op.id}
            bullet={<TablerIcon name={iconName as any} size={14} />}
            title={
              <Group gap="xs" wrap="nowrap">
                <Text size="sm" fw={600}>
                  {op.operationType?.name ?? op.operationNumber}
                </Text>
                <Text size="xs" c="dimmed">
                  {op.operationNumber}
                </Text>
              </Group>
            }
          >
            <Stack gap={4} mt={4}>
              <Group gap="xs">
                <CustodyStatusBadge status={op.custodyStatusBefore} />
                <TablerIcon name="arrowRight" size={12} />
                <CustodyStatusBadge status={op.custodyStatusAfter} />
              </Group>

              {stationLabel && (
                <Text size="xs" c="dimmed">
                  Station: {stationLabel}
                </Text>
              )}

              {op.notes && (
                <Box
                  px="xs"
                  py={4}
                  style={{ background: 'var(--mantine-color-gray-0)', borderRadius: 4 }}
                >
                  <Text size="xs" c="dimmed">
                    {op.notes}
                  </Text>
                </Box>
              )}

              <Text size="xs" c="dimmed">
                By {op.performedBy?.name ?? op.performedById} · {formatDate(op.createdAt)}
              </Text>
            </Stack>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};
