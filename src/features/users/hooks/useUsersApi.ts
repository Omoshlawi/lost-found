import { authClient } from '@/lib/api';
import { apiFetch } from '@/lib/api/apiFetch';
import useApi from '@/lib/api/useApi';
import { BanUserPayload, User, UserRolePayload, UserSession } from '../types';

export const useUsersApi = () => {
  const getUsers = async () => {
    return apiFetch<{ users: User[] }>('/auth/admin/list-users');
  };

  const getUserSessions = async (userId: string) => {
    return apiFetch<{ sessions: UserSession[] }>('/auth/admin/list-user-sessions', {
      method: 'POST',
      data: { userId },
    });
  };

  const setRole = async (payload: UserRolePayload) => {
    return authClient.admin.setRole(payload as { userId: string; role: 'admin' | 'user' });
  };

  const banUser = async (payload: BanUserPayload) => {
    return authClient.admin.banUser(payload);
  };

  const unbanUser = async (userId: string) => {
    return authClient.admin.unbanUser({ userId });
  };

  const revokeUserSession = async (sessionToken: string) => {
    return authClient.admin.revokeUserSession({ sessionToken });
  };

  const revokeAllUserSessions = async (userId: string) => {
    return authClient.admin.revokeUserSessions({ userId });
  };

  const removeUser = async (userId: string) => {
    return authClient.admin.removeUser({ userId });
  };

  return {
    getUsers,
    getUserSessions,
    setRole,
    banUser,
    unbanUser,
    revokeUserSession,
    revokeAllUserSessions,
    removeUser,
  };
};

export const useUsers = () => {
  const { getUsers } = useUsersApi();
  const fetcher = async (_url: string) => {
    const res = await getUsers();
    return res.data;
  };
  const { data, ...rest } = useApi<{ users: User[] }>('/auth/admin/list-users', fetcher);

  return {
    users: data?.users || [],
    ...rest,
  };
};

export const useUserSessions = (userId: string) => {
  const { getUserSessions } = useUsersApi();
  const fetcher = async () => {
    const res = await getUserSessions(userId);
    return res.data;
  };
  const { data, ...rest } = useApi<{ sessions: UserSession[] }>(
    userId ? `/auth/admin/list-user-sessions/${userId}` : null,
    fetcher
  );

  return {
    sessions: data?.sessions || [],
    ...rest,
  };
};
