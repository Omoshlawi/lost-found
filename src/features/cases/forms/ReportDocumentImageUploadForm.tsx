import React, { useState } from 'react';
import { Button, Group, Image, SimpleGrid, Stack, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors, uploadFile } from '@/lib/api';
import { useDocumentReportApi } from '../hooks';
import { DocumentImage, DocumentReport } from '../types';

type ReportDocumentImageUploadFormProps = {
  report: DocumentReport;
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
  const { mutateDocumentReport, uploadDocumentImage } = useDocumentReportApi();
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
  });

  const handleUpload = async () => {
    try {
      setLoading(true);
      const uploaded = await uploadFile(files, 'report-documents');
      const documentImages = await uploadDocumentImage(
        report.id,
        report.document!.id,
        uploaded.map((u) => ({ url: u.path }))
      );
      showNotification({
        title: `Success`,
        message: `Report document uploaded succesfully`,
        color: 'green',
        position: 'top-right',
      });
      onSuccess?.(documentImages);
      mutateDocumentReport();
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
