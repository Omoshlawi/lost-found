import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, Group, Select, Stack, Text, TextInput, Anchor, HoverCard } from '@mantine/core';
import {
  DashboardPageHeader,
  StateFullDataTable,
  TablerIcon,
  StatusBadge,
} from '@/components';
import { useTableUrlFilters } from '@/hooks/useTableUrlFilters';
import { formatDateTime } from '@/lib/utils';
import { useTransitionReasonEntityTypes } from '@/features/admin/hooks/useTransitionReasons';
import { useStatusTransitions } from '../hooks';
import { StatusTransition } from '../types';

const StatusTransitionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, search, searchInput, setSearchInput, setPage, setPageSize } =
    useTableUrlFilters();

  const entityType = searchParams.get('entityType') || null;
  const fromStatus = searchParams.get('fromStatus') || null;
  const toStatus = searchParams.get('toStatus') || null;

  const transitionsAsync = useStatusTransitions({
    page,
    limit: pageSize,
    search,
    entityType,
    fromStatus,
    toStatus,
  });

  const { entityTypes } = useTransitionReasonEntityTypes();

  const setFilter = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const columns = useMemo<ColumnDef<StatusTransition>[]>(
    () => [
      {
        header: 'Entity',
        id: 'entity',
        cell: ({ row: { original } }) => {
          let link = '';
          const type = original.entityType.toLowerCase();
          
          if (type.includes('case')) {
            link = `/dashboard/cases/${original.entityId}`;
          }
          if (type === 'claim') {
            link = `/dashboard/claims/${original.entityId}`;
          }
          if (type === 'match') {
            link = `/dashboard/matches/${original.entityId}`;
          }

          return (
            <Stack gap={0}>
              <Badge size="xs" variant="light" color="gray">
                {original.entityType.split(/(?=[A-Z])/).join(' ')}
              </Badge>
              {link ? (
                <Anchor component={Link} to={link} size="sm" ff="monospace">
                  {original.entityId.substring(0, 8)}...
                </Anchor>
              ) : (
                <Text size="sm" ff="monospace">
                  {original.entityId.substring(0, 8)}...
                </Text>
              )}
            </Stack>
          );
        },
      },
      {
        header: 'Transition',
        id: 'transition',
        cell: ({ row: { original } }) => (
          <Group gap={4}>
             <StatusBadge status={original.fromStatus} />
            <TablerIcon name="arrowRight" size={10} />
            <StatusBadge status={original.toStatus} />
          </Group>
        ),
      },
      {
        header: 'Changed By',
        accessorKey: 'changedBy.name',
        cell: ({ row: { original } }) => (
          <Stack gap={0}>
             <Text size="sm" fw={500}>{original.changedBy?.name || 'System'}</Text>
             <Text size="xs" c="dimmed">{original.changedBy?.email}</Text>
          </Stack>
        ),
      },
      {
        header: 'Reason / Comment',
        id: 'reason',
        cell: ({ row: { original } }) => (
          <Stack gap={2}>
            {original.reason && (
               <Text size="sm" fw={600}>
                 {original.reason.label}
               </Text>
            )}
            {original.comment && (
               <HoverCard width={280} shadow="md">
                 <HoverCard.Target>
                    <Text size="xs" lineClamp={1} style={{ cursor: 'help' }}>
                      {original.comment}
                    </Text>
                 </HoverCard.Target>
                 <HoverCard.Dropdown>
                   <Text size="xs">{original.comment}</Text>
                 </HoverCard.Dropdown>
               </HoverCard>
            )}
            {!original.reason && !original.comment && <Text size="xs" c="dimmed">—</Text>}
          </Stack>
        ),
      },
      {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: ({ row: { original } }) => (
          <Text size="xs" c="dimmed">
            {formatDateTime(original.createdAt)}
          </Text>
        ),
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Status Transitions"
        subTitle="Audit log of all status changes for cases and claims"
        icon="history"
      />
      <StateFullDataTable
        {...transitionsAsync}
        data={transitionsAsync.statusTransitions}
        columns={columns}
        renderActions={() => (
          <Group gap="xs">
            <TextInput
              placeholder="Search by ID or note..."
              leftSection={<TablerIcon name="search" size={14} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="xs"
              w={200}
            />
            <Select
              placeholder="Entity Type"
              data={[
                { label: 'All Entities', value: '' },
                ...entityTypes.map(type => ({
                    label: type.split(/(?=[A-Z])/).join(' '),
                    value: type
                }))
              ]}
              value={entityType}
              onChange={(v) => setFilter('entityType', v)}
              size="xs"
              w={140}
              clearable
            />
            <TextInput
              placeholder="From Status"
              value={fromStatus || ''}
              onChange={(e) => setFilter('fromStatus', e.target.value)}
              size="xs"
              w={120}
            />
            <TextInput
              placeholder="To Status"
              value={toStatus || ''}
              onChange={(e) => setFilter('toStatus', e.target.value)}
              size="xs"
              w={120}
            />
          </Group>
        )}
        pagination={{
          totalCount: transitionsAsync.totalCount,
          currentPage: page,
          pageSize,
          onChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </Stack>
  );
};

export default StatusTransitionsPage;
