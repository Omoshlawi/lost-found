import React, { PropsWithChildren } from 'react';
import { Group, MantineStyleProp, Stack, Text } from '@mantine/core';
import styles from './TableContainer.module.css';

type TableContainerProps = PropsWithChildren<{
  title: string;
  actions?: React.ReactNode;
  style?: MantineStyleProp
}>;

const TableContainer: React.FC<TableContainerProps> = ({ children, actions, title,style }) => {
  return (
    <Stack m={0} className={styles.tableContainer} style={style}>
      <Group px={'xs'} py={'xs'} className={styles.tableContainerTitle} justify="space-between">
        <Text fw={'bold'}>{title}</Text>
        <Group>{actions}</Group>
      </Group>
      {children}
    </Stack>
  );
};

export default TableContainer;
