import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface WebPreviewShellProps {
  children: React.ReactNode;
}

export function WebPreviewShell({ children }: WebPreviewShellProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // On web, we wrap the app in a phone-like frame
  return (
    <View style={styles.webContainer}>
      <View style={styles.mockDeviceFrame}>
        <View style={styles.notch} />
        <View style={styles.deviceScreen}>
          {children}
        </View>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#181c20', // Dark background for the web page body
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  mockDeviceFrame: {
    width: 400,
    height: 850,
    backgroundColor: Colors.light.background,
    borderRadius: 40,
    borderWidth: 12,
    borderColor: '#2e3237',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  notch: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 150,
    height: 30,
    backgroundColor: '#2e3237',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1000,
  },
  deviceScreen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 120,
    height: 5,
    backgroundColor: '#181c20',
    borderRadius: 10,
    zIndex: 1000,
    opacity: 0.2,
  },
});
