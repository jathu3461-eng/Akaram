import '@/global.css';

import { Platform } from 'react-native';

// Akaram.ca brand colors - red/maroon Tamil Canadian theme
export const Colors = {
  light: {
    primary: '#C0392B',           // Akaram red
    primaryContainer: '#E74C3C',
    onPrimary: '#ffffff',
    secondary: '#922B21',         // Deep maroon
    secondaryContainer: '#E74C3C',
    onSecondary: '#ffffff',
    tertiary: '#8B0000',
    background: '#F8F9FA',
    onBackground: '#1A1A2E',
    surface: '#FFFFFF',
    onSurface: '#1A1A2E',
    surfaceVariant: '#F0E6E6',
    onSurfaceVariant: '#6B2D2D',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#FEF9F9',
    surfaceContainer: '#F5EDED',
    surfaceContainerHigh: '#EDE0E0',
    surfaceContainerHighest: '#E5D5D5',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    border: '#E8E8E8',
    error: '#DC2626',
    success: '#16A34A',
    link: '#2563EB',
    backgroundElement: '#F5EDED',
    backgroundSelected: '#FDECEA',
    gold: '#F59E0B',
    tamilRed: '#C0392B',
  },
  dark: {
    primary: '#FF6B6B',
    primaryContainer: '#8B0000',
    onPrimary: '#FFFFFF',
    secondary: '#FF8A80',
    secondaryContainer: '#6B0000',
    onSecondary: '#1A0000',
    tertiary: '#FFAB76',
    background: '#0F0F1A',
    onBackground: '#F0F0FF',
    surface: '#1A1A2E',
    onSurface: '#F0F0FF',
    surfaceVariant: '#3D1515',
    onSurfaceVariant: '#F0C0C0',
    surfaceContainerLowest: '#080810',
    surfaceContainerLow: '#141425',
    surfaceContainer: '#1E1E35',
    surfaceContainerHigh: '#282845',
    surfaceContainerHighest: '#323255',
    text: '#F0F0FF',
    textSecondary: '#A0A4B8',
    border: '#2E2E4A',
    error: '#FF6B6B',
    success: '#4ADE80',
    link: '#60A5FA',
    backgroundElement: '#1E1E35',
    backgroundSelected: '#3D1515',
    gold: '#FCD34D',
    tamilRed: '#FF6B6B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier New',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
  },
  web: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    serif: 'Georgia, serif',
    rounded: 'Inter, sans-serif',
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
