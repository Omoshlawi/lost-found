import React from 'react';
import { Skeleton, Stack } from '@mantine/core';

const InputSkeleton = () => {
  return (
    <Stack gap={1}>
      <Skeleton height={15} mt={6} width="50%" radius="xl" />
      <Skeleton height={40} mt={6} />
    </Stack>
  );
};

export default InputSkeleton;
