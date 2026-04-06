import useSWR from 'swr';
import { APIFetchResponse, authClient, constructUrl } from '@/lib/api';
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

type UserFilters = { limit?: number; offset?: number; searchValue?: string };

export const useUsers = (filters: UserFilters = {}) => {
  const url = constructUrl(
    '/auth/admin/list-users',
    filters as Record<string, string | number | undefined>
  );
  const fetcher = async (fetchUrl: string) => {
    const res = await apiFetch<{ users: User[]; total: number }>(fetchUrl);
    return res.data;
  };
  const { data, ...rest } = useApi<{ users: User[]; total: number }>(url, fetcher);

  return {
    users: data?.users ?? [],
    totalCount: data?.total ?? 0,
    ...rest,
  };
};

export const useUser = (userId?: string) => {
  const url = userId ? constructUrl(`/auth/admin/get-user`, { id: userId }) : null;
  const { data, ...rest } = useSWR<APIFetchResponse<User>>(url);

  return {
    user: data?.data,
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
