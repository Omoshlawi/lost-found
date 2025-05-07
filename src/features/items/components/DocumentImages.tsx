import React, { useState } from 'react';
import { IconEye, IconMapPin, IconTrash } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Collapse,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
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
  const [imagesOpen, setImagesOpen] = useState(true);

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
          <Group flex={1} justify="space-between">
            <ThemeIcon size="lg" radius="xl" color="green">
              <TablerIcon name="photo" size={20} />
            </ThemeIcon>
            <Tooltip label="Upload New Image">
              <Button
                variant="filled"
                color="green"
                size="sm"
                leftSection={<TablerIcon name="upload" size={16} />}
              >
                Upload Image
              </Button>
            </Tooltip>
          </Group>
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
        <Group flex={1} justify="space-between">
          <ActionIcon onClick={() => setImagesOpen(!imagesOpen)}>
            <TablerIcon name={imagesOpen ? 'chevronUp' : 'chevronDown'} size={16} />
          </ActionIcon>
          <Tooltip label="Upload New Image">
            <Button
              variant="filled"
              color="green"
              size="sm"
              leftSection={<TablerIcon name="upload" size={16} />}
            >
              Upload Image
            </Button>
          </Tooltip>
        </Group>
      </Group>

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
    </Paper>
  );
};

export default DocumentImages;
