import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppShell,
  Avatar,
  Flex,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { TablerIcon, TablerIconName } from '@/components/TablerIcon';
import { authClient } from '@/lib/api';
import { getNameInitials } from '@/lib/utils';

type SideNavProps = {
  onClose?: () => void;
};

type NavItem = {
  icon: TablerIconName;
  label: string;
  href: string;
  description?: string;
  children: Array<NavItem>;
};

const SideNav: React.FC<SideNavProps> = ({ onClose }) => {
  const location = useLocation();
  const { data: user } = authClient.useSession();

  const renderNavItems = (items: NavItem[], parentPath = '') => {
    return items.map((item, index) => {
      const fullPath = `${parentPath}${item.href ? `/${item.href}` : ''}`;
      const dashboardPath = `/dashboard${fullPath}`;

      // Special handling for root dashboard item
      const isActive =
        item.href === ''
          ? location.pathname === '/dashboard' // Exact match for root
          : location.pathname.startsWith(dashboardPath) &&
            (location.pathname === dashboardPath ||
              location.pathname.startsWith(`${dashboardPath}/`));

      if (item.children && item.children.length > 0) {
        return (
          <NavLink
            key={`${index}-${item.href}`}
            label={item.label}
            description={item.description}
            leftSection={<TablerIcon name={item.icon} size={16} stroke={1.5} />}
            rightSection={<TablerIcon name={'chevronRight'} size={16} stroke={1.5} />}
            childrenOffset={28}
            defaultOpened={
              // isActive
              true
            }
          >
            {renderNavItems(item.children, fullPath)}
          </NavLink>
        );
      }

      return (
        <NavLink
          key={`${index}-${item.href}`}
          component={Link}
          to={`/dashboard${fullPath}`}
          active={isActive}
          label={item.label}
          description={item.description}
          leftSection={<TablerIcon name={item.icon} size={16} stroke={1.5} />}
          // rightSection={<TablerIcon name={'chevronRight'} size={16} stroke={1.5} />}
          onClick={onClose}
        />
      );
    });
  };

  return (
    <>
      <AppShell.Section>
        <Group align={'center'} gap={4} p={'sm'}>
          {user?.user && <Avatar size={'lg'}>{getNameInitials(user?.user?.name)}</Avatar>}
          <Stack gap={0}>
            <Title order={4}>
              <Text variant="gradient" fw={'bold'}>
                {user?.user.name}
              </Text>
            </Title>
            <Text c="dimmed">{user?.user.email}</Text>
          </Stack>
        </Group>
      </AppShell.Section>
      <AppShell.Section grow component={ScrollArea}>
        {renderNavItems(data)}
      </AppShell.Section>
      <AppShell.Section>
        <NavLink
          label="Logout"
          variant="filled"
          leftSection={<TablerIcon name="logout" size={16} stroke={1.5} color="red" />}
          pb={'lg'}
          rightSection={<TablerIcon name="chevronRight" size={16} stroke={1.5} />}
          onClick={async () => {
            onClose?.();
            await authClient.signOut();
          }}
        />
      </AppShell.Section>
    </>
  );
};

export default SideNav;

const data: Array<NavItem> = [
  {
    icon: 'gauge',
    label: 'Dashboard',
    // description: 'Item with description',
    href: '',
    children: [],
  },
  {
    icon: 'clipboardText',
    label: 'Document types',
    // description: 'Manage Document types',
    href: 'document-types',
    children: [],
  },
  {
    icon: 'license',
    label: 'Document',
    description: 'Report lost or found documents',
    href: '',
    children: [
      {
        icon: 'listNumbers',
        label: 'Lost items',
        href: 'lost-documents',
        children: [],
      },
      {
        icon: 'activity',
        label: 'Found items',
        href: 'found-documents',
        children: [],
      },
    ],
  },

  {
    icon: 'settings',
    label: 'Settings',
    href: 'settings',
    description: 'Account settings',

    children: [
      { children: [], href: 'profile', icon: 'user', label: 'Profile' },
      {
        children: [],
        href: 'change-password',
        icon: 'fingerprint',
        label: 'Change Password',
      },
      {
        children: [],
        href: 'two-factor',
        icon: 'lock',
        label: 'Two factor authentication',
      },
      {
        children: [],
        href: 'notificaton',
        icon: 'bell',
        label: 'Notifications',
      },
    ],
  },
  {
    icon: 'components',
    label: 'Components',
    href: 'components',
    children: [
      { children: [], href: 'inputs', icon: 'inputAi', label: 'Inputs' },
      { children: [], href: 'table', icon: 'inputAi', label: 'Table' },
    ],
  },
];
