import React, { ComponentType, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/api';
import { Authenticated } from './Authenticated';

// ==================================================
// TYPES
// ==================================================

export interface RequireGuestProps {
  /** Query param name for callback URL (default: "callbackUrl") */
  callbackParamName?: string;

  /** Fallback path if no callback URL is present */
  afterAuthRedirect?: string;

  /** Child content */
  children?: React.ReactNode;
}

interface WithRequireGuestOptions {
  /** Query parameter name for the callback URL (default: "callbackUrl") */
  callbackParamName?: string;

  /** Default redirect if no callback is present (default: "/dashboard") */
  afterAuthRedirect?: string;
}

// ==================================================
// COMPONENT
// ==================================================

/**
 * RequireGuest component
 *
 * Ensures content only renders when the user is NOT authenticated.
 * If authenticated, redirects to callback URL or fallback path.
 *
 * @example
 * // Basic usage
 * <RequireGuest>
 *   <LoginForm />
 * </RequireGuest>
 *
 * @example
 * // Custom callback parameter and redirect
 * <RequireGuest
 *   callbackParamName="next"
 *   afterAuthRedirect="/profile"
 * >
 *   <SignupForm />
 * </RequireGuest>
 */
export const RequireGuest = ({
  callbackParamName = 'callbackUrl',
  afterAuthRedirect = '/dashboard',
  children,
}: RequireGuestProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = authClient.useSession();
  const { session, user } = data ?? {};
  const isAuthenticated = !!(session && user);

  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(location.search);
      const callbackUrl = params.get(callbackParamName);
      const redirectTo = callbackUrl ? decodeURIComponent(callbackUrl) : afterAuthRedirect;

      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, location.search, navigate, callbackParamName, afterAuthRedirect]);

  // If user is already authenticated, do not render login content
  if (isAuthenticated) {
    return null;
  }

  return <Authenticated requireSession={false}>{children}</Authenticated>;
};

// ==================================================
// HIGHER ORDER COMPONENT
// ==================================================

/**
 * Higher Order Component version of RequireGuest.
 *
 * Wraps a component and ensures it only renders if the user is NOT authenticated.
 * If authenticated, it redirects them to the provided callback URL (or fallback).
 *
 * @example
 * const LoginPage = () => <LoginForm />;
 *
 * export default withRequireGuest(LoginPage, {
 *   callbackParamName: "next",
 *   afterAuthRedirect: "/profile"
 * });
 */
export function withRequireGuest<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithRequireGuestOptions = {}
) {
  const { callbackParamName = 'callbackUrl', afterAuthRedirect = '/dashboard' } = options;

  const RequireGuestWrapper = (props: P) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { data } = authClient.useSession();
    const { session, user } = data ?? {};
    const isAuthenticated = !!(session && user);

    useEffect(() => {
      if (isAuthenticated) {
        const params = new URLSearchParams(location.search);
        const callbackUrl = params.get(callbackParamName);
        const redirectTo = callbackUrl ? decodeURIComponent(callbackUrl) : afterAuthRedirect;

        navigate(redirectTo, { replace: true });
      }
    }, [isAuthenticated, location.search, navigate, callbackParamName, afterAuthRedirect]);

    if (isAuthenticated) {
      return null;
    }

    return (
      <Authenticated requireSession={false}>
        <WrappedComponent {...props} />
      </Authenticated>
    );
  };

  RequireGuestWrapper.displayName = `withRequireGuest(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return RequireGuestWrapper;
}
