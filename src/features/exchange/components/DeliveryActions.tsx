import React, { FC, ReactNode, useState } from 'react';
import { IconPrinter, IconTruckOff } from '@tabler/icons-react';
import { Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { SystemAuthorized } from '@/components';
import { useExchangeApi } from '../hooks/useExchanges';

interface DeliveryDispatchProps {
  exchangeNumber: string;
  renderTrigger: (props: { onClick: () => void }) => ReactNode;
}

/**
 * Opens the printable delivery label in a new browser tab.
 * Staff attaches the printed label to the package before dispatching.
 */
export const PrintDeliveryLabel: FC<DeliveryDispatchProps> = ({
  exchangeNumber,
  renderTrigger,
}) => {
  const { getDeliveryLabelUrl } = useExchangeApi();

  const open = () => {
    window.open(getDeliveryLabelUrl(exchangeNumber), '_blank', 'noopener,noreferrer');
  };

  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      {renderTrigger({ onClick: open })}
    </SystemAuthorized>
  );
};

interface FailDeliveryProps {
  exchangeNumber: string;
  renderTrigger: (props: { onClick: () => void }) => ReactNode;
}

/**
 * Staff marks a COURIER_DELIVERY exchange as failed (e.g. recipient not home).
 * Opens a modal for reason entry.
 */
export const MarkDeliveryFailed: FC<FailDeliveryProps> = ({ exchangeNumber, renderTrigger }) => {
  const [opened, setOpened] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { failDelivery } = useExchangeApi();

  const handleConfirm = async () => {
    if (reason.trim().length < 5) {
      return;
    }
    setIsLoading(true);
    try {
      await failDelivery(exchangeNumber, { reason: reason.trim() });
      notifications.show({
        title: 'Delivery marked as failed',
        message: 'The owner has been notified.',
        color: 'orange',
      });
      setOpened(false);
      setReason('');
    } catch {
      notifications.show({
        title: 'Action failed',
        message: 'Could not mark delivery as failed. Please try again.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SystemAuthorized
      permissions={{ documentCase: ['collect'] }}
      unauthorizedAction={{ type: 'hide' }}
    >
      <>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Mark Delivery as Failed"
          size="md"
        >
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Record why the delivery was unsuccessful. The document owner will be notified and may
              reschedule if they have remaining attempts.
            </Text>
            <Textarea
              label="Reason for failure"
              placeholder="e.g. Recipient was not home. Address was locked."
              minRows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.currentTarget.value)}
              error={
                reason.trim().length > 0 && reason.trim().length < 5
                  ? 'Must be at least 5 characters'
                  : undefined
              }
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setOpened(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                color="orange"
                leftSection={<IconTruckOff size={14} />}
                onClick={handleConfirm}
                loading={isLoading}
                disabled={reason.trim().length < 5}
              >
                Mark Failed
              </Button>
            </Group>
          </Stack>
        </Modal>
        {renderTrigger({ onClick: () => setOpened(true) })}
      </>
    </SystemAuthorized>
  );
};

/**
 * Convenience group that shows both label + fail actions for an IN_PROGRESS COURIER_DELIVERY exchange.
 */
interface DeliveryActionsGroupProps {
  exchangeNumber: string;
}

export const DeliveryActionsGroup: FC<DeliveryActionsGroupProps> = ({ exchangeNumber }) => (
  <Group gap="xs">
    <PrintDeliveryLabel
      exchangeNumber={exchangeNumber}
      renderTrigger={({ onClick }) => (
        <Button
          size="sm"
          variant="light"
          color="civicBlue"
          leftSection={<IconPrinter size={14} />}
          onClick={onClick}
        >
          Print Label
        </Button>
      )}
    />
    <MarkDeliveryFailed
      exchangeNumber={exchangeNumber}
      renderTrigger={({ onClick }) => (
        <Button
          size="sm"
          variant="light"
          color="orange"
          leftSection={<IconTruckOff size={14} />}
          onClick={onClick}
        >
          Mark Failed
        </Button>
      )}
    />
  </Group>
);
