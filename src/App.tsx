import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ApiConfigProvider } from '@/lib/api';
import { Router } from '@/Router';
import { theme } from '@/theme';

export default function App() {
  return (
    <ApiConfigProvider>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications />
          <Router />
        </ModalsProvider>
      </MantineProvider>
    </ApiConfigProvider>
  );
}
