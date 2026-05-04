import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { APIFetchResponse, constructUrl } from '@/lib/api';
import { useActiveStation } from './useActiveStation';

export interface MyStation {
  id: string;
  code: string;
  name: string;
  level1: string;
  level2: string | null;
  operations: { id: string; code: string; name: string }[];
}

export const useMyStations = (search: string = '', skip: boolean = false) => {
  const { data, error, isLoading, mutate } = useSWR<
    APIFetchResponse<{ results: MyStation[]; totalCount: number }>
  >(skip ? null : constructUrl('/staff-station-operations/mine', { search }));

  const stations: MyStation[] = data?.data?.results ?? [];

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      const q = search?.toLowerCase();
      if (!q) {
        return true;
      }
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.level1.toLowerCase().includes(q) ||
        (s.level2 ?? '').toLowerCase().includes(q)
      );
    });
  }, [search, stations]);
  return { stations: filtered, isLoading, error, mutate };
};

export const useMyStationOperations = (skip: boolean = false) => {
  const { data, error, isLoading, mutate } = useSWR<
    APIFetchResponse<{ results: MyStation[]; totalCount: number }>
  >(skip ? null : constructUrl('/staff-station-operations/mine'));

  const stations: MyStation[] = data?.data?.results ?? [];

  return { stations, isLoading, error, mutate };
};

/**
 * Auto-selects the station when the user has exactly one assignment
 * and no station is currently active. Call once near the top of the
 * authenticated layout.
 */
export const useAutoSelectStation = () => {
  const { stations, isLoading } = useMyStations();
  const { stationId, setStation } = useActiveStation();

  useEffect(() => {
    if (!isLoading && stationId === null && stations.length === 1) {
      setStation(stations[0].id);
    }
  }, [isLoading, stations, stationId]);
};
