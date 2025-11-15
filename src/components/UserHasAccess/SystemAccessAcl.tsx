import { ComponentType, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Loader } from '@mantine/core';
import { useUserHasSystemAccess } from '@/hooks/useSystemAccess';
import { TablerIcon } from '../TablerIcon';

// ============================================
// TYPES & INTERFACES
// ============================================

type UnauthorizedAction =
  | { type: 'redirect'; path: string }
  | { type: 'fallback'; component: ReactNode }
  | { type: 'hide' }
  | { type: 'custom'; handler: () => void };

interface BaseAuthConfig {
  permissions: Record<string, Array<string>>;
  unauthorizedAction?: UnauthorizedAction;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode | ((error: any) => ReactNode);
  onUnauthorized?: () => void;
  onAuthorized?: () => void;
}

export interface AuthorizedProps extends BaseAuthConfig {
  children: ReactNode;
}

export interface HOCAuthConfig extends BaseAuthConfig {
  displayName?: string;
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
    Failed to check permissions. Please try again.
  </Alert>
);

const DefaultUnauthorizedFallback = () => (
  <Alert color="yellow" icon={<TablerIcon name="lock" size={16} />}>
    You don't have permission to access this content.
  </Alert>
);

// ============================================
// AUTHORIZATION LOGIC HOOK
// ============================================

/**
 * Internal hook that handles authorization logic
 * Consolidates permission checking
 */
const useAuthorizationCheck = (config: BaseAuthConfig) => {
  const { permissions, unauthorizedAction, onUnauthorized, onAuthorized } = config;
  const navigate = useNavigate();

  // Replace with your actual system access hook
  const { hasAccess, isLoading, error, mutate } = useUserHasSystemAccess(permissions);

  // Handle authorization state changes
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (hasAccess) {
      onAuthorized?.();
    } else {
      onUnauthorized?.();

      // Handle unauthorized actions
      if (unauthorizedAction?.type === 'redirect') {
        navigate(unauthorizedAction.path);
      } else if (unauthorizedAction?.type === 'custom') {
        unauthorizedAction.handler();
      }
    }
  }, [hasAccess, isLoading, onAuthorized, onUnauthorized, unauthorizedAction, navigate]);

  return { hasAccess, isLoading, error, mutate };
};

// ============================================
// COMPONENT
// ============================================

/**
 * Authorization wrapper component
 *
 * Wraps children with authorization checks.
 */
export const Authorized = ({
  children,
  permissions,
  unauthorizedAction = {
    type: 'fallback',
    component: <DefaultUnauthorizedFallback />,
  },
  loadingFallback = <DefaultLoadingFallback />,
  errorFallback = <DefaultErrorFallback error={null} />,
  onUnauthorized,
  onAuthorized,
}: AuthorizedProps) => {
  const { hasAccess, isLoading, error } = useAuthorizationCheck({
    permissions,
    unauthorizedAction,
    onUnauthorized,
    onAuthorized,
  });

  // Handle loading state
  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  // Handle error state
  if (error) {
    return <>{typeof errorFallback === 'function' ? errorFallback(error) : errorFallback}</>;
  }

  // Handle unauthorized state
  if (!hasAccess) {
    if (unauthorizedAction.type === 'hide') {
      return null;
    }
    if (unauthorizedAction.type === 'fallback') {
      return <>{unauthorizedAction.component}</>;
    }
    // For redirect and custom, the effect handles it
    return null;
  }

  // Render authorized content
  return <>{children}</>;
};

// ============================================
// HIGHER ORDER COMPONENT
// ============================================

/**
 * Higher Order Component for authorization
 *
 * Wraps a component with authorization logic, checking permissions before rendering.
 */
export function withAuthorization<P extends object>(
  Component: ComponentType<P>,
  config: HOCAuthConfig
) {
  const {
    permissions,
    unauthorizedAction = {
      type: 'fallback',
      component: <DefaultUnauthorizedFallback />,
    },
    loadingFallback = <DefaultLoadingFallback />,
    errorFallback = <DefaultErrorFallback error={null} />,
    onUnauthorized,
    onAuthorized,
    displayName,
  } = config;

  const AuthorizedComponent = (props: P) => {
    const { hasAccess, isLoading, error } = useAuthorizationCheck({
      permissions,
      unauthorizedAction,
      onUnauthorized,
      onAuthorized,
    });

    // Handle loading state
    if (isLoading) {
      return <>{loadingFallback}</>;
    }

    // Handle error state
    if (error) {
      return <>{typeof errorFallback === 'function' ? errorFallback(error) : errorFallback}</>;
    }

    // Handle unauthorized state
    if (!hasAccess) {
      if (unauthorizedAction.type === 'hide') {
        return null;
      }
      if (unauthorizedAction.type === 'fallback') {
        return <>{unauthorizedAction.component}</>;
      }
      // For redirect and custom, the effect handles it
      return null;
    }

    // Render authorized component
    return <Component {...props} />;
  };

  // Set display name for better debugging
  AuthorizedComponent.displayName =
    displayName || `withAuthorization(${Component.displayName || Component.name || 'Component'})`;

  return AuthorizedComponent;
}
