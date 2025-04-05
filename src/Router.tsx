import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/auth/pages';
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

    element: <DashboardLayout />,
    children: [
      { index: true, element: <div>Dashboard</div> },
      { path: 'items/lost', element: <div>Lost Items</div> },
      { path: 'items/found', element: <div>Found Items</div> },
      { path: 'settings', element: <div>Account settings</div> },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
