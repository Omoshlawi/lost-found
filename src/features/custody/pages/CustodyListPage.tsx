import { DashboardPageHeader, StateFullDataTable, TablerIcon } from '@/components';
import { launchWorkspace } from '@/components/Workspace';
import { handleApiErrors } from '@/lib/api';
import { formatDate } from '@/lib/utils/helpers';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Row } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DocumentOperationStatusBadge,
  CustodyStatusBadge,
} from '../components';
import AddItemsForm from '../forms/AddItemsForm';
import NewOperationForm from '../forms/NewOperationForm';
import {
  approveOperation,
  cancelOperation,
  executeOperation,
  rejectOperation,
  removeOperationItem,
  skipOperationItem,
  submitOperation,
  useDocumentOperations,
} from '../hooks/useCustody';
import { usePickupStations } from '../hooks/usePickupStations';
import {
  DocumentOperation,
  DocumentOperationStatus,
} from '../types';
import { useDocumentOperationTypes } from '../hooks/useCustody';

const STATUS_OPTIONS = [
  { label: 'Draft', value: DocumentOperationStatus.DRAFT },
  { label: 'Pending Approval', value: DocumentOperationStatus.SUBMITTED },
  { label: 'Approved', value: DocumentOperationStatus.APPROVED },
  { label: 'In Progress', value: DocumentOperationStatus.IN_PROGRESS },
  { label: 'Completed', value: DocumentOperationStatus.COMPLETED },
  { label: 'Cancelled', value: DocumentOperationStatus.CANCELLED },
];

interface ExpandedOperationItemsProps {
  row: Row<DocumentOperation>;
  onMutate: () => void;
}

const ExpandedOperationItems: React.FC<ExpandedOperationItemsProps> = ({ row, onMutate }) => {
  const op = row.original;
  const isDraft = op.status === DocumentOperationStatus.DRAFT;
  const isApproved = op.status === DocumentOperationStatus.APPROVED;
  const canRemove = isDraft;
  const canSkip = isDraft || isApproved;

  const handleItemAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    try {
      await actionFn();
      showNotification({ title: 'Done', message: successMsg, color: 'teal' });
      onMutate();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      showNotification({ title: 'Error', message: e.detail ?? 'Action failed.', color: 'red' });
    }
  };

  if (!op.items || op.items.length === 0) {
    return (
      <Text size="sm" c="dimmed" py="sm">
        No documents in this operation.
      </Text>
    );
  }

  return (
    <Box pl="xl">
      <Table withRowBorders={false} fz="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Case No.</Table.Th>
            <Table.Th>Document Type</Table.Th>
            <Table.Th>Custody Change</Table.Th>
            <Table.Th>Item Status</Table.Th>
            {(canRemove || canSkip) && <Table.Th style={{ width: 60 }} />}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {op.items.map((item) => {
            const isPending = item.status === 'PENDING';
            return (
              <Table.Tr key={item.id}>
                <Table.Td>
                  <Text
                    size="sm"
                    fw={500}
                    component="a"
                    href={`/dashboard/custody/${item.foundCaseId}`}
                    style={{ textDecoration: 'none' }}
                  >
                    {item.foundCase?.case?.caseNumber ?? item.foundCaseId.slice(0, 8)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {item.foundCase?.case?.document?.type?.name ?? '—'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  {item.custodyStatusBefore ? (
                    <Group gap={4} wrap="nowrap">
                      <CustodyStatusBadge status={item.custodyStatusBefore} />
                      <TablerIcon name="arrowRight" size={12} />
                      <CustodyStatusBadge status={item.custodyStatusAfter ?? undefined} />
                    </Group>
                  ) : (
                    <Text size="xs" c="dimmed">
                      Pending
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Badge
                    size="xs"
                    variant="light"
                    color={
                      item.status === 'COMPLETED'
                        ? 'civicGreen'
                        : item.status === 'FAILED'
                          ? 'red'
                          : item.status === 'SKIPPED'
                            ? 'gray'
                            : 'civicBlue'
                    }
                  >
                    {item.status}
                  </Badge>
                </Table.Td>
                {(canRemove || canSkip) && (
                  <Table.Td>
                    {isPending && (
                      <Group gap={2} wrap="nowrap">
                        {canSkip && (
                          <ActionIcon
                            variant="subtle"
                            color="orange"
                            size="xs"
                            title="Skip item"
                            onClick={() =>
                              handleItemAction(
                                () => skipOperationItem(op.id, item.id),
                                'Item skipped.',
                              )
                            }
                          >
                            <TablerIcon name="playerSkipForward" size={12} />
                          </ActionIcon>
                        )}
                        {canRemove && (
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="xs"
                            title="Remove item"
                            onClick={() =>
                              handleItemAction(
                                () => removeOperationItem(op.id, item.id),
                                'Item removed.',
                              )
                            }
                          >
                            <TablerIcon name="trash" size={12} />
                          </ActionIcon>
                        )}
                      </Group>
                    )}
                  </Table.Td>
                )}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

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

  const handleAction = async (
    actionFn: () => Promise<any>,
    successMsg: string,
  ) => {
    try {
      await actionFn();
      showNotification({ title: 'Done', message: successMsg, color: 'teal' });
      operationsAsync.mutate();
    } catch (err) {
      const e = handleApiErrors<{}>(err);
      showNotification({ title: 'Error', message: e.detail ?? 'Action failed.', color: 'red' });
    }
  };

  const openNewOperation = () => {
    const close = launchWorkspace(
      <NewOperationForm
        onClose={() => close()}
        onSuccess={() => operationsAsync.mutate()}
      />,
      { title: 'New Custody Operation' },
    );
  };

  const openAddItems = (operation: DocumentOperation) => {
    const existingIds = operation.items?.map((i) => i.foundCaseId) ?? [];
    const close = launchWorkspace(
      <AddItemsForm
        operationId={operation.id}
        existingFoundCaseIds={existingIds}
        onClose={() => close()}
        onSuccess={() => operationsAsync.mutate()}
      />,
      { title: `Add Documents — ${operation.operationNumber}` },
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
          original.station?.name ??
          original.toStation?.name ??
          '—',
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
    cell: ({ row: { original } }) => {
      const isDraft = original.status === DocumentOperationStatus.DRAFT;
      const isSubmitted = original.status === DocumentOperationStatus.SUBMITTED;
      const isApproved = original.status === DocumentOperationStatus.APPROVED;
      const isTerminal =
        original.status === DocumentOperationStatus.COMPLETED ||
        original.status === DocumentOperationStatus.CANCELLED;

      if (isTerminal) return null;

      return (
        <Menu position="bottom-end" width={180}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <TablerIcon name="dots" size={14} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {isDraft && (
              <>
                <Menu.Item
                  leftSection={<TablerIcon name="filePlus" size={14} />}
                  onClick={() => openAddItems(original)}
                >
                  Add Documents
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<TablerIcon name="bolt" size={14} />}
                  onClick={() =>
                    handleAction(
                      () => executeOperation(original.id),
                      'Operation executed successfully.',
                    )
                  }
                >
                  Execute
                </Menu.Item>
                <Menu.Item
                  leftSection={<TablerIcon name="send" size={14} />}
                  onClick={() =>
                    handleAction(
                      () => submitOperation(original.id),
                      'Operation submitted for approval.',
                    )
                  }
                >
                  Submit for Approval
                </Menu.Item>
              </>
            )}
            {isSubmitted && (
              <>
                <Menu.Item
                  leftSection={<TablerIcon name="check" size={14} />}
                  color="teal"
                  onClick={() =>
                    handleAction(
                      () => approveOperation(original.id),
                      'Operation approved.',
                    )
                  }
                >
                  Approve
                </Menu.Item>
                <Menu.Item
                  leftSection={<TablerIcon name="x" size={14} />}
                  color="orange"
                  onClick={() =>
                    handleAction(
                      () => rejectOperation(original.id, 'OTHER'),
                      'Operation rejected.',
                    )
                  }
                >
                  Reject
                </Menu.Item>
              </>
            )}
            {isApproved && (
              <Menu.Item
                leftSection={<TablerIcon name="bolt" size={14} />}
                onClick={() =>
                  handleAction(
                    () => executeOperation(original.id),
                    'Operation executed successfully.',
                  )
                }
              >
                Execute
              </Menu.Item>
            )}
            {!isTerminal && (
              <>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<TablerIcon name="ban" size={14} />}
                  color="red"
                  onClick={() =>
                    handleAction(
                      () => cancelOperation(original.id, 'CREATED_IN_ERROR'),
                      'Operation cancelled.',
                    )
                  }
                >
                  Cancel
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      );
    },
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
            <Button
              leftSection={<TablerIcon name="plus" size={14} />}
              size="xs"
              onClick={openNewOperation}
            >
              New Operation
            </Button>
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
