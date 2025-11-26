import React from 'react';
import { Grid, Group, Paper, Text, ThemeIcon, Title, useMantineTheme } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useComputedColorScheme } from '@mantine/core';
import { getBackgroundColor } from '../utils/reportUtils';

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
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      mb="md"
      style={{ backgroundColor: getBackgroundColor('green', theme, colorScheme) }}
    >
      <Group mb="xs">
        <Title order={4}>Location Information</Title>
        <ThemeIcon size="lg" radius="xl" color="green">
          <IconMapPin size={20} />
        </ThemeIcon>
      </Group>

      <Grid>
        <Grid.Col span={4}>
          <Text fw={700}>County:</Text>
          <Text>{county?.name || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Sub-County:</Text>
          <Text>{subCounty?.name || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fw={700}>Ward:</Text>
          <Text>{ward?.name || 'Not specified'}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text fw={700}>Landmark:</Text>
          <Text>{landMark || 'Not specified'}</Text>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};

export default LocationInformation;