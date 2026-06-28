import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const plans = [
  {
    title: 'Business Listing',
    price: '$99',
    period: '/year',
    features: ['Premium Directory Placement', 'Add up to 10 photos', 'Link to website & social media', 'Receive reviews'],
    buttonText: 'List Your Business',
  },
  {
    title: 'Publish Obituary',
    price: '$50',
    period: '/post',
    features: ['Permanent placement in RIP Book', 'Condolence messages enabled', 'Candle lighting feature', 'Shareable link'],
    buttonText: 'Publish an Obituary',
  },
];

export default function PricingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing & Submissions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Grow your reach</Text>
          <Text style={styles.subtitle}>Choose the right plan to connect with the Tamil Canadian community.</Text>
        </View>

        {plans.map((plan, index) => (
          <View key={index} style={styles.planCard}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPeriod}>{plan.period}</Text>
            </View>
            <View style={styles.featuresList}>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>{plan.buttonText}</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    padding: Spacing.four,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: Spacing.six,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: Spacing.six,
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: '#ebeef3',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.four,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  planPeriod: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: Spacing.six,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  featureText: {
    fontSize: 15,
    color: Colors.light.text,
    marginLeft: Spacing.two,
  },
  actionBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.three,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
