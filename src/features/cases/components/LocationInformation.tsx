import React from 'react';
import { ActionIcon, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { launchWorkspace, TablerIcon } from '@/components';
import UpdateCaseAddressForm from '../forms/UpdateCaseAddressForm';
import { DocumentCase } from '../types';

interface LocationProps {
  documentCase: DocumentCase;
}

const LocationInformation: React.FC<LocationProps> = ({ documentCase }) => {
  const handleUpdateAddress = () => {
    const closeWorkspace = launchWorkspace(
      <UpdateCaseAddressForm documentCase={documentCase} closeWorkspace={() => closeWorkspace()} />,
      { title: 'Update Address' }
    );
  };
  const address = documentCase.address;

  return (
    <div>
      <Group mb="md" justify="space-between">
        <Stack>
          <Title order={4}>Location Information</Title>
          <Text size="sm" c="dimmed" mb={4}>
            Location details where the document was lost or found
          </Text>
        </Stack>
        <ActionIcon onClick={handleUpdateAddress}>
          <TablerIcon name="edit" size={20} />
        </ActionIcon>
      </Group>

      <Grid>
        {address?.country && (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>
              Country
            </Text>
            <Text>{address?.country}</Text>
          </Grid.Col>
        )}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {address?.locale?.formatSpec?.levels?.find((level) => level.level === 'level1')
              ?.label ?? 'Administrative Level 1'}
          </Text>
          <Text>{address?.level1 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {address?.locale?.formatSpec?.levels?.find((level) => level.level === 'level2')
              ?.label ?? 'Administrative Level 2'}
          </Text>
          <Text>{address?.level2 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {address?.locale?.formatSpec?.levels?.find((level) => level.level === 'level3')
              ?.label ?? 'Administrative Level 3'}
          </Text>
          <Text>{address?.level3 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {address?.locale?.formatSpec?.levels?.find((level) => level.level === 'level4')
              ?.label ?? 'Administrative Level 4'}
          </Text>
          <Text>{address?.level4 || 'N/A'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            {address?.locale?.formatSpec?.levels?.find((level) => level.level === 'level5')
              ?.label ?? 'Administrative Level 5'}
          </Text>
          <Text>{address?.level5 || 'N/A'}</Text>
        </Grid.Col>
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
    </div>
  );
};

export default LocationInformation;
