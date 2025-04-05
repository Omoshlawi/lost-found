import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { ApiConfigProvider } from '@/lib/api';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ApiConfigProvider>
        <Router />
      </ApiConfigProvider>
    </MantineProvider>
  );
}
