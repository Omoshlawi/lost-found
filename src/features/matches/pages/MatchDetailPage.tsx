import { useParams } from 'react-router-dom';
import { Stack, Tabs } from '@mantine/core';
import { ErrorState, TablerIcon } from '@/components';
import { useMatch } from '../hooks';
import MatchDetailSkeleton from './MatchDetailSkeleton';
import {
  MatchAnalysisTab,
  MatchComparisonTab,
  MatchDetailHeader,
  MatchImagesTab,
  MatchScoreBreakdown,
} from '../components';

const MatchDetailPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { match, isLoading, error } = useMatch(matchId);

  if (isLoading) {
    return <MatchDetailSkeleton />;
  }
  if (error || !match) {
    return <ErrorState error={error} message="No match data available" title="Match Detail" />;
  }

  return (
    <Stack gap="xl">
      <MatchDetailHeader match={match} />

      <MatchScoreBreakdown match={match} />

      <Tabs defaultValue="comparison" variant="default">
        <Tabs.List>
          <Tabs.Tab value="comparison" leftSection={<TablerIcon name="columns" size={16} />}>
            Case Comparison
          </Tabs.Tab>
          <Tabs.Tab value="ai-analysis" leftSection={<TablerIcon name="robot" size={16} />}>
            Analysis
          </Tabs.Tab>
          <Tabs.Tab value="images" leftSection={<TablerIcon name="photo" size={16} />}>
            Document Images
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="comparison" pt="md">
          <MatchComparisonTab match={match} />
        </Tabs.Panel>

        <Tabs.Panel value="ai-analysis" pt="md">
          <MatchAnalysisTab match={match} />
        </Tabs.Panel>

        <Tabs.Panel value="images" pt="md">
          <MatchImagesTab match={match} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default MatchDetailPage;
