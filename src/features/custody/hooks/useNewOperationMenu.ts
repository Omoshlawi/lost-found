import { useMemo, useState } from 'react';
import { useActiveStation } from '@/hooks/useActiveStation';
import { useAllowedOperations } from '../hooks/useCustody';
import { DocumentOperationType } from '../types';

export const useNewOperationMenu = () => {
  const {
    activeStation,
    stationId: activeStationId,
    isLoading: stationLoading,
  } = useActiveStation();

  const { allowedOperations, isLoading: opTypesLoading } = useAllowedOperations(
    activeStationId ?? undefined
  );

  const [search, setSearch] = useState('');

  const filteredOpTypes = useMemo<DocumentOperationType[]>(() => {
    if (!search.trim()) {
      return allowedOperations;
    }
    const q = search.toLowerCase();
    return allowedOperations.filter(
      (t) => t.name.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q)
    );
  }, [allowedOperations, search]);

  return {
    activeStation,
    activeStationId,
    isLoading: stationLoading || opTypesLoading,
    availableOpTypes: allowedOperations,
    standardOpTypes: filteredOpTypes.filter((t) => !t.isHighPrivilege),
    privilegedOpTypes: filteredOpTypes.filter((t) => t.isHighPrivilege),
    filteredOpTypes,
    search,
    setSearch,
  };
};
