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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { obituaries as initialObituaries } from '@/data/mock-data';
import type { Obituary } from '@/store/app-store';

export default function RipBookScreen() {
  const [obituaries, setObituaries] = useState<Obituary[]>(initialObituaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObituary, setSelectedObituary] = useState<Obituary | null>(null);

  // Tribute Form state
  const [tributeName, setTributeName] = useState('');
  const [tributeMessage, setTributeMessage] = useState('');

  const filteredObituaries = obituaries.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.hometown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLightCandle = (id: string) => {
    setObituaries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, candles: item.candles + 1 };
          if (selectedObituary && selectedObituary.id === id) {
            setSelectedObituary(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddTribute = (id: string) => {
    if (!tributeName || !tributeMessage) {
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
          if (selectedObituary && selectedObituary.id === id) {
            setSelectedObituary(updated);
          }
          return updated;
        }
        return item;
      })
    );

    setTributeName('');
    setTributeMessage('');
    Alert.alert('Success', 'Your condolence tribute has been posted.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.light.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search obituaries by name or hometown..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Obituaries List */}
      <FlatList
        data={filteredObituaries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedObituary(item)}
          >
            <View style={styles.cardBody}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardMeta}>Age: {item.age}</Text>
                <Text style={styles.cardMeta}>Passed away: {item.date}</Text>
                <Text style={styles.cardHometown}>Hometown: {item.hometown}</Text>
                
                <View style={styles.candleRow}>
                  <Ionicons name="flame" size={16} color={Colors.light.primary} />
                  <Text style={styles.candleCount}>{item.candles} candles lit</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No obituary entries found</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Obituary Detail Modal */}
      <Modal
        visible={selectedObituary !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedObituary(null)}
      >
        {selectedObituary && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedObituary(null)} style={styles.closeButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                <Text style={styles.closeButtonText}>Obituaries</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>Memorial Tribute</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.memorialHeader}>
                <Image source={{ uri: selectedObituary.image }} style={styles.memorialImage} />
                <Text style={styles.memorialName}>{selectedObituary.name}</Text>
                <Text style={styles.memorialDates}>Hometown: {selectedObituary.hometown} | Age: {selectedObituary.age}</Text>
                <Text style={styles.memorialPassDate}>Date of Passing: {selectedObituary.date}</Text>

                {/* Light Candle Action */}
                <TouchableOpacity
                  style={styles.lightCandleBtn}
                  onPress={() => handleLightCandle(selectedObituary.id)}
                >
                  <Ionicons name="flame" size={22} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.lightCandleBtnText}>Light a Condolence Candle ({selectedObituary.candles})</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.memorialBody}>
                <Text style={styles.sectionTitle}>Obituary Details</Text>
                <Text style={styles.obituaryText}>{selectedObituary.notice}</Text>

                <View style={styles.divider} />

                {/* Guestbook Form */}
                <Text style={styles.sectionTitle}>Leave a Tribute / Condolence</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Your Name"
                  value={tributeName}
                  onChangeText={setTributeName}
                />
                <TextInput
                  style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
                  multiline
                  numberOfLines={3}
                  placeholder="Share a memory or send comfort..."
                  value={tributeMessage}
                  onChangeText={setTributeMessage}
                />
                <TouchableOpacity
                  style={styles.submitTributeBtn}
                  onPress={() => handleAddTribute(selectedObituary.id)}
                >
                  <Text style={styles.submitTributeBtnText}>Submit Condolence</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Guestbook List */}
                <Text style={styles.sectionTitle}>Condolences Guestbook ({selectedObituary.condolences.length})</Text>
                {selectedObituary.condolences.map((tribute, index) => (
                  <View key={index} style={styles.tributeCard}>
                    <View style={styles.tributeHeader}>
                      <Text style={styles.tributeAuthor}>{tribute.author}</Text>
                      <Text style={styles.tributeDate}>{tribute.date}</Text>
                    </View>
                    <Text style={styles.tributeMessage}>{tribute.message}</Text>
                  </View>
                ))}
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
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },
  searchIcon: {
    marginRight: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  listContainer: {
    padding: Spacing.four,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardBody: {
    flexDirection: 'row',
    padding: Spacing.three,
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Spacing.three,
    backgroundColor: '#eee',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  cardHometown: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  candleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  candleCount: {
    fontSize: 11,
    color: Colors.light.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: Spacing.three,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  memorialHeader: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: Spacing.five,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  memorialImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: Spacing.three,
    backgroundColor: '#eee',
    borderWidth: 3,
    borderColor: Colors.light.border,
  },
  memorialName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  memorialDates: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  memorialPassDate: {
    fontSize: 13,
    color: Colors.light.secondary,
    fontWeight: '600',
    marginBottom: Spacing.three,
  },
  lightCandleBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 25,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  lightCandleBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  memorialBody: {
    padding: Spacing.four,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  obituaryText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.four,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  submitTributeBtn: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 10,
    paddingVertical: Spacing.two + 2,
    alignItems: 'center',
  },
  submitTributeBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  tributeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.two,
  },
  tributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tributeAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  tributeDate: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  tributeMessage: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
});
