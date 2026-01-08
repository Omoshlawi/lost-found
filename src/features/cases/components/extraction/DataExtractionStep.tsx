import React, { FC } from 'react';
import { Box, Group, Paper, Stack, Text } from '@mantine/core';
import { Document } from '../../types';

type DataExtractionStepProps = {
  document: Document;
};

const DataExtractionStep: FC<DataExtractionStepProps> = ({ document: parsedData }) => {
  return (
    <Paper p="md" mt="sm" withBorder>
      <Text size="sm" fw={500} mb="xs">
        Extracted Data:
      </Text>
      <Stack gap="xs">
        {parsedData.ownerName && (
          <Group gap="xs">
            <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
              Owner Name:
            </Text>
            <Text size="sm" fw={500}>
              {parsedData.ownerName}
            </Text>
          </Group>
        )}
        {parsedData.documentNumber && (
          <Group gap="xs">
            <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
              Document Number:
            </Text>
            <Text size="sm" fw={500}>
              {parsedData.documentNumber}
            </Text>
          </Group>
        )}
        {parsedData.dateOfBirth && (
          <Group gap="xs">
            <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
              Date of Birth:
            </Text>
            <Text size="sm" fw={500}>
              {parsedData.dateOfBirth}
            </Text>
          </Group>
        )}
        {parsedData.issuer && (
          <Group gap="xs">
            <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
              Issuer:
            </Text>
            <Text size="sm" fw={500}>
              {parsedData.issuer}
            </Text>
          </Group>
        )}
        {parsedData.additionalFields && parsedData.additionalFields.length > 0 && (
          <Box mt="xs">
            <Text size="sm" c="dimmed" mb="xs">
              Additional Fields:
            </Text>
            <Stack gap={4}>
              {parsedData.additionalFields.map((field: any, idx: number) => (
                <Group key={idx} gap="xs">
                  <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
                    {field.fieldName}:
                  </Text>
                  <Text size="sm" fw={500}>
                    {field.fieldValue}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default DataExtractionStep;
