import React, { ComponentType, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Loader } from '@mantine/core';
import { authClient } from '@/lib/api';
import { TablerIcon } from '../TablerIcon';

// ============================================
// TYPES & INTERFACES
// ============================================

type UnauthenticatedAction =
  | { type: 'redirect'; path: string }
  | { type: 'fallback'; component: ReactNode }
  | { type: 'hide' }
  | { type: 'custom'; handler: () => void };

interface BaseAuthSessionConfig {
  unauthenticatedAction?: UnauthenticatedAction;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode | ((error: any) => ReactNode);
  onAuthenticated?: (session: any, user: any) => void;
  onUnauthenticated?: () => void;
  requireSession?: boolean; // true = must be logged in, false = must be guest
  callbackParamName?: string; // query param name for callback (default: "callbackUrl")
}

export interface AuthenticatedProps extends BaseAuthSessionConfig {
  children: ReactNode | ((session: any, user: any) => ReactNode);
}

export interface HOCAuthSessionConfig extends BaseAuthSessionConfig {
  displayName?: string;
  injectSession?: boolean;
}

interface InjectedSessionProps {
  session?: any;
  user?: any;
}

// ============================================
// DEFAULT FALLBACKS
// ============================================

const DefaultLoadingFallback = () => (
  <Box style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
    <Loader size="sm" />
  </Box>
);

const DefaultErrorFallback = ({ error: _error }: { error: any }) => (
  <Alert color="red" icon={<TablerIcon name="alertCircle" size={16} />}>
    Failed to load session. Please try again.
  </Alert>
);

const DefaultUnauthenticatedFallback = () => (
  <Alert color="yellow" icon={<TablerIcon name="lock" size={16} />}>
    You need to be logged in to access this content.
  </Alert>
);

// ============================================
// AUTHENTICATION LOGIC HOOK
// ============================================

const useAuthenticationCheck = (config: BaseAuthSessionConfig) => {
  const {
    unauthenticatedAction,
    onAuthenticated,
    onUnauthenticated,
    requireSession = true,
    callbackParamName = 'callbackUrl',
  } = config;

  const navigate = useNavigate();
  const location = useLocation();

  const { data, error, isPending } = authClient.useSession();
  const { session, user } = data ?? {};

  const isAuthenticated = !!(session && user);

  useEffect(() => {
    if (isPending) {
      return;
    }

    const shouldBeAuthenticated = requireSession;
    const meetsRequirement = isAuthenticated === shouldBeAuthenticated;

    if (meetsRequirement) {
      if (isAuthenticated) {
        onAuthenticated?.(session, user);
      }
    } else {
      onUnauthenticated?.();

      if (unauthenticatedAction?.type === 'redirect') {
        const currentPath = `${location.pathname}${location.search}`;
        const encodedCallback = encodeURIComponent(currentPath);
        const paramName = encodeURIComponent(callbackParamName);
        const separator = unauthenticatedAction.path.includes('?') ? '&' : '?';
        const redirectTo = `${unauthenticatedAction.path}${separator}${paramName}=${encodedCallback}`;
        navigate(redirectTo, { replace: true });
      } else if (unauthenticatedAction?.type === 'custom') {
        unauthenticatedAction.handler();
      }
    }
  }, [
    isAuthenticated,
    isPending,
    requireSession,
    onAuthenticated,
    onUnauthenticated,
    unauthenticatedAction,
    session,
    user,
    location,
    navigate,
    callbackParamName,
  ]);

  return {
    isAuthenticated,
    session,
    user,
    isLoading: isPending,
    error,
  };
};

// ============================================
// COMPONENT
// ============================================

/**
 * Authenticated wrapper component
 *
 * Controls rendering based on authentication state. Can require users to be
 * logged in or logged out, with customizable behavior for unauthorized access.
 *
 * @example
 * // Require authenticated user
 * <Authenticated>
 *   <DashboardContent />
 * </Authenticated>
 *
 * @example
 * // Redirect unauthenticated users to login
 * <Authenticated
 *   unauthenticatedAction={{ type: "redirect", path: "/login" }}
 * >
 *   <PrivateContent />
 * </Authenticated>
 *
 * @example
 * // Render function with session data
 * <Authenticated>
 *   {(session, user) => (
 *     <div>Welcome, {user.name}!</div>
 *   )}
 * </Authenticated>
 *
 * @example
 * // Require guest (not logged in)
 * <Authenticated
 *   requireSession={false}
 *   unauthenticatedAction={{
 *     type: "fallback",
 *     component: <Text>Already logged in</Text>
 *   }}
 * >
 *   <LoginForm />
 * </Authenticated>
 */
export const Authenticated = ({
  children,
  unauthenticatedAction = {
    type: 'fallback',
    component: <DefaultUnauthenticatedFallback />,
  },
  loadingFallback = <DefaultLoadingFallback />,
  errorFallback = <DefaultErrorFallback error={null} />,
  onAuthenticated,
  onUnauthenticated,
  requireSession = true,
  callbackParamName = 'callbackUrl',
}: AuthenticatedProps) => {
  const { isAuthenticated, session, user, isLoading, error } = useAuthenticationCheck({
    unauthenticatedAction,
    onAuthenticated,
    onUnauthenticated,
    requireSession,
    callbackParamName,
  });

  if (isLoading) {
    return <>{loadingFallback}</>;
  }
  if (error) {
    return <>{typeof errorFallback === 'function' ? errorFallback(error) : errorFallback}</>;
  }

  const meetsRequirement = isAuthenticated === requireSession;

  if (!meetsRequirement) {
    if (unauthenticatedAction.type === 'hide') {
      return null;
    }
    if (unauthenticatedAction.type === 'fallback') {
      return <>{unauthenticatedAction.component}</>;
    }
    return null;
  }

  const content = typeof children === 'function' ? children(session, user) : children;

  return <>{content}</>;
};

// ============================================
// HIGHER ORDER COMPONENT (HOC)
// ============================================

/**
 * Higher Order Component for authentication
 *
 * Wraps a component with authentication checks, optionally injecting
 * session data as props.
 *
 * @example
 * // Basic authentication requirement
 * const Dashboard = () => <div>Dashboard</div>;
 *
 * const ProtectedDashboard = withAuthentication(Dashboard, {
 *   unauthenticatedAction: { type: "redirect", path: "/login" }
 * });
 *
 * @example
 * // Inject session data into component
 * const Profile = ({ session, user }) => (
 *   <div>Hello, {user.name}</div>
 * );
 *
 * const ProfileWithAuth = withAuthentication(Profile, {
 *   injectSession: true,
 *   requireSession: true
 * });
 *
 * @example
 * // Require guest (not logged in)
 * const LoginPage = () => <LoginForm />;
 *
 * const GuestOnlyLogin = withAuthentication(LoginPage, {
 *   requireSession: false,
 *   unauthenticatedAction: { type: "redirect", path: "/dashboard" }
 * });
 */
export function withAuthentication<P extends object>(
  Component: ComponentType<P>,
  config: HOCAuthSessionConfig = {}
) {
  const {
    unauthenticatedAction = {
      type: 'fallback',
      component: <DefaultUnauthenticatedFallback />,
    },
    loadingFallback = <DefaultLoadingFallback />,
    errorFallback = <DefaultErrorFallback error={null} />,
    onAuthenticated,
    onUnauthenticated,
    requireSession = true,
    injectSession = false,
    displayName,
    callbackParamName = 'callbackUrl',
  } = config;

  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, session, user, isLoading, error } = useAuthenticationCheck({
      unauthenticatedAction,
      onAuthenticated,
      onUnauthenticated,
      requireSession,
      callbackParamName,
    });

    if (isLoading) {
      return <>{loadingFallback}</>;
    }
    if (error) {
      return <>{typeof errorFallback === 'function' ? errorFallback(error) : errorFallback}</>;
    }

    const meetsRequirement = isAuthenticated === requireSession;

    if (!meetsRequirement) {
      if (unauthenticatedAction.type === 'hide') {
        return null;
      }
      if (unauthenticatedAction.type === 'fallback') {
        return <>{unauthenticatedAction.component}</>;
      }
      return null;
    }

    const componentProps = injectSession
      ? ({ ...props, session, user } as P & InjectedSessionProps)
      : props;

    return <Component {...componentProps} />;
  };

  AuthenticatedComponent.displayName =
    displayName || `withAuthentication(${Component.displayName || Component.name || 'Component'})`;

  return AuthenticatedComponent;
}
