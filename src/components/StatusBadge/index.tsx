import { Badge } from '@mantine/core';

// ─── Status → color mapping ───────────────────────────────────────────────────
// Covers: FoundDocumentCaseStatus, LostDocumentCaseStatus, ClaimStatus,
// and AIExtraction extractionStatus. Add new statuses here as the platform grows.

const STATUS_COLOR: Record<string, string> = {
  // Found document case
  DRAFT: 'gray',
  SUBMITTED: 'civicBlue',
  VERIFIED: 'civicGreen',
  REJECTED: 'red',
  COMPLETED: 'teal',
  // Claim
  PENDING: 'civicGold',
  UNDER_REVIEW: 'orange',
  DISPUTED: 'orange',
  CANCELLED: 'gray',
  // AI extraction
  IN_PROGRESS: 'civicBlue',
  FAILED: 'red',
  // Match
  CLAIMED: 'teal',
  // Custody
  WITH_FINDER: 'civicGold',
  IN_CUSTODY: 'teal',
  IN_TRANSIT: 'civicBlue',
  HANDED_OVER: 'civicGreen',
  DISPOSED: 'gray',
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  DISPUTED: 'Disputed',
  CANCELLED: 'Cancelled',
  IN_PROGRESS: 'In Progress',
  FAILED: 'Failed',
  // Match
  CLAIMED: 'Claimed',
  // Custody
  WITH_FINDER: 'With Finder',
  IN_CUSTODY: 'In Custody',
  IN_TRANSIT: 'In Transit',
  HANDED_OVER: 'Handed Over',
  DISPOSED: 'Disposed',
};

interface StatusBadgeProps {
  status: string | undefined;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) {
    return null;
  }
  return (
    <Badge color={STATUS_COLOR[status] ?? 'gray'} variant="light" size="sm">
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
