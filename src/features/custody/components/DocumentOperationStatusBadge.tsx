import { Badge } from '@mantine/core';
import { DocumentOperationStatus } from '../types';

const STATUS_COLOR: Record<DocumentOperationStatus, string> = {
  [DocumentOperationStatus.DRAFT]: 'gray',
  [DocumentOperationStatus.SUBMITTED]: 'civicBlue',
  [DocumentOperationStatus.APPROVED]: 'teal',
  [DocumentOperationStatus.IN_PROGRESS]: 'civicGold',
  [DocumentOperationStatus.COMPLETED]: 'civicGreen',
  [DocumentOperationStatus.CANCELLED]: 'red',
  [DocumentOperationStatus.REJECTED]: 'orange',
};

const STATUS_LABEL: Record<DocumentOperationStatus, string> = {
  [DocumentOperationStatus.DRAFT]: 'Draft',
  [DocumentOperationStatus.SUBMITTED]: 'Pending Approval',
  [DocumentOperationStatus.APPROVED]: 'Approved',
  [DocumentOperationStatus.IN_PROGRESS]: 'In Progress',
  [DocumentOperationStatus.COMPLETED]: 'Completed',
  [DocumentOperationStatus.CANCELLED]: 'Cancelled',
  [DocumentOperationStatus.REJECTED]: 'Rejected',
};

interface DocumentOperationStatusBadgeProps {
  status: DocumentOperationStatus | string | undefined;
}

export function DocumentOperationStatusBadge({ status }: DocumentOperationStatusBadgeProps) {
  if (!status) {
    return null;
  }
  const color = STATUS_COLOR[status as DocumentOperationStatus] ?? 'gray';
  const label = STATUS_LABEL[status as DocumentOperationStatus] ?? status;
  return (
    <Badge color={color} variant="light" size="sm">
      {label}
    </Badge>
  );
}
