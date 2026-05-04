import React from 'react';
import { Badge, Box, Group, Text, ThemeIcon } from '@mantine/core';
import { TablerIcon } from '@/components';
import { DocumentOperationType } from '../types';
import { getOperationIcon } from './operationIcons';

interface OperationTypeHeaderProps {
  opType: DocumentOperationType;
}

export const OperationTypeHeader: React.FC<OperationTypeHeaderProps> = ({ opType }) => (
  <Box
    style={{
      border: '1px solid var(--mantine-color-default-border)',
      backgroundColor: 'var(--mantine-color-default)',
      padding: 'var(--mantine-spacing-md)',
    }}
  >
    <Group gap="sm" wrap="nowrap" align="flex-start">
      <ThemeIcon
        size="lg"
        variant="light"
        color={opType.isHighPrivilege ? 'orange' : 'civicBlue'}
        radius={0}
      >
        <TablerIcon name={getOperationIcon(opType.code)} size={18} />
      </ThemeIcon>
      <Box flex={1}>
        <Text fw={600} size="sm" lh={1.3}>
          {opType.name}
        </Text>
        {opType.description && (
          <Text size="xs" c="dimmed" mt={2}>
            {opType.description}
          </Text>
        )}
        <Group gap={6} mt={8}>
          {opType.isHighPrivilege && (
            <Badge size="xs" variant="light" color="orange">
              Requires approval
            </Badge>
          )}
          {opType.requiresDestinationStation && (
            <Badge size="xs" variant="light" color="civicBlue">
              Requires destination
            </Badge>
          )}
          {opType.requiresSourceStation && (
            <Badge size="xs" variant="light" color="civicBlue">
              Requires source station
            </Badge>
          )}
          {opType.isFinalOperation && (
            <Badge size="xs" variant="light" color="red">
              Final operation
            </Badge>
          )}
        </Group>
      </Box>
    </Group>
  </Box>
);
