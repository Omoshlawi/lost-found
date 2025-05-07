import React from 'react';
import { Card, Divider, Group, Skeleton, Stack } from '@mantine/core';

const DocumentReportDetailSkeleton = () => {
  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <Stack>
        <Stack gap={0}>
          <Group align="center">
            <Skeleton height={90} radius={'xs'} mb="xl" width={90} />
            <Stack justify="center" flex={1}>
              <Skeleton height={30} radius="sm" width="20%" />
              <Skeleton height={8} mt={6} radius="sm" width="20%" />
            </Stack>
          </Group>
          <Group justify="space-between">
            <Group flex={1}>
              <Skeleton height={30} mt={6} width="80px" radius="xl" />
              <Skeleton height={30} mt={6} width="80px" radius="xl" />
            </Group>
            <Skeleton height={40} mt={6} width="150px" radius="sm" />
          </Group>
        </Stack>
        <Divider my="md" />
        <Skeleton w={'100%'} h={'240'} />
        <Skeleton w={'100%'} h={'240'} />
        <Skeleton w={'100%'} h={'240'} />
        <Skeleton w={'100%'} h={'240'} />
      </Stack>
    </Card>
  );
};

export default DocumentReportDetailSkeleton;
