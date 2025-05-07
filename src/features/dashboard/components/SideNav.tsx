import { Link, useLocation } from 'react-router-dom';
import { AppShell, Avatar, Flex, NavLink, ScrollArea, Text, Title } from '@mantine/core';
import {
  getAllTablerIconNames,
  getTablerIconCategories,
  TablerIcon,
  TablerIconName,
} from '@/components/TablerIcon';
import { authClient } from '@/lib/api';
import { getNameInitials } from '@/lib/utils';

const SideNav = () => {
  const location = useLocation();
  const { data: user } = authClient.useSession();
  const items = data.map((item, index) => {
    // Check if current path starts with the dashboard item path
    const isActive =
      item.href === ''
        ? location.pathname === '/dashboard'
        : location.pathname.startsWith(`/dashboard/${item.href}`);

    return (
      <NavLink
        key={index}
        style={{ textDecoration: 'none', color: 'inherit' }}
        to={`/dashboard${item.href ? `/${item.href}` : ''}`}
        component={Link}
        active={isActive}
        label={item.label}
        description={item.description}
        rightSection={<TablerIcon name={'chevronRight'} size={16} stroke={1.5} />}
        leftSection={<TablerIcon name={item.icon} size={16} stroke={1.5} />}
      />
    );
  });

  return (
    <>
      <AppShell.Section>
        <Flex align={'baseline'} gap={'sm'} p={'sm'}>
          {user?.user && <Avatar size={'md'}>{getNameInitials(user?.user?.name)}</Avatar>}
          <Title order={4}>
            <Text variant="gradient" fw={'bold'}>
              {user?.user.name}
            </Text>
          </Title>
        </Flex>
      </AppShell.Section>
      <AppShell.Section grow component={ScrollArea}>
        {items}
      </AppShell.Section>
      <AppShell.Section>
        <NavLink
          label="Logout"
          variant="filled"
          leftSection={<TablerIcon name="logout" size={16} stroke={1.5} color="red" />}
          pb={'lg'}
          rightSection={<TablerIcon name="chevronRight" size={16} stroke={1.5} />}
          onClick={async () => {
            await authClient.signOut();
          }}
        />
      </AppShell.Section>
    </>
  );
};

export default SideNav;

const data: Array<{ icon: TablerIconName; label: string; href: string; description?: string }> = [
  { icon: 'gauge', label: 'Dashboard', description: 'Item with description', href: '' },
  {
    icon: 'clipboardText',
    label: 'Document types',
    description: 'Manage Document types',
    href: 'document-types',
  },
  {
    icon: 'fingerprint',
    label: 'Lost items',
    href: 'lost-documents',
  },
  {
    icon: 'activity',
    label: 'Found items',
    href: 'found-documents',
  },
  {
    icon: 'settings',
    label: 'Account settings',
    href: 'settings',
  },
  {
    icon: 'components',
    label: 'Components',
    href: 'components',
  },
];
