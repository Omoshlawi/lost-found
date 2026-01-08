import React, { FC } from 'react';
import { Badge, Loader, ThemeIcon } from '@mantine/core';
import { TablerIcon } from '@/components';

export type Status = 'pending' | 'loading' | 'completed' | 'error';

export const StatusIcon: FC<{ status: Status }> = ({ status }) => {
  if (status === 'completed') {
    return (
      <ThemeIcon color="green" size="lg" radius="xl">
        <TablerIcon name="check" size={20} />
      </ThemeIcon>
    );
  }
  if (status === 'loading') {
    return (
      <ThemeIcon color="blue" size="lg" radius="xl" variant="light">
        <Loader size={20} />
      </ThemeIcon>
    );
  }
  if (status === 'error') {
    return (
      <ThemeIcon color="red" size="lg" radius="xl">
        <TablerIcon name="alertCircle" size={20} />
      </ThemeIcon>
    );
  }
  return (
    <ThemeIcon color="gray" size="lg" radius="xl" variant="light">
      <TablerIcon name="clock" size={20} />
    </ThemeIcon>
  );
};

export const StatusBadge: FC<{ status: Status }> = ({ status }) => {
  if (status === 'completed') {
    return (
      <Badge color="green" variant="light">
        Completed
      </Badge>
    );
  }
  if (status === 'loading') {
    return (
      <Badge color="blue" variant="light" leftSection={<Loader size={12} />}>
        Processing
      </Badge>
    );
  }
  if (status === 'error') {
    return (
      <Badge color="red" variant="light">
        Error
      </Badge>
    );
  }
  return (
    <Badge color="gray" variant="light">
      Pending
    </Badge>
  );
};
