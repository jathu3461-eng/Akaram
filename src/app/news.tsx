import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { articles } from '@/data/mock-data';

export default function NewsScreen() {
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
          <Text style={styles.headerTitle}>News Updates</Text>
          <Text style={styles.headerSub}>Tamil Canadian News</Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.newsCard}
            onPress={() => router.push({ pathname: '/articles', params: { id: item.id } })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.newsContent}>
              <View style={styles.newsMeta}>
                <Text style={styles.newsCategory}>{item.category}</Text>
                <Text style={styles.newsDate}>{item.date}</Text>
              </View>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsExcerpt} numberOfLines={2}>{item.excerpt}</Text>
              <View style={styles.newsFooter}>
                <Text style={styles.newsAuthor}>By {item.author}</Text>
                <View style={styles.readTimeRow}>
                  <Ionicons name="time-outline" size={12} color={Colors.light.textSecondary} />
                  <Text style={styles.readTime}>{item.readTime}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  listContainer: { padding: Spacing.three },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  newsImage: { width: '100%', height: 180, backgroundColor: '#f3f4f6' },
  newsContent: { padding: Spacing.three },
  newsMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  newsCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newsDate: { fontSize: 11, color: Colors.light.textSecondary },
  newsTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 6, lineHeight: 22 },
  newsExcerpt: { fontSize: 13, color: Colors.light.textSecondary, lineHeight: 19, marginBottom: 10 },
  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  newsAuthor: { fontSize: 12, color: Colors.light.textSecondary, fontWeight: '500' },
  readTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readTime: { fontSize: 12, color: Colors.light.textSecondary },
});
