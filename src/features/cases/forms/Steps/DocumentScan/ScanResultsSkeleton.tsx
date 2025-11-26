import React from 'react';
import { Divider, Group, Skeleton, Stack } from '@mantine/core';

const ScanResultsSkeleton = () => {
  return (
    <Stack p={'xs'}>
      <Group>
        <Skeleton height={20} width={100} />
        <Skeleton height={20} width={100} />
        <Skeleton height={20} width={100} />
      </Group>
      <Divider />
      <Skeleton height={35} w={200} radius={'lg'} />

      <Skeleton height={300} />
      <Group justify="space-between">
        <Skeleton height={35} w={200} radius={'lg'} />
        <Skeleton height={40} w={200} />
      </Group>
      <Skeleton height={200} />
    </Stack>
  );
};

export default ScanResultsSkeleton;
