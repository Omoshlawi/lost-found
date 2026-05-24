import { APIFetchResponse, constructUrl, useApi } from '@/lib/api';
import { DocaiJobStages } from '../types';

export const useExtractionStages = (docaiJobId?: string) => {
  const url = docaiJobId
    ? constructUrl(`/docai/jobs/${docaiJobId}/stages`, { includeConversations: 'true' })
    : null;
  const { data, error, isLoading } = useApi<APIFetchResponse<DocaiJobStages>>(url);
  return { stages: data?.data?.stages ?? [], isLoading, error };
};
