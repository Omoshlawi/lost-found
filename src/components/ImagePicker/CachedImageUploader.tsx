import React, { useEffect, useState } from 'react';
import { Box, Button, Group, Image, Modal, SimpleGrid, Stack, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { cleanFiles, handleApiErrors, UploadedFile, uploadFile } from '@/lib/api';

type CachedImage = Pick<UploadedFile, 'bytesSize' | 'path' | 'memeType' | 'uploadedBy'> & {
  timestamp: number;
};

interface CachedImageUploaderProps {
  storageKey?: string;
  maxCacheAge?: number;
  onUploadSuccess?: (images: CachedImage[]) => void;
  onClose?: () => void;
}

const CachedImageUploader: React.FC<CachedImageUploaderProps> = ({
  storageKey = 'cached-images',
  maxCacheAge = 1000 * 60 * 60 * 24, // 24 hours
  onUploadSuccess,
  onClose,
}) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [cachedImages, setCachedImages] = useState<CachedImage[]>([]);
  const [hasCheckedInitialCache, setHasCheckedInitialCache] = useState(false);
  const [useCached, setUseCached] = useState(false);
  const [
    openCachedNotificationModal,
    { close: closeCachedNotificationModel, open: openCachedNotificationModel },
  ] = useDisclosure(false);

  // Load cached images from localStorage on component mount
  useEffect(() => {
    const loadCachedImages = () => {
      try {
        const parsedImages: CachedImage[] = getCachedImages();
        const currentTime = Date.now();
        const validImages = parsedImages.filter((img) => currentTime - img.timestamp < maxCacheAge);
        const expiredImages = parsedImages.filter(
          (img) => currentTime - img.timestamp >= maxCacheAge
        );

        setCachedImages(validImages);

        if (expiredImages.length > 0) {
          clearCachedImages(expiredImages.map((img) => img.path));
        }

        // Only show modal if there are valid cached images and this is the initial load
        if (validImages.length > 0 && !hasCheckedInitialCache) {
          openCachedNotificationModel();
        }
      } catch (error: any) {
        showNotification({ title: 'Error loading cached images', message: error?.message });
        localStorage.removeItem(storageKey);
      } finally {
        setHasCheckedInitialCache(true);
      }
    };

    loadCachedImages();
  }, [storageKey, maxCacheAge, hasCheckedInitialCache, openCachedNotificationModel]);

  // Generate previews from the selected files
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={`preview-${index}`}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        radius="md"
      />
    );
  });

  // Generate previews from cached images
  const cachedPreviews = cachedImages.map((image, index) => (
    <Image key={`cached-${index}`} src={`/media/${image.path}`} radius="md" />
  ));

  // Save images to local storage
  const cacheImages = (uploadedImages: UploadedFile[]) => {
    try {
      const imagesToCache: CachedImage[] = uploadedImages.map((image) => ({
        path: image.path,
        bytesSize: image.bytesSize,
        memeType: image.memeType,
        timestamp: Date.now(),
        uploadedBy: image.uploadedBy,
      }));
      localStorage.setItem(storageKey, JSON.stringify(imagesToCache));
      setCachedImages(imagesToCache);
      return imagesToCache;
    } catch (error: any) {
      console.error('Error caching images:', error);
      showNotification({ title: 'Error caching images', message: error?.message });
      return [];
    }
  };

  // Clear cached images from local storage
  const clearCachedImages = async (paths?: string[]) => {
    try {
      setLoading(true);
      if (!paths) {
        const cached = getCachedImages();
        await cleanFiles(cached.map((img) => img.path));
        localStorage.removeItem(storageKey);
        setCachedImages([]);
      } else {
        const cached = getCachedImages();
        const remainingImages = cached.filter((img) => !paths.includes(img.path));
        localStorage.setItem(storageKey, JSON.stringify(remainingImages));
        await cleanFiles(paths);
        setCachedImages(remainingImages);
      }
    } catch (error: any) {
      showNotification({ title: 'Error clearing cached images', message: error?.message });
    } finally {
      setLoading(false);
    }
  };

  const getCachedImages = () => {
    const cachedImagesJson = localStorage.getItem(storageKey);
    if (cachedImagesJson) {
      try {
        return JSON.parse(cachedImagesJson) as CachedImage[];
      } catch {
        return [];
      }
    }
    return [];
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const uploaded = await uploadFile(files, 'tmp');
      const images = cacheImages(uploaded);
      showNotification({
        title: 'Success',
        message: 'Images uploaded successfully',
        color: 'green',
        position: 'top-right',
      });
      onUploadSuccess?.(images);
      setFiles([]);
      onClose?.();
    } catch (error) {
      const e = handleApiErrors(error);
      showNotification({
        title: 'Error uploading images',
        message: e.detail || 'Failed to upload images',
        color: 'red',
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseCachedImages = () => {
    onUploadSuccess?.(cachedImages);
    closeCachedNotificationModel();
    onClose?.();
  };

  return (
    <>
      <Stack>
        <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles} loading={loading} disabled={loading}>
          <Group gap="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <Text ta="center">Drop images here</Text>
            </Dropzone.Accept>
            <Dropzone.Reject>
              <Text ta="center">Only image files are accepted</Text>
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Text ta="center">Drop images here or click to select files</Text>
            </Dropzone.Idle>
          </Group>
        </Dropzone>

        {previews.length > 0 && (
          <>
            <Text size="sm">Selected images:</Text>
            <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xs">
              {previews}
            </SimpleGrid>
          </>
        )}

        <Group>
          <Button
            onClick={() => setFiles([])}
            disabled={files.length === 0 || loading}
            variant="default"
          >
            Clear
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || loading} loading={loading}>
            Upload
          </Button>
        </Group>
      </Stack>

      {/* Modal for cached images - only shows on initial load if cached images exist */}
      <Modal
        opened={openCachedNotificationModal}
        onClose={closeCachedNotificationModel}
        title="Previously uploaded images detected"
        styles={{ title: { fontWeight: '700' } }}
        centered
      >
        <Stack>
          <Text>
            We found previously uploaded images that were not saved. Would you like to use these
            images or clear them?
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
            {cachedPreviews}
          </SimpleGrid>

          <Group>
            <Button
              variant="outline"
              color="red"
              onClick={() => {
                clearCachedImages();
                closeCachedNotificationModel();
              }}
              loading={loading}
            >
              Clear Images
            </Button>
            <Button onClick={handleUseCachedImages} loading={loading}>
              Use These Images
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default CachedImageUploader;
