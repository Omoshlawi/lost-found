import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import {
  ActionIcon,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  useComputedColorScheme,
} from '@mantine/core';
import { TablerIcon } from '../TablerIcon';
import { useWorkspaceStore } from './store';

type WorkspaceWrapperProps = PropsWithChildren<{
  title?: string;
  onClose?: () => void;
  expandable?: boolean;
  id: string;
}>;
const WorkspaceWrapper: React.FC<WorkspaceWrapperProps> = ({
  children,
  onClose,
  title,
  expandable,
  id,
}) => {
  const theme = useComputedColorScheme();
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const updateWorkspaces = useWorkspaceStore((state) => state.updateWorkspaces);

  const expanded = useMemo(() => {
    const workspace = workspaces.find(({ id: uid }) => id === uid);
    return workspace?.expanded;
  }, [id, workspaces]);

  const onToggleExpand = useCallback(() => {
    const idx = workspaces.findIndex(({ id: uid }) => id === uid);
    const workspaces_ = [...workspaces];
    if (idx !== -1) {
      workspaces_[idx] = { ...workspaces_[idx], expanded: !workspaces_[idx].expanded };
      updateWorkspaces(workspaces_);
    }
  }, [workspaces, id]);

  return (
    <Stack w={'100%'} h={'100%'} gap={0}>
      <Group gap={0}>
        <Flex
          flex={1}
          align={'center'}
          h={'100%'}
          bg={theme === 'dark' ? 'gray.8' : theme === 'light' ? 'gray.1' : 'red'}
        >
          <Text fw={'bold'} pl={'md'}>
            {title}
          </Text>
        </Flex>
        <Group gap={0}>
          {expandable && (
            <>
              <ActionIcon
                variant="subtle"
                aria-label="toggle-expand-icon"
                onClick={onToggleExpand}
                radius={0}
                size={60}
              >
                <TablerIcon name={expanded ? 'minimize' : 'maximize'} stroke={1.5} />
              </ActionIcon>
              <Divider orientation="vertical" />
            </>
          )}
          <ActionIcon
            variant="subtle"
            aria-label="close-cone"
            onClick={onClose}
            radius={0}
            size={60}
          >
            <TablerIcon name="arrowRight" stroke={1.5} />
          </ActionIcon>
          <Divider orientation="vertical" />
        </Group>
      </Group>
      <Divider size={'xs'} />

      <Flex flex={1} direction={'column'}>
        {children}
      </Flex>
    </Stack>
  );
};

export default WorkspaceWrapper;
