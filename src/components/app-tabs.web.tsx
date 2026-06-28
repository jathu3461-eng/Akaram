import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/theme';

const TAB_ITEMS = [
  { name: 'index', href: '/', label: 'Home', icon: '🏠' },
  { name: 'directory', href: '/directory', label: 'Directory', icon: '🔍' },
  { name: 'marketplace', href: '/marketplace', label: 'Market', icon: '🛍' },
  { name: 'rip-book', href: '/rip-book', label: 'RIP Book', icon: '🕯' },
  { name: 'more', href: '/more', label: 'More', icon: '☰' },
];

export default function AppTabs() {
  return (
    <View style={styles.webBg}>
      {/* Background decoration */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Phone device frame */}
      <View style={styles.device}>
        {/* Side buttons */}
        <View style={styles.sideButtonLeft1} />
        <View style={styles.sideButtonLeft2} />
        <View style={styles.sideButtonLeft3} />
        <View style={styles.sideButtonRight} />

        {/* Screen */}
        <View style={styles.screen}>
          {/* Status bar row */}
          <View style={styles.statusBar}>
            <Text style={styles.statusTime}>9:41</Text>
            <View style={styles.dynamicIsland} />
            <View style={styles.statusIcons}>
              <Text style={styles.statusIcon}>●●●</Text>
              <Text style={styles.statusIcon}>WiFi</Text>
              <Text style={styles.statusIcon}>⬛</Text>
            </View>
          </View>

          {/* App content */}
          <View style={styles.appContent}>
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

          {/* Home indicator */}
          <View style={styles.homeIndicatorBar}>
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>

      {/* Brand label below phone */}
      <View style={styles.brandRow}>
        <Text style={styles.brandLabel}>Akaram.ca</Text>
        <Text style={styles.brandDot}> · </Text>
        <Text style={styles.brandSub}>Tamil Canadian Directory</Text>
      </View>
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: string; label: string };

export function TabButton({ isFocused, icon, label, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabBtn, pressed && { opacity: 0.6 }]}>
      <View style={[styles.tabBtnInner, isFocused && styles.tabBtnInnerActive]}>
        <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>{icon}</Text>
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]} numberOfLines={1}>
          {label}
        </Text>
        {isFocused && <View style={styles.tabDot} />}
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabBar}>
      <View style={styles.tabBarInner}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  webBg: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  bgCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(192,57,43,0.12)',
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(146,43,33,0.08)',
    bottom: -60,
    left: -60,
  },
  device: {
    width: 393,
    height: 852,
    borderRadius: 54,
    backgroundColor: '#0D0D0D',
    borderWidth: 12,
    borderColor: '#2C2C2C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.6,
    shadowRadius: 60,
    elevation: 20,
    overflow: 'visible',
    position: 'relative',
  },
  sideButtonLeft1: {
    position: 'absolute',
    left: -15,
    top: 100,
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: '#3A3A3A',
  },
  sideButtonLeft2: {
    position: 'absolute',
    left: -15,
    top: 152,
    width: 4,
    height: 64,
    borderRadius: 2,
    backgroundColor: '#3A3A3A',
  },
  sideButtonLeft3: {
    position: 'absolute',
    left: -15,
    top: 230,
    width: 4,
    height: 64,
    borderRadius: 2,
    backgroundColor: '#3A3A3A',
  },
  sideButtonRight: {
    position: 'absolute',
    right: -15,
    top: 170,
    width: 4,
    height: 80,
    borderRadius: 2,
    backgroundColor: '#3A3A3A',
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 43,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  statusBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    backgroundColor: Colors.light.background,
    zIndex: 10,
  },
  statusTime: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    width: 60,
  },
  dynamicIsland: {
    width: 126,
    height: 37,
    borderRadius: 20,
    backgroundColor: '#000',
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -63,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 60,
    justifyContent: 'flex-end',
  },
  statusIcon: {
    fontSize: 8,
    color: Colors.light.text,
  },
  appContent: { flex: 1 },
  homeIndicatorBar: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1A1A2E',
    opacity: 0.2,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    paddingBottom: 2,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingTop: 6,
    paddingHorizontal: 2,
  },
  tabBtn: { flex: 1, alignItems: 'center' },
  tabBtnInner: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 14,
    minWidth: 54,
  },
  tabBtnInnerActive: { backgroundColor: '#FEF2F2' },
  tabIcon: { fontSize: 22, marginBottom: 2 },
  tabIconActive: {},
  tabLabel: { fontSize: 9, fontWeight: '600', color: '#8E8E93' },
  tabLabelActive: { color: Colors.light.primary, fontWeight: '700' },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
    marginTop: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  brandLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  brandDot: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  brandSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
});
