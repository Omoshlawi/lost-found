import React, { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authClient } from '@/lib/api';

type LoginRequiredProps = PropsWithChildren<{
  redirectTo?: string;
}>;
const LoginRequired: FC<LoginRequiredProps> = ({ children, redirectTo = '/login' }) => {
  const { data, isPending, error } = authClient.useSession();
  const location = useLocation();
  const callbackUrl = location.pathname + location.search;
  const redirectUrl = redirectTo + '?callbackUrl=' + encodeURIComponent(callbackUrl);
  if (!data && !isPending) {
    return <Navigate to={redirectUrl} />;
  }
  return <>{children}</>;
};

export default LoginRequired;
