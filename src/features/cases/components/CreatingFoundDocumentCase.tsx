import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { IconAlertCircle, IconCheck, IconClock } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Loader,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useAppColors } from '@/hooks/useAppColors';
import { useDocumentExtraction } from '../hooks/useDocumentExtraction';
import {
  AiInteraction,
  DocumentCase,
  Extraction,
  FoundDocumentCaseFormData,
  ProgressEvent,
} from '../types';

type CreatingFoundDocumentCaseProps = {
  extraction: Extraction;
  onExtractionComplete: (documentCase: DocumentCase) => void;
  data: FoundDocumentCaseFormData;
};

type StepStatus = 'pending' | 'loading' | 'completed' | 'error';

interface StepState {
  key: string;
  status: StepStatus;
  message?: string;
  data?: any;
}

const stepLabels: Record<string, string> = {
  IMAGE_VALIDATION: 'Image Validation',
  DATA_EXTRACTION: 'Data Extraction',
  SECURITY_QUESTIONS: 'Security Questions',
  IMAGE_ANALYSIS: 'Image Analysis',
  CONFIDENCE_SCORE: 'Confidence Score',
};

const CreatingFoundDocumentCase: FC<CreatingFoundDocumentCaseProps> = ({
  extraction,
  onExtractionComplete,
  data,
}) => {
  const [progressEvents, setProgressEvents] = useState<Array<ProgressEvent>>([]);
  const { extract, socketRef, addEventListener } = useDocumentExtraction();
  const hasExtractedRef = useRef(false);
  const { bgColor } = useAppColors();

  // Listen to streaming progress event
  useEffect(() => {
    const cleanup = addEventListener(
      `stream_progress:${extraction.id}`,
      (progressData: ProgressEvent) => {
        // eslint-disable-next-line no-console
        console.log(progressData);
        setProgressEvents((p) => [...p, progressData]);
      }
    );

    return cleanup;
  }, [extraction.id, addEventListener]);

  // Start extraction once when component mounts
  useEffect(() => {
    if (hasExtractedRef.current) {
      return;
    }

    let connectionCheckInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const performExtraction = async () => {
      // Wait for socket to be connected
      if (!socketRef.current?.connected) {
        // Wait for connection
        connectionCheckInterval = setInterval(() => {
          if (socketRef.current?.connected) {
            if (connectionCheckInterval) {
              clearInterval(connectionCheckInterval);
              connectionCheckInterval = null;
            }
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            performExtraction();
          }
        }, 100);

        // Cleanup interval after 10 seconds
        timeoutId = setTimeout(() => {
          if (connectionCheckInterval) {
            clearInterval(connectionCheckInterval);
            connectionCheckInterval = null;
          }
        }, 10000);
        return;
      }

      hasExtractedRef.current = true;
      const docCase = await extract(extraction.id, data);
      if (docCase) {
        onExtractionComplete(docCase);
      }
    };

    performExtraction();

    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [extract, extraction.id, data, onExtractionComplete, socketRef]);

  // Process progress events into step states
  const steps = useMemo(() => {
    const stepMap = new Map<string, StepState>();

    progressEvents.forEach((event) => {
      const key = event.key;
      const state = event.state;

      let status: StepStatus = 'pending';
      let message: string | undefined;
      let stepData: any;

      if (state.isLoading) {
        status = 'loading';
      } else if (state.data !== undefined) {
        status = 'completed';
        stepData = state.data;
        if (typeof state.data === 'string') {
          message = state.data;
        } else if (state.data && typeof state.data === 'object') {
          // For DATA_EXTRACTION, show success message
          if (key === 'DATA_EXTRACTION' && state.data.success !== undefined) {
            message = state.data.success ? 'Data extracted successfully' : 'Extraction failed';
          }
        }
      } else if (state.error) {
        status = 'error';
        message = state.error.message || 'An error occurred';
      }

      // Update or create step state
      const existing = stepMap.get(key);
      if (!existing || status !== 'pending') {
        stepMap.set(key, {
          key,
          status,
          message,
          data: stepData,
        });
      }
    });

    // Convert map to array and sort by expected order
    const stepOrder = ['IMAGE_VALIDATION', 'DATA_EXTRACTION', 'SECURITY_QUESTIONS'];
    const stepsArray = Array.from(stepMap.values());
    return stepsArray.sort((a, b) => {
      const aIndex = stepOrder.indexOf(a.key);
      const bIndex = stepOrder.indexOf(b.key);
      if (aIndex === -1 && bIndex === -1) {
        return 0;
      }
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }
      return aIndex - bIndex;
    });
  }, [progressEvents]);

  const getStatusIcon = (status: StepStatus, _key: string) => {
    switch (status) {
      case 'completed':
        return (
          <ThemeIcon color="green" size="lg" radius="xl">
            <IconCheck size={20} />
          </ThemeIcon>
        );
      case 'loading':
        return (
          <ThemeIcon color="blue" size="lg" radius="xl" variant="light">
            <Loader size={20} />
          </ThemeIcon>
        );
      case 'error':
        return (
          <ThemeIcon color="red" size="lg" radius="xl">
            <IconAlertCircle size={20} />
          </ThemeIcon>
        );
      default:
        return (
          <ThemeIcon color="gray" size="lg" radius="xl" variant="light">
            <IconClock size={20} />
          </ThemeIcon>
        );
    }
  };

  const getStatusBadge = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge color="green" variant="light">
            Completed
          </Badge>
        );
      case 'loading':
        return (
          <Badge color="blue" variant="light" leftSection={<Loader size={12} />}>
            Processing
          </Badge>
        );
      case 'error':
        return (
          <Badge color="red" variant="light">
            Error
          </Badge>
        );
      default:
        return (
          <Badge color="gray" variant="light">
            Pending
          </Badge>
        );
    }
  };

  const renderStepData = (step: StepState) => {
    if (!step.data || step.status !== 'completed') {
      return null;
    }

    // Handle DATA_EXTRACTION with document extraction data
    if (step.key === 'DATA_EXTRACTION' && step.data.response) {
      try {
        // Try to parse JSON response if it's a string
        let parsedData = step.data.response;
        if (typeof parsedData === 'string' && parsedData.includes('```json')) {
          const jsonMatch = parsedData.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[1]);
          }
        } else if (typeof parsedData === 'string') {
          try {
            parsedData = JSON.parse(parsedData);
          } catch {
            // If parsing fails, show as text
          }
        }

        if (typeof parsedData === 'object' && parsedData !== null) {
          return (
            <Paper p="md" mt="sm" withBorder>
              <Text size="sm" fw={500} mb="xs">
                Extracted Data:
              </Text>
              <Stack gap="xs">
                {parsedData.ownerName && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
                      Owner Name:
                    </Text>
                    <Text size="sm" fw={500}>
                      {parsedData.ownerName}
                    </Text>
                  </Group>
                )}
                {parsedData.documentNumber && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
                      Document Number:
                    </Text>
                    <Text size="sm" fw={500}>
                      {parsedData.documentNumber}
                    </Text>
                  </Group>
                )}
                {parsedData.dateOfBirth && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
                      Date of Birth:
                    </Text>
                    <Text size="sm" fw={500}>
                      {parsedData.dateOfBirth}
                    </Text>
                  </Group>
                )}
                {parsedData.issuer && (
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
                      Issuer:
                    </Text>
                    <Text size="sm" fw={500}>
                      {parsedData.issuer}
                    </Text>
                  </Group>
                )}
                {parsedData.additionalFields && parsedData.additionalFields.length > 0 && (
                  <Box mt="xs">
                    <Text size="sm" c="dimmed" mb="xs">
                      Additional Fields:
                    </Text>
                    <Stack gap={4}>
                      {parsedData.additionalFields.map((field: any, idx: number) => (
                        <Group key={idx} gap="xs">
                          <Text size="sm" c="dimmed" style={{ minWidth: 120 }}>
                            {field.fieldName}:
                          </Text>
                          <Text size="sm" fw={500}>
                            {field.fieldValue}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Paper>
          );
        }
      } catch (error) {
        // If parsing fails, show raw data
      }
    }

    // Handle other steps with AIInteraction data
    if (step.data && typeof step.data === 'object' && 'aiModel' in step.data) {
      const aiData = step.data as AiInteraction;
      return (
        <Paper p="md" mt="sm" withBorder>
          <Text size="sm" fw={500} mb="xs">
            AI Interaction Details:
          </Text>
          <Stack gap="xs">
            <Group gap="xs">
              <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                Model:
              </Text>
              <Text size="sm" fw={500}>
                {aiData.aiModel} ({aiData.modelVersion})
              </Text>
            </Group>

            <Group gap="xs">
              <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                Interaction Type:
              </Text>
              <Text size="sm" fw={500}>
                {aiData.interactionType}
              </Text>
            </Group>

            {aiData.tokenUsage && (
              <Box mt="xs">
                <Text size="sm" c="dimmed" mb="xs">
                  Token Usage:
                </Text>
                <Stack gap={4}>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                      Total Tokens:
                    </Text>
                    <Text size="sm" fw={500}>
                      {aiData.tokenUsage.totalTokenCount.toLocaleString()}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                      Prompt Tokens:
                    </Text>
                    <Text size="sm" fw={500}>
                      {aiData.tokenUsage.promptTokenCount.toLocaleString()}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                      Response Tokens:
                    </Text>
                    <Text size="sm" fw={500}>
                      {aiData.tokenUsage.candidatesTokenCount.toLocaleString()}
                    </Text>
                  </Group>
                </Stack>
              </Box>
            )}

            {aiData.processingTime && (
              <Group gap="xs">
                <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                  Processing Time:
                </Text>
                <Text size="sm" fw={500}>
                  {aiData.processingTime}
                </Text>
              </Group>
            )}

            {aiData.estimatedCost && (
              <Group gap="xs">
                <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                  Estimated Cost:
                </Text>
                <Text size="sm" fw={500}>
                  {aiData.estimatedCost}
                </Text>
              </Group>
            )}

            <Group gap="xs">
              <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                Status:
              </Text>
              <Badge color={aiData.success ? 'green' : 'red'} variant="light">
                {aiData.success ? 'Success' : 'Failed'}
              </Badge>
            </Group>

            {aiData.errorMessage && (
              <Box mt="xs">
                <Text size="sm" c="dimmed" mb="xs">
                  Error Message:
                </Text>
                <Text size="sm" c="red">
                  {aiData.errorMessage}
                </Text>
              </Box>
            )}

            {aiData.retryCount > 0 && (
              <Group gap="xs">
                <Text size="sm" c="dimmed" style={{ minWidth: 140 }}>
                  Retry Count:
                </Text>
                <Text size="sm" fw={500}>
                  {aiData.retryCount}
                </Text>
              </Group>
            )}

            {aiData.response && (
              <Box mt="xs">
                <Text size="sm" c="dimmed" mb="xs">
                  Response:
                </Text>
                <Paper p="xs" withBorder bg={bgColor}>
                  <Text size="xs" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {typeof aiData.response === 'string'
                      ? aiData.response.substring(0, 500) +
                        (aiData.response.length > 500 ? '...' : '')
                      : JSON.stringify(aiData.response, null, 2)}
                  </Text>
                </Paper>
              </Box>
            )}
          </Stack>
        </Paper>
      );
    }

    return null;
  };

  const overallProgress = useMemo(() => {
    if (steps.length === 0) {
      return 0;
    }
    const completed = steps.filter((s) => s.status === 'completed').length;
    return (completed / steps.length) * 100;
  }, [steps]);

  return (
    <Stack gap="md" p="md">
      <Card withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Text size="lg" fw={600}>
              Document Extraction Progress
            </Text>
            <Badge variant="light" color={socketRef.current?.connected ? 'green' : 'red'}>
              {socketRef.current?.connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </Group>

          <Box>
            <Group justify="space-between" mb={4}>
              <Text size="sm" c="dimmed">
                Overall Progress
              </Text>
              <Text size="sm" fw={500}>
                {Math.round(overallProgress)}%
              </Text>
            </Group>
            <Progress value={overallProgress} size="lg" radius="xl" />
          </Box>
        </Stack>
      </Card>

      <Stack gap="md">
        {steps.length === 0 ? (
          <Card withBorder p="xl">
            <Group justify="center">
              <Loader size="md" />
              <Text c="dimmed">Waiting for extraction to start...</Text>
            </Group>
          </Card>
        ) : (
          steps.map((step, index) => (
            <Card key={step.key} withBorder>
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start">
                  <Group gap="md" align="flex-start">
                    {getStatusIcon(step.status, step.key)}
                    <Box style={{ flex: 1 }}>
                      <Text fw={500} size="md">
                        {stepLabels[step.key] || step.key}
                      </Text>
                      {step.message && (
                        <Text size="sm" c="dimmed" mt={4}>
                          {step.message}
                        </Text>
                      )}
                    </Box>
                  </Group>
                  {getStatusBadge(step.status)}
                </Group>

                {step.status === 'loading' && (
                  <Box mt="xs">
                    <Progress value={50} animated size="sm" radius="xl" />
                  </Box>
                )}

                {renderStepData(step)}

                {index < steps.length - 1 && <Divider mt="md" />}
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default CreatingFoundDocumentCase;
