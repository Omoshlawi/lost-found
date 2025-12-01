import { apiFetch } from './apiFetch';
import { constructUrl } from './constructUrl';
import httpClient from './httpClient';

export const uploadFile = async (file: File) => {
  // Step 1: Request signed URL from the API
  const requestUrl = constructUrl('/files/upload-url', {
    fileName: file.name,
    size: file.size,
    mimeType: file.type,
  });

  const requestResp = await apiFetch<{ url: string; key: string }>(requestUrl);
  const signedUrl = requestResp.data.url;
  const key = requestResp.data.key;
  // Step 2: Upload file directly to S3 using the signed URL
  await httpClient.put(signedUrl, file, {
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      Accept: undefined,
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 300000, // 5 minute timeout for large files
  });

  return key;
};
