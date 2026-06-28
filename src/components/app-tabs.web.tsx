import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, useColorScheme, View, StyleSheet, Text } from 'react-native';

import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

import { Colors, Spacing } from '@/constants/theme';

const TAB_ITEMS = [
  { name: 'index', href: '/', label: 'Home', icon: '🏠' },
  { name: 'directory', href: '/directory', label: 'Directory', icon: '🔍' },
  { name: 'marketplace', href: '/marketplace', label: 'Market', icon: '🛍️' },
  { name: 'rip-book', href: '/rip-book', label: 'RIP Book', icon: '🕯️' },
  { name: 'more', href: '/more', label: 'More', icon: '⋯' },
];

export default function AppTabs() {
  return (
    <View style={styles.webContainer}>
      <View style={styles.phoneFrame}>
        {/* Dynamic Island */}
        <View style={styles.dynamicIsland} />

        <View style={styles.phoneScreen}>
          <Tabs>
            <TabSlot style={{ flex: 1 }} />
            <TabList asChild>
              <CustomTabList>
                {TAB_ITEMS.map((tab) => (
                  <TabTrigger key={tab.name} name={tab.name} href={tab.href as any} asChild>
                    <TabButton icon={tab.icon} label={tab.label} />
                  </TabTrigger>
                ))}
              </CustomTabList>
            </TabList>
          </Tabs>
        </View>
      </View>
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: string; label: string };

export function TabButton({ children, isFocused, icon, label, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabBtn, pressed && styles.pressed]}>
      <View style={[styles.tabBtnInner, isFocused && styles.tabBtnInnerActive]}>
        <Text style={styles.tabIcon}>{icon}</Text>
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.tabListInner}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#E8EDF3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  phoneFrame: {
    width: 390,
    height: 790,
    borderRadius: 50,
    borderWidth: 14,
    borderColor: '#1C1C1E',
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  dynamicIsland: {
    width: 120,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#000',
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    zIndex: 9999,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 36,
    overflow: 'hidden',
  },
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingBottom: 4,
  },
  tabListInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
  },
  tabBtnInner: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 56,
  },
  tabBtnInnerActive: {
    backgroundColor: '#FEF2F2',
  },
  pressed: { opacity: 0.7 },
  tabIcon: { fontSize: 20, marginBottom: 2 },
  tabLabel: { fontSize: 10, fontWeight: '600', color: Colors.light.textSecondary },
  tabLabelActive: { color: Colors.light.primary, fontWeight: '700' },
});
