import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/landing/pages';
import { DocumentTypeForm } from './features/admin/forms';
import { DocumentTypesPage } from './features/admin/pages';
import { DashboardLayout } from './features/dashboard/components';
import { FoundItemsPage, LostItemsPage } from './features/items/pages';
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
      { path: 'items/lost', element: <LostItemsPage /> },
      { path: 'items/found', element: <FoundItemsPage /> },
      { path: 'settings', element: <div>Account settings</div> },
      { path: 'components', element: <UiComponents /> },
      {
        path: 'document-types',
        element: (
          <>
            <Outlet />
          </>
        ),
        children: [
          { index: true, element: <DocumentTypesPage /> },
          { path: 'add', element: <DocumentTypeForm /> },
          { path: ':documentTypeId/update', element: <DocumentTypeForm /> },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
