import React from 'react';
import { Grid, Group, Text, ThemeIcon, Title } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';

interface LocationProps {
  county?: { name?: string };
  subCounty?: { name?: string };
  ward?: { name?: string };
  landMark?: string;
}

const LocationInformation: React.FC<LocationProps> = ({ 
  county, 
  subCounty, 
  ward, 
  landMark 
}) => {
  return (
    <div>
      <Group mb="md" justify="space-between">
        <Title order={4}>Location Information</Title>
        <ThemeIcon size="lg" radius="xl" color="green" variant="light">
          <IconMapPin size={20} />
        </ThemeIcon>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            County
          </Text>
          <Text>{county?.name || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Sub-County
          </Text>
          <Text>{subCounty?.name || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Ward
          </Text>
          <Text>{ward?.name || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={600} c="dimmed" mb={4}>
            Landmark
          </Text>
          <Text>{landMark || 'Not specified'}</Text>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default LocationInformation;