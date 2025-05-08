import { apiFetch } from './apiFetch';

export interface UploadedFile {
  path: string;
  bytesSize: number;
  memeType: string;
  uploadedBy: string;
  fieldName: string;
}

export const uploadFile = async (files: Array<File>, uploadTo: string) => {
  const uploadsData = new FormData();
  uploadsData.append('path', uploadTo);
  files.forEach((file) => {
    uploadsData.append('files', file);
  });
  const res = await apiFetch<Array<UploadedFile>>('/files', {
    method: 'POST',
    data: uploadsData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
