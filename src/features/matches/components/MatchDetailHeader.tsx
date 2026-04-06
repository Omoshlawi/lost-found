import { Badge, Group } from '@mantine/core';
import { DashboardPageHeader, StatusBadge } from '@/components';
import { VERDICT_COLORS, VERDICT_LABELS } from '../constants';
import { Match } from '../types';

interface MatchDetailHeaderProps {
  match: Match;
}

export const MatchDetailHeader = ({ match }: MatchDetailHeaderProps) => {
  return (
    <DashboardPageHeader
      icon="exchange"
      title={`Match #${match.matchNumber}`}
      subTitle={() => (
        <Group gap="sm">
          <StatusBadge status={match.status} />
          {match.verdict && (
            <Badge size="xs" variant="light" color={VERDICT_COLORS[match.verdict] ?? 'gray'}>
              {VERDICT_LABELS[match.verdict] ?? match.verdict.replace(/_/g, ' ')}
            </Badge>
          )}
          <Badge
            size="xs"
            variant="outline"
            color={
              match.finalScore >= 0.7
                ? 'green'
                : match.finalScore >= 0.4
                  ? 'yellow'
                  : match.finalScore < 0.1
                    ? 'red'
                    : 'orange'
            }
          >
            {match.finalScore >= 0.7
              ? 'High'
              : match.finalScore >= 0.4
                ? 'Medium'
                : match.finalScore < 0.1
                  ? 'No Match'
                  : 'Low'}{' '}
            confidence
          </Badge>
          <Badge size="xs" variant="light" color="civicBlue">
            Score: {(match.finalScore * 100).toFixed(0)}%
          </Badge>
        </Group>
      )}
    />
  );
};
