import React from 'react';
import { ActionIcon, Badge, Box, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import { TablerIcon } from '@/components';
import { GroupedStaffGrant, StaffStationOperation } from '../types';

type ExpandedGrantRowProps = {
  group: GroupedStaffGrant;
  onRevoke: (grant: StaffStationOperation) => void;
};

export const ExpandedGrantRow: React.FC<ExpandedGrantRowProps> = ({ group, onRevoke }) => (
  <Stack gap="sm" py="xs">
    {group.stations.map((sg, i) => (
      <React.Fragment key={sg.stationId}>
        {i > 0 && <Divider />}
        <Box>
          <Group gap="xs" mb={6}>
            <TablerIcon name="building" size={14} />
            <Text size="sm" fw={600}>
              {sg.station?.name ?? sg.stationId}
            </Text>
            {sg.station?.code && (
              <Badge size="xs" variant="light" color="teal">
                {sg.station.code}
              </Badge>
            )}
          </Group>
          <Group gap={6} wrap="wrap" pl={22}>
            {sg.operations.map((op) => (
              <Badge
                key={op.id}
                variant="light"
                color="civicBlue"
                size="sm"
                rightSection={
                  <Tooltip label="Revoke" withArrow position="top">
                    <ActionIcon
                      size={12}
                      variant="transparent"
                      color="red"
                      onClick={() => onRevoke(op)}
                      aria-label={`Revoke ${op.operationType?.name}`}
                    >
                      <TablerIcon name="x" size={10} />
                    </ActionIcon>
                  </Tooltip>
                }
              >
                {op.operationType?.name ?? op.operationTypeId}
              </Badge>
            ))}
          </Group>
        </Box>
      </React.Fragment>
    ))}
  </Stack>
);
