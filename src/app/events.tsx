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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { events } from '@/data/mock-data';
import type { Event } from '@/store/app-store';

const categoryColors: Record<string, string> = {
  Cultural: '#7C3AED',
  Food: '#D97706',
  Business: '#2563EB',
  Religious: '#DC2626',
  Music: '#059669',
  Education: '#0891B2',
};

export default function EventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categoryFilters = ['All', 'Cultural', 'Food', 'Business', 'Religious', 'Music', 'Education'];
  const filtered = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Events Calendar</Text>
          <Text style={styles.headerSub}>2026 Events</Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoryFilters}
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
            <Ionicons name="calendar-outline" size={48} color={Colors.light.border} />
            <Text style={styles.emptyText}>No events scheduled</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard} onPress={() => setSelectedEvent(item)} activeOpacity={0.85}>
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <View style={styles.eventContent}>
              <View style={styles.eventMetaRow}>
                <View style={[styles.categoryBadge, { backgroundColor: (categoryColors[item.category] || '#666') + '20' }]}>
                  <Text style={[styles.categoryBadgeText, { color: categoryColors[item.category] || '#666' }]}>
                    {item.category}
                  </Text>
                </View>
              </View>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.eventInfoRow}>
                <Ionicons name="calendar-outline" size={14} color={Colors.light.primary} />
                <Text style={styles.eventInfoText}>{item.date}</Text>
              </View>
              <View style={styles.eventInfoRow}>
                <Ionicons name="time-outline" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.eventInfoText}>{item.time}</Text>
              </View>
              <View style={styles.eventInfoRow}>
                <Ionicons name="location-outline" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.eventInfoText} numberOfLines={1}>{item.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Event Detail Modal */}
      <Modal visible={selectedEvent !== null} animationType="slide" onRequestClose={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.closeBtn}>
                <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
                <Text style={styles.closeBtnText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>Event Details</Text>
              <View style={{ width: 50 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedEvent.image }} style={styles.detailImage} />
              <View style={styles.detailBody}>
                <View style={[styles.categoryBadge, { backgroundColor: (categoryColors[selectedEvent.category] || '#666') + '20', alignSelf: 'flex-start', marginBottom: 10 }]}>
                  <Text style={[styles.categoryBadgeText, { color: categoryColors[selectedEvent.category] || '#666' }]}>
                    {selectedEvent.category}
                  </Text>
                </View>
                <Text style={styles.detailTitle}>{selectedEvent.title}</Text>

                <View style={styles.detailInfoBox}>
                  <View style={styles.detailInfoRow}>
                    <Ionicons name="calendar" size={18} color={Colors.light.primary} />
                    <Text style={styles.detailInfoText}>{selectedEvent.date}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.detailInfoRow}>
                    <Ionicons name="time" size={18} color={Colors.light.primary} />
                    <Text style={styles.detailInfoText}>{selectedEvent.time}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.detailInfoRow}>
                    <Ionicons name="location" size={18} color={Colors.light.primary} />
                    <Text style={styles.detailInfoText}>{selectedEvent.location}</Text>
                  </View>
                </View>

                <Text style={styles.detailSectionTitle}>About this Event</Text>
                <Text style={styles.detailDesc}>{selectedEvent.description}</Text>

                <TouchableOpacity
                  style={styles.addCalBtn}
                  onPress={() => Alert.alert('Calendar', 'Event added to your calendar!')}
                >
                  <Ionicons name="calendar-sharp" size={18} color="#fff" />
                  <Text style={styles.addCalBtnText}>Add to Calendar</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
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
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.text, textAlign: 'center' },
  headerSub: { fontSize: 12, color: Colors.light.textSecondary, textAlign: 'center' },
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
  eventCard: {
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
  eventImage: { width: '100%', height: 160, backgroundColor: '#f3f4f6' },
  eventContent: { padding: 14 },
  eventMetaRow: { flexDirection: 'row', marginBottom: 8 },
  categoryBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  categoryBadgeText: { fontSize: 11, fontWeight: '700' },
  eventTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 10, lineHeight: 21 },
  eventInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 5 },
  eventInfoText: { fontSize: 13, color: Colors.light.text, fontWeight: '500' },
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
  modalTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text },
  detailImage: { width: '100%', height: 220, backgroundColor: '#f3f4f6' },
  detailBody: { padding: Spacing.four },
  detailTitle: { fontSize: 22, fontWeight: '800', color: Colors.light.text, lineHeight: 28, marginBottom: Spacing.three },
  detailInfoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.three,
  },
  detailInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  detailInfoText: { fontSize: 14, color: Colors.light.text, fontWeight: '500', flex: 1 },
  divider: { height: 1, backgroundColor: Colors.light.border },
  detailSectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 8 },
  detailDesc: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 22 },
  addCalBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.four,
  },
  addCalBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
