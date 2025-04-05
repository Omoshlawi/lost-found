import React, { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/lib/global-store';

type LoginRequiredProps = PropsWithChildren<{
  redirectTo?: string;
}>;
const LoginRequired: FC<LoginRequiredProps> = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated } = useSession();
  const location = useLocation();
  const callbackUrl = location.pathname + location.search;
  const redirectUrl = redirectTo + '?callbackUrl=' + encodeURIComponent(callbackUrl);
  if (!isAuthenticated) {
    return <Navigate to={redirectUrl} />;
  }
  return <>{children}</>;
};

export default LoginRequired;
