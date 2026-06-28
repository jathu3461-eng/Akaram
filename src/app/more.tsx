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
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { articles, events } from '@/data/mock-data';
import { useAppStore } from '@/store/app-store';

export default function MoreScreen() {
  const router = useRouter();
  const { state, login, logout } = useAppStore();
  const { isAuthenticated: isLoggedIn, user } = state;
  const username = user?.name || '';
  const email = user?.email || '';

  // Navigation Modals
  const [activeModal, setActiveModal] = useState<'articles' | 'events' | 'contact' | 'auth' | 'profile' | null>(null);
  
  // Active details
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  // Auth form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleLogin = () => {
    if (!authEmail || !authPassword) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
    const name = authEmail.split('@')[0];
    login({
      id: Math.random().toString(),
      name,
      email: authEmail,
      phone: '',
    });
    setActiveModal('profile');
    Alert.alert('Welcome', `Successfully logged in as ${name}!`);
  };

  const handleRegister = () => {
    if (!authUsername || !authEmail || !authPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    login({
      id: Math.random().toString(),
      name: authUsername,
      email: authEmail,
      phone: '',
    });
    setActiveModal('profile');
    Alert.alert('Registered', 'Your account has been created successfully!');
  };

  const handleContactSubmit = () => {
    if (!contactName || !contactEmail || !contactMsg) {
      Alert.alert('Error', 'Please fill in all form fields.');
      return;
    }
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setActiveModal(null);
    Alert.alert('Thank You', 'Your message has been sent. We will get back to you shortly.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={24} color={Colors.light.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{isLoggedIn ? `Hello, ${username}` : 'Welcome Guest'}</Text>
            <Text style={styles.userSub}>{isLoggedIn ? email : 'Sign in to access your listings & cart'}</Text>
          </View>
          <TouchableOpacity
            style={styles.authBtn}
            onPress={() => setActiveModal(isLoggedIn ? 'profile' : 'auth')}
          >
            <Text style={styles.authBtnText}>{isLoggedIn ? 'View Profile' : 'Login'}</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/news')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#ffe5e5' }]}>
              <Ionicons name="newspaper-outline" size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.gridLabel}>News</Text>
            <Text style={styles.gridDesc}>Latest Updates</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => setActiveModal('articles')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#ffdbcf' }]}>
              <Ionicons name="document-text-outline" size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.gridLabel}>Articles</Text>
            <Text style={styles.gridDesc}>Blogs & Guides</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/events')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#e5f3ff' }]}>
              <Ionicons name="calendar-outline" size={24} color={Colors.light.link} />
            </View>
            <Text style={styles.gridLabel}>Events</Text>
            <Text style={styles.gridDesc}>Community Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/locations')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#e6e5ff' }]}>
              <Ionicons name="map-outline" size={24} color="#6366f1" />
            </View>
            <Text style={styles.gridLabel}>Locations</Text>
            <Text style={styles.gridDesc}>Explore Canada</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/pricing')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#fffbe6' }]}>
              <Ionicons name="pricetag-outline" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.gridLabel}>Pricing</Text>
            <Text style={styles.gridDesc}>Post Ads & Books</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => setActiveModal('contact')}>
            <View style={[styles.gridIconBg, { backgroundColor: '#e6f4ea' }]}>
              <Ionicons name="mail-outline" size={24} color={Colors.light.success} />
            </View>
            <Text style={styles.gridLabel}>Contact Us</Text>
            <Text style={styles.gridDesc}>Get in touch</Text>
          </TouchableOpacity>
        </View>

        {/* Extra helpful links */}
        <View style={styles.linkSection}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/p/about' as any)}>
            <Text style={styles.linkText}>About Us</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/p/privacy' as any)}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/p/terms' as any)}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ARTICLES MODAL */}
      <Modal visible={activeModal === 'articles'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setSelectedArticle(null); setActiveModal(null); }} style={styles.closeButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
              <Text style={styles.closeButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Articles & News</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedArticle ? (
            <ScrollView style={{ padding: Spacing.four }} showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.backLink}>
                <Ionicons name="arrow-back" size={16} color={Colors.light.primary} />
                <Text style={styles.backLinkText}>Back to all articles</Text>
              </TouchableOpacity>
              <Image source={{ uri: selectedArticle.image }} style={styles.articleDetailImage} />
              <Text style={styles.articleDetailTitle}>{selectedArticle.title}</Text>
              <Text style={styles.articleDetailMeta}>By {selectedArticle.author} | Published {selectedArticle.date}</Text>
              <Text style={styles.articleDetailContent}>{selectedArticle.content}</Text>
              <View style={{ height: 40 }} />
            </ScrollView>
          ) : (
            <FlatList
              data={articles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.articleCard} onPress={() => setSelectedArticle(item)}>
                  <Image source={{ uri: item.image }} style={styles.articleImage} />
                  <View style={styles.articleContent}>
                    <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.articleMeta}>{item.date}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ padding: Spacing.four }}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* EVENTS MODAL */}
      <Modal visible={activeModal === 'events'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setSelectedEvent(null); setActiveModal(null); }} style={styles.closeButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
              <Text style={styles.closeButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Events Calendar</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedEvent ? (
            <ScrollView style={{ padding: Spacing.four }} showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.backLink}>
                <Ionicons name="arrow-back" size={16} color={Colors.light.primary} />
                <Text style={styles.backLinkText}>Back to all events</Text>
              </TouchableOpacity>
              <Image source={{ uri: selectedEvent.image }} style={styles.articleDetailImage} />
              <Text style={styles.articleDetailTitle}>{selectedEvent.title}</Text>
              
              <View style={styles.eventInfoBox}>
                <View style={styles.eventInfoRow}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.light.primary} />
                  <Text style={styles.eventInfoVal}>{selectedEvent.date}</Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <Ionicons name="location-outline" size={18} color={Colors.light.primary} />
                  <Text style={styles.eventInfoVal}>{selectedEvent.location}</Text>
                </View>
              </View>

              <Text style={styles.articleDetailContent}>{selectedEvent.description}</Text>
              
              <TouchableOpacity 
                style={styles.addCalendarBtn} 
                onPress={() => Alert.alert('Calendar', 'Event added to your phone calendar successfully!')}
              >
                <Ionicons name="calendar-sharp" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.addCalendarBtnText}>Add to Calendar</Text>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          ) : (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.eventCard} onPress={() => setSelectedEvent(item)}>
                  <Image source={{ uri: item.image }} style={styles.eventImage} />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventMeta}>{item.date}</Text>
                    <Text style={styles.eventLoc} numberOfLines={1}>{item.location}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ padding: Spacing.four }}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* CONTACT US MODAL */}
      <Modal visible={activeModal === 'contact'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
              <Text style={styles.closeButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Contact Us</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={{ padding: Spacing.four }}>
            <Text style={styles.contactLabel}>Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Your Full Name"
              value={contactName}
              onChangeText={setContactName}
            />

            <Text style={styles.contactLabel}>Email Address *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. jathu@example.com"
              keyboardType="email-address"
              value={contactEmail}
              onChangeText={setContactEmail}
            />

            <Text style={styles.contactLabel}>Message *</Text>
            <TextInput
              style={[styles.formInput, { height: 120, textAlignVertical: 'top' }]}
              multiline
              numberOfLines={5}
              placeholder="How can we help you? Write your message here..."
              value={contactMsg}
              onChangeText={setContactMsg}
            />

            <TouchableOpacity style={styles.submitContactBtn} onPress={handleContactSubmit}>
              <Text style={styles.submitContactBtnText}>Submit Message</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* AUTH (LOGIN/REGISTER) MODAL */}
      <Modal visible={activeModal === 'auth'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Akaram Account</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={{ padding: Spacing.five }}>
            <Text style={styles.authMainTitle}>Sign In</Text>
            <Text style={styles.authSubtitle}>Connect to search, post ads, and interact with the directory.</Text>
            
            <Text style={styles.contactLabel}>Email Address</Text>
            <TextInput
              style={styles.formInput}
              placeholder="name@domain.com"
              keyboardType="email-address"
              value={authEmail}
              onChangeText={setAuthEmail}
            />

            <Text style={styles.contactLabel}>Password</Text>
            <TextInput
              style={styles.formInput}
              placeholder="••••••••"
              secureTextEntry
              value={authPassword}
              onChangeText={setAuthPassword}
            />

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.authDivider}>
              <View style={styles.authDividerLine} />
              <Text style={styles.authDividerText}>OR REGISTER</Text>
              <View style={styles.authDividerLine} />
            </View>

            <Text style={styles.contactLabel}>User Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Username"
              value={authUsername}
              onChangeText={setAuthUsername}
            />

            <TouchableOpacity style={[styles.loginBtn, { backgroundColor: Colors.light.primary }]} onPress={handleRegister}>
              <Text style={styles.loginBtnText}>Create Account</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* PROFILE DASHBOARD MODAL */}
      <Modal visible={activeModal === 'profile'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>User Dashboard</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={{ padding: Spacing.four }}>
            <View style={styles.profileBox}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>{username ? username[0].toUpperCase() : 'U'}</Text>
              </View>
              <Text style={styles.profileName}>{username}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>

            <Text style={styles.sectionTitle}>Your Activity</Text>
            <View style={styles.activityBox}>
              <View style={styles.activityRow}>
                <Ionicons name="document-text-outline" size={20} color={Colors.light.primary} />
                <Text style={styles.activityLabel}>My Classified Ads (0)</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityRow}>
                <Ionicons name="bookmark-outline" size={20} color={Colors.light.secondary} />
                <Text style={styles.activityLabel}>Saved Directory Listings (0)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                logout();
                setAuthUsername('');
                setAuthEmail('');
                setAuthPassword('');
                setActiveModal(null);
                Alert.alert('Logged Out', 'You have been logged out.');
              }}
            >
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
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: Spacing.four,
    padding: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffdbcf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  userSub: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  authBtn: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  authBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.three,
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#ffffff',
    width: '47%',
    borderRadius: 16,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  gridIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
  },
  gridDesc: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  linkSection: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.four,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.three,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  backLinkText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  articleImage: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
  },
  articleContent: {
    flex: 1,
    padding: Spacing.three,
    justifyContent: 'center',
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  articleMeta: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  articleDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginBottom: Spacing.three,
  },
  articleDetailTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
    lineHeight: 26,
    marginBottom: Spacing.one,
  },
  articleDetailMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.three,
  },
  articleDetailContent: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  eventImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  eventContent: {
    padding: Spacing.three,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  eventMeta: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  eventLoc: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  eventInfoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.three,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    gap: Spacing.two,
  },
  eventInfoVal: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '500',
  },
  addCalendarBtn: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  addCalendarBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.one,
    marginTop: Spacing.two,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  submitContactBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  submitContactBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  authMainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  authSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.five,
  },
  loginBtn: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  loginBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  authDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.four,
  },
  authDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  authDividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    paddingHorizontal: Spacing.three,
  },
  profileBox: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.four,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffdbcf',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  activityBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.three,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  activityDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: Colors.light.error,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.five,
  },
  logoutBtnText: {
    color: Colors.light.error,
    fontWeight: '700',
    fontSize: 15,
  },
});
