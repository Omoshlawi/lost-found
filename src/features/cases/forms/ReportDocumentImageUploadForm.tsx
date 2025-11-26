import React, { useState } from 'react';
import { Button, Group, Image, SimpleGrid, Stack, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors, uploadFile } from '@/lib/api';
import { useDocumentCaseApi } from '../hooks';
import { DocumentCase, DocumentImage } from '../types';

type ReportDocumentImageUploadFormProps = {
  report: DocumentCase;
  onClose?: () => void;
  onSuccess?: (docs: Array<DocumentImage>) => void;
};

const ReportDocumentImageUploadForm: React.FC<ReportDocumentImageUploadFormProps> = ({
  report,
  onClose,
  onSuccess,
}) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState(false);
  const { uploadDocumentImage } = useDocumentCaseApi();
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
  });

  const handleUpload = async () => {
    try {
      setLoading(true);
      const urls = await Promise.all(files.map((file) => uploadFile(file)));
      const documentImages = await uploadDocumentImage(
        report.id,
        report.document!.id,
        urls.filter((u): u is string => typeof u === 'string').map((u) => ({ url: u }))
      );
      showNotification({
        title: `Success`,
        message: `Report document uploaded succesfully`,
        color: 'green',
        position: 'top-right',
      });
      onSuccess?.(documentImages);
      onClose?.();
    } catch (error) {
      const e = handleApiErrors(error);
      if (e.detail) {
        showNotification({
          title: `Error Uploading document image`,
          message: e.detail,
          color: 'red',
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack>
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles} loading={loading} disabled={loading}>
        <Text ta="center">Drop images here</Text>
      </Dropzone>
      <SimpleGrid cols={{ base: 1, sm: 4 }}>{previews}</SimpleGrid>
      <Group justify="flex-end">
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
  );
};

export default ReportDocumentImageUploadForm;
