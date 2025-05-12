// utils/reportUtils.ts
import { MantineTheme } from '@mantine/core';

export const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getUrgencyColor = (level: string | undefined, colorScheme: 'dark' | 'light') => {
  if (!level) return 'blue';

  switch (level.toUpperCase()) {
    case 'HIGH':
      return colorScheme === 'dark' ? 'red.7' : 'red';
    case 'MEDIUM':
      return colorScheme === 'dark' ? 'orange.7' : 'orange';
    case 'LOW':
      return colorScheme === 'dark' ? 'green.7' : 'green';
    default:
      return 'blue';
  }
};

export const getStatusColor = (status: string | undefined, colorScheme: 'dark' | 'light') => {
  if (!status) return 'blue';

  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return colorScheme === 'dark' ? 'green.7' : 'green';
    case 'RESOLVED':
      return colorScheme === 'dark' ? 'blue.7' : 'blue';
    case 'EXPIRED':
      return colorScheme === 'dark' ? 'gray.6' : 'gray';
    default:
      return colorScheme === 'dark' ? 'yellow.7' : 'yellow';
  }
};

export const getBackgroundColor = (
  color: string,
  theme: MantineTheme,
  colorScheme: 'dark' | 'light'
) => {
  if (colorScheme === 'dark') {
    switch (color) {
      case 'blue':
        return theme.colors.blue[9] + '15'; // Using hex opacity
      case 'green':
        return theme.colors.green[9] + '15';
      case 'orange':
        return theme.colors.orange[9] + '15';
      case 'gray':
      default:
        return theme.colors.gray[9] + '15';
    }
  } else {
    // Light theme
    switch (color) {
      case 'blue':
        return theme.colors.blue[0];
      case 'green':
        return theme.colors.green[0];
      case 'orange':
        return theme.colors.orange[0];
      case 'gray':
      default:
        return theme.colors.gray[0];
    }
  }
};
