import { ReactNode, useMemo } from 'react';
import { Group, Paper, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { TablerIcon } from '@/components';
import { DATE_FORMAT } from '../constants';
import { Match } from '../types';

interface MatchComparisonTabProps {
  match: Match;
}

export const MatchComparisonTab = ({ match }: MatchComparisonTabProps) => {
  const foundCase = match.foundDocumentCase;
  const lostCase = match.lostDocumentCase;

  const comparisons = useMemo<Array<{ field: string; lost: ReactNode; found: ReactNode }>>(
    () => [
      {
        field: 'Case Number',
        found: foundCase?.case?.caseNumber ?? '—',
        lost: lostCase?.case?.caseNumber ?? '—',
      },
      {
        field: 'Full Name',
        found: foundCase?.case?.document?.fullName ?? '—',
        lost: lostCase?.case?.document?.fullName ?? '—',
      },
      {
        field: 'Surname',
        found: foundCase?.case?.document?.surname ?? '—',
        lost: lostCase?.case?.document?.surname ?? '—',
      },
      {
        field: 'Document Type',
        found: foundCase?.case?.document?.type?.name ?? '—',
        lost: lostCase?.case?.document?.type?.name ?? '—',
      },
      {
        field: 'Document Number',
        found: foundCase?.case?.document?.documentNumber ?? '—',
        lost: lostCase?.case?.document?.documentNumber ?? '—',
      },
      {
        field: 'Serial Number',
        found: foundCase?.case?.document?.serialNumber ?? '—',
        lost: lostCase?.case?.document?.serialNumber ?? '—',
      },
      {
        field: 'Batch Number',
        found: foundCase?.case?.document?.batchNumber ?? '—',
        lost: lostCase?.case?.document?.batchNumber ?? '—',
      },
      {
        field: 'Date of Birth',
        found: foundCase?.case?.document?.dateOfBirth
          ? dayjs(foundCase.case.document.dateOfBirth).format(DATE_FORMAT)
          : '—',
        lost: lostCase?.case?.document?.dateOfBirth
          ? dayjs(lostCase.case.document.dateOfBirth).format(DATE_FORMAT)
          : '—',
      },
      {
        field: 'Place of Birth',
        found: foundCase?.case?.document?.placeOfBirth ?? '—',
        lost: lostCase?.case?.document?.placeOfBirth ?? '—',
      },
      {
        field: 'Gender',
        found: foundCase?.case?.document?.gender ?? '—',
        lost: lostCase?.case?.document?.gender ?? '—',
      },
      {
        field: 'Issuer',
        found: foundCase?.case?.document?.issuer ?? '—',
        lost: lostCase?.case?.document?.issuer ?? '—',
      },
      {
        field: 'Place of Issue',
        found: foundCase?.case?.document?.placeOfIssue ?? '—',
        lost: lostCase?.case?.document?.placeOfIssue ?? '—',
      },
      {
        field: 'Issuance Date',
        found: foundCase?.case?.document?.issuanceDate
          ? dayjs(foundCase.case.document.issuanceDate).format(DATE_FORMAT)
          : '—',
        lost: lostCase?.case?.document?.issuanceDate
          ? dayjs(lostCase.case.document.issuanceDate).format(DATE_FORMAT)
          : '—',
      },
      {
        field: 'Event Date',
        found: foundCase?.case?.eventDate
          ? dayjs(foundCase.case.eventDate).format(DATE_FORMAT)
          : '—',
        lost: lostCase?.case?.eventDate ? dayjs(lostCase.case.eventDate).format(DATE_FORMAT) : '—',
      },
      {
        field: 'Address',
        found: foundCase?.case?.document?.addressRaw ?? '—',
        lost: lostCase?.case?.document?.addressRaw ?? '—',
      },
      {
        field: 'Tags',
        found: foundCase?.case?.tags?.join(', ') ?? '—',
        lost: lostCase?.case?.tags?.join(', ') ?? '—',
      },
      {
        field: 'Description',
        found: foundCase?.case?.description ?? '—',
        lost: lostCase?.case?.description ?? '—',
      },
      {
        field: 'Additional Fields',
        found: foundCase?.case?.document?.additionalFields?.length ? (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {foundCase.case.document.additionalFields.map((af, i) => (
              <li key={i}>
                {af.fieldName}: {af.fieldValue}
              </li>
            ))}
          </ul>
        ) : (
          '—'
        ),
        lost: lostCase?.case?.document?.additionalFields?.length ? (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {lostCase.case.document.additionalFields.map((af, i) => (
              <li key={i}>
                {af.fieldName}: {af.fieldValue}
              </li>
            ))}
          </ul>
        ) : (
          '—'
        ),
      },
    ],
    [foundCase, lostCase]
  );

  return (
    <Paper p={0} withBorder style={{ overflow: 'auto' }}>
      <Table variant="vertical" layout="fixed" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={180}>Field</Table.Th>
            <Table.Th w={280}>
              <Group gap={6}>
                <TablerIcon name="fileSearch" size={14} />
                Lost Case
              </Group>
            </Table.Th>
            <Table.Th w={280}>
              <Group gap={6}>
                <TablerIcon name="fileCheck" size={14} />
                Found Case
              </Group>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {comparisons.map((c, i) => (
            <Table.Tr key={i}>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {c.field}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{c.lost}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{c.found}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};
