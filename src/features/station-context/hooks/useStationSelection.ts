import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mutate } from 'swr';
import { usePickupStations } from '@/features/custody/hooks/usePickupStations';
import { Station } from '@/features/custody/types';
import { useActiveStation } from '@/hooks/useActiveStation';
import { useMyStations } from '@/hooks/useMyStations';
import {
  clearPreferredStation,
  PREFERRED_STATION_KEY,
  savePreferredStation,
} from '@/hooks/usePreferredStation';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';

export interface SelectableStation {
  id: string;
  code: string;
  name: string;
  level1: string;
  level2?: string | null;
  operations: { id: string; code: string; name: string }[];
}

const toSelectable = (s: Station): SelectableStation => ({
  id: s.id,
  code: s.code,
  name: s.name,
  level1: s.level1,
  level2: s.level2,
  operations: [],
});

export const useStationSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callBackUrl = searchParams.get('callBackUrl');
  const [search, setSearch] = useState('');

  const { hasAccess: isAdmin, isLoading: loadingPermisionCheck } = useUserHasSystemAccess({
    documentOperationType: ['manage'],
  });
  const { stations: myStations, isLoading: myLoading } = useMyStations(search, isAdmin);
  const { stations: allStations, isLoading: allLoading } = usePickupStations({ search }, !isAdmin);
  // Only fetch all stations once we know the user has no grants (admin path)
  const isLoading = myLoading || allLoading || loadingPermisionCheck;

  const stations: SelectableStation[] = isAdmin ? allStations.map(toSelectable) : myStations;

  const { stationId, setStation } = useActiveStation();
  // Pre-select the currently active station when revisiting the page mid-session
  const [selectedId, setSelectedId] = useState<string | null>(stationId ?? null);
  // Checked by default when the settings fetch resolves and a preference is already saved
  const [remember, setRemember] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    if (!selectedId) {
      return;
    }

    setIsSaving(true);
    try {
      // Write into session and update UI immediately
      await setStation(selectedId);

      // Optionally persist as long-term preference
      if (remember) {
        await savePreferredStation(selectedId);
        await mutate(`/settings?key=${encodeURIComponent(PREFERRED_STATION_KEY)}`);
      } else {
        await clearPreferredStation().catch(() => {});
        await mutate(`/settings?key=${encodeURIComponent(PREFERRED_STATION_KEY)}`);
      }

      if (callBackUrl) {
        return navigate(callBackUrl, { replace: true });
      }
      return navigate('/dashboard', { replace: true });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isAdmin,
    stations,
    totalCount: stations.length,
    search,
    setSearch,
    selectedId,
    setSelectedId,
    remember,
    setRemember,
    isSaving,
    handleConfirm,
  };
};
