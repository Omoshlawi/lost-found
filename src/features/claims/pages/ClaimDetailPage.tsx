import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
} from '@mantine/core';
import { DashboardPageHeader, ErrorState, TablerIcon } from '@/components';
import { useAppColors } from '@/hooks/useAppColors';
import { ClaimActions, ClaimDetailSkeleton } from '../components';
import useCompareCases from '../hooks/use-compare-cases';

const ClaimDetailPage = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const { claim, error, isLoading, comparisons, foundCase } = useCompareCases(claimId);
  const attachments = useMemo(() => claim?.attachments ?? [], [claim]);
  const images = useMemo(() => foundCase?.case?.document?.images ?? [], [foundCase]);
  const [selectedimageIndex, setSelectedimageindex] = useState(0);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const { bgColor } = useAppColors();
  const selectedImage = `/api/files/stream?fileName=${images[selectedimageIndex]?.url}`;
  const selectedAttachment = `/api/files/stream?fileName=${attachments[selectedAttachmentIndex]?.storageKey}`;
  const navigateImage = (direction: number) => {
    setSelectedimageindex((prev) => (prev + direction + images.length) % images.length);
  };
  const navigateAttachment = (direction: number) => {
    setSelectedAttachmentIndex(
      (prev) => (prev + direction + attachments.length) % attachments.length
    );
  };

  if (isLoading) {
    return <ClaimDetailSkeleton />;
  }
  if (error) {
    return <ErrorState error={error} message="No report data available" title="Report Detail" />;
  }
  return (
    <Stack gap="xl">
      <DashboardPageHeader
        icon="filterQuestion"
        title={`${claim?.claimNumber}`}
        subTitle={() => (
          <Group gap="sm">
            <Text c="dimmed">Claim detail</Text>
            <Badge size="xs">{claim?.status}</Badge>
          </Group>
        )}
        traiiling={<ClaimActions claim={claim!} />}
      />
      <Tabs defaultValue="claim">
        <Tabs.List>
          <Tabs.Tab value="claim" leftSection={<TablerIcon name="userQuestion" size={12} />}>
            User Claim
          </Tabs.Tab>
          <Tabs.Tab value="cases" leftSection={<TablerIcon name="briefcase" size={12} />}>
            Cases Comparison
          </Tabs.Tab>
          <Tabs.Tab value="attachments" leftSection={<TablerIcon name="paperclip" size={12} />}>
            Attachments Comparison
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="claim" pt="md">
          <Table variant="vertical" layout="fixed">
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Question</Table.Th>
                <Table.Td>Provided Response</Table.Td>
                <Table.Td>Expected Response</Table.Td>
              </Table.Tr>

              {claim?.verification?.userResponses?.map(({ question, response }, i) => (
                <Table.Tr key={i}>
                  <Table.Th>{question}</Table.Th>
                  <Table.Td>{response}</Table.Td>
                  <Table.Td>
                    {foundCase?.securityQuestion?.find((q) => q.question === question)?.answer}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
        <Tabs.Panel value="cases" pt="md">
          <Paper p={0} flex={1} w="100%" style={{ overflow: 'auto' }}>
            <Table variant="vertical" layout="fixed">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td w={160}>Field name</Table.Td>
                  <Table.Td w={160}>Lost</Table.Td>
                  <Table.Td w={160}>Found</Table.Td>
                </Table.Tr>

                {comparisons.map((comparison, i) => (
                  <Table.Tr key={i}>
                    <Table.Td>{comparison.field}</Table.Td>
                    <Table.Th>{comparison.lost}</Table.Th>
                    <Table.Th>{comparison.found}</Table.Th>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>
        <Tabs.Panel value="attachments" pt="md">
          <SimpleGrid cols={{ base: 1, lg: 2 }}>
            <Paper bg={bgColor} p="md">
              <Text fw="bold">Found Document</Text>
              <Divider mb="md" />

              <Box style={{ position: 'relative' }}>
                <Image
                  src={selectedImage}
                  fit="contain"
                  radius="md"
                  fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                  style={{ width: '100%', height: '100%' }}
                />

                {images.length > 1 && (
                  <Box
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 8px',
                      pointerEvents: 'none', // allow only buttons to capture clicks
                    }}
                  >
                    <ActionIcon
                      onClick={() => navigateImage(-1)}
                      radius="xl"
                      variant="filled"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <TablerIcon name="chevronLeft" />
                    </ActionIcon>

                    <ActionIcon
                      onClick={() => navigateImage(1)}
                      radius="xl"
                      variant="filled"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <TablerIcon name="chevronRight" />
                    </ActionIcon>
                  </Box>
                )}
              </Box>
            </Paper>
            <Paper bg={bgColor} p="md">
              <Text fw="bold">Attached Support document</Text>
              <Divider mb="md" />
              <Box style={{ position: 'relative' }}>
                <Image
                  src={selectedAttachment}
                  flex={1}
                  fit="contain"
                  radius="md"
                  fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                />
                {attachments.length > 1 && (
                  <Box
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 8px',
                      pointerEvents: 'none', // allow only buttons to capture clicks
                    }}
                  >
                    <ActionIcon
                      onClick={() => navigateAttachment(-1)}
                      radius="xl"
                      variant="filled"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <TablerIcon name="chevronLeft" />
                    </ActionIcon>

                    <ActionIcon
                      onClick={() => navigateAttachment(1)}
                      radius="xl"
                      variant="filled"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <TablerIcon name="chevronRight" />
                    </ActionIcon>
                  </Box>
                )}
              </Box>
            </Paper>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default ClaimDetailPage;
