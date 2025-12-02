import React, { useState } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { handleApiErrors, uploadFile } from '@/lib/api';
import { ImageUpload } from '../components';
import { useDocumentCaseApi } from '../hooks';
import { Document, DocumentImage } from '../types';

type ReportDocumentImageUploadFormProps = {
  document: Document;
  onClose?: () => void;
  onSuccess?: (docs: Array<DocumentImage>) => void;
};

const CaseDocumentImageUploadForm: React.FC<ReportDocumentImageUploadFormProps> = ({
  document,
  onClose,
  onSuccess,
}) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState(false);
  const { uploadDocumentImage } = useDocumentCaseApi();

  const handleUpload = async () => {
    try {
      setLoading(true);
      const urls = await Promise.all(files.map((file) => uploadFile(file)));
      const documentImages = await uploadDocumentImage(document.caseId, document.id, {
        images: urls.filter((u): u is string => typeof u === 'string'),
      });
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
      <ImageUpload
        multiple
        accept={IMAGE_MIME_TYPE}
        uploading={loading}
        onFilesChange={setFiles}
        description="Select images (max 2, will be uploaded on submit). This action will rescan, extract and update document information."
        withBorder={false}
      />
      <Group justify="flex-end">
        <Button onClick={handleUpload} disabled={files.length === 0 || loading} loading={loading}>
          Upload
        </Button>
      </Group>
    </Stack>
  );
};

export default CaseDocumentImageUploadForm;
