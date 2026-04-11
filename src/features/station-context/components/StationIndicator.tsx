import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Group, Loader, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { TablerIcon } from '@/components';
import { useMyStations } from '@/hooks/useMyStations';
import { useActiveStation } from '@/hooks/useActiveStation';

/**
 * Displayed in the app header next to the logo.
 *
 * Desktop (sm+): [icon] Station Name [›]
 * Mobile:        store icon with a small status dot (teal = active, amber = needs selection).
 *                Tooltip shows the station name or "Select a station" on hover/press.
 *
 * Hidden for users who have no station grants AND have no active station.
 */
const StationIndicator: React.FC = () => {
  const navigate = useNavigate();
  const { stations, isLoading: grantsLoading } = useMyStations();
  const { activeStation, isLoading: stationLoading } = useActiveStation();

  const isLoading = grantsLoading || stationLoading;

  if (!isLoading && stations.length === 0 && activeStation === null) {
    return null;
  }

  const iconColor = activeStation
    ? 'var(--mantine-color-civicBlue-6)'
    : 'var(--mantine-color-yellow-6)';

  const dotColor = activeStation
    ? 'var(--mantine-color-teal-5)'
    : 'var(--mantine-color-yellow-5)';

  const tooltipLabel = activeStation ? activeStation.name : 'Select a station';

  return (
    <>
      {/* ── Desktop: full chip with name ── */}
      <UnstyledButton
        visibleFrom="sm"
        onClick={() => navigate('/select-station')}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Group gap={6} align="center">
          {isLoading ? (
            <Loader size={12} />
          ) : (
            <>
              <TablerIcon name="buildingStore" size={14} style={{ color: iconColor }} />
              <Text
                size="xs"
                fw={600}
                c={activeStation ? 'civicBlue.7' : 'yellow.7'}
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {activeStation ? activeStation.name : 'Select Station'}
              </Text>
              <TablerIcon
                name="chevronRight"
                size={12}
                style={{ color: 'var(--mantine-color-dimmed)' }}
              />
            </>
          )}
        </Group>
      </UnstyledButton>

      {/* ── Mobile: icon-only with status dot ── */}
      <Tooltip label={tooltipLabel} position="bottom" withArrow hiddenFrom="sm">
        <UnstyledButton
          hiddenFrom="sm"
          onClick={() => navigate('/select-station')}
          style={{ display: 'flex', alignItems: 'center', padding: 4 }}
          aria-label={tooltipLabel}
        >
          {isLoading ? (
            <Loader size={12} />
          ) : (
            <Box style={{ position: 'relative', lineHeight: 0 }}>
              <TablerIcon name="buildingStore" size={18} style={{ color: iconColor }} />
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -1,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: dotColor,
                  border: '1.5px solid var(--mantine-color-body)',
                }}
              />
            </Box>
          )}
        </UnstyledButton>
      </Tooltip>
    </>
  );
};

export default StationIndicator;
