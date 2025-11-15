import { useComputedColorScheme, useMantineTheme } from '@mantine/core';

export const useAppColors = () => {
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();
  const bgColor = colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[6];
  const cardColor = colorScheme === 'light' ? theme.white : theme.colors.dark[7];
  return {
    bgColor,
    cardColor,
  };
};
