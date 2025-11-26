import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/landing/pages';
import {
  AddressesPage,
  AddressHierarchyPage,
  AddressLocalesPage,
} from './features/addresses/pages';
import { DocumentTypesPage } from './features/admin/pages';
import { DocumentCaseDetail, FoundDocumentCasesPage, LostItemsPage } from './features/cases/pages';
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
      {
        path: 'lost-documents',
        element: <Outlet />,
        children: [
          { index: true, element: <LostItemsPage /> },
          { path: ':reportId', element: <DocumentCaseDetail /> },
        ],
      },
      {
        path: 'found-documents',
        element: <Outlet />,
        children: [
          { index: true, element: <FoundDocumentCasesPage /> },
          { path: ':reportId', element: <DocumentCaseDetail /> },
        ],
      },
      { path: 'settings', element: <div>Account settings</div> },
      { path: 'components', element: <UiComponents /> },
      {
        path: 'document-types',
        element: <DocumentTypesPage />,
      },
      {
        path: 'addresses',
        element: <AddressesPage />,
      },
      {
        path: 'address-hierarchy',
        element: <AddressHierarchyPage />,
      },
      {
        path: 'address-locales',
        element: <AddressLocalesPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
