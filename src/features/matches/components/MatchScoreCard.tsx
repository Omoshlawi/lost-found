import { Card, Group, Text, ThemeIcon, Title } from '@mantine/core';
import { TablerIcon } from '@/components';

interface MatchScoreCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export const MatchScoreCard = ({ label, value, icon, color }: MatchScoreCardProps) => {
  const pct = (value * 100).toFixed(0);
  return (
    <Card withBorder padding="md">
      <Group justify="space-between" mb={4}>
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>
          {label}
        </Text>
        <ThemeIcon size={24} color={color} variant="light" radius="xl">
          <TablerIcon name={icon as any} size={14} />
        </ThemeIcon>
      </Group>
      <Title
        order={3}
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 800,
          color: `var(--mantine-color-${color}-6)`,
        }}
      >
        {pct}%
      </Title>
    </Card>
  );
};
