import React, { useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { DataTable, StatusBadge, TablerIcon } from '@/components';
import {
  DocumentExchange,
  ExchangeDirection,
  ExchangeMethod,
  useDocumentExchanges,
} from '@/features/exchange';
import { formatDateTime } from '@/lib/utils/helpers';

const METHOD_LABEL: Record<ExchangeMethod, string> = {
  [ExchangeMethod.STATION_DROPOFF]: 'Station Drop-off',
  [ExchangeMethod.AGENT_PICKUP]: 'Agent Pickup',
  [ExchangeMethod.OWNER_PICKUP]: 'Owner Pickup',
  [ExchangeMethod.INHOUSE_DELIVERY]: 'In-house Delivery',
  [ExchangeMethod.COURIER_DELIVERY]: 'Courier Delivery',
};

const STATION_METHODS: ExchangeMethod[] = [
  ExchangeMethod.STATION_DROPOFF,
  ExchangeMethod.OWNER_PICKUP,
];

function locationLabel(exchange: DocumentExchange): string {
  if (STATION_METHODS.includes(exchange.method)) {
    if (exchange.station) {
      return `${exchange.station.name} (${exchange.station.code})`;
    }
    return exchange.stationId ? '—' : '—';
  }
  if (exchange.address) {
    return [exchange.address.level3, exchange.address.address1].filter(Boolean).join(', ');
  }
  return exchange.addressId ? '—' : '—';
}

interface AuditFieldProps {
  label: string;
  value: string | undefined | null;
}

const AuditField: React.FC<AuditFieldProps> = ({ label, value }) => (
  <Stack gap={2}>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
    <Text size="sm">{value ?? '—'}</Text>
  </Stack>
);

const ExpandedExchangeRow: React.FC<{ row: Row<DocumentExchange> }> = ({ row }) => {
  const e = row.original;
  return (
    <Box pl="xl" py="sm">
      <Stack gap="xs">
        <SimpleGrid cols={3} spacing="lg">
          <AuditField label="Created By" value={e.createdBy?.name} />
          <AuditField label="Created At" value={formatDateTime(e.createdAt)} />
          <div />
          {e.completedBy && (
            <>
              <AuditField label="Completed By" value={e.completedBy.name} />
              <AuditField
                label="Completed At"
                value={e.completedAt ? formatDateTime(e.completedAt) : undefined}
              />
              <div />
            </>
          )}
          {e.cancelledBy && (
            <>
              <AuditField label="Cancelled By" value={e.cancelledBy.name} />
              <div />
              <div />
            </>
          )}
        </SimpleGrid>
        {e.cancelReason && (
          <>
            <Divider />
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Cancel Reason:
              </Text>
              <Text size="sm">{e.cancelReason}</Text>
            </Group>
          </>
        )}
      </Stack>
    </Box>
  );
};

interface ExchangesPanelProps {
  foundCaseId: string;
}

const ExchangesPanel: React.FC<ExchangesPanelProps> = ({ foundCaseId }) => {
  const { exchanges, isLoading } = useDocumentExchanges(foundCaseId);

  const columns = useMemo<ColumnDef<DocumentExchange>[]>(
    () => [
      {
        id: 'expand',
        size: 36,
        cell: ({ row }) => (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => row.toggleExpanded()}
            aria-label="Expand row"
          >
            <TablerIcon name={row.getIsExpanded() ? 'chevronUp' : 'chevronDown'} size={14} />
          </ActionIcon>
        ),
      },
      {
        header: 'Exchange No.',
        accessorKey: 'exchangeNumber',
        cell: ({ row: { original } }) => (
          <Text size="sm" fw={500} ff="monospace">
            {original.exchangeNumber}
          </Text>
        ),
      },
      {
        header: 'Direction',
        id: 'direction',
        cell: ({ row: { original } }) => (
          <Badge
            size="xs"
            variant="light"
            color={original.direction === ExchangeDirection.INBOUND ? 'civicBlue' : 'teal'}
          >
            {original.direction === ExchangeDirection.INBOUND ? 'Inbound' : 'Outbound'}
          </Badge>
        ),
      },
      {
        header: 'Method',
        id: 'method',
        cell: ({ row: { original } }) => METHOD_LABEL[original.method] ?? original.method,
      },
      {
        header: 'Location',
        id: 'location',
        cell: ({ row: { original } }) => locationLabel(original),
      },
      {
        header: 'Status',
        id: 'status',
        cell: ({ row: { original } }) => <StatusBadge status={original.status} />,
      },
      {
        header: 'Scheduled',
        id: 'scheduledAt',
        cell: ({ row: { original } }) => formatDateTime(original.scheduledAt),
      },
      {
        header: 'Completed',
        id: 'completedAt',
        cell: ({ row: { original } }) =>
          original.completedAt ? formatDateTime(original.completedAt) : '—',
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <Stack gap="sm">
        <Skeleton height={40} radius="sm" />
        <Skeleton height={40} radius="sm" />
        <Skeleton height={40} radius="sm" />
      </Stack>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={exchanges}
      withColumnViewOptions={false}
      renderExpandedRow={(row) => <ExpandedExchangeRow row={row} />}
    />
  );
};

export default ExchangesPanel;
