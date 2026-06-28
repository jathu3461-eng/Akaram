import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';

export default function MoreScreen() {
  const router = useRouter();
  const { state, login, logout } = useAppStore();
  const { isAuthenticated: isLoggedIn, user } = state;

  const [activeModal, setActiveModal] = useState<'contact' | 'auth' | 'profile' | null>(null);

  // Auth form
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // Contact form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleLogin = () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
    const name = authEmail.split('@')[0];
    login({ id: Date.now().toString(), name, email: authEmail, phone: '' });
    setActiveModal('profile');
    setAuthEmail(''); setAuthPassword('');
  };

  const handleRegister = () => {
    if (!authUsername.trim() || !authEmail.trim() || !authPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    login({ id: Date.now().toString(), name: authUsername, email: authEmail, phone: '' });
    setActiveModal('profile');
    setAuthUsername(''); setAuthEmail(''); setAuthPassword('');
    Alert.alert('Welcome!', 'Your account has been created successfully.');
  };

  const handleContactSubmit = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) {
      Alert.alert('Error', 'Please fill in all form fields.');
      return;
    }
    setContactName(''); setContactEmail(''); setContactMsg('');
    setActiveModal(null);
    Alert.alert('Sent!', 'Your message has been sent. We will get back to you shortly.');
  };

  const menuItems = [
    {
      icon: 'newspaper-outline',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      label: 'News & Updates',
      desc: 'Latest Tamil Canadian news',
      action: () => router.push('/news'),
    },
    {
      icon: 'document-text-outline',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      label: 'Articles',
      desc: 'Tamil & English articles',
      action: () => router.push('/articles'),
    },
    {
      icon: 'calendar-outline',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      label: 'Events Calendar',
      desc: 'Community events',
      action: () => router.push('/events'),
    },
    {
      icon: 'map-outline',
      iconBg: '#FDF4FF',
      iconColor: '#9333EA',
      label: 'Locations',
      desc: 'Explore cities in Canada',
      action: () => router.push('/locations'),
    },
    {
      icon: 'pricetag-outline',
      iconBg: '#FFF7ED',
      iconColor: '#EA580C',
      label: 'Pricing & Plans',
      desc: 'Advertise with Akaram',
      action: () => router.push('/pricing'),
    },
    {
      icon: 'mail-outline',
      iconBg: '#F0FDF4',
      iconColor: Colors.light.success,
      label: 'Contact Us',
      desc: 'எங்களை தொடர்பு கொள்ள',
      action: () => setActiveModal('contact'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            {isLoggedIn ? (
              <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase()}</Text>
            ) : (
              <Ionicons name="person-outline" size={22} color={Colors.light.primary} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>
              {isLoggedIn ? `Hello, ${user?.name}` : 'Welcome Guest'}
            </Text>
            <Text style={styles.userSub}>
              {isLoggedIn ? user?.email : 'Sign in to access your listings & cart'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.authBtn}
            onPress={() => setActiveModal(isLoggedIn ? 'profile' : 'auth')}
          >
            <Text style={styles.authBtnText}>{isLoggedIn ? 'Dashboard' : 'Login'}</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore More</Text>
        </View>
        <View style={styles.menuGrid}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.gridItem} onPress={item.action} activeOpacity={0.8}>
              <View style={[styles.gridIconBg, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
              <Text style={styles.gridDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Links */}
        <View style={styles.linkSection}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          {[
            { label: 'About Akaram.ca', slug: 'about' },
            { label: 'Privacy Policy', slug: 'privacy' },
            { label: 'Terms of Service', slug: 'terms' },
          ].map((item) => (
            <TouchableOpacity
              key={item.slug}
              style={styles.linkRow}
              onPress={() => router.push(`/p/${item.slug}` as any)}
            >
              <Text style={styles.linkText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL('https://akaram.ca')}
          >
            <Text style={styles.linkText}>Visit akaram.ca website</Text>
            <Ionicons name="open-outline" size={16} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Akaram.ca — Tamil Canadian Directory</Text>
          <Text style={styles.footerSub}>© 2026 akaram.ca | Developed by Ceylon Tech</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CONTACT MODAL */}
      <Modal visible={activeModal === 'contact'} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
              <Ionicons name="chevron-back" size={22} color={Colors.light.text} />
              <Text style={styles.closeButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Contact Us</Text>
            <View style={{ width: 50 }} />
          </View>
          <ScrollView style={{ padding: Spacing.four }}>
            <Text style={styles.contactIntro}>
              எங்களை தொடர்பு கொள்ள{'\n'}akaram.ca Tamil Canadian web directory தொடர்பான கேள்விகளுக்கு எங்களை நாடுங்கள்.
            </Text>
            {[
              { label: 'Your Name *', val: contactName, set: setContactName, placeholder: 'Full Name', type: undefined },
              { label: 'Email Address *', val: contactEmail, set: setContactEmail, placeholder: 'name@example.com', type: 'email-address' as const },
            ].map((f) => (
              <View key={f.label}>
                <Text style={styles.formLabel}>{f.label}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={f.placeholder}
                  keyboardType={f.type}
                  value={f.val}
                  onChangeText={f.set}
                />
              </View>
            ))}
            <Text style={styles.formLabel}>Message *</Text>
            <TextInput
              style={[styles.formInput, { height: 120, textAlignVertical: 'top' }]}
              multiline numberOfLines={5}
              placeholder="How can we help you?"
              value={contactMsg}
              onChangeText={setContactMsg}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleContactSubmit}>
              <Text style={styles.submitBtnText}>Send Message</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* AUTH MODAL */}
      <Modal visible={activeModal === 'auth'} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Akaram Account</Text>
            <View style={{ width: 30 }} />
          </View>
          <ScrollView style={{ padding: Spacing.four }}>
            {/* Tabs */}
            <View style={styles.authTabs}>
              <TouchableOpacity
                style={[styles.authTab, !isRegister && styles.authTabActive]}
                onPress={() => setIsRegister(false)}
              >
                <Text style={[styles.authTabText, !isRegister && styles.authTabTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authTab, isRegister && styles.authTabActive]}
                onPress={() => setIsRegister(true)}
              >
                <Text style={[styles.authTabText, isRegister && styles.authTabTextActive]}>Register</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.authMainTitle}>
              {isRegister ? 'Create Account' : 'Sign In'}
            </Text>
            <Text style={styles.authSubtitle}>
              {isRegister
                ? 'Join the Tamil Canadian community directory.'
                : 'Access your listings, saved businesses, and more.'}
            </Text>

            {isRegister && (
              <>
                <Text style={styles.formLabel}>Username</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Your name"
                  value={authUsername}
                  onChangeText={setAuthUsername}
                />
              </>
            )}
            <Text style={styles.formLabel}>Email Address</Text>
            <TextInput
              style={styles.formInput}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={authEmail}
              onChangeText={setAuthEmail}
            />
            <Text style={styles.formLabel}>Password</Text>
            <TextInput
              style={styles.formInput}
              placeholder="••••••••"
              secureTextEntry
              value={authPassword}
              onChangeText={setAuthPassword}
            />
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={isRegister ? handleRegister : handleLogin}
            >
              <Text style={styles.submitBtnText}>{isRegister ? 'Create Account' : 'Log In'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.switchAuthBtn}
              onPress={() => setIsRegister(!isRegister)}
            >
              <Text style={styles.switchAuthText}>
                {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* PROFILE MODAL */}
      <Modal visible={activeModal === 'profile'} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>My Dashboard</Text>
            <View style={{ width: 30 }} />
          </View>
          <ScrollView style={{ padding: Spacing.four }}>
            <View style={styles.profileBox}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{user?.name?.[0]?.toUpperCase() ?? 'U'}</Text>
              </View>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>

            <Text style={styles.sectionTitle}>Your Activity</Text>
            <View style={styles.activityBox}>
              <View style={styles.activityRow}>
                <Ionicons name="document-text-outline" size={20} color={Colors.light.primary} />
                <Text style={styles.activityLabel}>My Classified Ads</Text>
                <Text style={styles.activityCount}>0</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityRow}>
                <Ionicons name="bookmark-outline" size={20} color={Colors.light.secondary} />
                <Text style={styles.activityLabel}>Saved Listings</Text>
                <Text style={styles.activityCount}>{state.savedListings.length}</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityRow}>
                <Ionicons name="bag-outline" size={20} color={Colors.light.success} />
                <Text style={styles.activityLabel}>Cart Items</Text>
                <Text style={styles.activityCount}>{state.cart.reduce((a, b) => a + b.quantity, 0)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                logout();
                setActiveModal(null);
                Alert.alert('Logged Out', 'You have been logged out successfully.');
              }}
            >
              <Ionicons name="log-out-outline" size={18} color={Colors.light.error} />
              <Text style={styles.logoutBtnText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: Spacing.three,
    padding: Spacing.three,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: Colors.light.primary },
  userName: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  userSub: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 2 },
  authBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  authBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  sectionHeader: {
    paddingHorizontal: Spacing.three,
    paddingTop: 4,
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.light.text },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.two,
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 18,
    padding: Spacing.three,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  gridIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridLabel: { fontSize: 14, fontWeight: '700', color: Colors.light.text },
  gridDesc: { fontSize: 11, color: Colors.light.textSecondary, marginTop: 2 },
  linkSection: { paddingHorizontal: Spacing.three, paddingTop: 10 },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  linkText: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  footerText: { fontSize: 13, fontWeight: '600', color: Colors.light.text, textAlign: 'center' },
  footerSub: { fontSize: 11, color: Colors.light.textSecondary, marginTop: 4, textAlign: 'center' },
  modalContainer: { flex: 1, backgroundColor: Colors.light.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  closeButtonText: { fontSize: 15, fontWeight: '600', color: Colors.light.text },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  contactIntro: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
  },
  formLabel: { fontSize: 13, fontWeight: '700', color: Colors.light.text, marginBottom: 5, marginTop: 12 },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.light.text,
  },
  submitBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  authTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surfaceContainer,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  authTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  authTabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  authTabText: { fontSize: 14, fontWeight: '600', color: Colors.light.textSecondary },
  authTabTextActive: { color: Colors.light.primary, fontWeight: '700' },
  authMainTitle: { fontSize: 24, fontWeight: '800', color: Colors.light.text, marginBottom: 6 },
  authSubtitle: { fontSize: 13, color: Colors.light.textSecondary, lineHeight: 19, marginBottom: 16 },
  switchAuthBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  switchAuthText: { fontSize: 13, color: Colors.light.primary, fontWeight: '600' },
  profileBox: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  profileAvatarText: { fontSize: 28, fontWeight: '800', color: Colors.light.primary },
  profileName: { fontSize: 20, fontWeight: '700', color: Colors.light.text },
  profileEmail: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 4 },
  activityBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  activityLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.light.text },
  activityCount: { fontSize: 15, fontWeight: '800', color: Colors.light.primary },
  activityDivider: { height: 1, backgroundColor: Colors.light.border },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.light.error,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutBtnText: { color: Colors.light.error, fontWeight: '700', fontSize: 15 },
});
