import useSWR from 'swr';
import { APIFetchResponse, constructUrl } from '@/lib/api';
import { Claim } from '../types';

export const useClaims = (paras: Record<string, any> = {}) => {
  const url = constructUrl('/claim', {
    v: 'custom:include(match,foundDocumentCase,user)',
    ...paras,
  });
  const { data, error, isLoading } = useSWR<APIFetchResponse<{ results: Array<Claim> }>>(url);
  return {
    claims: data?.data?.results ?? [],
    error,
    isLoading,
  };
};

export const useClaim = (claimId?: string, paras: Record<string, any> = {}) => {
  const url = constructUrl(`/claim/${claimId}`, {
    v: 'custom:include(verification,attachments,match:include(lostDocumentCase:include(case:include(document:include(type)))),foundDocumentCase:include(case:include(document:include(type,images))),user)',
    ...paras,
  });
  const { data, error, isLoading } = useSWR<APIFetchResponse<Claim>>(url);
  return {
    claim: data?.data,
    error,
    isLoading,
  };
};
