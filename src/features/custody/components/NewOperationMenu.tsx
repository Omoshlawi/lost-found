import React from 'react';
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
import { useNewOperationMenu } from '../hooks/useNewOperationMenu';
import { DocumentOperationType } from '../types';
import { getOperationIcon } from './operationIcons';

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
