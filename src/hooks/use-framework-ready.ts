import { useEffect } from 'react';

declare const expo: { modules: { ExpoReactNativeFactoryProvider?: { register?: () => void } } } | undefined;

export function useFrameworkReady() {
  useEffect(() => {
    // Required hook for Expo framework initialization
  }, []);
}
