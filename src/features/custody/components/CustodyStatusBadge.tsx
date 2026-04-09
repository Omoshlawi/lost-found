import { Badge } from '@mantine/core';
import { CustodyStatus } from '../types';

const CUSTODY_COLOR: Record<string, string> = {
  WITH_FINDER: 'civicGold',
  IN_CUSTODY: 'teal',
  IN_TRANSIT: 'civicBlue',
  HANDED_OVER: 'civicGreen',
  DISPOSED: 'gray',
};

const CUSTODY_LABEL: Record<string, string> = {
  WITH_FINDER: 'With Finder',
  IN_CUSTODY: 'In Custody',
  IN_TRANSIT: 'In Transit',
  HANDED_OVER: 'Handed Over',
  DISPOSED: 'Disposed',
};

interface CustodyStatusBadgeProps {
  status: CustodyStatus | string | undefined;
}

export function CustodyStatusBadge({ status }: CustodyStatusBadgeProps) {
  if (!status) {
    return null;
  }
  return (
    <Badge color={CUSTODY_COLOR[status] ?? 'gray'} variant="light" size="sm">
      {CUSTODY_LABEL[status] ?? status}
    </Badge>
  );
}
