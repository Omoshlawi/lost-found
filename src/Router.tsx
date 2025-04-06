import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Box, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LoginPage, RegisterPage } from '@/features/auth/pages';
import { LoginRequired } from './features/auth/components';
import { useLoadInitialAuthState } from './features/auth/hooks';
import { DashboardLayout } from './features/dashboard/components';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',

    element: (
      <LoginRequired>
        <DashboardLayout />
      </LoginRequired>
    ),
    children: [
      { index: true, element: <div>Dashboard</div> },
      { path: 'items/lost', element: <div>Lost Items</div> },
      { path: 'items/found', element: <div>Found Items</div> },
      { path: 'settings', element: <div>Account settings</div> },
    ],
  },
]);

export function Router() {
  const { isLoading, error } = useLoadInitialAuthState();
  const [visible, { toggle }] = useDisclosure(isLoading);

  if (isLoading) return;

  return (
    <>
      <RouterProvider router={router} />
      <p>{error?.message}</p>
      <Box pos="relative">
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      </Box>
    </>
  );
}
