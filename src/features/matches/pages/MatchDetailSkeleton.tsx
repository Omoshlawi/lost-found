import { Box, Grid, Group, Paper, Skeleton, SimpleGrid, Stack } from '@mantine/core';

const MatchDetailSkeleton = () => {
  return (
    <Stack gap="xl">
      {/* Header */}
      <Box pb="md">
        <Group justify="space-between" align="center" mb="sm">
          <Group gap="sm">
            <Skeleton height={42} width={42} />
            <Stack gap={4}>
              <Skeleton height={22} width={200} />
              <Skeleton height={14} width={320} />
            </Stack>
          </Group>
        </Group>
        <Skeleton height={1} />
      </Box>

      {/* Score cards */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        {Array.from({ length: 4 }).map((_, i) => (
          <Paper key={i} withBorder p="md">
            <Skeleton height={12} width="50%" mb={8} />
            <Skeleton height={28} width="40%" />
          </Paper>
        ))}
      </SimpleGrid>

      {/* Tabs */}
      <Group gap={2}>
        {[140, 120, 140].map((w, i) => (
          <Skeleton key={i} height={36} width={w} />
        ))}
      </Group>

      {/* Table */}
      <Paper withBorder p="lg">
        <Stack gap="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i}>
              <Grid.Col span={3}>
                <Skeleton height={14} width="70%" />
              </Grid.Col>
              <Grid.Col span={4}>
                <Skeleton height={14} width="60%" />
              </Grid.Col>
              <Grid.Col span={4}>
                <Skeleton height={14} width="60%" />
              </Grid.Col>
            </Grid>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default MatchDetailSkeleton;
