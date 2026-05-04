import { FC } from 'react';
import {
  Badge,
  Box,
  Group,
  Loader,
  Radio,
  Skeleton,
  Stack,
  Text,
  UnstyledButton,
  useComputedColorScheme,
} from '@mantine/core';
import { useAllowedOperations } from '@/features/custody/hooks/useCustody';
import { Station } from '@/features/custody/types';

type SelectableStationTileProps = {
  station: Station;
  value?: string;
  onChange?: (value: string) => void;
};
const SelectableStationTile: FC<SelectableStationTileProps> = ({ station, value, onChange }) => {
  const isSelected = station.id === value;
  const colorScheme = useComputedColorScheme();
  const { allowedOperations, isLoading: opTypesLoading } = useAllowedOperations(station.id);
  const defaultBorder =
    colorScheme === 'dark' ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)';

  return (
    <UnstyledButton key={station.id} onClick={() => onChange?.(station.id)}>
      <Box
        style={{
          border: `1px solid ${isSelected ? 'var(--mantine-color-civicBlue-6)' : defaultBorder}`,
          borderLeft: `3px solid ${isSelected ? 'var(--mantine-color-civicBlue-6)' : 'transparent'}`,
          padding: 'var(--mantine-spacing-sm) var(--mantine-spacing-md)',
          backgroundColor: 'var(--mantine-color-body)',
          transition: 'border-color 150ms ease',
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs" align="center">
              <Text size="xs" ff="monospace" fw={600} c="dimmed">
                {station.code}
              </Text>
              <Text size="sm" fw={600} truncate>
                {station.name}
              </Text>
            </Group>
            <Text size="xs" c="dimmed">
              {[station.level2, station.level1].filter(Boolean).join(' · ')}
            </Text>
            {opTypesLoading ? (
              <>
                <Group gap={4} mt={2}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height={24} width={80} radius="xl" />
                  ))}
                </Group>
              </>
            ) : (
              <>
                {allowedOperations.length > 0 && (
                  <Group gap={4} mt={2}>
                    {allowedOperations.map((op) => (
                      <Badge key={op.id} size="xs" variant="light" color="civicBlue">
                        {op.name}
                      </Badge>
                    ))}
                  </Group>
                )}
              </>
            )}
          </Stack>
          <Radio value={station.id} aria-label={station.name} />
        </Group>
      </Box>
    </UnstyledButton>
  );
};

export default SelectableStationTile;
