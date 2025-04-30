import React from 'react';
import { Card, Stack, Text } from '@mantine/core';
import { TablerIcon } from '../TablerIcon';

type ErrorStateProps = {
  headerTitle: string;
  message?: string;
  error?: Error;
};

const ErrorState: React.FunctionComponent<ErrorStateProps> = ({ headerTitle, error, message }) => {
  return (
    <Card>
      <Card.Section withBorder p={'xs'}>
        {headerTitle}
      </Card.Section>
      <Card.Section withBorder p={'xs'} flex={1}>
        <Stack align="center">
          <TablerIcon name="exclamationCircle" size={100} color="red" />
          <Text>{error?.message ?? message}</Text>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default ErrorState;
