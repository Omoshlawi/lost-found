import React from 'react';
import dayjs from 'dayjs';
import {
  Accordion,
  Badge,
  Center,
  Divider,
  Grid,
  Group,
  Loader,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { SectionTitle, StatusBadge, TablerIcon } from '@/components';
import { AIExtraction, CaseType, Document, LostDocumentCase } from '../types';
import { useDocumentCaseTimeline } from '../hooks/useDocumentCases';

// ─── Timeline event metadata ─────────────────────────────────────────────────

const EVENT_META: Record<string, { label: string; icon: string; description: string }> = {
  document_event:     { label: 'Document Event',     icon: 'calendar',      description: 'Date the document was lost or found' },
  case_reported:      { label: 'Case Reported',       icon: 'clipboardText', description: 'Case filed in the system' },
  ai_extraction:      { label: 'AI Extraction',       icon: 'robot',         description: 'Document data extracted via AI pipeline' },
  case_submitted:     { label: 'Case Submitted',      icon: 'send',          description: 'Case submitted for staff review' },
  case_verified:      { label: 'Case Verified',       icon: 'circleCheck',   description: 'Case verified by staff' },
  case_rejected:      { label: 'Case Rejected',       icon: 'circleX',       description: 'Case rejected by staff' },
  document_matched:   { label: 'Document Matched',    icon: 'linkPlus',      description: 'A match was identified for this document' },
  claim_submitted:    { label: 'Claim Submitted',     icon: 'userCheck',     description: 'Owner submitted a claim for this document' },
  claim_verified:     { label: 'Claim Verified',      icon: 'circleCheck',   description: 'Claim approved — handover initiated' },
  claim_rejected:     { label: 'Claim Rejected',      icon: 'circleX',       description: 'Claim was rejected or cancelled' },
  handover_scheduled: { label: 'Handover Scheduled',  icon: 'calendarEvent', description: 'Document handover appointment scheduled' },
  case_completed:     { label: 'Case Completed',      icon: 'trophy',        description: 'Document successfully returned to owner' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AdditionalDetailsProps {
  caseId: string;
  caseNumber: string;
  reportType: CaseType;
  status: string;
  document?: Document;
  lostDocumentCase?: LostDocumentCase;
  extraction?: AIExtraction;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  caseId,
  caseNumber,
  reportType,
  status,
  document,
  lostDocumentCase,
  extraction,
}) => {
  const { events, isLoading: timelineLoading } = useDocumentCaseTimeline(caseId);

  const activeIndex = events.reduce(
    (last, evt, idx) => (evt.status !== 'pending' ? idx : last),
    -1
  );

  return (
    <Stack gap="xl">

      {/* ── Case Reference ───────────────────────────────────────────────── */}
      <Stack gap="md">
        <SectionTitle label="Case Reference" />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>Case Number</Text>
            <Text ff="monospace" size="sm">{caseNumber}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>Case Type</Text>
            <Badge variant="light" color={reportType === 'FOUND' ? 'civicGreen' : 'civicBlue'}>
              {reportType === 'FOUND' ? 'Found Document' : 'Lost Document'}
            </Badge>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>Current Status</Text>
            <Text size="sm">{status}</Text>
          </Grid.Col>
          {reportType === 'LOST' && lostDocumentCase && (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Text size="sm" fw={600} c="dimmed" mb={4}>Entry Method</Text>
              <Badge variant="outline" color={lostDocumentCase.auto ? 'civicBlue' : 'gray'}>
                {lostDocumentCase.auto ? 'Document Scan' : 'Manual Entry'}
              </Badge>
            </Grid.Col>
          )}
        </Grid>
      </Stack>

      <Divider />

      {/* ── Document Security Features ───────────────────────────────────── */}
      {document && (
        <>
          <Stack gap="md">
            <SectionTitle label="Document Security Features" />
            <Group gap="xl">
              <Stack gap={4} align="center">
                <TablerIcon name={document.photoPresent ? 'photo' : 'photoOff'} size={22} />
                <Text size="xs" c="dimmed">Photo</Text>
                <Badge size="xs" variant="light" color={document.photoPresent ? 'civicGreen' : 'gray'}>
                  {document.photoPresent ? 'Present' : 'Absent'}
                </Badge>
              </Stack>
              <Stack gap={4} align="center">
                <TablerIcon name="fingerprint" size={22} />
                <Text size="xs" c="dimmed">Fingerprint</Text>
                <Badge size="xs" variant="light" color={document.fingerprintPresent ? 'civicGreen' : 'gray'}>
                  {document.fingerprintPresent ? 'Present' : 'Absent'}
                </Badge>
              </Stack>
              <Stack gap={4} align="center">
                <TablerIcon name="signature" size={22} />
                <Text size="xs" c="dimmed">Signature</Text>
                <Badge size="xs" variant="light" color={document.signaturePresent ? 'civicGreen' : 'gray'}>
                  {document.signaturePresent ? 'Present' : 'Absent'}
                </Badge>
              </Stack>
              <Stack gap={4} align="center">
                <TablerIcon name={document.isExpired ? 'alertTriangle' : 'shieldCheck'} size={22} />
                <Text size="xs" c="dimmed">Validity</Text>
                <Badge size="xs" variant="light" color={document.isExpired ? 'red' : 'civicGreen'}>
                  {document.isExpired ? 'Expired' : 'Valid'}
                </Badge>
              </Stack>
            </Group>
          </Stack>
          <Divider />
        </>
      )}

      {/* ── AI Extraction Details ────────────────────────────────────────── */}
      {extraction && (
        <>
          <Stack gap="md">
            <SectionTitle label="AI Extraction" />
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Text size="sm" fw={600} c="dimmed" mb={4}>Status</Text>
                <StatusBadge status={extraction.extractionStatus} />
              </Grid.Col>
              {extraction.currentStep && (
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Text size="sm" fw={600} c="dimmed" mb={4}>Current Step</Text>
                  <Text size="sm">
                    {{ VISION: 'Image Analysis', TEXT: 'Data Extraction', POST_PROCESSING: 'Post Processing' }[extraction.currentStep] ?? extraction.currentStep}
                  </Text>
                </Grid.Col>
              )}
              {extraction.ocrConfidence != null && (
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Text size="sm" fw={600} c="dimmed" mb={4}>OCR Confidence</Text>
                  <Text size="sm">{Math.round(extraction.ocrConfidence * 100)}%</Text>
                </Grid.Col>
              )}
              {extraction.extractionConfidence != null && (
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                  <Text size="sm" fw={600} c="dimmed" mb={4}>Extraction Confidence</Text>
                  <Text size="sm">{Math.round(extraction.extractionConfidence * 100)}%</Text>
                </Grid.Col>
              )}
              {extraction.fallbackTriggered && (
                <Grid.Col span={12}>
                  <Badge variant="light" color="orange" leftSection={<TablerIcon name="alertTriangle" size={12} />}>
                    Fallback extraction triggered — results may be less accurate
                  </Badge>
                </Grid.Col>
              )}
            </Grid>
          </Stack>
          <Divider />
        </>
      )}

      {/* ── Document Type Details ────────────────────────────────────────── */}
      <Stack gap="md">
        <SectionTitle label="Document Type Details" />
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>Avg. Replacement Cost</Text>
            <Text size="sm">{document?.type?.averageReplacementCost ?? 'Unknown'}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Text size="sm" fw={600} c="dimmed" mb={4}>Verification Required</Text>
            <Text size="sm">{document?.type?.requiredVerification || 'Unknown'}</Text>
          </Grid.Col>
        </Grid>
      </Stack>

      <Divider />

      {/* ── Case Timeline (collapsed by default) ─────────────────────────── */}
      <Accordion variant="contained" defaultValue={null}>
        <Accordion.Item value="timeline">
          <Accordion.Control icon={<TablerIcon name="clock" size={16} />}>
            <Text size="sm" fw={600}>Case Timeline</Text>
          </Accordion.Control>
          <Accordion.Panel>
            {timelineLoading ? (
              <Center py="xl">
                <Loader size="sm" />
              </Center>
            ) : events.length === 0 ? (
              <Text size="sm" c="dimmed" py="md">No timeline data available.</Text>
            ) : (
              <Timeline active={activeIndex} bulletSize={28} lineWidth={2} mt="md">
                {events.map((evt) => {
                  const meta = EVENT_META[evt.key] ?? { label: evt.key, icon: 'point', description: '' };
                  const isPending = evt.status === 'pending';
                  return (
                    <Timeline.Item
                      key={evt.key}
                      bullet={<TablerIcon name={meta.icon as any} size={14} />}
                      title={
                        <Text size="sm" fw={600} c={isPending ? 'dimmed' : undefined}>
                          {meta.label}
                        </Text>
                      }
                    >
                      <Text size="xs" c="dimmed">
                        {evt.timestamp
                          ? dayjs(evt.timestamp).format('DD MMM YYYY, HH:mm')
                          : isPending
                            ? 'Pending…'
                            : 'In progress'}
                      </Text>
                      {meta.description && (
                        <Text size="xs" c="dimmed" mt={2}>
                          {meta.description}
                        </Text>
                      )}
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

    </Stack>
  );
};

export default AdditionalDetails;
