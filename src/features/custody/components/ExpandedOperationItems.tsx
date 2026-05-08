import React from 'react';
import { Row } from '@tanstack/react-table';
import { Box, Table, Text } from '@mantine/core';
import { DocumentOperation, DocumentOperationStatus, DocumentOperationTypeCode } from '../types';
import ExpandedOperationItem from './ExpandedOperationItem';

interface ExpandedOperationItemsProps {
  row: Row<DocumentOperation>;
  onMutate: () => void;
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
          {op.items.map((item) => (
            <ExpandedOperationItem
              item={item}
              onMutate={onMutate}
              operationType={op.operationType}
              operationStatus={op.status}
              operationId={op.id}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};
