import { createTheme, MantineColorsTuple } from '@mantine/core';

// Civic Editorial Design System
// Primary: Deep Navy #003b5a  — structural, brand
// Secondary: Sky Blue #006397 — interactive (buttons, links, focus)
// Tertiary: Civic Gold #e8b84b — accent highlights
// Success: Civic Green #1d9e75

export const civicNavy: MantineColorsTuple = [
  '#e8f1f7', // 0 - lightest tint
  '#c8dce9', // 1
  '#97bdd5', // 2
  '#669fc1', // 3
  '#3d82ad', // 4
  '#1d6a9a', // 5
  '#085488', // 6
  '#003b5a', // 7 - brand Deep Navy
  '#002e47', // 8
  '#001f31', // 9 - deepest
];

export const civicBlue: MantineColorsTuple = [
  '#e6f4fc', // 0 - lightest tint
  '#c1e2f5', // 1
  '#8bcaec', // 2
  '#55b1e3', // 3
  '#2f9bd8', // 4
  '#1088cc', // 5
  '#006397', // 6 - brand Sky Blue ← primaryShade
  '#005280', // 7
  '#004068', // 8
  '#002e4f', // 9 - deepest
];

export const civicGold: MantineColorsTuple = [
  '#fdf8ea', // 0
  '#faefca', // 1
  '#f6e094', // 2
  '#f1cf60', // 3
  '#edbe37', // 4
  '#e8b84b', // 5 - brand Civic Gold
  '#d4a43a', // 6
  '#bf8f29', // 7
  '#a87918', // 8
  '#8c620a', // 9
];

export const civicGreen: MantineColorsTuple = [
  '#e6f7f1', // 0
  '#c2eadd', // 1
  '#87d6bf', // 2
  '#4dc2a0', // 3
  '#2eb18a', // 4
  '#1ea678', // 5
  '#1d9e75', // 6 - brand Civic Green
  '#178f68', // 7
  '#107b59', // 8
  '#096145', // 9
];

export const theme = createTheme({
  colors: {
    civicNavy,
    civicBlue,
    civicGold,
    civicGreen,
  },
  primaryColor: 'civicBlue',
  primaryShade: { light: 6, dark: 5 },

  // Civic Editorial typography
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  headings: {
    fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    fontWeight: '700',
  },

  defaultRadius: 0,
});
