import React, { PropsWithChildren } from 'react';
import { Group, Stack, Text } from '@mantine/core';
import styles from './TableContainer.module.css';

type TableContainerProps = PropsWithChildren<{
  title: string;
  actions?: React.ReactNode;
}>;

const TableContainer: React.FC<TableContainerProps> = ({ children, actions, title }) => {
  return (
    <Stack m={0} className={styles.tableContainer}>
      <Group px={'xs'} py={'xs'} className={styles.tableContainerTitle} justify="space-between">
        <Text fw={'bold'}>{title}</Text>
        <Group>{actions}</Group>
      </Group>
      {children}
    </Stack>
  );
};

export default TableContainer;
