import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import {
  AboutUsPage,
  ContactUsPage,
  ForgotPasswordPage,
  HowItWorksPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  TwoFactorVerifyPage,
} from '@/features/landing/pages';
import {
  AddressesPage,
  AddressHierarchyPage,
  AddressLocalesPage,
} from './features/addresses/pages';
import { DocumentTypesPage, TransitionReasonsPage } from './features/admin/pages';
import { DocumentCaseDetail, DocumentCasesPage } from './features/cases/pages';
import { ClaimDetailPage, ClaimsPage } from './features/claims/pages';
import { MatchDetailPage, MatchesPage } from './features/matches/pages';
import { DashboardLayout } from './features/dashboard/components';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { AuthLayout, LoginRequired } from './features/landing/components';
import LandingLayout from './features/landing/pages/LandingLayout';
import { SettingsPage } from './features/settings';
import { TemplateDetailPage, TemplatesPage } from './features/templates/pages';
import UiComponents from './features/ui/UiComponents';
import { UserDetailPage, UsersPage } from './features/users/pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
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
      {
        path: '/two-factor-verify',
        element: <TwoFactorVerifyPage />,
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
      { index: true, element: <DashboardPage /> },
      {
        path: 'cases',
        element: <Outlet />,
        children: [
          { index: true, element: <DocumentCasesPage /> },
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
      {
        path: 'matches',
        element: <Outlet />,
        children: [
          { index: true, element: <MatchesPage /> },
          { path: ':matchId', element: <MatchDetailPage /> },
        ],
      },
      { path: 'components', element: <UiComponents /> },
      {
        path: 'document-types',
        element: <DocumentTypesPage />,
      },
      {
        path: 'status-transition-reasons',
        element: <TransitionReasonsPage />,
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
      {
        path: 'templates',
        element: <Outlet />,
        children: [
          { index: true, element: <TemplatesPage /> },
          { path: ':id', element: <TemplateDetailPage /> },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
