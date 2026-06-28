import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { businesses, categories, events, articles } from '@/data/mock-data';

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'businesses' | 'events' | 'articles'>('businesses');

  const filtered = businesses.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSub}>Discover Tamil businesses, events & articles</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search everything..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {(['businesses', 'events', 'articles'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'businesses' && (
        <FlatList
          data={searchQuery ? filtered : businesses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            !searchQuery ? (
              <View>
                {/* Categories */}
                <Text style={styles.sectionTitle}>Browse by Category</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categories}
                  keyExtractor={(c) => c.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.catChip}
                      onPress={() => router.push({ pathname: '/directory', params: { category: item.name } })}
                    >
                      <Ionicons name={item.icon as any} size={14} color={Colors.light.primary} />
                      <Text style={styles.catChipText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.catsScroll}
                />
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>All Businesses</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => router.push({ pathname: '/directory', params: { id: item.id } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.resultImage} />
              <View style={styles.resultContent}>
                <View style={styles.resultBadgeRow}>
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>{item.category}</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={12} color={Colors.light.textSecondary} />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {activeTab === 'events' && (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={() => router.push('/events')}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <Text style={styles.eventCategory}>{item.category}</Text>
                <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.eventMeta}>
                  <Ionicons name="calendar-outline" size={13} color={Colors.light.primary} />
                  <Text style={styles.eventMetaText}>{item.date}</Text>
                  <Text style={styles.eventMetaDot}>·</Text>
                  <Ionicons name="location-outline" size={13} color={Colors.light.textSecondary} />
                  <Text style={styles.eventMetaText} numberOfLines={1}>{item.location.split(',')[0]}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {activeTab === 'articles' && (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.articleCard}
              onPress={() => router.push({ pathname: '/articles', params: { id: item.id } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={styles.articleCat}>{item.category}</Text>
                <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.articleMeta}>
                  <Text style={styles.articleAuthor}>{item.author}</Text>
                  <Text style={styles.articleDot}>·</Text>
                  <Text style={styles.articleRead}>{item.readTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.light.text },
  headerSub: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 2 },
  searchContainer: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 8,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.light.text },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingHorizontal: Spacing.three,
    paddingBottom: 0,
  },
  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 4,
  },
  tabBtnActive: { borderBottomColor: Colors.light.primary },
  tabBtnText: { fontSize: 14, fontWeight: '600', color: Colors.light.textSecondary },
  tabBtnTextActive: { color: Colors.light.primary },
  listContainer: { padding: Spacing.three },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginBottom: 10 },
  catsScroll: { paddingBottom: 6 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  catChipText: { fontSize: 12, fontWeight: '600', color: Colors.light.primary },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  resultImage: { width: 90, height: 90, backgroundColor: '#f3f4f6' },
  resultContent: { flex: 1, padding: 10, justifyContent: 'center' },
  resultBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  catBadge: { backgroundColor: '#FEF2F2', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  catBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.light.primary, textTransform: 'uppercase' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 11, fontWeight: '700', color: Colors.light.text },
  resultName: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { fontSize: 11, color: Colors.light.textSecondary },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  eventImage: { width: 100, height: 90, backgroundColor: '#f3f4f6' },
  eventContent: { flex: 1, padding: 12, justifyContent: 'center' },
  eventCategory: { fontSize: 10, fontWeight: '700', color: Colors.light.primary, textTransform: 'uppercase', marginBottom: 4 },
  eventTitle: { fontSize: 13, fontWeight: '700', color: Colors.light.text, lineHeight: 18, marginBottom: 8 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  eventMetaText: { fontSize: 11, color: Colors.light.textSecondary, fontWeight: '500', flex: 1, minWidth: 0 },
  eventMetaDot: { color: Colors.light.border, fontSize: 14 },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  articleImage: { width: 90, height: 90, backgroundColor: '#f3f4f6' },
  articleContent: { flex: 1, padding: 12, justifyContent: 'center' },
  articleCat: { fontSize: 10, fontWeight: '700', color: Colors.light.primary, textTransform: 'uppercase', marginBottom: 4 },
  articleTitle: { fontSize: 13, fontWeight: '700', color: Colors.light.text, lineHeight: 18, marginBottom: 8 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  articleAuthor: { fontSize: 11, color: Colors.light.textSecondary },
  articleDot: { color: Colors.light.border },
  articleRead: { fontSize: 11, color: Colors.light.textSecondary },
});
