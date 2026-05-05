import { useState } from 'react';
import { useActiveStation } from '@/hooks/useActiveStation';
import { useStaffAllowedOperations } from './useCustody';

export const useNewOperationMenu = () => {
  const {
    activeStation,
    stationId: activeStationId,
    isLoading: stationLoading,
  } = useActiveStation();

  const [search, setSearch] = useState('');
  const { operations, isLoading: opTypesLoading } = useStaffAllowedOperations(
    activeStationId ?? '',
    search
  );

  return {
    activeStation,
    activeStationId,
    isLoading: stationLoading || opTypesLoading,
    availableOpTypes: operations,
    standardOpTypes: operations.filter((t) => !t.isHighPrivilege),
    privilegedOpTypes: operations.filter((t) => t.isHighPrivilege),
    filteredOpTypes: operations,
    search,
    setSearch,
  };
};
