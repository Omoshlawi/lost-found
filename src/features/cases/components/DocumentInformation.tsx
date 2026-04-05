import React from 'react';
import { Grid, Group, Stack, Text } from '@mantine/core';
import { SectionTitle } from '@/components';

import { CaseType, Document } from '../types';
import { formatDate } from '../utils/reportUtils';

interface DocumentProps {
  document: Document;
  reportType: CaseType;
  status: string;
}

const DocumentInformation: React.FC<DocumentProps> = ({ document }) => {

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <SectionTitle label="Document Information" />
      </Group>

      {/* Identity */}
      <SectionTitle label="Identity" />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Owner
          </Text>
          <Text>{document?.ownerName || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Document Type
          </Text>
          <Text>{document?.type?.name || 'Unknown'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Gender
          </Text>
          <Text>{document?.gender || 'Unknown'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Nationality
          </Text>
          <Text>{document?.nationality || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Place of Birth
          </Text>
          <Text>{document?.placeOfBirth || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Date of Birth
          </Text>
          <Text>{formatDate(document?.dateOfBirth)}</Text>
        </Grid.Col>
      </Grid>

      {/* Document Numbers */}
      <SectionTitle label="Document Numbers" />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Serial Number
          </Text>
          <Text>{document?.serialNumber || 'Not available'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Document Number
          </Text>
          <Text>{document?.documentNumber || 'Not available'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Batch Number
          </Text>
          <Text>{document?.batchNumber || 'Not available'}</Text>
        </Grid.Col>
      </Grid>

      {/* Issuance */}
      <SectionTitle label="Issuance" />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Issuer
          </Text>
          <Text>{document?.issuer || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Place of Issue
          </Text>
          <Text>{document?.placeOfIssue || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Issuance Date
          </Text>
          <Text>{formatDate(document?.issuanceDate)}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Expiry Date
          </Text>
          <Text>{formatDate(document?.expiryDate)}</Text>
        </Grid.Col>
      </Grid>

      {/* Additional Fields */}
      {((document?.additionalFields?.length ?? 0) > 0 || document?.note) && (
        <>
          <SectionTitle label="Additional" />
          <Grid>
            {document?.additionalFields?.map((field, i) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={i}>
                <Text size="sm" fw={600} c="dimmed" mb={4}>
                  {field.fieldName}
                </Text>
                <Text>{field.fieldValue}</Text>
              </Grid.Col>
            ))}
            {document?.note && (
              <Grid.Col span={12}>
                <Text size="sm" fw={600} c="dimmed" mb={4}>
                  Additional Notes
                </Text>
                <Text>{document.note}</Text>
              </Grid.Col>
            )}
          </Grid>
        </>
      )}
    </Stack>
  );
};

export default DocumentInformation;
