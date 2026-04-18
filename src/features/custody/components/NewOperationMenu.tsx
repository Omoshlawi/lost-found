import React, { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Menu,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { useActiveStation } from '@/hooks/useActiveStation';
import { useMyStations } from '@/hooks/useMyStations';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import { useStationOperationTypes } from '../hooks/useCustody';
import { DocumentOperationType } from '../types';
import { getOperationIcon } from './operationIcons';

// ── Hook ──────────────────────────────────────────────────────────────────────

const useNewOperationMenu = () => {
  const {
    activeStation,
    stationId: activeStationId,
    isLoading: stationLoading,
  } = useActiveStation();
  const { stationOpTypes, isLoading: opTypesLoading } = useStationOperationTypes(
    activeStationId ?? undefined
  );

  // Admins see all enabled station operations; non-admins only their granted ones.
  // Uses the same permission as the station selector page.
  const { hasAccess: isAdmin, isLoading: adminCheckLoading } = useUserHasSystemAccess({
    documentOperationType: ['manage'],
  });
  const { stations: myStations } = useMyStations('', isAdmin);

  const [search, setSearch] = useState('');

  const availableOpTypes = useMemo<DocumentOperationType[]>(() => {
    const enabled = stationOpTypes.filter((s) => s.isEnabled && s.operationType);
    if (isAdmin) {
      return enabled.map((s) => s.operationType!);
    }
    const myStation = myStations.find((s) => s.id === activeStationId);
    const grantedIds = new Set((myStation?.operations ?? []).map((op) => op.id));
    return enabled.filter((s) => grantedIds.has(s.operationType!.id)).map((s) => s.operationType!);
  }, [isAdmin, stationOpTypes, myStations, activeStationId]);

  const filteredOpTypes = useMemo<DocumentOperationType[]>(() => {
    if (!search.trim()) {
      return availableOpTypes;
    }
    const q = search.toLowerCase();
    return availableOpTypes.filter(
      (t) => t.name.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q)
    );
  }, [availableOpTypes, search]);

  return {
    activeStation,
    activeStationId,
    isLoading: stationLoading || opTypesLoading || adminCheckLoading,
    availableOpTypes,
    standardOpTypes: filteredOpTypes.filter((t) => !t.isHighPrivilege),
    privilegedOpTypes: filteredOpTypes.filter((t) => t.isHighPrivilege),
    filteredOpTypes,
    search,
    setSearch,
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

interface NewOperationMenuProps {
  onSelect: (opType: DocumentOperationType) => void;
}

export const NewOperationMenu: React.FC<NewOperationMenuProps> = ({ onSelect }) => {
  const {
    activeStation,
    activeStationId,
    isLoading,
    availableOpTypes,
    standardOpTypes,
    privilegedOpTypes,
    filteredOpTypes,
    search,
    setSearch,
  } = useNewOperationMenu();

  return (
    <Menu position="bottom-end" width={300} shadow="md" onClose={() => setSearch('')}>
      <Menu.Target>
        <Button
          leftSection={<TablerIcon name="plus" size={14} />}
          rightSection={isLoading && <Loader size={10} />}
          size="xs"
        >
          New Operation
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {!activeStationId ? (
          <>
            <Menu.Label>New Operation</Menu.Label>
            <Menu.Item leftSection={<TablerIcon name="alertCircle" size={14} />} disabled>
              <Stack gap={2}>
                <Text size="sm">No active station</Text>
                <Text size="xs" c="dimmed">
                  Set your station in the top bar to continue
                </Text>
              </Stack>
            </Menu.Item>
          </>
        ) : (
          <>
            <Box px="xs" pt="xs" pb={4}>
              <TextInput
                size="xs"
                placeholder="Search operations…"
                leftSection={<TablerIcon name="search" size={12} />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
            <Divider />

            {availableOpTypes.length === 0 && !isLoading ? (
              <Menu.Item disabled>
                <Text size="sm" c="dimmed">
                  No operations available at this station
                </Text>
              </Menu.Item>
            ) : filteredOpTypes.length === 0 ? (
              <Menu.Item disabled>
                <Text size="sm" c="dimmed">
                  No operations match your search
                </Text>
              </Menu.Item>
            ) : (
              <>
                {activeStation && <Menu.Label>{activeStation.name}</Menu.Label>}

                {standardOpTypes.map((opType) => (
                  <Menu.Item
                    key={opType.id}
                    leftSection={<TablerIcon name={getOperationIcon(opType.code)} size={14} />}
                    onClick={() => onSelect(opType)}
                  >
                    <Stack gap={1}>
                      <Text size="sm" fw={500} lh={1.2}>
                        {opType.name}
                      </Text>
                      {opType.description && (
                        <Text size="xs" c="dimmed" lh={1.3}>
                          {opType.description}
                        </Text>
                      )}
                    </Stack>
                  </Menu.Item>
                ))}

                {privilegedOpTypes.length > 0 && (
                  <>
                    {standardOpTypes.length > 0 && <Divider />}
                    <Menu.Label>Requires Approval</Menu.Label>
                    {privilegedOpTypes.map((opType) => (
                      <Menu.Item
                        key={opType.id}
                        leftSection={<TablerIcon name={getOperationIcon(opType.code)} size={14} />}
                        onClick={() => onSelect(opType)}
                      >
                        <Stack gap={1}>
                          <Group gap={6} wrap="nowrap">
                            <Text size="sm" fw={500} lh={1.2}>
                              {opType.name}
                            </Text>
                            <Badge size="xs" variant="light" color="orange">
                              Approval
                            </Badge>
                          </Group>
                          {opType.description && (
                            <Text size="xs" c="dimmed" lh={1.3}>
                              {opType.description}
                            </Text>
                          )}
                        </Stack>
                      </Menu.Item>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
