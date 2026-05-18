import useSWR from 'swr';
import { APIFetchResponse, constructUrl, PaginatedData } from '@/lib/api';
import { Invoice } from '../types';

export const useInvoice = (claimId?: string) => {
  const url = constructUrl('/invoice', { claimId, v: 'custom:include(items)' });
  const { data, isLoading, error } = useSWR<APIFetchResponse<PaginatedData<Invoice>>>(
    claimId ? url : null
  );
  return { invoice: data?.data?.results?.[0], isLoading, error };
};
