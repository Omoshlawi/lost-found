import React from 'react';
import { Skeleton, Table, useComputedColorScheme, useMantineTheme } from '@mantine/core';

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns = 5, rows = 5 }) => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();

  const headerBg = colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1];

  const _rows = Array.from({ length: rows }).map((_, rowIdx) => (
    <Table.Tr
      key={rowIdx}
      bg={
        rowIdx % 2 === 0
          ? undefined
          : colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0]
      }
    >
      {Array.from({ length: columns }).map((_, colIdx) => (
        <Table.Td key={colIdx}>
          <Skeleton
            height={25}
            mt={6}
            width="70%"
            radius="xl"
            style={{
              background:
                colorScheme === 'dark'
                  ? `rgba(${theme.colors.dark[5]
                      .replace('#', '')
                      .match(/.{2}/g)
                      ?.map((x) => parseInt(x, 16))
                      .join(',')},0.6)`
                  : `rgba(${theme.colors.gray[2]
                      .replace('#', '')
                      .match(/.{2}/g)
                      ?.map((x) => parseInt(x, 16))
                      .join(',')},0.45)`,
            }}
          />
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder>
      <Table.Thead>
        <Table.Tr style={{ background: headerBg }} key="header">
          {Array.from({ length: columns }).map((_, i) => (
            <Table.Th key={i}>
              <Skeleton
                height={28}
                mt={6}
                width="70%"
                radius="xl"
                style={{
                  background:
                    colorScheme === 'dark'
                      ? `rgba(${theme.colors.dark[4]
                          .replace('#', '')
                          .match(/.{2}/g)
                          ?.map((x) => parseInt(x, 16))
                          .join(',')},0.8)`
                      : `rgba(${theme.colors.gray[2]
                          .replace('#', '')
                          .match(/.{2}/g)
                          ?.map((x) => parseInt(x, 16))
                          .join(',')},0.65)`,
                }}
              />
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{_rows}</Table.Tbody>
    </Table>
  );
};

export default TableSkeleton;
