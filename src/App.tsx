import '@mantine/core/styles.css';

import { ApiConfigProvider } from '@/lib/api';
import { Router } from '@/Router';
import { theme } from '@/theme';
import { MantineProvider } from '@mantine/core';

export default function App() {

  return (
    <MantineProvider theme={theme}>
      <ApiConfigProvider>
        <Router />
      </ApiConfigProvider>
    </MantineProvider>
  );
}
