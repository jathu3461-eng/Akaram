import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const plans = [
  {
    id: 'p1',
    title: 'Business Listing',
    subtitle: 'வணிக பட்டியல்',
    price: '$99',
    period: '/year',
    color: Colors.light.primary,
    icon: 'storefront-outline',
    features: [
      'Premium Directory Placement',
      'Add up to 10 photos',
      'Link to website & social media',
      'Customer reviews enabled',
      'Phone & email contact button',
    ],
    buttonText: 'List Your Business',
  },
  {
    id: 'p2',
    title: 'Publish Obituary',
    subtitle: 'மரண அறிவித்தல்',
    price: '$50',
    period: '/post',
    color: Colors.light.secondary,
    icon: 'flame-outline',
    features: [
      'Permanent RIP Book placement',
      'Condolence messages enabled',
      'Virtual candle lighting',
      'Shareable memorial link',
      'Photo gallery included',
    ],
    buttonText: 'Publish an Obituary',
  },
  {
    id: 'p3',
    title: 'Classified Ad',
    subtitle: 'விளம்பரம்',
    price: 'Free',
    period: '',
    color: Colors.light.success,
    icon: 'megaphone-outline',
    features: [
      'Post to Marketplace',
      'Upload item photos',
      'Buyer contact form',
      'Active for 30 days',
      'Renew for free',
    ],
    buttonText: 'Post a Free Ad',
  },
];

export default function PricingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Pricing & Plans</Text>
          <Text style={styles.headerSub}>விளம்பர திட்டங்கள்</Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Grow your reach</Text>
          <Text style={styles.heroSubtitle}>
            Connect with 50,000+ Tamil Canadians across all provinces.{'\n'}
            கனடா தமிழர்களை சென்றடையுங்கள்.
          </Text>
        </View>

        {plans.map((plan) => (
          <View key={plan.id} style={[styles.planCard, { borderTopColor: plan.color, borderTopWidth: 4 }]}>
            <View style={styles.planHeader}>
              <View style={[styles.planIconBg, { backgroundColor: plan.color + '20' }]}>
                <Ionicons name={plan.icon as any} size={24} color={plan.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                {plan.period ? <Text style={styles.planPeriod}>{plan.period}</Text> : null}
              </View>
            </View>
            <View style={styles.featuresList}>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={plan.color} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: plan.color }]}
              onPress={() => Alert.alert(plan.title, `Contact us at akaram.ca to ${plan.buttonText.toLowerCase()}.`)}
            >
              <Text style={styles.actionBtnText}>{plan.buttonText}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.contactBanner}>
          <Text style={styles.contactBannerTitle}>Need help? Contact us</Text>
          <Text style={styles.contactBannerText}>akaram.ca — Developed by Ceylon Tech</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.four,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.text, textAlign: 'center' },
  headerSub: { fontSize: 12, color: Colors.light.textSecondary, textAlign: 'center' },
  container: { padding: Spacing.four },
  heroSection: {
    backgroundColor: Colors.light.primary,
    borderRadius: 22,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20 },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.three, gap: 12 },
  planIconBg: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  planTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.text },
  planSubtitle: { fontSize: 12, color: Colors.light.textSecondary },
  priceBox: { alignItems: 'flex-end' },
  planPrice: { fontSize: 30, fontWeight: '800' },
  planPeriod: { fontSize: 13, color: Colors.light.textSecondary },
  featuresList: { marginBottom: Spacing.three },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  featureText: { fontSize: 14, color: Colors.light.text },
  actionBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  contactBanner: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 16,
    padding: Spacing.four,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  contactBannerTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginBottom: 4 },
  contactBannerText: { fontSize: 12, color: Colors.light.textSecondary },
});
