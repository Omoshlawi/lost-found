import React from 'react';
import { AppShell, Avatar, Burger, Drawer, Flex, Group, Text, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ColorSchemeToggle, Logo } from '@/components';
import { authClient } from '@/lib/api';
import { useSession } from '@/lib/global-store';
import { getNameInitials } from '@/lib/utils';
import SideNav from './SideNav';
import UserActionsMenu from './UserActionsMenu';

const TopNavBar = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const { data } = authClient.useSession();
  const isMobile = useMediaQuery('(max-width: 50em)');

  return (
    <>
      <Drawer opened={opened} onClose={close} size={'sm'}>
        <Flex flex={1} direction={'column'} justify={'space-between'} align={'stretch'}>
          <SideNav />
        </Flex>
      </Drawer>
      <AppShell.Header>
        <Flex justify={'space-between'} align={'center'} w={'100%'} h={'100%'} px={'xs'}>
          {isMobile && <Burger opened={opened} onClick={toggle} size="sm" />}
          <Logo />
          <Group>
            <ColorSchemeToggle />
            <UserActionsMenu />
          </Group>
        </Flex>
      </AppShell.Header>
    </>
  );
};

export default TopNavBar;
