import React, { useState } from 'react';
import { IconEye, IconMapPin, IconTrash } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Collapse,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Text,
  ThemeIcon,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { TablerIcon, TablerIconName } from '@/components';
import { DocumentImage } from '../types';
import { getBackgroundColor } from '../utils';

type Prop = {
  images?: Array<DocumentImage>;
};

const DocumentImages: React.FC<Prop> = ({ images = [] }) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const [imagesOpen, setImagesOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <Paper
        p="md"
        radius="md"
        withBorder
        mb="md"
        style={{ backgroundColor: getBackgroundColor('red', theme, colorScheme) }}
      >
        <Group mb="xs">
          <Title order={4}>Document Images</Title>
          <ThemeIcon size="lg" radius="xl" color="green">
            <TablerIcon name="photo" size={20} />
          </ThemeIcon>
        </Group>
        <Text c={'dimmed'}>No ducument images for this report</Text>
      </Paper>
    );
  }

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      mb="md"
      style={{ backgroundColor: getBackgroundColor('red', theme, colorScheme) }}
    >
      <Group mb="xs">
        <Title order={4}>Document Images</Title>
        <ActionIcon onClick={() => setImagesOpen(!imagesOpen)}>
          <TablerIcon name={imagesOpen ? 'chevronUp' : 'chevronDown'} size={16} />
        </ActionIcon>
      </Group>

      {!images || images.length === 0 ? (
        <Text c="dimmed" {...{ align: 'center' }} p={'sm'}>
          No document images available
        </Text>
      ) : (
        <Collapse in={imagesOpen}>
          <Carousel
            withIndicators
            height={300}
            slideSize="33.333333%"
            slideGap="md"
            emblaOptions={{
              loop: true,
              dragFree: false,
              align: 'center',
            }}
          >
            {images.map((image, index) => (
              <Carousel.Slide key={index}>
                <Image
                  src={image.url || '/placeholder.svg'}
                  height={250}
                  fit="contain"
                  radius="md"
                  fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Collapse>
      )}
    </Paper>
  );
};

export default DocumentImages;
