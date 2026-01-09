import React, { FC } from 'react';
import { Box, Group, Paper, Pill, Stack, Table, Tabs, Text } from '@mantine/core';
import { TablerIcon } from '@/components';
import { ConfidenceScore, Document, ImageAnalysisResult } from '../../types';

type DataExtractionStepProps = {
  document: Document;
};

export const DataExtractionStep: FC<DataExtractionStepProps> = ({ document: parsedData }) => {
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

type DataExtractionConfidenceScoreProps = {
  confidenceScore: ConfidenceScore;
};
export const DataExtractionConfidenceScore: FC<DataExtractionConfidenceScoreProps> = ({
  confidenceScore,
}) => {
  return (
    <Paper p={0} mt="sm">
      <Table variant="vertical" layout="fixed" withTableBorder>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th w={160}>Owner name</Table.Th>
            <Table.Td>{confidenceScore.ownerName}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>Document Number</Table.Th>
            <Table.Td>{confidenceScore.documentNumber}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>Date of birth</Table.Th>
            <Table.Td>{confidenceScore.dateOfBirth}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>Issuer</Table.Th>
            <Table.Td>{confidenceScore.issuer}</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>Expiry date</Table.Th>
            <Table.Td>{confidenceScore.expiryDate}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Paper>
  );
};

type ImageAnalysisProps = {
  analysis: Array<ImageAnalysisResult>;
};

export const ImageAnalysis: FC<ImageAnalysisProps> = ({ analysis }) => {
  return (
    <Paper p="md" mt="sm" withBorder>
      <Tabs defaultValue="image-0" orientation="vertical">
        <Tabs.List>
          {analysis.map((a, i) => (
            <Tabs.Tab value={`image-${a.index}`} key={i}>
              Image {a.index}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {analysis.map((a, i) => (
          <Tabs.Panel value={`image-${a.index}`} key={i}>
            <Paper p="md">
              <Table variant="vertical" layout="fixed" withTableBorder>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th w={160}>Focus</Table.Th>
                    <Table.Td>{a.focus}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th>Image type</Table.Th>
                    <Table.Td>{a.imageType}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th>Lighting</Table.Th>
                    <Table.Td>{a.lighting}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th>Readability</Table.Th>
                    <Table.Td>{a.readability}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th>Has tampering</Table.Th>
                    <Table.Td>
                      <TablerIcon name={a.tamperingDetected ? 'check' : 'x'} />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Usable for extraction</Table.Th>
                    <Table.Td>{a.usableForExtraction}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Warning</Table.Th>
                    <Table.Td>
                      {a.warnings.map((warning, i) => (
                        <Pill key={i}>{warning}</Pill>
                      ))}
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Paper>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Paper>
  );
};
