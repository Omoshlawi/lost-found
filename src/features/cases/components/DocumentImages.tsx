import React from 'react';
import { Carousel } from '@mantine/carousel';
import { ActionIcon, Button, Group, Image, Stack, Text, Title, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { TablerIcon } from '@/components';
import CaseDocumentImageUploadForm from '../forms/CaseDocumentImageUploadForm';
import { Document } from '../types';
import styles from './DocumentImage.module.css';

type Prop = {
  document: Document;
};

const DocumentImages: React.FC<Prop> = ({ document }) => {
  const { images = [] } = document;
  const onUploadImage = () => {
    const modalId = modals.open({
      title: 'Upload Document Images',
      children: (
        <CaseDocumentImageUploadForm document={document} onClose={() => modals.close(modalId)} />
      ),
    });
  };
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
          height="100%"
          fit="contain"
          radius="md"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      ),
    });
  };

  return (
    <div>
      <Group mb="md" justify="space-between">
        <Stack>
          <Title order={4}>Document Images</Title>
          <Text size="sm" c="dimmed" mb={4}>
            Scanned Images of the document
          </Text>
        </Stack>
        <Button
          variant="light"
          color="green"
          size="sm"
          leftSection={<TablerIcon name="upload" size={16} />}
          onClick={onUploadImage}
        >
          Reupload
        </Button>
      </Group>

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
          const url = `/api/files/stream?fileName=${image.url}`;
          return (
            <Carousel.Slide key={index} className={styles.slideContainer}>
              <Group
                flex={1}
                justify="center"
                pos="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                className={styles.actionButtonsGroup}
              >
                <Tooltip label="Filter Image and rescan">
                  <ActionIcon color="teal" size={50} className={styles.actionButton}>
                    <TablerIcon name="filter" />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Re-scan Document Image">
                  <ActionIcon color="red" size={50} className={styles.actionButton}>
                    <TablerIcon name="scan" />
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
                height="100%"
                fit="cover"
                radius="md"
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
              />
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </div>
  );
};

export default DocumentImages;
