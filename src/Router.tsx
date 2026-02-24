import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import {
  AboutUsPage,
  ContactUsPage,
  ForgotPasswordPage,
  HowItWorksPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from '@/features/landing/pages';
import {
  AddressesPage,
  AddressHierarchyPage,
  AddressLocalesPage,
} from './features/addresses/pages';
import { DocumentTypesPage } from './features/admin/pages';
import { DocumentCaseDetail, FoundDocumentCasesPage, LostItemsPage } from './features/cases/pages';
import { ClaimDetailPage, ClaimsPage } from './features/claims/pages';
import { DashboardLayout } from './features/dashboard/components';
import { AuthLayout, LoginRequired } from './features/landing/components';
import LandingLayout from './features/landing/pages/LandingLayout';
import { SettingsPage } from './features/settings';
import UiComponents from './features/ui/UiComponents';
import { UserDetailPage, UsersPage } from './features/users/pages';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/about',
        element: <AboutUsPage />,
      },
      {
        path: '/how-it-works',
        element: <HowItWorksPage />,
      },
      {
        path: '/contact',
        element: <ContactUsPage />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
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
      {
        path: 'settings',
        element: <SettingsPage />,
        children: [{ path: ':tab', element: <SettingsPage /> }],
      },
      {
        path: 'claims',
        element: <Outlet />,
        children: [
          { index: true, element: <ClaimsPage /> },
          { path: ':claimId', element: <ClaimDetailPage /> },
        ],
      },
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
      {
        path: 'users',
        element: <Outlet />,
        children: [
          { index: true, element: <UsersPage /> },
          { path: ':id', element: <UserDetailPage /> },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
