import React from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Alert, List, Skeleton, Text } from '@mantine/core';
import { useDeliveryPolicy } from '../hooks/useExchanges';

interface DeliveryPolicyNoticeProps {
  /** Only render when this is true — pass true when COURIER_DELIVERY is selected */
  visible: boolean;
}

const DeliveryPolicyNotice: React.FC<DeliveryPolicyNoticeProps> = ({ visible }) => {
  const { policy, isLoading } = useDeliveryPolicy();

  if (!visible) {
    return null;
  }
  if (isLoading) {
    return <Skeleton height={90} radius="md" />;
  }
  if (!policy) {
    return null;
  }

  const localFee = policy.fees.find((f) => f.zone === 'LOCAL');
  const countyFee = policy.fees.find((f) => f.zone === 'COUNTY');
  const nationalFee = policy.fees.find((f) => f.zone === 'NATIONAL');
  const currency = localFee?.currency ?? 'KES';

  return (
    <Alert
      icon={<IconInfoCircle size={16} />}
      title="Courier Delivery Policy"
      color="blue"
      variant="light"
      radius="md"
    >
      <List size="sm" spacing={4} mt={4}>
        <List.Item>
          Delivery fees are charged by zone and are <strong>non-refundable</strong> once a courier
          has been dispatched.
        </List.Item>
        {localFee && countyFee && nationalFee && (
          <List.Item>
            Fees: Local {currency} {localFee.amount} · County {currency} {countyFee.amount} ·
            National {currency} {nationalFee.amount}
          </List.Item>
        )}
        <List.Item>
          If delivery fails (e.g. recipient not home, wrong address), you receive{' '}
          <strong>one free reschedule</strong>.
        </List.Item>
        <List.Item>
          After <strong>{policy.maxAttempts} failed attempts</strong>, in-person collection at a
          station is required.
        </List.Item>
      </List>
      <Text size="xs" c="dimmed" mt={8}>
        Ensure your address is accurate and you are available at the scheduled delivery time.
      </Text>
    </Alert>
  );
};

export default DeliveryPolicyNotice;
