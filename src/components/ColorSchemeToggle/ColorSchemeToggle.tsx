import { useCallback } from 'react';
import {
  IconAdjustments,
  IconBrightnessAutoFilled,
  IconBrightnessDownFilled,
  IconMoonFilled,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Group,
  MantineColorScheme,
  useMantineColorScheme,
} from '@mantine/core';

export function ColorSchemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const toggleTheme = useCallback(() => {
    switch (colorScheme) {
      case 'light':
        setColorScheme('dark');
        break;
      case 'dark':
        setColorScheme('auto');
        break;
      default:
        setColorScheme('light');
    }
  }, [setColorScheme, colorScheme]);

  return (
    <ActionIcon
      variant="outline"
      aria-label="Theme Settings"
      onClick={toggleTheme}
      size={'lg'}
      radius={'xl'}
    >
      {colorScheme === 'dark' && (
        <IconMoonFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
      )}
      {colorScheme === 'light' && (
        <IconBrightnessDownFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
      )}
      {colorScheme === 'auto' && (
        <IconBrightnessAutoFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
      )}
    </ActionIcon>
  );

  return (
    <Group justify="center" mt="xl">
      <Button onClick={() => setColorScheme('light')}>Light</Button>
      <Button onClick={() => setColorScheme('dark')}>Dark</Button>
      <Button onClick={() => setColorScheme('auto')}>Auto</Button>
    </Group>
  );
}
