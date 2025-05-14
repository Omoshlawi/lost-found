import { useEffect } from 'react';
import useSWR from 'swr';
import { apiFetch, constructUrl } from '@/lib/api';
import { ImageProcessFormValues } from '../types';

const useFilteredImage = (file?: File, filters: Partial<ImageProcessFormValues> = {}) => {
  const url = constructUrl('/files/ocr', {
    ...Object.fromEntries(
      Object.entries(filters).filter(([key, val]) => {
        if (typeof val === 'string' && !val) return false;
        return true;
      })
    ),
  });
  const fetcher = async (url: string) => {
    const formData = new FormData();
    formData.append('file', file!);
    const response = await apiFetch(url, {
      method: 'POST',
      data: formData,
      responseType: 'blob',
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const blob = response.data;
    return { data: URL.createObjectURL(blob) };
  };
  const { data, error, isLoading, mutate } = useSWR<{ data: string }>(
    // Add file as part of the key to trigger refetch
    file ? url : null,
    fetcher
  );

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (data?.data) {
        URL.revokeObjectURL(data.data);
      }
    };
  }, [data?.data]);

  return { error, isLoading, image: data?.data, mutate };
};

export default useFilteredImage;
