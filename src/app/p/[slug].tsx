import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const staticContent: Record<string, { title: string; content: string }> = {
  about: {
    title: 'About Us',
    content: 'Akaram.ca is the premier web directory and community hub for Tamil Canadians. Founded with the mission to connect culture, community, and business, we provide a centralized platform for discovering local businesses, upcoming events, news, and more.\n\nOur goal is to support local entrepreneurs and preserve our rich cultural heritage across Canada.',
  },
  privacy: {
    title: 'Privacy Policy',
    content: 'We take your privacy seriously. This policy describes what personal information we collect and how we use it.\n\n1. Information Collection: We collect information when you register, post an ad, or subscribe to our newsletter.\n2. Information Usage: Your information is used to personalize your experience, process transactions, and send periodic emails.\n3. Data Protection: We implement a variety of security measures to maintain the safety of your personal information.',
  },
  terms: {
    title: 'Terms & Conditions',
    content: 'By using Akaram.ca and its mobile application, you agree to these terms.\n\n- All user-generated content must comply with local Canadian laws.\n- We reserve the right to remove any inappropriate listings or comments.\n- The directory information is provided "as is" and we are not liable for business inaccuracies.',
  },
};

export default function StaticPage() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const pageData = slug && staticContent[slug] ? staticContent[slug] : { title: 'Page Not Found', content: 'The page you requested could not be found.' };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pageData.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.content}>{pageData.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebeef3',
  },
  backButton: {
    marginRight: Spacing.three,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  container: {
    padding: Spacing.six,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
  },
});
