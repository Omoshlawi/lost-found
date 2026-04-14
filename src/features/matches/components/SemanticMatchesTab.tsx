import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Paper,
  SegmentedControl,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { TablerIcon } from '@/components';
import { formatDate } from '@/lib/utils';
import { useSemanticMatches } from '../hooks';

export const SemanticMatchesTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const semanticRef = searchParams.get('semanticRef') ?? '';
  const semanticType = (searchParams.get('semanticType') ?? 'lost') as 'lost' | 'found';

  const [inputRef, setInputRef] = useState(semanticRef);
  const [inputType, setInputType] = useState<'lost' | 'found'>(semanticType);

  const handleSearch = () => {
    setSearchParams(
      (prev) => {
        if (inputRef) {
          prev.set('semanticRef', inputRef);
          prev.set('semanticType', inputType);
        } else {
          prev.delete('semanticRef');
          prev.delete('semanticType');
        }
        return prev;
      },
      { replace: true }
    );
  };

  const { results, isLoading } = useSemanticMatches({
    caseRef: semanticRef || undefined,
    type: semanticType,
  });

  const hasSearched = !!semanticRef;

  return (
    <Stack gap="md">
      {/* ── Search Form ──────────────────────────────────────────────────── */}
      <Paper withBorder p="md">
        <Group gap="sm" align="flex-end" wrap="nowrap">
          <TextInput
            label="Case Reference"
            placeholder="e.g. LC-2024-001234 or UUID"
            value={inputRef}
            onChange={(e) => setInputRef(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
            leftSection={<TablerIcon name="search" size={14} />}
          />
          <Stack gap={4}>
            <Text size="xs" fw={600} c="dimmed">
              Case Type
            </Text>
            <SegmentedControl
              value={inputType}
              onChange={(v) => setInputType(v as 'lost' | 'found')}
              data={[
                { label: 'Lost', value: 'lost' },
                { label: 'Found', value: 'found' },
              ]}
              size="xs"
            />
          </Stack>
          <Button
            leftSection={<TablerIcon name="vectorTriangle" size={14} />}
            onClick={handleSearch}
            variant="filled"
            color="civicBlue"
          >
            Search
          </Button>
        </Group>
      </Paper>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {!hasSearched && (
        <Center py="xl">
          <Stack align="center" gap="xs">
            <TablerIcon name="searchOff" size={40} />
            <Text c="dimmed" size="sm" ta="center" maw={360}>
              Enter a case reference number above to find semantically similar document cases.
            </Text>
          </Stack>
        </Center>
      )}

      {hasSearched && isLoading && (
        <Stack gap={4}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={40} />
          ))}
        </Stack>
      )}

      {hasSearched && !isLoading && results.length === 0 && (
        <Center py="xl">
          <Stack align="center" gap="xs">
            <TablerIcon name="databaseOff" size={40} />
            <Text c="dimmed" size="sm">
              No similar cases found for this reference.
            </Text>
          </Stack>
        </Center>
      )}

      {hasSearched && !isLoading && results.length > 0 && (
        <Paper withBorder p={0} style={{ overflow: 'auto' }}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Case #</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Document</Table.Th>
                <Table.Th>Document #</Table.Th>
                <Table.Th>Event Date</Table.Th>
                <Table.Th w={40} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {results.map((result) => {
                const isLost = !!result.lostDocumentCase;
                const docType = result.document?.type?.name ?? '—';
                const fullName = result.document?.fullName ?? result.document?.documentNumber ?? '—';
                const docNumber = result.document?.documentNumber ?? '—';
                return (
                  <Table.Tr key={result.id}>
                    <Table.Td>
                      <Text size="sm" ff="monospace" fw={500}>
                        {result.caseNumber}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={isLost ? 'civicBlue' : 'civicGreen'}
                        size="sm"
                      >
                        {isLost ? 'Lost' : 'Found'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text size="sm">{docType}</Text>
                        <Text size="xs" c="dimmed">
                          {fullName}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" ff="monospace">
                        {docNumber}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{result.eventDate ? formatDate(result.eventDate) : '—'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        component={Link}
                        to={`/dashboard/cases/${result.id}`}
                        variant="subtle"
                        size="sm"
                        aria-label="View case"
                      >
                        <TablerIcon name="arrowRight" size={14} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
};
