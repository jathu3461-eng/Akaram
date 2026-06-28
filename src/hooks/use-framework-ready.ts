import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const expo: { modules: { ExpoReactNativeFactoryProvider?: { register?: () => void } } } | undefined;

export function useFrameworkReady() {
  useEffect(() => {
    // Required hook for Expo framework initialization
  }, []);
}
