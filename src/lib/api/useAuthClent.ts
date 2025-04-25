import { createAuthClient } from 'better-auth/react';
import { BASE_URL, restBaseUrl } from '@/constants';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: `${BASE_URL}`,
});
const useAuthClent = () => {
  return authClient;
};

export default useAuthClent;
