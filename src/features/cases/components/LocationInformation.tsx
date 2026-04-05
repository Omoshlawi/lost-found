import React from 'react';
import { Grid, Group, Stack, Text } from '@mantine/core';
import { SectionTitle } from '@/components';
import { CaseType, DocumentCase } from '../types';

interface LocationProps {
  documentCase: DocumentCase;
  reportType: CaseType;
  status: string;
}

const LocationInformation: React.FC<LocationProps> = ({ documentCase }) => {
  const address = documentCase.address;

  const getLevel = (level: string) =>
    address?.locale?.formatSpec?.levels?.find((l) => l.level === level)?.label ??
    `Administrative Level ${level.replace('level', '')}`;

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <SectionTitle label="Location Information" />
      </Group>

      {/* Administrative Levels */}
      <SectionTitle label="Administrative Area" />
      <Grid>
        {address?.country && (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Country
            </Text>
            <Text>{address.country}</Text>
          </Grid.Col>
        )}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {getLevel('level1')}
          </Text>
          <Text>{address?.level1 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {getLevel('level2')}
          </Text>
          <Text>{address?.level2 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {getLevel('level3')}
          </Text>
          <Text>{address?.level3 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {getLevel('level4')}
          </Text>
          <Text>{address?.level4 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {getLevel('level5')}
          </Text>
          <Text>{address?.level5 || 'N/A'}</Text>
        </Grid.Col>
      </Grid>

      {/* Street Address */}
      <SectionTitle label="Street Address" />
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Address 1
          </Text>
          <Text>{address?.address1 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Address 2
          </Text>
          <Text>{address?.address2 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Landmark
          </Text>
          <Text>{address?.landmark || 'N/A'}</Text>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default LocationInformation;
