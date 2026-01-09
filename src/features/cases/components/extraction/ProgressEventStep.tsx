import React, { FC, useMemo } from 'react';
import { Box, Card, Group, Progress, Stack, Text } from '@mantine/core';
import { AiInteractionProgressEvent, ImageValidationEvent, ProgressEvent } from '../../types';
import { Status, StatusBadge, StatusIcon } from './StatusComponents';

type ImageValidationProgressEventStepProps = {
  events?: Array<ProgressEvent>;
  step: ImageValidationEvent['key'];
  title: string;
  renderDescription?: (status: Status) => string;
  renderData?: (data: ImageValidationEvent['state']['data']) => React.ReactNode;
  showPending?: boolean;
};
type AiInteractionProgressEventStepProps = {
  events?: Array<ProgressEvent>;
  step: AiInteractionProgressEvent['key'];
  title: string;
  renderDescription?: (status: Status) => string;
  renderData?: (data: AiInteractionProgressEvent['state']['data']) => React.ReactNode;
  showPending?: boolean;
};

type ProgressEventStepProps =
  | ImageValidationProgressEventStepProps
  | AiInteractionProgressEventStepProps;

const ProgressEventStep: FC<ProgressEventStepProps> = ({
  events = [],
  step,
  title,
  renderDescription,
  renderData,
  showPending = false,
}) => {
  const stepEvents = useMemo(() => events.filter((e) => e.key === step), [events, step]);
  const { isLoading, data, error } = useMemo<ProgressEvent['state']>(() => {
    const hasLoadingState = stepEvents.some((e) => e.state.isLoading);
    const hasErrorState = stepEvents.some((e) => e.state.error);
    const data = stepEvents.find((e) => hasLoadingState && !hasErrorState && e.state.data)?.state
      ?.data as any;
    const error = stepEvents.find((e) => hasLoadingState && e.state.error)?.state?.error;
    return {
      isLoading: hasLoadingState && !error && !data,
      data,
      error,
    };
  }, [stepEvents]);
  const status = useMemo<Status>(() => {
    if (isLoading) {
      return 'loading';
    }
    if (error) {
      return 'error';
    }
    if (data) {
      return 'completed';
    }
    return 'pending';
  }, [isLoading, data, error]);

  if (!showPending && stepEvents.length === 0) {
    return null;
  }

  return (
    <Card withBorder>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group gap="md" align="flex-start">
            <StatusIcon status={status} />
            <Box style={{ flex: 1 }}>
              <Text fw={500} size="md">
                {title}
              </Text>
              {typeof renderDescription === 'function' && (
                <Text size="sm" c="dimmed" mt={4}>
                  {renderDescription(status)}
                </Text>
              )}
            </Box>
          </Group>
          <StatusBadge status={status} />
        </Group>
        {status === 'loading' && (
          <Box mt="xs">
            <Progress value={50} animated size="sm" radius="xl" />
          </Box>
        )}
        {status === 'completed' && typeof renderData === 'function' && (
          <>{renderData(data as any)}</>
        )}
      </Stack>
    </Card>
  );
};

export default ProgressEventStep;
