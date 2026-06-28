import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <View style={styles.webContainer}>
      <View style={styles.phoneFrame}>
        {/* Dynamic Island Notch */}
        <View style={styles.dynamicIsland}>
          <View style={styles.dynamicIslandCamera} />
          <View style={styles.dynamicIslandSensor} />
        </View>

        <View style={styles.phoneScreen}>
          <Tabs>
            <TabSlot style={{ flex: 1 }} />
            <TabList asChild>
              <CustomTabList>
                <TabTrigger name="index" href="/" asChild>
                  <TabButton>Home</TabButton>
                </TabTrigger>
                <TabTrigger name="directory" href="/directory" asChild>
                  <TabButton>Directory</TabButton>
                </TabTrigger>
                <TabTrigger name="marketplace" href="/marketplace" asChild>
                  <TabButton>Market</TabButton>
                </TabTrigger>
                <TabTrigger name="rip-book" href="/rip-book" asChild>
                  <TabButton>RIP Book</TabButton>
                </TabTrigger>
                <TabTrigger name="more" href="/more" asChild>
                  <TabButton>More</TabButton>
                </TabTrigger>
              </CustomTabList>
            </TabList>
          </Tabs>
        </View>
      </View>
    </View>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'primary' : 'textSecondary'} style={isFocused && styles.boldText}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#eef1f6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  phoneFrame: {
    width: 385,
    height: 780,
    borderRadius: 44,
    borderWidth: 12,
    borderColor: '#1e2022',
    backgroundColor: '#1e2022',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  dynamicIsland: {
    width: 110,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#000000',
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dynamicIslandCamera: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1a1a1a',
  },
  dynamicIslandSensor: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0d0d0d',
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#f7f9ff',
    borderRadius: 32,
    overflow: 'hidden',
  },
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.two,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ebeef3',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.three,
    minWidth: 60,
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '700',
  },
});
