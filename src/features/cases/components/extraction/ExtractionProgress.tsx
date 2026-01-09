import { FC, useEffect, useRef, useState } from 'react';
import { Badge, Box, Card, Group, Loader, Paper, Progress, Stack, Text } from '@mantine/core';
import { useDocumentExtraction } from '../../hooks/useDocumentExtraction';
import {
  ConfidenceScore,
  Document,
  DocumentCase,
  Extraction,
  FoundDocumentCaseFormData,
  ImageAnalysisResult,
  ProgressEvent,
  SecurityQuestion,
} from '../../types';
import AiInteractionStep from './AiInteractionStep';
import {
  DataExtractionConfidenceScore,
  DataExtractionStep,
  ImageAnalysis,
} from './DataExtractionStep';
import ProgressEventStep from './ProgressEventStep';

type ExtractionProgressProps = {
  extraction: Extraction;
  onExtractionComplete: (documentCase: DocumentCase) => void;
  data: FoundDocumentCaseFormData;
};

const ExtractionProgress: FC<ExtractionProgressProps> = ({
  data,
  extraction,
  onExtractionComplete,
}) => {
  const [progressEvents, setProgressEvents] = useState<Array<ProgressEvent>>([]);
  const { extract, socketRef, addEventListener } = useDocumentExtraction();
  const hasExtractedRef = useRef(false);

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
        // TODO: uncoment
        // onExtractionComplete(docCase);
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
                {Math.round(20)}%{/* TODO: cALCULATE PERCENTAGE */}
              </Text>
            </Group>
            <Progress value={20} size="lg" radius="xl" />
            {Math.round(20)}%{/* TODO: cALCULATE PERCENTAGE */}
          </Box>
        </Stack>
      </Card>

      <Stack gap="md">
        {progressEvents.length === 0 ? (
          <Card withBorder p="xl">
            <Group justify="center">
              <Loader size="md" />
              <Text c="dimmed">Waiting for extraction to start...</Text>
            </Group>
          </Card>
        ) : (
          <>
            <ProgressEventStep
              step="IMAGE_VALIDATION"
              events={progressEvents}
              title="Image Validation"
              renderDescription={(status) =>
                status === 'completed'
                  ? 'Image Validation Complete'
                  : status === 'error'
                    ? 'Error validating image'
                    : status === 'loading'
                      ? 'Validating image'
                      : 'Pending Validation'
              }
              renderData={(data) => {
                if (data) {
                  return <Text>{data}</Text>;
                }
              }}
            />
            <ProgressEventStep
              events={progressEvents}
              step="DATA_EXTRACTION"
              title="Data Extraction"
              renderDescription={(status) =>
                status === 'completed'
                  ? 'Data Extraction Complete'
                  : status === 'error'
                    ? 'Error Extracting data'
                    : status === 'loading'
                      ? 'Extracting data from image'
                      : 'Pending data extraction'
              }
              renderData={(data) => {
                if (data) {
                  return (
                    <AiInteractionStep<Document>
                      aiInteraction={data}
                      renderParsedResponse={(parsedData) => (
                        <DataExtractionStep document={parsedData} />
                      )}
                    />
                  );
                }
              }}
            />
            <ProgressEventStep
              events={progressEvents}
              step="SECURITY_QUESTIONS"
              title="Security Question Generation"
              renderDescription={(status) =>
                status === 'completed'
                  ? 'Security Questions generation Complete'
                  : status === 'error'
                    ? 'Error generating Security Question'
                    : status === 'loading'
                      ? 'Generating sequrity questions'
                      : 'Pending security question generation'
              }
              renderData={(data) => {
                if (data) {
                  return (
                    <AiInteractionStep<{ questions: Array<SecurityQuestion> }>
                      aiInteraction={data}
                      renderParsedResponse={({ questions }) => (
                        <Paper p="md" mt="sm" withBorder>
                          {questions.map((q, i) => (
                            <Text>
                              {i + 1}.{q.question}({q.answer})
                            </Text>
                          ))}
                        </Paper>
                      )}
                    />
                  );
                }
              }}
            />
            <ProgressEventStep
              events={progressEvents}
              step="CONFIDENCE_SCORE"
              title="Confidence Scoring"
              renderDescription={(status) =>
                status === 'completed'
                  ? 'Confidence scoring Complete'
                  : status === 'error'
                    ? 'Error validating image'
                    : status === 'loading'
                      ? 'Confidence scoring'
                      : 'Pending Validation'
              }
              renderData={(data) => {
                if (data) {
                  return (
                    <AiInteractionStep<ConfidenceScore>
                      aiInteraction={data}
                      renderParsedResponse={(confidenceScore) => (
                        <DataExtractionConfidenceScore confidenceScore={confidenceScore} />
                      )}
                    />
                  );
                }
              }}
            />
            <ProgressEventStep
              events={progressEvents}
              step="IMAGE_ANALYSIS"
              title="Image Analysis"
              renderDescription={(status) =>
                status === 'completed'
                  ? 'Image analysis Complete'
                  : status === 'error'
                    ? 'Error analysing image'
                    : status === 'loading'
                      ? 'Analysing image'
                      : 'Pending Validation'
              }
              renderData={(data) => {
                if (data) {
                  return (
                    <AiInteractionStep<Array<ImageAnalysisResult>>
                      aiInteraction={data}
                      renderParsedResponse={(analysis) => <ImageAnalysis analysis={analysis} />}
                    />
                  );
                }
              }}
            />
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default ExtractionProgress;
