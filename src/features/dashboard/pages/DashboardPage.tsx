import { Link } from 'react-router-dom';
import {
  Anchor,
  Box,
  Divider,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { TablerIcon, TablerIconName } from '@/components/TablerIcon';
import { useClaims } from '@/features/claims/hooks';
import { useDocumentCases } from '@/features/cases/hooks';
import { ClaimStatus } from '@/features/claims/types';
import { FoundDocumentCaseStatus, LostDocumentCaseStatus } from '@/features/cases/types';
import dayjs from 'dayjs';

// ─── KPI card ────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  description: string;
  icon: TablerIconName;
  color: string;
  count: number;
  isLoading: boolean;
  linkTo: string;
}

function KpiCard({ label, description, icon, color, count, isLoading, linkTo }: KpiCardProps) {
  return (
    <Box
      style={(theme) => ({
        border: `1px solid ${theme.colors.dark[theme.colorScheme === 'dark' ? 6 : 2] ?? 'var(--mantine-color-default-border)'}`,
        borderLeft: `3px solid var(--mantine-color-${color}-6)`,
        padding: 'var(--mantine-spacing-md)',
        backgroundColor: 'var(--mantine-color-body)',
      })}
    >
      <Group justify="space-between" align="flex-start" mb="xs">
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>
          {label}
        </Text>
        <TablerIcon
          name={icon}
          size={18}
          stroke={1.5}
          style={{ color: `var(--mantine-color-${color}-6)` }}
        />
      </Group>

      {isLoading ? (
        <Skeleton height={36} width={60} mb={4} />
      ) : (
        <Title
          order={2}
          style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 800,
            color: `var(--mantine-color-${color}-6)`,
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          {count}
        </Title>
      )}

      <Group justify="space-between" align="center">
        <Text size="xs" c="dimmed">
          {description}
        </Text>
        <Anchor component={Link} to={linkTo} size="xs" c={`${color}.6`}>
          View →
        </Anchor>
      </Group>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const foundSubmitted = useDocumentCases({
    caseType: 'FOUND',
    status: FoundDocumentCaseStatus.SUBMITTED,
    limit: 100,
  });
  const lostActive = useDocumentCases({
    caseType: 'LOST',
    status: LostDocumentCaseStatus.SUBMITTED,
    limit: 100,
  });
  const claimsPending = useClaims({ status: ClaimStatus.PENDING, limit: 100 });
  const claimsUnderReview = useClaims({ status: ClaimStatus.UNDER_REVIEW, limit: 100 });

  return (
    <Stack gap="xl">
      {/* Page header */}
      <Box>
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title
              order={4}
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700 }}
            >
              Overview
            </Title>
            <Text size="xs" c="dimmed">
              Staff dashboard — {dayjs().format('dddd, DD MMMM YYYY')}
            </Text>
          </Stack>
        </Group>
        <Divider />
      </Box>

      {/* KPI grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <KpiCard
          label="Awaiting Verification"
          description="Found docs submitted by finders"
          icon="fileCheck"
          color="civicBlue"
          count={foundSubmitted.reports.length}
          isLoading={foundSubmitted.isLoading}
          linkTo="/dashboard/found-documents"
        />
        <KpiCard
          label="Active Lost Cases"
          description="Open lost document reports"
          icon="fileSearch"
          color="civicNavy"
          count={lostActive.reports.length}
          isLoading={lostActive.isLoading}
          linkTo="/dashboard/lost-documents"
        />
        <KpiCard
          label="Claims Pending"
          description="Claims awaiting staff review"
          icon="filterQuestion"
          color="civicGold"
          count={claimsPending.claims.length}
          isLoading={claimsPending.isLoading}
          linkTo="/dashboard/claims"
        />
        <KpiCard
          label="Under Review"
          description="Claims currently being reviewed"
          icon="clock"
          color="orange"
          count={claimsUnderReview.claims.length}
          isLoading={claimsUnderReview.isLoading}
          linkTo="/dashboard/claims"
        />
      </SimpleGrid>
    </Stack>
  );
}
