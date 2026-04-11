import useSWR from 'swr';
import { apiFetch, APIFetchResponse } from '@/lib/api';

/** User setting key; must be saved with `isPublic: true` so non-admin GET /settings can read it. */
export const PREFERRED_STATION_KEY = 'preferred.station.id';

interface SettingRecord {
  key: string;
  value: string;
}

interface SettingsResult {
  results: SettingRecord[];
}

/** Fetch the user's preferred station ID from user settings (long-term preference). */
export const usePreferredStationSetting = () => {
  const { data, isLoading } = useSWR<APIFetchResponse<SettingsResult>>(
    `/settings?key=${encodeURIComponent(PREFERRED_STATION_KEY)}`
  );
  const preferredStationId = data?.data?.results?.[0]?.value ?? null;
  return { preferredStationId, isLoading };
};

/** Write the active station into the session via the extended auth endpoint. */
export const updateSessionStation = (stationId: string | null) =>
  apiFetch('/extended/auth/session', {
    method: 'PATCH',
    data: { stationId },
  });

/** Persist the preferred station in user settings (survives new sessions). */
export const savePreferredStation = (stationId: string) =>
  apiFetch('/settings', {
    method: 'POST',
    data: { key: PREFERRED_STATION_KEY, value: stationId, isPublic: true },
  });

/** Clear the preferred station preference. */
export const clearPreferredStation = () =>
  apiFetch('/settings', {
    method: 'DELETE',
    data: { keyOrPrefix: PREFERRED_STATION_KEY },
  });
