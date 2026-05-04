import { useEffect } from 'react';
import useSWR from 'swr';
import { Station } from '@/features/custody/types';
import { APIFetchResponse, constructUrl } from '@/lib/api';
import { useActiveStation } from './useActiveStation';

export const useMyStations = (search: string = '') => {
  const { data, error, isLoading, mutate } = useSWR<
    APIFetchResponse<{ results: Station[]; totalCount: number }>
  >(constructUrl('/pickup-stations/assigned', { search }));

  const stations = data?.data?.results ?? [];

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
