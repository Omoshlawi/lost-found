import { FC } from 'react';
import { Divider, Text } from '@mantine/core';

export const SectionTitle: FC<{ label: string }> = ({ label }) => (
  <Divider
    labelPosition="left"
    label={
      <Text size="sm" fw={600}>
        {label}
      </Text>
    }
  />
);
