import { ComponentType } from 'react';
import {
  Authenticated,
  AuthenticatedProps,
  HOCAuthSessionConfig,
  withAuthentication,
} from './Authenticated';
import {
  Authorized,
  AuthorizedProps,
  HOCAuthConfig,
  withAuthorization,
} from './SystemAndOrganizationAccessAcl';

// ============================================
// UTILITY COMPONENTS wrappers
// ============================================

/**
 * System-level authorization component
 * Convenience wrapper for system permissions
 */
export const SystemAuthorized = (props: Omit<AuthorizedProps, 'level'>) => (
  <Authorized {...props} />
);

/**
 * System-level HOC
 * Convenience wrapper for system permissions
 */
export const withSystemAuthorization = <P extends object>(
  Component: ComponentType<P>,
  config: Omit<HOCAuthConfig, 'level'>
) => withAuthorization(Component, { ...config });

/**
 * RequireAuth component
 * Convenience wrapper that requires authentication (requireSession=true)
 */
export const RequireAuth = (props: Omit<AuthenticatedProps, 'requireSession'>) => (
  <Authenticated {...props} requireSession />
);

/**
 * RequireAuth HOC
 * Convenience wrapper for withAuthentication with requireSession=true
 */
export const withRequireAuth = <P extends object>(
  Component: ComponentType<P>,
  config: Omit<HOCAuthSessionConfig, 'requireSession'> = {}
) => withAuthentication(Component, { ...config, requireSession: true });
