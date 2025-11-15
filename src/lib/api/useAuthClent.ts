import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({});
const useAuthClent = () => {
  return authClient;
};

export default useAuthClent;
