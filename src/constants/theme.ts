import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#8b0000',
    primaryContainer: '#ffebeb',
    onPrimary: '#ffffff',
    secondary: '#dc3545',
    secondaryContainer: '#ffcdd2',
    onSecondary: '#ffffff',
    tertiary: '#8c4c00',
    background: '#f7f9ff',
    onBackground: '#181c20',
    surface: '#f7f9ff',
    onSurface: '#181c20',
    surfaceVariant: '#e0e3e8',
    onSurfaceVariant: '#5a4138',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f1f4f9',
    surfaceContainer: '#ebeef3',
    surfaceContainerHigh: '#e5e8ee',
    surfaceContainerHighest: '#e0e3e8',
    text: '#181c20',
    textSecondary: '#616161',
    border: '#ebeef3',
    error: '#ba1a1a',
    success: '#2E7D32',
    link: '#0D6EFD',
    backgroundElement: '#ebeef3',
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
