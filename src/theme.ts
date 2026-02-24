import { createTheme, MantineColorsTuple } from '@mantine/core';

export const citizenNavy: MantineColorsTuple = [
  '#edf3fb',
  '#dbe4f1',
  '#b4c6db',
  '#8ba7c6',
  '#688cb3',
  '#4f7aa6',
  '#4170a0',
  '#24416b', // Brand color
  '#2a4b79',
  '#1f3b61',
];

export const citizenTeal: MantineColorsTuple = [
  '#ebfdee',
  '#d8f4e0',
  '#aae5c2',
  '#79d6a2',
  '#4fc886',
  '#33bf72',
  '#20b965',
  '#52b788', // Brand color
  '#0d8445',
  '#01753a',
];

export const theme = createTheme({
  colors: {
    citizenNavy,
    citizenTeal,
  },
  primaryColor: 'citizenNavy',
});
