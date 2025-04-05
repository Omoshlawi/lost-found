import '@mantine/core/styles.css';

import { AppShell, Avatar, Burger, Flex, MantineProvider, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle } from '@/components';
import { ApiConfigProvider } from '@/lib/api';
import { useSession } from '@/lib/global-store';
import { getNameInitials } from '@/lib/utils';
import { Router } from '@/Router';
import { theme } from '@/theme';

export default function App() {


  return (
    <MantineProvider theme={theme}>
      <ApiConfigProvider>
        
        <Router />
      </ApiConfigProvider>
    </MantineProvider>
  );
}
