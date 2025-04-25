import React, { useState } from 'react';
import {
  IconActivity,
  IconChevronRight,
  IconFingerprint,
  IconGauge,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppShell,
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  NavLink,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { authClient } from '@/lib/api';

const SideNav = () => {
  const location = useLocation();

  const items = data.map((item, index) => {
    // Check if current path starts with the dashboard item path
    const isActive =
      item.href === ''
        ? location.pathname === '/dashboard'
        : location.pathname.startsWith(`/dashboard/${item.href}`);

    return (
      <Link
        to={`/dashboard${item.href ? `/${item.href}` : ''}`}
        key={index}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <NavLink
          key={item.label}
          active={isActive}
          label={item.label}
          description={item.description}
          rightSection={<IconChevronRight size={16} stroke={1.5} />}
          leftSection={<item.icon size={16} stroke={1.5} />}
        />
      </Link>
    );
  });

  return (
    <>
      <AppShell.Section>
        <Flex align={'baseline'} gap={'sm'} p={'sm'} style={{}}>
          <Avatar>LO</Avatar>
          <Title order={4}>
            <Text variant="gradient" fw={'bold'}>
              Laurent omondi
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
          leftSection={<IconLogout size={16} stroke={1.5} />}
          pb={'lg'}
          rightSection={<IconChevronRight size={16} stroke={1.5} />}
          onClick={async () => {
            await authClient.signOut({});
          }}
        />
      </AppShell.Section>
    </>
  );
};

export default SideNav;

const data = [
  { icon: IconGauge, label: 'Dashboard', description: 'Item with description', href: '' },
  {
    icon: IconFingerprint,
    label: 'Lost items',
    href: 'items/lost',
  },
  {
    icon: IconActivity,
    label: 'Found items',
    href: 'items/found',
  },
  {
    icon: IconSettings,
    label: 'Account settings',
    href: 'settings',
  },
];
