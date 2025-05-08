import React, { useState } from 'react';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Button,
  Collapse,
  Group,
  Image,
  Paper,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { TablerIcon } from '@/components';
import { DocumentImage } from '../types';
import { getBackgroundColor } from '../utils';
import styles from './DocumentImage.module.css';

type Prop = {
  images?: Array<DocumentImage>;
  onUploadImage?: () => void;
  onDeleteImage?: (image: DocumentImage) => Promise<void>;
};

const DocumentImages: React.FC<Prop> = ({ images = [], onUploadImage, onDeleteImage }) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const [imagesOpen, setImagesOpen] = useState(true);
  const handleView = (url: string) => {
    modals.open({
      size: '90vw', // Sets the width to 90% of viewport width
      centered: true,
      withCloseButton: true,
      padding: 'xs',
      styles: {
        inner: {
          padding: '2vh',
        },
        content: {
          maxHeight: '96vh', // Sets the maximum height to 96% of viewport height
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          flex: 1, // Makes the body take the available space
          padding: 0, // Remove default padding
        },
      },
      children: (
        <Image
          src={url}
          height={'100%'}
          fit="contain"
          radius="md"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      ),
    });
  };

  const handleConfirmDeleteimage = (image: DocumentImage) => {
    modals.openConfirmModal({
      title: 'Delete Document Image',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the image? This action is destructive and not reversible
        </Text>
      ),
      labels: { confirm: 'Delete image', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: async () => await onDeleteImage?.(image),
    });
  };

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
                onClick={onUploadImage}
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
              onClick={onUploadImage}
            >
              Upload Image
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <Collapse in={imagesOpen}>
        <Carousel
          // withIndicators
          height={400}
          slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
          slideGap="md"
          emblaOptions={{
            loop: true,
            dragFree: false,
            align: 'center',
          }}
        >
          {images.map((image, index) => {
            const url = `/media/${image.url}`;
            return (
              <Carousel.Slide key={index} className={styles.slideContainer}>
                <Group
                  flex={1}
                  justify="center"
                  pos={'absolute'}
                  top={0}
                  bottom={0}
                  left={0}
                  right={0}
                  className={styles.actionButtonsGroup}
                >
                  <Tooltip label="Delete Document Image">
                    <ActionIcon
                      color="red"
                      size={50}
                      className={styles.actionButton}
                      onClick={() => handleConfirmDeleteimage(image)}
                    >
                      <TablerIcon name="trash" />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Expand image">
                    <ActionIcon
                      size={50}
                      className={styles.actionButton}
                      onClick={() => handleView(url)}
                    >
                      <TablerIcon name="windowMaximize" />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Image
                  src={url}
                  height={'100%'}
                  fit="cover"
                  radius="md"
                  fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Collapse>
    </Paper>
  );
};

export default DocumentImages;
