import useSWR from 'swr';
import { APIFetchResponse, constructUrl, PaginatedData } from '@/lib/api';
import { Match } from '../types';

export const useMatches = (params: Record<string, any> = {}) => {
  const url = constructUrl('/matching', {
    v: 'custom:include(lostDocumentCase:include(case:include(document:include(type))),foundDocumentCase:include(case:include(document:include(type))))',
    ...params,
  });
  const { data, error, isLoading, mutate } = useSWR<APIFetchResponse<PaginatedData<Match>>>(url);
  return {
    matches: data?.data?.results ?? [],
    totalCount: data?.data?.totalCount ?? 0,
    currentPage: data?.data?.currentPage ?? 1,
    pageSize: data?.data?.pageSize ?? 12,
    isLoading,
    error,
    mutate,
  };
};

export const useMatch = (matchId?: string) => {
  const url = matchId
    ? constructUrl(`/matching/${matchId}`, {
        v: 'custom:include(lostDocumentCase:include(case:include(document:include(type,images,additionalFields),address)),foundDocumentCase:include(case:include(document:include(type,images,additionalFields),address)))',
      })
    : null;
  const { data, error, isLoading } = useSWR<APIFetchResponse<Match>>(url);
  return {
    match: data?.data,
    isLoading,
    error,
  };
};
