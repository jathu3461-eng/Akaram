import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { articles } from '@/data/mock-data';
import type { Article } from '@/store/app-store';

const articleCategories = ['All', 'Canada Life', 'Food', 'Community', 'Sports', 'எழுதுகோல்'];

export default function ArticlesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(
    params.id ? articles.find(a => a.id === params.id) || null : null
  );
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = articles.filter(a => {
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Articles</Text>
          <Text style={styles.headerSub}>கட்டுரைகள்</Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color={Colors.light.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={articleCategories}
          keyExtractor={i => i}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedCategory === item && styles.filterChipActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.filterChipText, selectedCategory === item && styles.filterChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterScroll}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={Colors.light.border} />
            <Text style={styles.emptyText}>No articles found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.articleCard} onPress={() => setSelectedArticle(item)} activeOpacity={0.85}>
            <Image source={{ uri: item.image }} style={styles.articleImage} />
            <View style={styles.articleContent}>
              <Text style={styles.articleCategory}>{item.category}</Text>
              <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.articleExcerpt} numberOfLines={2}>{item.excerpt}</Text>
              <View style={styles.articleMeta}>
                <Text style={styles.articleAuthor}>{item.author}</Text>
                <View style={styles.metaDot} />
                <Ionicons name="time-outline" size={11} color={Colors.light.textSecondary} />
                <Text style={styles.articleMetaText}>{item.readTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Article Detail Modal */}
      <Modal visible={selectedArticle !== null} animationType="slide" onRequestClose={() => setSelectedArticle(null)}>
        {selectedArticle && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.closeBtn}>
                <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
                <Text style={styles.closeBtnText}>Articles</Text>
              </TouchableOpacity>
              <View style={{ width: 70 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedArticle.image }} style={styles.detailImage} />
              <View style={styles.detailBody}>
                <Text style={styles.detailCategory}>{selectedArticle.category}</Text>
                <Text style={styles.detailTitle}>{selectedArticle.title}</Text>
                <View style={styles.detailMeta}>
                  <Ionicons name="person-outline" size={13} color={Colors.light.textSecondary} />
                  <Text style={styles.detailMetaText}>By {selectedArticle.author}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.detailMetaText}>{selectedArticle.date}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.detailMetaText}>{selectedArticle.readTime}</Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.detailContent}>{selectedArticle.content}</Text>

                {/* Related articles hint */}
                <View style={styles.relatedContainer}>
                  <Text style={styles.relatedTitle}>You might also like / தொடர்புடையவை</Text>
                  {articles.filter(a => a.id !== selectedArticle.id).slice(0, 2).map(a => (
                    <TouchableOpacity
                      key={a.id}
                      style={styles.relatedCard}
                      onPress={() => setSelectedArticle(a)}
                    >
                      <Image source={{ uri: a.image }} style={styles.relatedImage} />
                      <Text style={styles.relatedTitle2} numberOfLines={2}>{a.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
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
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.text, textAlign: 'center' },
  headerSub: { fontSize: 12, color: Colors.light.textSecondary, textAlign: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.light.text },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 10,
  },
  filterScroll: { paddingHorizontal: Spacing.four },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceContainer,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: Colors.light.primary },
  filterChipText: { fontSize: 12, fontWeight: '600', color: Colors.light.textSecondary },
  filterChipTextActive: { color: '#fff' },
  listContainer: { padding: Spacing.three },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  articleImage: { width: 100, height: 100, backgroundColor: '#f3f4f6' },
  articleContent: { flex: 1, padding: 12 },
  articleCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  articleTitle: { fontSize: 13, fontWeight: '700', color: Colors.light.text, lineHeight: 18, marginBottom: 4 },
  articleExcerpt: { fontSize: 11, color: Colors.light.textSecondary, lineHeight: 15, marginBottom: 6 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  articleAuthor: { fontSize: 11, color: Colors.light.textSecondary, fontWeight: '600' },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.light.border },
  articleMetaText: { fontSize: 11, color: Colors.light.textSecondary },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, fontWeight: '700', color: Colors.light.textSecondary, marginTop: 12 },
  modalContainer: { flex: 1, backgroundColor: Colors.light.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  closeBtnText: { fontSize: 15, fontWeight: '600', color: Colors.light.text },
  detailImage: { width: '100%', height: 220, backgroundColor: '#f3f4f6' },
  detailBody: { padding: Spacing.four },
  detailCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  detailTitle: { fontSize: 22, fontWeight: '800', color: Colors.light.text, lineHeight: 29, marginBottom: 12 },
  detailMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5, marginBottom: 16 },
  detailMetaText: { fontSize: 12, color: Colors.light.textSecondary },
  divider: { height: 1, backgroundColor: Colors.light.border, marginBottom: 16 },
  detailContent: { fontSize: 15, color: Colors.light.text, lineHeight: 26 },
  relatedContainer: { marginTop: Spacing.five },
  relatedTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginBottom: 12 },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  relatedImage: { width: 55, height: 55, borderRadius: 8, backgroundColor: '#f3f4f6' },
  relatedTitle2: { flex: 1, fontSize: 12, fontWeight: '600', color: Colors.light.text, lineHeight: 17 },
});
