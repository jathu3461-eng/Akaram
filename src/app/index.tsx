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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { categories, businesses, obituaries, articles, events } from '@/data/mock-data';

const { width } = Dimensions.get('window');

const featuredBusinesses = businesses.slice(0, 4);
const latestObituaries = obituaries.slice(0, 2);
const latestArticles = articles.slice(0, 3);

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    router.push({ pathname: '/directory', params: { q: searchQuery, loc: location } });
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Akaram</Text>
              <Text style={styles.logoDot}>.ca</Text>
            </View>
            <Text style={styles.logoTagline}>Tamil Canadian Directory</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/marketplace')} style={styles.iconButton}>
              <Ionicons name="cart-outline" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Find Local Tamil{'\n'}Businesses in Canada</Text>
            <Text style={styles.heroSubtitle}>
              Connecting culture, community, and business across Canada
            </Text>
          </View>

          {/* Search Card */}
          <View style={styles.searchCard}>
            <View style={styles.inputWrapper}>
              <Ionicons name="search-outline" size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Restaurants, Services, Temples..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="City (e.g. Toronto, Scarborough)"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.8}>
              <Ionicons name="search" size={18} color="#fff" />
              <Text style={styles.searchButtonText}>Search Directory</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>500+</Text>
              <Text style={styles.statLabel}>Businesses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Provinces</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>50k+</Text>
              <Text style={styles.statLabel}>Community</Text>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <TouchableOpacity onPress={() => router.push('/directory')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => router.push({ pathname: '/directory', params: { category: cat.name } })}
                activeOpacity={0.7}
              >
                <View style={styles.categoryIconBg}>
                  <Ionicons name={cat.icon as any} size={22} color={Colors.light.primary} />
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                <Text style={styles.categoryCount}>{cat.count}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Businesses */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Listings</Text>
            <TouchableOpacity onPress={() => router.push('/directory')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>முக்கிய நிறுவனங்கள்</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {featuredBusinesses.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() => router.push({ pathname: '/directory', params: { id: item.id } })}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{item.category}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.cardRow}>
                    <Ionicons name="location-outline" size={12} color={Colors.light.textSecondary} />
                    <Text style={styles.cardLocationText}>{item.location}</Text>
                  </View>
                  <View style={styles.cardRatingRow}>
                    {[1,2,3,4,5].map(i => (
                      <Ionicons key={i} name={i <= Math.floor(item.rating) ? "star" : "star-outline"} size={12} color="#F59E0B" />
                    ))}
                    <Text style={styles.cardRatingText}>{item.rating} ({item.reviews})</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Events Banner */}
        <TouchableOpacity
          style={styles.eventsBanner}
          onPress={() => router.push('/events')}
          activeOpacity={0.9}
        >
          <View style={styles.eventsBannerContent}>
            <View style={styles.eventsBannerIcon}>
              <Ionicons name="calendar" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventsBannerTitle}>Upcoming Events</Text>
              <Text style={styles.eventsBannerSub}>{events.length} events this season</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
          </View>
        </TouchableOpacity>

        {/* Latest Articles */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Articles</Text>
            <TouchableOpacity onPress={() => router.push('/articles')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>பிரபலமான கட்டுரைகள்</Text>
          {latestArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleRow}
              onPress={() => router.push({ pathname: '/articles', params: { id: article.id } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: article.image }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={styles.articleCategory}>{article.category}</Text>
                <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                <View style={styles.articleMeta}>
                  <Ionicons name="time-outline" size={11} color={Colors.light.textSecondary} />
                  <Text style={styles.articleMetaText}>{article.readTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Obituaries / RIP Book */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.ripBookHeader}>
              <Ionicons name="flame" size={18} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}> Recent Obituaries</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/rip-book')}>
              <Text style={styles.seeAllText}>RIP Book</Text>
            </TouchableOpacity>
          </View>
          {latestObituaries.map((obit) => (
            <TouchableOpacity
              key={obit.id}
              style={styles.obituaryRow}
              onPress={() => router.push('/rip-book')}
              activeOpacity={0.85}
            >
              <Image source={{ uri: obit.image }} style={styles.obituaryImage} />
              <View style={styles.obituaryInfo}>
                <Text style={styles.obituaryName}>{obit.name}</Text>
                <Text style={styles.obituaryMeta}>Age: {obit.age} | Passed: {obit.date}</Text>
                <Text style={styles.obituaryHometown}>{obit.hometown}</Text>
                <View style={styles.candleRow}>
                  <Ionicons name="flame" size={13} color={Colors.light.primary} />
                  <Text style={styles.candleText}>{obit.candles} candles lit</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Advertise Banner */}
        <View style={styles.advertiseContainer}>
          <View style={styles.advertiseCard}>
            <View style={styles.advertiseLeft}>
              <Text style={styles.advertiseTitle}>Advertise with Akaram</Text>
              <Text style={styles.advertiseDesc}>உங்கள் வணிகத்தை இணைக்க{'\n'}Promote your business to the Tamil Canadian community.</Text>
              <View style={styles.advertiseButtons}>
                <TouchableOpacity
                  style={styles.advertiseBtn}
                  onPress={() => router.push('/pricing')}
                >
                  <Text style={styles.advertiseBtnText}>List Business</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.advertiseBtn, styles.advertiseBtnOutline]}
                  onPress={() => router.push('/rip-book')}
                >
                  <Text style={[styles.advertiseBtnText, styles.advertiseBtnOutlineText]}>Publish Obituary</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  logoRow: {},
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.primary,
    letterSpacing: -0.5,
  },
  logoDot: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  logoTagline: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 1,
    fontWeight: '500',
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: { padding: 8, borderRadius: 20 },
  heroSection: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroContent: { marginBottom: Spacing.three },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 19,
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: Spacing.three,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 2,
  },
  searchButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  searchButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 12,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionContainer: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ripBookHeader: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.light.text },
  sectionSubtitle: { fontSize: 12, color: Colors.light.textSecondary, marginBottom: Spacing.three, fontStyle: 'italic' },
  seeAllText: { color: Colors.light.primary, fontWeight: '600', fontSize: 13 },
  categoriesScroll: { paddingRight: Spacing.four, paddingBottom: 8 },
  categoryItem: { alignItems: 'center', marginRight: 18, width: 72 },
  categoryIconBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  categoryName: { fontSize: 11, fontWeight: '600', color: Colors.light.text, textAlign: 'center' },
  categoryCount: { fontSize: 10, color: Colors.light.primary, fontWeight: '700' },
  featuredScroll: { paddingRight: Spacing.four, paddingBottom: 8 },
  featuredCard: {
    width: width * 0.62,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 130, backgroundColor: '#f3f4f6' },
  cardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 5, lineHeight: 19 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 3 },
  cardLocationText: { fontSize: 11, color: Colors.light.textSecondary },
  cardRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  cardRatingText: { fontSize: 11, color: Colors.light.text, fontWeight: '600', marginLeft: 4 },
  eventsBanner: {
    marginHorizontal: Spacing.four,
    marginTop: Spacing.four,
    backgroundColor: Colors.light.secondary,
    borderRadius: 18,
    overflow: 'hidden',
  },
  eventsBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  eventsBannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsBannerTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 3 },
  eventsBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  articleRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  articleImage: { width: 90, height: 90, backgroundColor: '#f3f4f6' },
  articleContent: { flex: 1, padding: 12, justifyContent: 'center' },
  articleCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  articleTitle: { fontSize: 13, fontWeight: '700', color: Colors.light.text, lineHeight: 18 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  articleMetaText: { fontSize: 11, color: Colors.light.textSecondary },
  obituaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  obituaryImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: Spacing.three,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  obituaryInfo: { flex: 1 },
  obituaryName: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 3 },
  obituaryMeta: { fontSize: 11, color: Colors.light.textSecondary, marginBottom: 2 },
  obituaryHometown: { fontSize: 11, color: Colors.light.secondary, fontWeight: '600', marginBottom: 4 },
  candleRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  candleText: { fontSize: 11, color: Colors.light.primary, fontWeight: '600' },
  advertiseContainer: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four },
  advertiseCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 22,
    padding: Spacing.four,
    overflow: 'hidden',
  },
  advertiseLeft: {},
  advertiseTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 6 },
  advertiseDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 19, marginBottom: Spacing.three },
  advertiseButtons: { flexDirection: 'row', gap: Spacing.two },
  advertiseBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  advertiseBtnText: { color: Colors.light.primary, fontWeight: '700', fontSize: 13 },
  advertiseBtnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#fff' },
  advertiseBtnOutlineText: { color: '#fff' },
});
