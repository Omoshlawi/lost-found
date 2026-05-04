import React from 'react';
import {
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
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { SelectableStationTile } from '../components';
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
                return (
                  <SelectableStationTile
                    key={station.id}
                    station={station}
                    value={selectedId}
                    onChange={setSelectedId}
                  />
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
