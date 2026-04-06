import { useMemo, useState } from 'react';
import { ActionIcon, Box, Divider, Image, Paper, SimpleGrid, Text } from '@mantine/core';
import { TablerIcon } from '@/components';
import { useAppColors } from '@/hooks/useAppColors';
import { Match } from '../types';

interface MatchImagesTabProps {
  match: Match;
}

export const MatchImagesTab = ({ match }: MatchImagesTabProps) => {
  const { bgColor } = useAppColors();
  const foundImages = useMemo(() => match.foundDocumentCase?.case?.document?.images ?? [], [match]);
  const lostImages = useMemo(() => match.lostDocumentCase?.case?.document?.images ?? [], [match]);

  const [selectedFoundImageIndex, setSelectedFoundImageIndex] = useState(0);
  const [selectedLostImageIndex, setSelectedLostImageIndex] = useState(0);

  const navigateFoundImage = (direction: number) => {
    setSelectedFoundImageIndex((prev) => (prev + direction + foundImages.length) % foundImages.length);
  };

  const navigateLostImage = (direction: number) => {
    setSelectedLostImageIndex((prev) => (prev + direction + lostImages.length) % lostImages.length);
  };

  const selectedFoundImage = foundImages[selectedFoundImageIndex]?.url
    ? `/api/files/stream?fileName=${foundImages[selectedFoundImageIndex].url}`
    : null;

  const selectedLostImage = lostImages[selectedLostImageIndex]?.url
    ? `/api/files/stream?fileName=${lostImages[selectedLostImageIndex].url}`
    : null;

  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
      <Paper bg={bgColor} p="md" withBorder>
        <Text fw="bold" mb="xs">
          Found Document Images
        </Text>
        <Divider mb="md" />
        <Box style={{ position: 'relative' }}>
          <Image
            src={selectedFoundImage || ''}
            fit="contain"
            radius="md"
            fallbackSrc="https://placehold.co/600x400?text=No+Image"
            style={{ width: '100%', height: 'auto', minHeight: 300 }}
          />

          {foundImages.length > 1 && (
            <Box
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px',
                pointerEvents: 'none',
              }}
            >
              <ActionIcon
                onClick={() => navigateFoundImage(-1)}
                radius="xl"
                variant="filled"
                style={{ pointerEvents: 'auto' }}
              >
                <TablerIcon name="chevronLeft" />
              </ActionIcon>

              <ActionIcon
                onClick={() => navigateFoundImage(1)}
                radius="xl"
                variant="filled"
                style={{ pointerEvents: 'auto' }}
              >
                <TablerIcon name="chevronRight" />
              </ActionIcon>
            </Box>
          )}
        </Box>
        {foundImages.length > 0 && (
          <Text size="xs" c="dimmed" ta="center" mt="sm">
            Image {selectedFoundImageIndex + 1} of {foundImages.length}
          </Text>
        )}
      </Paper>

      <Paper bg={bgColor} p="md" withBorder>
        <Text fw="bold" mb="xs">
          Lost Document Images
        </Text>
        <Divider mb="md" />
        <Box style={{ position: 'relative' }}>
          <Image
            src={selectedLostImage || ''}
            fit="contain"
            radius="md"
            fallbackSrc="https://placehold.co/600x400?text=No+Image"
            style={{ width: '100%', height: 'auto', minHeight: 300 }}
          />

          {lostImages.length > 1 && (
            <Box
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px',
                pointerEvents: 'none',
              }}
            >
              <ActionIcon
                onClick={() => navigateLostImage(-1)}
                radius="xl"
                variant="filled"
                style={{ pointerEvents: 'auto' }}
              >
                <TablerIcon name="chevronLeft" />
              </ActionIcon>

              <ActionIcon
                onClick={() => navigateLostImage(1)}
                radius="xl"
                variant="filled"
                style={{ pointerEvents: 'auto' }}
              >
                <TablerIcon name="chevronRight" />
              </ActionIcon>
            </Box>
          )}
        </Box>
        {lostImages.length > 0 && (
          <Text size="xs" c="dimmed" ta="center" mt="sm">
            Image {selectedLostImageIndex + 1} of {lostImages.length}
          </Text>
        )}
      </Paper>
    </SimpleGrid>
  );
};
