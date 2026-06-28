import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { articles } from '@/data/mock-data';

export default function NewsScreen() {
  const router = useRouter();

  // For demonstration, use articles as news items
  const newsItems = articles;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News Updates</Text>
      </View>

      <FlatList
        data={newsItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.newsCard}>
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.newsContent}>
              <View style={styles.newsMeta}>
                <Text style={styles.newsCategory}>{item.category}</Text>
                <Text style={styles.newsDate}>{item.date}</Text>
              </View>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsExcerpt} numberOfLines={2}>{item.excerpt}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  listContainer: {
    padding: Spacing.four,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: Spacing.four,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ebeef3',
  },
  newsImage: {
    width: '100%',
    height: 180,
  },
  newsContent: {
    padding: Spacing.four,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  newsCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
    textTransform: 'uppercase',
  },
  newsDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.two,
    lineHeight: 22,
  },
  newsExcerpt: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
