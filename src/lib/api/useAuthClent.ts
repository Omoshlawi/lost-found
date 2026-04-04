import { adminClient, jwtClient, twoFactorClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [adminClient(), usernameClient(), jwtClient(), twoFactorClient()],
});
const useAuthClent = () => {
  return authClient;
};

export default useAuthClent;
