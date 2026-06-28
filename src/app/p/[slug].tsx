import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const staticContent: Record<string, { title: string; content: string }> = {
  about: {
    title: 'About Akaram.ca',
    content: 'Akaram.ca is the premier web directory and community hub for Tamil Canadians across all provinces.\n\nFounded with the mission to connect culture, community, and business, we provide a centralized platform for discovering local Tamil businesses, upcoming cultural events, community news, classified ads, and memorial obituaries.\n\nOur goal is to support local Tamil entrepreneurs, preserve our rich cultural heritage, and strengthen community bonds across Canada.\n\n"Akaram.ca — the one place Tamil Canadians need to connect culture, community, and business."\n\nDeveloped by Ceylon Tech (PVT) Ltd.',
  },
  privacy: {
    title: 'Privacy Policy',
    content: 'We take your privacy seriously. This policy describes what personal information we collect and how we use it.\n\n1. Information Collection\nWe collect information when you register, post an ad, or contact us. This may include your name, email address, phone number, and business details.\n\n2. Information Usage\nYour information is used to personalize your experience, process transactions, improve our services, and send periodic community updates (which you can unsubscribe from at any time).\n\n3. Data Protection\nWe implement industry-standard security measures to maintain the safety of your personal information. We do not sell or share your data with third parties without consent.\n\n4. Cookies\nWe use cookies to improve your browsing experience. You may disable cookies in your browser settings.\n\n5. Contact\nFor privacy concerns, contact us at akaram.ca.',
  },
  terms: {
    title: 'Terms & Conditions',
    content: 'By using Akaram.ca and its mobile application, you agree to these terms and conditions.\n\n1. Acceptable Use\nAll user-generated content (listings, classified ads, obituaries) must comply with local Canadian laws and community standards.\n\n2. Business Listings\nBusiness information must be accurate and up-to-date. We reserve the right to remove inaccurate or inappropriate listings.\n\n3. Classified Ads\nAds must not contain illegal items or misleading information. Free ads are active for 30 days and may be renewed.\n\n4. Obituaries\nObituary notices are permanent. Please ensure all information is accurate before publishing.\n\n5. Liability\nDirectory information is provided "as is". Akaram.ca is not liable for business inaccuracies or user-to-user transactions.\n\n6. Modifications\nWe reserve the right to modify these terms at any time. Continued use of the app constitutes acceptance of updated terms.',
  },
};

export default function StaticPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const pageData = slug && staticContent[slug]
    ? staticContent[slug]
    : { title: 'Page Not Found', content: 'The page you requested could not be found.' };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pageData.title}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.contentText}>{pageData.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.light.text, flex: 1, textAlign: 'center' },
  content: { padding: Spacing.four },
  contentText: { fontSize: 15, lineHeight: 26, color: Colors.light.text },
});
