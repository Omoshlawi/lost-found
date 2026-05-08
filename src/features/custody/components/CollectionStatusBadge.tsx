import { Badge, Loader, Text } from '@mantine/core';
import { useActiveExchange } from '@/features/cases/hooks';
import { DocumentOperationItem } from '../types';

function CollectionStatusBadge({ item }: { item: DocumentOperationItem }) {
  const { hasActiveVerification, isLoading } = useActiveExchange(item.foundCaseId);

  const fc = item.foundCase;

  if (isLoading) {
    return <Loader size="xs" />;
  }
  if (!fc) {
    return (
      <Text size="xs" c="dimmed">
        —
      </Text>
    );
  }
  if (fc.status === 'SUBMITTED') {
    return (
      <Badge size="xs" variant="light" color="civicGreen">
        Collected
      </Badge>
    );
  }
  if (hasActiveVerification) {
    return (
      <Badge size="xs" variant="light" color="orange">
        Code Sent
      </Badge>
    );
  }
  return (
    <Badge size="xs" variant="light" color="gray">
      Awaiting
    </Badge>
  );
}

export default CollectionStatusBadge;
