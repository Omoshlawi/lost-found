import { apiFetch } from './apiFetch';
import { constructUrl } from './constructUrl';

export const uploadFile = async (file: File) => {
  // Step 1: Request signed URL from the API
  const requestUrl = constructUrl('files/upload-url', {
    fileName: file.name,
    size: file.size,
    mimeType: file.type,
  });

  const requestResp = await apiFetch<{ url: string }>(requestUrl);
  const signedUrl = requestResp.data.url;

  // Step 2: Upload file directly to S3 using the signed URL
  await apiFetch(signedUrl, {
    method: 'PUT',
    data: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      Accept: undefined,
    },
    maxBodyLength: Infinity,
    timeout: 300000, // 5 minute timeout for large files
  });

  const url = signedUrl?.split('?')?.[0];
  if (url) {
    const fileName = signedUrl.split('/').pop();
    return `/files/stream?fileName=${fileName}`;
  }
};
