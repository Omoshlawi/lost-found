import React from 'react';
import { Row } from '@tanstack/react-table';
import { ActionIcon, Badge, Box, Group, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { TablerIcon } from '@/components';
import { handleApiErrors } from '@/lib/api';
import { removeOperationItem, skipOperationItem } from '../hooks/useCustody';
import {
  DocumentOperation,
  DocumentOperationItem,
  DocumentOperationStatus,
  DocumentOperationTypeCode,
} from '../types';
import { CustodyStatusBadge } from './CustodyStatusBadge';

interface ExpandedOperationItemsProps {
  row: Row<DocumentOperation>;
  onMutate: () => void;
}

function CollectionStatusBadge({ item }: { item: DocumentOperationItem }) {
  const fc = item.foundCase;
  if (!fc) {
    return <Text size="xs" c="dimmed">—</Text>;
  }
  if (fc.status === 'SUBMITTED') {
    return <Badge size="xs" variant="light" color="civicGreen">Collected</Badge>;
  }
  if (fc.collections?.some((c) => c.status === 'PENDING')) {
    return <Badge size="xs" variant="light" color="orange">Code Sent</Badge>;
  }
  return <Badge size="xs" variant="light" color="gray">Awaiting</Badge>;
}

export const ExpandedOperationItems: React.FC<ExpandedOperationItemsProps> = ({
  row,
  onMutate,
}) => {
  const op = row.original;
  const isDraft = op.status === DocumentOperationStatus.DRAFT;
  const isApproved = op.status === DocumentOperationStatus.APPROVED;
  const canRemove = isDraft;
  const canSkip = isDraft || isApproved;
  const isReceiptOp = op.operationType?.code === DocumentOperationTypeCode.RECEIPT;

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

  const confirmSkip = (item: DocumentOperationItem) => {
    const label = item.foundCase?.case?.caseNumber ?? item.foundCaseId.slice(0, 8);
    modals.openConfirmModal({
      title: 'Skip Document',
      children: (
        <Text size="sm">
          Skip case <strong>{label}</strong>? It will be excluded from execution.
        </Text>
      ),
      labels: { confirm: 'Skip', cancel: 'Cancel' },
      confirmProps: { color: 'orange' },
      onConfirm: () => handleItemAction(() => skipOperationItem(op.id, item.id), 'Item skipped.'),
    });
  };

  const confirmRemove = (item: DocumentOperationItem) => {
    const label = item.foundCase?.case?.caseNumber ?? item.foundCaseId.slice(0, 8);
    modals.openConfirmModal({
      title: 'Remove Document',
      children: (
        <Text size="sm">
          Remove case <strong>{label}</strong> from this operation?
        </Text>
      ),
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleItemAction(() => removeOperationItem(op.id, item.id), 'Item removed.'),
    });
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
            {isReceiptOp && <Table.Th>Collection</Table.Th>}
            <Table.Th>Address</Table.Th>
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
                    href={`/dashboard/cases/${item.foundCaseId}`}
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
                {isReceiptOp && (
                  <Table.Td>
                    <CollectionStatusBadge item={item} />
                  </Table.Td>
                )}
                <Table.Td>
                  <Text size="xs" c="dimmed">
                    {item.userAddressId
                      ? [
                          item.userAddress?.level2,
                          item.userAddress?.level3,
                          item.userAddress?.address1,
                        ]
                          .filter(Boolean)
                          .join(', ')
                      : '--'}
                  </Text>
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
                            onClick={() => confirmSkip(item)}
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
                            onClick={() => confirmRemove(item)}
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
