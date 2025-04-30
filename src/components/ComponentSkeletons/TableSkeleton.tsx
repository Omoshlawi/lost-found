import React from 'react';
import { Skeleton, Table } from '@mantine/core';

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns = 5, rows = 5 }) => {
  const _rows = Array.from({ length: rows }).map((_, index) => (
    <Table.Tr key={index}>
      {Array.from({ length: columns }).map((_, i) => (
        <Table.Td key={i}>
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder>
      <Table.Thead>
        <Table.Tr bg={'gray.3'}>
          {Array.from({ length: columns }).map((_, i) => (
            <Table.Th key={i}>
              <Skeleton height={8} mt={6} width="70%" radius="xl" h={10} />
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{_rows}</Table.Tbody>
    </Table>
  );
};

export default TableSkeleton;
