import { useMemo } from 'react';

const useRoles = () => {
  const roles = useMemo(
    () => [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
    ],
    []
  );

  return { roles };
};

export default useRoles;
