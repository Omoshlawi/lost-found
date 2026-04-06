import { MatchConfidence, MatchStatus } from './types';

export const DATE_FORMAT = 'ddd DD MMM, YYYY';

export const STATUS_OPTIONS = [
  { label: 'Pending', value: MatchStatus.PENDING },
  { label: 'Claimed', value: MatchStatus.CLAIMED },
  { label: 'Rejected', value: MatchStatus.REJECTED },
];

export const CONFIDENCE_OPTIONS = [
  { label: 'High', value: MatchConfidence.HIGH },
  { label: 'Medium', value: MatchConfidence.MEDIUM },
  { label: 'Low', value: MatchConfidence.LOW },
  { label: 'No Match', value: MatchConfidence.NO_MATCH },
];

export const VERDICT_LABELS: Record<string, string> = {
  VERIFIED_MATCH: 'Definitive Match',
  PROBABLE_MATCH: 'Likely Match',
  POSSIBLE_MATCH: 'Potential Match',
  NO_MATCH: 'Non-Match',
};

export const VERDICT_COLORS: Record<string, string> = {
  VERIFIED_MATCH: 'green',
  PROBABLE_MATCH: 'teal',
  POSSIBLE_MATCH: 'yellow',
  NO_MATCH: 'red',
};
