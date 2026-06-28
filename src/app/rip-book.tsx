import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { obituaries as initialObituaries } from '@/data/mock-data';
import type { Obituary } from '@/store/app-store';

export default function RipBookScreen() {
  const [obituaries, setObituaries] = useState<Obituary[]>(initialObituaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObituary, setSelectedObituary] = useState<Obituary | null>(null);
  const [tributeName, setTributeName] = useState('');
  const [tributeMessage, setTributeMessage] = useState('');

  const filtered = obituaries.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.hometown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLightCandle = (id: string) => {
    setObituaries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, candles: item.candles + 1 };
          if (selectedObituary?.id === id) setSelectedObituary(updated);
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddTribute = (id: string) => {
    if (!tributeName.trim() || !tributeMessage.trim()) {
      Alert.alert('Error', 'Please fill in both your name and message.');
      return;
    }
    setObituaries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            condolences: [
              { id: Date.now().toString(), author: tributeName, message: tributeMessage, date: 'Just now' },
              ...item.condolences,
            ],
          };
          if (selectedObituary?.id === id) setSelectedObituary(updated);
          return updated;
        }
        return item;
      })
    );
    setTributeName('');
    setTributeMessage('');
    Alert.alert('Thank You', 'Your condolence tribute has been posted.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="flame" size={22} color={Colors.light.primary} />
            <Text style={styles.headerTitle}>RIP Book</Text>
          </View>
          <Text style={styles.headerSub}>மரண அறிவித்தல்கள்</Text>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or hometown..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={17} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedObituary(item)} activeOpacity={0.85}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardMeta}>Age: {item.age}</Text>
              <Text style={styles.cardMeta}>Passed: {item.date}</Text>
              <Text style={styles.cardHometown}>{item.hometown}</Text>
              <View style={styles.candleRow}>
                <Ionicons name="flame" size={14} color={Colors.light.primary} />
                <Text style={styles.candleCount}>{item.candles} candles lit</Text>
                <View style={styles.condolenceBadge}>
                  <Text style={styles.condolenceBadgeText}>{item.condolences.length} tributes</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.light.border} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={52} color={Colors.light.border} />
            <Text style={styles.emptyText}>No obituaries found</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Obituary Detail Modal */}
      <Modal
        visible={selectedObituary !== null}
        animationType="slide"
        onRequestClose={() => setSelectedObituary(null)}
      >
        {selectedObituary && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedObituary(null)} style={styles.closeButton}>
                <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
                <Text style={styles.closeButtonText}>RIP Book</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Memorial</Text>
              <View style={{ width: 60 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Memorial Header */}
              <View style={styles.memorialHeader}>
                <View style={styles.memorialImageWrapper}>
                  <Image source={{ uri: selectedObituary.image }} style={styles.memorialImage} />
                </View>
                <Text style={styles.memorialName}>{selectedObituary.name}</Text>
                <Text style={styles.memorialDates}>{selectedObituary.hometown}</Text>
                <Text style={styles.memorialAge}>Age: {selectedObituary.age}</Text>
                <View style={styles.passDateRow}>
                  <Ionicons name="calendar-outline" size={14} color={Colors.light.textSecondary} />
                  <Text style={styles.passDate}>Passed Away: {selectedObituary.date}</Text>
                </View>
                <TouchableOpacity
                  style={styles.lightCandleBtn}
                  onPress={() => handleLightCandle(selectedObituary.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="flame" size={20} color="#fff" />
                  <Text style={styles.lightCandleBtnText}>
                    Light a Candle ({selectedObituary.candles})
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.memorialBody}>
                {/* Obituary Text */}
                <Text style={styles.sectionTitle}>Obituary Notice</Text>
                <Text style={styles.obituaryText}>{selectedObituary.notice}</Text>

                <View style={styles.sectionDivider} />

                {/* Leave Tribute */}
                <Text style={styles.sectionTitle}>Leave a Condolence / தனிப்பட்ட செய்தி</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Your Name"
                  value={tributeName}
                  onChangeText={setTributeName}
                />
                <TextInput
                  style={[styles.formInput, { height: 90, textAlignVertical: 'top' }]}
                  multiline
                  numberOfLines={3}
                  placeholder="Share a memory or send your condolences..."
                  value={tributeMessage}
                  onChangeText={setTributeMessage}
                />
                <TouchableOpacity
                  style={styles.submitTributeBtn}
                  onPress={() => handleAddTribute(selectedObituary.id)}
                >
                  <Text style={styles.submitTributeBtnText}>Submit Condolence</Text>
                </TouchableOpacity>

                <View style={styles.sectionDivider} />

                {/* Guestbook */}
                <Text style={styles.sectionTitle}>
                  Condolence Guestbook ({selectedObituary.condolences.length})
                </Text>
                {selectedObituary.condolences.length === 0 ? (
                  <View style={styles.noCondolences}>
                    <Text style={styles.noCondolencesText}>Be the first to leave a tribute.</Text>
                  </View>
                ) : (
                  selectedObituary.condolences.map((tribute) => (
                    <View key={tribute.id} style={styles.tributeCard}>
                      <View style={styles.tributeAvatar}>
                        <Text style={styles.tributeAvatarText}>{tribute.author[0]?.toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.tributeHeader}>
                          <Text style={styles.tributeAuthor}>{tribute.author}</Text>
                          <Text style={styles.tributeDate}>{tribute.date}</Text>
                        </View>
                        <Text style={styles.tributeMessage}>{tribute.message}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
              <View style={{ height: 50 }} />
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
    paddingHorizontal: Spacing.four,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTop: { marginBottom: 10 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.light.text },
  headerSub: { fontSize: 12, color: Colors.light.textSecondary },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.light.text },
  listContainer: { padding: Spacing.three },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginBottom: 3 },
  cardMeta: { fontSize: 12, color: Colors.light.textSecondary, marginBottom: 1 },
  cardHometown: { fontSize: 12, color: Colors.light.primary, fontWeight: '600', marginBottom: 6 },
  candleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  candleCount: { fontSize: 12, color: Colors.light.primary, fontWeight: '700' },
  condolenceBadge: {
    backgroundColor: '#F5EDED',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 4,
  },
  condolenceBadgeText: { fontSize: 10, color: Colors.light.secondary, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginTop: 12 },
  modalContainer: { flex: 1, backgroundColor: Colors.light.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  closeButtonText: { fontSize: 15, fontWeight: '600', color: Colors.light.text },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  memorialHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  memorialImageWrapper: {
    borderWidth: 3,
    borderColor: Colors.light.primary,
    borderRadius: 75,
    padding: 3,
    marginBottom: 14,
  },
  memorialImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
  },
  memorialName: { fontSize: 22, fontWeight: '800', color: Colors.light.text, textAlign: 'center', marginBottom: 4 },
  memorialDates: { fontSize: 13, color: Colors.light.textSecondary, marginBottom: 2 },
  memorialAge: { fontSize: 13, color: Colors.light.textSecondary, marginBottom: 6 },
  passDateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 18 },
  passDate: { fontSize: 13, color: Colors.light.secondary, fontWeight: '600' },
  lightCandleBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lightCandleBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  memorialBody: { padding: Spacing.four },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 10 },
  obituaryText: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 23 },
  sectionDivider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Spacing.four },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 10,
  },
  submitTributeBtn: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 4,
  },
  submitTributeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  noCondolences: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  noCondolencesText: { color: Colors.light.textSecondary, fontSize: 13 },
  tributeCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tributeAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  tributeAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.light.primary },
  tributeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tributeAuthor: { fontSize: 13, fontWeight: '700', color: Colors.light.text },
  tributeDate: { fontSize: 11, color: Colors.light.textSecondary },
  tributeMessage: { fontSize: 13, color: Colors.light.textSecondary, lineHeight: 19 },
});
