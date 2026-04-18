import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { useActiveStation } from '@/hooks/useActiveStation';
import { formatDate } from '@/lib/utils/helpers';
import {
  ActionIcon,
  Badge,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DocumentOperationStatusBadge,
  ExpandedOperationItems,
  NewOperationMenu,
  OperationActionsMenu,
} from '../components';
import NewOperationForm from '../forms/NewOperationForm';
import {
  useDocumentOperations,
  useDocumentOperationTypes,
} from '../hooks/useCustody';
import { usePickupStations } from '../hooks/usePickupStations';
import { DocumentOperation, DocumentOperationStatus, DocumentOperationType } from '../types';

const STATUS_OPTIONS = [
  { label: 'Draft', value: DocumentOperationStatus.DRAFT },
  { label: 'Pending Approval', value: DocumentOperationStatus.SUBMITTED },
  { label: 'Approved', value: DocumentOperationStatus.APPROVED },
  { label: 'In Progress', value: DocumentOperationStatus.IN_PROGRESS },
  { label: 'Completed', value: DocumentOperationStatus.COMPLETED },
  { label: 'Cancelled', value: DocumentOperationStatus.CANCELLED },
];

const CustodyListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const stationId = searchParams.get('stationId') ?? undefined;
  const operationTypeId = searchParams.get('operationTypeId') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '20');

  const setParam = (key: string, value: string | null) => {
    setSearchParams(
      (prev) => {
        value ? prev.set(key, value) : prev.delete(key);
        prev.set('page', '1');
        return prev;
      },
      { replace: true },
    );
  };

  const { stations } = usePickupStations();
  const { operationTypes } = useDocumentOperationTypes({ limit: 50 });
  const { stationId: activeStationId } = useActiveStation();

  const stationOptions = stations.map((s) => ({ label: `${s.name} (${s.code})`, value: s.id }));
  const opTypeOptions = operationTypes.map((t) => ({ label: t.name, value: t.id }));

  const operationsAsync = useDocumentOperations({
    page,
    limit: pageSize,
    ...(search && { search }),
    ...(status && { status }),
    ...(stationId && { stationId }),
    ...(operationTypeId && { operationTypeId }),
  });

  const openOperationForm = (opType: DocumentOperationType) => {
    const close = launchWorkspace(
      <NewOperationForm
        preselectedType={opType}
        defaultStationId={activeStationId}
        onClose={() => close()}
        onSuccess={() => operationsAsync.mutate()}
      />,
      { title: opType.name },
    );
  };

  const columns = useMemo<ColumnDef<DocumentOperation>[]>(
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
            <TablerIcon
              name={row.getIsExpanded() ? 'chevronUp' : 'chevronDown'}
              size={14}
            />
          </ActionIcon>
        ),
      },
      {
        header: 'Operation No.',
        accessorKey: 'operationNumber',
        cell: ({ row: { original } }) => (
          <Text size="sm" fw={500}>
            {original.operationNumber}
          </Text>
        ),
      },
      {
        header: 'Type',
        cell: ({ row: { original } }) => original.operationType?.name ?? '—',
      },
      {
        header: 'Status',
        id: 'status',
        cell: ({ row: { original } }) => (
          <DocumentOperationStatusBadge status={original.status} />
        ),
      },
      {
        header: 'Station',
        id: 'station',
        cell: ({ row: { original } }) =>
          original.station?.name ?? original.toStation?.name ?? '—',
      },
      {
        header: 'Documents',
        id: 'itemCount',
        cell: ({ row: { original } }) => (
          <Badge variant="light" size="sm" color="civicBlue">
            {original.items?.length ?? 0}
          </Badge>
        ),
      },
      {
        header: 'Created By',
        id: 'createdBy',
        cell: ({ row: { original } }) => original.createdBy?.name ?? '—',
      },
      {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: ({ row: { original } }) => formatDate(original.createdAt),
      },
    ],
    [],
  );

  const actionsColumn: ColumnDef<DocumentOperation> = {
    id: 'actions',
    size: 40,
    cell: ({ row: { original } }) => (
      <OperationActionsMenu operation={original} onMutate={() => operationsAsync.mutate()} />
    ),
  };

  return (
    <Stack gap="md">
      <DashboardPageHeader
        title="Document Custody"
        subTitle="Manage custody operations for found documents"
        icon="buildingWarehouse"
      />
      <StateFullDataTable
        {...operationsAsync}
        data={operationsAsync.operations}
        columns={[...columns, actionsColumn]}
        renderExpandedRow={(row) => (
          <ExpandedOperationItems row={row} onMutate={() => operationsAsync.mutate()} />
        )}
        renderActions={() => (
          <>
            <TextInput
              placeholder="Search operations..."
              leftSection={<TablerIcon name="search" size={14} />}
              value={search ?? ''}
              onChange={(e) => setParam('search', e.target.value || null)}
              size="xs"
              w={200}
            />
            <Select
              placeholder="Status"
              data={STATUS_OPTIONS}
              value={status ?? null}
              onChange={(v) => setParam('status', v)}
              size="xs"
              clearable
              w={160}
            />
            <Select
              placeholder="Operation Type"
              data={opTypeOptions}
              value={operationTypeId ?? null}
              onChange={(v) => setParam('operationTypeId', v)}
              size="xs"
              clearable
              w={160}
              searchable
            />
            <Select
              placeholder="Station"
              data={stationOptions}
              value={stationId ?? null}
              onChange={(v) => setParam('stationId', v)}
              size="xs"
              clearable
              w={180}
              searchable
            />
            <NewOperationMenu onSelect={openOperationForm} />
          </>
        )}
        pagination={{
          totalCount: operationsAsync.totalCount,
          currentPage: page,
          pageSize,
          onChange: (p) =>
            setSearchParams(
              (prev) => {
                prev.set('page', String(p));
                return prev;
              },
              { replace: true },
            ),
          onPageSizeChange: (ps) =>
            setSearchParams(
              (prev) => {
                prev.set('pageSize', String(ps));
                prev.set('page', '1');
                return prev;
              },
              { replace: true },
            ),
        }}
      />
    </Stack>
  );
};

export default CustodyListPage;
