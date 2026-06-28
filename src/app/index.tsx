import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

import { categories, businesses, obituaries } from '@/data/mock-data';

// Derived mock data for home screen
const featuredBusinesses = businesses.slice(0, 3);
const latestObituaries = obituaries.slice(0, 2);

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    // Navigate to Directory screen with search query parameters
    router.push({
      pathname: '/directory',
      params: { q: searchQuery, loc: location },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Akaram</Text>
            <Text style={styles.logoDot}>.ca</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('/more')} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/marketplace')} style={styles.iconButton}>
              <Ionicons name="cart-outline" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Find Local Tamil Businesses in Canada</Text>
          <Text style={styles.heroSubtitle}>Connecting culture, community, and business in one place.</Text>

          {/* Search Inputs */}
          <View style={styles.searchCard}>
            <View style={styles.inputWrapper}>
              <Ionicons name="search-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="What are you looking for?"
                placeholderTextColor={Colors.light.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color={Colors.light.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="City or Province (e.g. Toronto)"
                placeholderTextColor={Colors.light.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search Directory</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => router.push({ pathname: '/directory', params: { category: category.name } })}
              >
                <View style={styles.categoryIconBg}>
                  <Ionicons name={category.icon as any} size={24} color={Colors.light.primary} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Businesses</Text>
            <TouchableOpacity onPress={() => router.push('/directory')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {featuredBusinesses.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() => router.push({ pathname: '/directory', params: { id: item.id } })}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTag}>{item.category}</Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.cardLocationRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.light.textSecondary} />
                    <Text style={styles.cardLocationText}>{item.location}</Text>
                  </View>
                  <View style={styles.cardRatingRow}>
                    <Ionicons name="star" size={14} color="#FFCC00" />
                    <Text style={styles.cardRatingText}>{item.rating} ({item.reviews} reviews)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Obituaries / RIP Book Snippet */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Obituaries (RIP Book)</Text>
            <TouchableOpacity onPress={() => router.push('/rip-book')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {latestObituaries.map((obituary) => (
            <TouchableOpacity
              key={obituary.id}
              style={styles.obituaryRow}
              onPress={() => router.push({ pathname: '/rip-book', params: { id: obituary.id } })}
            >
              <Image source={{ uri: obituary.image }} style={styles.obituaryImage} />
              <View style={styles.obituaryInfo}>
                <Text style={styles.obituaryName}>{obituary.name}</Text>
                <Text style={styles.obituaryMeta}>Age: {obituary.age} | Passed: {obituary.date}</Text>
                <Text style={styles.obituaryHometown}>Hometown: {obituary.hometown}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradientMock style={styles.banner}>
            <Text style={styles.bannerTitle}>Advertise with Akaram</Text>
            <Text style={styles.bannerDescription}>Promote your business, items, or obituaries to the Canadian Tamil community.</Text>
            <TouchableOpacity style={styles.bannerButton} onPress={() => router.push('/more')}>
              <Text style={styles.bannerButtonText}>Learn More</Text>
            </TouchableOpacity>
          </LinearGradientMock>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Simple linear gradient fallback component
function LinearGradientMock({ children, style }: { children: React.ReactNode; style: any }) {
  return (
    <View style={[style, { backgroundColor: Colors.light.primary }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.secondary,
    fontFamily: 'Plus Jakarta Sans',
  },
  logoDot: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    fontFamily: 'Plus Jakarta Sans',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: Spacing.three,
    padding: Spacing.one,
  },
  heroSection: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: Spacing.two,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#ffdbcf',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.four,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Plus Jakarta Sans',
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.one,
  },
  searchButton: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionContainer: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'Plus Jakarta Sans',
  },
  seeAllText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  categoriesScroll: {
    paddingRight: Spacing.four,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: Spacing.four,
    width: 80,
  },
  categoryIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffdbcf',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  featuredScroll: {
    paddingRight: Spacing.four,
  },
  featuredCard: {
    width: width * 0.65,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  cardContent: {
    padding: Spacing.three,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    marginBottom: Spacing.one,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  cardLocationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  cardRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 4,
  },
  obituaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  obituaryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.three,
    backgroundColor: '#eee',
  },
  obituaryInfo: {
    flex: 1,
  },
  obituaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  obituaryMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  obituaryHometown: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: '500',
  },
  bannerContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  banner: {
    borderRadius: 20,
    padding: Spacing.five,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: Spacing.two,
  },
  bannerDescription: {
    fontSize: 13,
    color: '#ffdbcf',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.four,
  },
  bannerButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
  },
  bannerButtonText: {
    color: Colors.light.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
