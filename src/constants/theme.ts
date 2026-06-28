import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#8b0000',
    primaryContainer: '#ffebeb',
    onPrimary: '#ffffff',
    secondary: '#d4a843',
    secondaryContainer: '#fdf3e7',
    onSecondary: '#ffffff',
    tertiary: '#8c4c00',
    background: '#fff8f0',
    onBackground: '#1a1a2e',
    surface: '#ffffff',
    onSurface: '#1a1a2e',
    surfaceVariant: '#fdf3e7',
    onSurfaceVariant: '#5a4138',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#fdf3e7',
    surfaceContainer: '#fff8f0',
    surfaceContainerHigh: '#f7ede0',
    surfaceContainerHighest: '#f0e6d8',
    text: '#1a1a2e',
    textSecondary: '#6b6b7b',
    border: '#f0e6d8',
    error: '#c0392b',
    success: '#27ae60',
    link: '#8b0000',
    backgroundElement: '#fdf3e7',
    backgroundSelected: '#ffebeb',
  },
  dark: {
    primary: '#ffb4ab',
    primaryContainer: '#690000',
    onPrimary: '#690000',
    secondary: '#ffb4a9',
    secondaryContainer: '#930006',
    onSecondary: '#690002',
    tertiary: '#ffb77b',
    background: '#181c20',
    onBackground: '#eef1f6',
    surface: '#181c20',
    onSurface: '#eef1f6',
    surfaceVariant: '#5a4138',
    onSurfaceVariant: '#e0e3e8',
    surfaceContainerLowest: '#0d1114',
    surfaceContainerLow: '#1c2024',
    surfaceContainer: '#212529',
    surfaceContainerHigh: '#2a2e33',
    surfaceContainerHighest: '#33373c',
    text: '#eef1f6',
    textSecondary: '#a0a4ab',
    border: '#2e3237',
    error: '#ffdad6',
    success: '#81c784',
    link: '#64b5f6',
    backgroundElement: '#212529',
    backgroundSelected: '#802a00',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'Plus Jakarta Sans',
    serif: 'Georgia',
    rounded: 'Plus Jakarta Sans',
    mono: 'Courier New',
  },
  default: {
    sans: 'Plus Jakarta Sans',
    serif: 'serif',
    rounded: 'Plus Jakarta Sans',
    mono: 'monospace',
  },
  web: {
    sans: 'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif',
    serif: 'Georgia, serif',
    rounded: 'Plus Jakarta Sans, sans-serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
