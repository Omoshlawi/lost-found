import React from 'react';
import { Group, Loader, Text } from '@mantine/core';

const ClaimDetailSkeleton = () => {
  return (
    <Group>
      <Loader />
      <Text>Loading.....</Text>
    </Group>
  );
};

export default ClaimDetailSkeleton;
