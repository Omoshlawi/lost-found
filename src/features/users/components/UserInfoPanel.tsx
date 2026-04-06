import React from 'react';
import { Box, Divider, Group, Stack, Text } from '@mantine/core';

interface UserInfoPanelProps {
  label: string;
  fields: Array<{
    label: string;
    value: string | React.ReactNode;
    color?: string;
  }>;
}

const UserInfoPanel: React.FC<UserInfoPanelProps> = ({ label, fields }) => (
  <Stack gap="xs" miw={220}>
    <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.08em' }}>
      {label}
    </Text>
    <Divider mb={4} />
    {fields.map((field, index) => (
      <Group key={index} gap={8} wrap="nowrap" align="baseline">
        <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
          {field.label}:
        </Text>
        <Box style={{ flex: 1, minWidth: 0 }}>
          {typeof field.value === 'string' ? (
            <Text size="sm" fw={500} c={field.color} truncate title={field.value}>
              {field.value}
            </Text>
          ) : (
            field.value
          )}
        </Box>
      </Group>
    ))}
  </Stack>
);

export default UserInfoPanel;
