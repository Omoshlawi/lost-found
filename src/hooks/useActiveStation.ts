import { useCallback } from 'react';
import useSWR from 'swr';
import { apiFetch, APIFetchResponse, authClient } from '@/lib/api';
import { updateSessionStation } from './usePreferredStation';

export interface ActiveStation {
  id: string;
  code: string;
  name: string;
  level1: string;
  level2?: string | null;
}
export const useActiveStation = () => {
  const { data: sessionData, isPending, refetch } = authClient.useSession();

  const sessionStationId: string | null = (sessionData?.session as any)?.stationId ?? null;

  const { data: stationData, isLoading: stationLoading } = useSWR<APIFetchResponse<ActiveStation>>(
    sessionStationId ? `/pickup-stations/${sessionStationId}` : null
  );
  const activeStation: ActiveStation | null = stationData?.data ?? null;

  const setStation = useCallback(
    async (id: string) => {
      await updateSessionStation(id);
      refetch();
    },
    [refetch]
  );

  const clearStation = useCallback(async () => {
    await updateSessionStation(null);
    refetch();
  }, [refetch]);

  return {
    activeStation,
    stationId: sessionStationId,
    isLoading: isPending || stationLoading,
    setStation,
    clearStation,
  };
};

/**
 * Fetch station details by ID without a hook. Returns null if the station is not
 * found or has been deleted — used by PostLoginGuard to validate saved preferences.
 */
export const fetchStationById = async (stationId: string): Promise<ActiveStation | null> => {
  try {
    const res = await apiFetch<ActiveStation>(`/pickup-stations/${stationId}`);
    return res.data ?? null;
  } catch {
    return null;
  }
};
