import useSWR from 'swr';
import { apiFetch, APIFetchResponse, constructUrl, mutate } from '@/lib/api';
import { Claim, RejectClaimFormData, VerifyClaimFormData } from '../types';

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
    v: 'custom:include(verification,attachments,match:include(lostDocumentCase:include(case:include(document:include(type,additionalFields)))),foundDocumentCase:include(case:include(document:include(type,images,additionalFields))),user)',
    ...paras,
  });
  const { data, error, isLoading } = useSWR<APIFetchResponse<Claim>>(url);
  return {
    claim: data?.data,
    error,
    isLoading,
  };
};

const verifyClaim = async (claimId: string, data: VerifyClaimFormData) => {
  const url = constructUrl(`/claim/${claimId}/verify`);
  const res = await apiFetch<Claim>(url, {
    method: 'POST',
    data,
  });
  mutate('/claim');
  return res.data;
};
const rejectClaim = async (claimId: string, data: RejectClaimFormData) => {
  const url = constructUrl(`/claim/${claimId}/reject`);
  const res = await apiFetch<Claim>(url, {
    method: 'POST',
    data,
  });
  mutate('/claim');
  return res.data;
};

const reviewClaim = async (claimId: string, data: VerifyClaimFormData) => {
  const url = constructUrl(`/claim/${claimId}/review`);
  const res = await apiFetch<Claim>(url, {
    method: 'POST',
    data,
  });
  mutate('/claim');
  return res.data;
};

const verifyReviewedClaim = async (claimId: string, data: VerifyClaimFormData) => {
  const url = constructUrl(`/claim/${claimId}/verify-reviewed`);
  const res = await apiFetch<Claim>(url, {
    method: 'POST',
    data,
  });
  mutate('/claim');
  return res.data;
};

const rejectReviewedClaim = async (claimId: string, data: RejectClaimFormData) => {
  const url = constructUrl(`/claim/${claimId}/reject-reviewed`);
  const res = await apiFetch<Claim>(url, {
    method: 'POST',
    data,
  });
  mutate('/claim');
  return res.data;
};

export const useClaimApi = () => {
  return { verifyClaim, rejectClaim, reviewClaim, verifyReviewedClaim, rejectReviewedClaim };
};
