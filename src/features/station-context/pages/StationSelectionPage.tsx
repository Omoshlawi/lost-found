import React from 'react';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Loader,
  Radio,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  useComputedColorScheme,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { useStationSelection } from '../hooks/useStationSelection';

const StationSelectionPage: React.FC = () => {
  const {
    isLoading,
    isAdmin,
    stations,
    totalCount,
    search,
    setSearch,
    selectedId,
    setSelectedId,
    remember,
    setRemember,
    isSaving,
    handleConfirm,
  } = useStationSelection();

  const colorScheme = useComputedColorScheme();
  const defaultBorder =
    colorScheme === 'dark' ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)';

  return (
    <Stack gap="xl" w="100%" maw={520}>
      {/* Header */}
      <Box>
        <Group justify="space-between" align="flex-start" mb="sm">
          <Stack gap={2}>
            <Title
              order={3}
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 }}
            >
              Select Your Station
            </Title>
            <Text size="sm" c="dimmed">
              {isAdmin
                ? 'Choose a station to check in to for this session.'
                : 'Where are you operating from today?'}
            </Text>
          </Stack>

          {/* {!isRequired && (
            <Button variant="subtle" color="gray" size="xs" onClick={handleSkip}>
              Skip for now
            </Button>
          )} */}
        </Group>
        <Divider />
      </Box>

      {/* Search */}
      <TextInput
        placeholder="Search stations…"
        leftSection={<TablerIcon name="search" size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        autoFocus
      />

      {/* Station list */}
      {isLoading ? (
        <Group justify="center" py="xl">
          <Loader size="sm" />
        </Group>
      ) : stations.length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" py="xl">
          {totalCount === 0
            ? 'No stations are assigned to your account.'
            : 'No stations match your search.'}
        </Text>
      ) : (
        <ScrollArea.Autosize mah={320}>
          <Radio.Group value={selectedId ?? ''} onChange={setSelectedId}>
            <Stack gap="xs">
              {stations.map((station) => {
                const isSelected = station.id === selectedId;
                return (
                  <UnstyledButton key={station.id} onClick={() => setSelectedId(station.id)}>
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
                          {station.operations.length > 0 && (
                            <Group gap={4} mt={2}>
                              {station.operations.map((op) => (
                                <Badge key={op.id} size="xs" variant="light" color="civicBlue">
                                  {op.name}
                                </Badge>
                              ))}
                            </Group>
                          )}
                        </Stack>
                        <Radio value={station.id} aria-label={station.name} />
                      </Group>
                    </Box>
                  </UnstyledButton>
                );
              })}
            </Stack>
          </Radio.Group>
        </ScrollArea.Autosize>
      )}

      {/* Remember + confirm */}
      <Stack gap="md">
        <Checkbox
          label="Remember this station for future logins"
          checked={remember}
          onChange={(e) => setRemember(e.currentTarget.checked)}
        />

        <Button
          fullWidth
          disabled={!selectedId || isLoading}
          loading={isSaving}
          onClick={handleConfirm}
          rightSection={<TablerIcon name="arrowRight" size={16} />}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};

export default StationSelectionPage;
