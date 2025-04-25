import React from 'react';
import { AppShell, Avatar, Burger, Drawer, Flex, Group, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle, Logo } from '@/components';
import { useSession } from '@/lib/global-store';
import { getNameInitials } from '@/lib/utils';
import SideNav from './SideNav';

const TopNavBar = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const { isAuthenticated, user } = useSession();

  return (
    <>
      <Drawer opened={opened} onClose={close} size={'sm'}>
        <Flex flex={1} direction={'column'} justify={'space-between'} align={'stretch'}>
          <SideNav />
        </Flex>
      </Drawer>
      <AppShell.Header>
        <Flex justify={'space-between'} align={'center'} w={'100%'} h={'100%'} px={'xs'}>
          <AppShell.Section>
            <Flex display={'flex'} gap={'sm'} justify={'center'} align={'center'}>
              <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
              <Logo />
              <Title variant="radiant" order={4} lineClamp={1}>
                <Text
                  inherit
                  variant="gradient"
                  component="span"
                  gradient={{ from: 'pink', to: 'yellow' }}
                >
                  Lost and Found
                </Text>
              </Title>
            </Flex>
          </AppShell.Section>
          <AppShell.Section>
            <Flex display={'flex'} gap={'sm'} justify={'center'} align={'center'}>
              <Avatar>{getNameInitials('Laurent Ouma')}</Avatar>
              <ColorSchemeToggle />
            </Flex>
          </AppShell.Section>
        </Flex>
      </AppShell.Header>
    </>
  );
};

export default TopNavBar;
