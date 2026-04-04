import { Skeleton, Table } from '@mantine/core';

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

const TableSkeleton = ({ columns = 5, rows = 6 }: TableSkeletonProps) => (
  <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
    <Table.Thead>
      <Table.Tr>
        {Array.from({ length: columns }).map((_, i) => (
          <Table.Th key={i}>
            <Skeleton height={14} width="60%" />
          </Table.Th>
        ))}
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Table.Tr key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Table.Td key={colIdx}>
              <Skeleton height={14} width={colIdx === 0 ? '30%' : '70%'} />
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>
);

export default TableSkeleton;
