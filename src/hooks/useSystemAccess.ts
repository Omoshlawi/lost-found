import { useMemo } from 'react';
import useSWR from 'swr';
import { apiFetch, APIFetchResponse, authClient, constructUrl } from '@/lib/api';
import { flattenPermisionsObject } from '@/lib/utils';
import { User } from '@/types/auth';

/**
 * System-level permission check hook (Server-side validation)
 *
 * Validates user permissions at the system level using the Better Auth admin plugin.
 * This performs server-side validation to ensure permissions cannot be bypassed by
 * client manipulation. Use this for security-critical checks.
 *
 * @param permissions - Object mapping resources to arrays of required actions
 *                      Example: { user: ['impersonate', 'delete'], category: ['create'] }
 *
 * @returns Object containing:
 *   - hasAccess: boolean - True if user has all specified system-level permissions
 *   - isLoading: boolean - True while the permission check is in progress
 *   - error: any - Error object if the request fails
 *   - mutate: function - SWR mutate function to manually revalidate
 *
 * @example
 * // Check if user can impersonate others (admin-only action)
 * const { hasAccess, isLoading } = useUserHasSystemAccess({
 *   user: ['impersonate']
 * });
 *
 * if (isLoading) return <Loader />;
 *
 * return (
 *   <>
 *     {hasAccess && <ImpersonateUserButton />}
 *   </>
 * );
 *
 * @example
 * // Check multiple system permissions
 * const { hasAccess: canManageSystem } = useUserHasSystemAccess({
 *   user: ['create', 'delete'],
 *   category: ['create', 'delete'],
 *   amenity: ['create', 'delete']
 * });
 *
 * @security
 * - This hook makes a server-side API call to validate permissions
 * - Always use this for security-critical operations (user impersonation, system config)
 * - System-level permissions are typically admin or superadmin only
 * - The backend MUST validate permissions before executing any operations
 *
 * @note
 * - Uses SWR for caching and automatic revalidation
 * - Permissions are checked against the user's system-level role (admin, user, etc.)
 * - Returns false by default if the API call fails or returns no data
 */
export const useUserHasSystemAccess = (permissions: Record<string, Array<string>>) => {
  // Optimization: Skip API call if permissions object is empty
  const hasPermissions = Object.keys(permissions).length > 0;
  const { data: userSession } = authClient.useSession();
  const _permission = useMemo(() => flattenPermisionsObject(permissions).join(','), [permissions]);
  const url = constructUrl(`/auth/admin/has-permission`, {
    permissions: _permission,
    user: userSession?.user?.id,
  });
  const { data, error, isLoading, mutate } = useSWR<APIFetchResponse<{ success: boolean }>>(
    // Only fetch if there are permissions to check
    hasPermissions ? url : null,
    (url_: string) => apiFetch(url_, { method: 'POST', data: { permissions } })
  );

  return {
    isLoading: hasPermissions ? isLoading : false,
    mutate,
    error: hasPermissions ? error : undefined,
    hasAccess: hasPermissions ? (data?.data?.success ?? false) : false,
  };
};

/**
 * System-level permission check utility (Client-side)
 *
 * Checks if a user has system-level permissions by evaluating their roles locally.
 * This is a synchronous, client-side check suitable for UI purposes only.
 *
 * ⚠️ WARNING: This is for UI optimization only (hiding/showing elements, reducing API calls)
 * NEVER rely on this for actual security - always validate permissions server-side!
 *
 * @param user - User object containing role information (or null/undefined)
 * @param permissions - Object mapping resources to arrays of required actions
 *
 * @returns boolean - True if ANY of the user's roles has the required permissions
 *
 * @example
 * // Check if user can see admin menu
 * const user = getCurrentUser();
 * const canAccessAdmin = userHasSystemAccess(user, {
 *   user: ['list', 'view']
 * });
 *
 * {canAccessAdmin && <AdminMenu />}
 *
 * @example
 * // Use in a custom hook
 * function useCanImpersonate() {
 *   const user = useCurrentUser();
 *   return userHasSystemAccess(user, { user: ['impersonate'] });
 * }
 *
 * @security
 * - Client-side only - can be bypassed by modifying JavaScript
 * - Use only for UI optimization (hiding buttons, showing/hiding sections)
 * - Backend MUST re-validate all permissions before executing operations
 * - Useful for reducing unnecessary API calls when permission is clearly denied
 *
 * @implementation
 * - Handles null/undefined users safely (returns false)
 * - Supports comma-separated roles (e.g., "admin,user")
 * - Uses .some() logic: returns true if ANY role has permission
 * - Error-safe: catches and logs errors, returns false on failure
 * - Trims whitespace from role names
 */
export const userHasSystemAccess = (
  user: User | null | undefined,
  permissions: Record<string, Array<string>>
): boolean => {
  // Early return if no user or no role
  if (!user || !user.role) {
    return false;
  }

  try {
    // Split roles and trim whitespace
    const roles = user.role
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    if (roles.length === 0) {
      return false;
    }

    // Check if ANY role has the required permissions (not ALL)
    const hasAccess = roles.some((role) =>
      authClient.admin.checkRolePermission({
        role: role as any,
        permissions,
      })
    );

    return hasAccess;
  } catch (error) {
    // If role parsing or checking fails, deny access
    // eslint-disable-next-line no-console
    console.error('Error checking user access:', error);
    return false;
  }
};

/**
 * System-level permission check hook (Client-side, synchronous)
 *
 * React hook that checks system-level permissions using the current user session.
 * Evaluates permissions locally without making API calls. Suitable for UI purposes only.
 *
 * ⚠️ WARNING: This is for UI optimization only (conditional rendering, optimistic updates)
 * For security-critical checks, use useUserHasSystemAccess which validates server-side!
 *
 * @param permissions - Object mapping resources to arrays of required actions
 *
 * @returns Object containing:
 *   - hasAccess: boolean - True if user has the required system permissions
 *   - isLoading: boolean - True while session is loading
 *   - error: any - Error from session fetch
 *   - mutate: function - Function to manually refetch the session
 *
 * @example
 * // Hide impersonation menu for non-admins (UI only)
 * const { hasAccess, isLoading } = useUserHasSystemAccessSync({
 *   user: ['impersonate']
 * });
 *
 * if (isLoading) return <Skeleton />;
 *
 * return (
 *   <Menu>
 *     {hasAccess && <ImpersonateUser />}
 *   </Menu>
 * );
 *
 * @example
 * // Optimistically hide features before server check
 * const { hasAccess: canManageCategories } = useUserHasSystemAccessSync({
 *   category: ['create', 'delete']
 * });
 *
 * // Still validate on the server when user attempts the action!
 * const handleDelete = async () => {
 *   // Server will re-validate permissions
 *   await deleteCategory(id);
 * };
 *
 * @security
 * - Client-side only - can be bypassed by modifying JavaScript
 * - Use only for UI optimization and better user experience
 * - Backend MUST re-validate all permissions before executing operations
 * - Reduces unnecessary renders and API calls for obviously unauthorized users
 *
 * @performance
 * - Uses useMemo to avoid recalculating on every render
 * - Only recalculates when session or permissions change
 * - No network request - purely local evaluation
 *
 * @note
 * - Returns false while session is loading or if no user is logged in
 * - Automatically updates when session changes
 * - Uses Better Auth's useSession hook under the hood
 */
export const useUserHasSystemAccessSync = (permissions: Record<string, Array<string>>) => {
  const { data: userSession, error, isPending, refetch } = authClient.useSession();

  const hasAccess = useMemo(() => {
    if (!userSession?.user) {
      return false;
    }
    return userHasSystemAccess(userSession.user as User, permissions);
  }, [userSession, permissions]);

  return {
    isLoading: isPending,
    error,
    mutate: refetch,
    hasAccess,
  };
};
