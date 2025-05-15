import { apiFetch, constructUrl, useApi } from '@/lib/api';
import { ImageProcessFormValues, ImageScanResult } from '../types';

const useImageScanResults = (file?: File, filters: ImageProcessFormValues = {}) => {
  const url = constructUrl('/files/ocr', {
    ...Object.fromEntries(
      Object.entries({ ...filters, mode: 'scanned' }).filter(([key, val]) => {
        if (typeof val === 'string' && !val) return false;
        return true;
      })
    ),
  });

  const fetcher = (url: string) => {
    const formData = new FormData();
    formData.append('file', file!);
    return apiFetch<ImageScanResult>(url, {
      method: 'POST',
      data: formData,
      responseType: 'json',
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };
  const { data, error, isLoading, mutate } = useApi(file ? url : null, fetcher);
  return {
    isLoading,
    error,
    mutate,
    data: data?.data,
  };
};

export default useImageScanResults;
