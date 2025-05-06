import React from 'react';
import { Stack, Text } from '@mantine/core';
import { handleApiErrors } from '@/lib/api';
import { TableContainer } from '../TableContainer';
import { TablerIcon } from '../TablerIcon';

type ErrorStateProps = {
  headerTitle: string;
  message?: string;
  error?: Error;
};

const ErrorState: React.FunctionComponent<ErrorStateProps> = ({ headerTitle, error, message }) => {
  return (
    <TableContainer title={headerTitle}>
      <Stack align="center">
        <TablerIcon name="exclamationCircle" size={100} color="red" />
        <Text c={'dimmed'}>{error ? handleApiErrors(error).detail : message}</Text>
      </Stack>
    </TableContainer>
  );
};

export default ErrorState;
