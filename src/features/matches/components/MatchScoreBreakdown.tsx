import { SimpleGrid } from '@mantine/core';
import { Match } from '../types';
import { MatchScoreCard } from './MatchScoreCard';

interface MatchScoreBreakdownProps {
  match: Match;
}

export const MatchScoreBreakdown = ({ match }: MatchScoreBreakdownProps) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      <MatchScoreCard
        label="Weighted Match Score"
        value={match.finalScore}
        icon="chartBar"
        color="civicBlue"
      />
      <MatchScoreCard
        label="Similarity Score"
        value={match.vectorScore}
        icon="vectorTriangle"
        color="violet"
      />
    </SimpleGrid>
  );
};
