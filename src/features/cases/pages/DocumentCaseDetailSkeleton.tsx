import React from 'react';
import { Box, Grid, Group, Paper, Skeleton, Stack } from '@mantine/core';

const DocumentCaseDetailSkeleton = () => {
  return (
    <Stack gap="xl">
      {/* Header — mirrors DashboardPageHeader structure */}
      <Box pb="md">
        <Group justify="space-between" align="center" mb="sm">
          <Group gap="sm">
            <Skeleton height={42} width={42} />
            <Stack gap={4}>
              <Skeleton height={22} width={200} />
              <Skeleton height={14} width={320} />
            </Stack>
          </Group>
          <Skeleton height={36} width={110} />
        </Group>
        <Skeleton height={1} />
      </Box>

      {/* Tab list */}
      <Group gap={2}>
        {[100, 100, 100, 140, 110].map((w, i) => (
          <Skeleton key={i} height={36} width={w} />
        ))}
      </Group>

      {/* Tab panel */}
      <Paper withBorder p="lg">
        <Stack gap="lg">
          <Skeleton height={14} width="25%" />
          <Grid>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton height={10} width="40%" mb={6} />
                <Skeleton height={16} width="65%" />
              </Grid.Col>
            ))}
          </Grid>
          <Skeleton height={14} width="20%" />
          <Grid>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton height={10} width="40%" mb={6} />
                <Skeleton height={16} width="65%" />
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default DocumentCaseDetailSkeleton;
