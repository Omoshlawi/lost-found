import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/landing/pages';
import { DashboardLayout } from './features/dashboard/components';
import { LoginRequired } from './features/landing/components';
import LandingLayout from './features/landing/pages/LandingLayout';
import UiComponents from './features/ui/UiComponents';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
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
      { path: 'components', element: <UiComponents /> },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
