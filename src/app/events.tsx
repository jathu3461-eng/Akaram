import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { events } from '@/data/mock-data';

const EVENT_CATEGORIES = ['All', 'Cultural', 'Food', 'Business', 'Religious', 'Music', 'Education'];

const categoryColors: Record<string, string> = {
  Cultural: '#8B0000',
  Food: '#e05c28',
  Business: '#1a56db',
  Religious: '#7c3aed',
  Music: '#d97706',
  Education: '#059669',
  All: '#8B0000',
};

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);

  const filtered =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const handleMapOpen = (location: string) => {
    const query = encodeURIComponent(location);
    const url =
      Platform.OS === 'ios'
        ? `maps://?q=${query}`
        : `geo:0,0?q=${query}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logoText}>Akaram</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="calendar" size={22} color={Colors.light.primary} />
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Events Calendar</Text>
        <Text style={styles.headerDesc}>Upcoming Tamil Canadian events across Canada</Text>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {EVENT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={56} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No events in this category</Text>
          </View>
        ) : (
          filtered.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => setSelectedEvent(event)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventOverlay}>
                <View style={[styles.categoryBadge, { backgroundColor: categoryColors[event.category] || Colors.light.primary }]}>
                  <Text style={styles.categoryBadgeText}>{event.category}</Text>
                </View>
              </View>
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                <View style={styles.eventMeta}>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.light.primary} />
                    <Text style={styles.metaText}>{event.date} · {event.time}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.light.secondary} />
                    <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
                  </View>
                </View>
                <Text style={styles.eventExcerpt} numberOfLines={2}>{event.description}</Text>
                <View style={styles.eventFooter}>
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => handleMapOpen(event.location)}
                  >
                    <Ionicons name="navigate-outline" size={14} color="#fff" />
                    <Text style={styles.mapButtonText}>Get Directions</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailButton} onPress={() => setSelectedEvent(event)}>
                    <Text style={styles.detailButtonText}>Details</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Event Detail Modal */}
      <Modal
        visible={selectedEvent !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <SafeAreaView style={styles.modalSafe}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedEvent.image }} style={styles.modalImage} />
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedEvent(null)}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>

              <View style={styles.modalContent}>
                <View style={[styles.categoryBadge, { backgroundColor: categoryColors[selectedEvent.category] || Colors.light.primary, alignSelf: 'flex-start', marginBottom: Spacing.three }]}>
                  <Text style={styles.categoryBadgeText}>{selectedEvent.category}</Text>
                </View>

                <Text style={styles.modalTitle}>{selectedEvent.title}</Text>

                <View style={styles.modalDetailBox}>
                  <View style={styles.modalDetailRow}>
                    <Ionicons name="calendar-outline" size={18} color={Colors.light.primary} />
                    <View style={{ marginLeft: Spacing.three }}>
                      <Text style={styles.modalDetailLabel}>Date & Time</Text>
                      <Text style={styles.modalDetailValue}>{selectedEvent.date}</Text>
                      <Text style={styles.modalDetailValue}>{selectedEvent.time}</Text>
                    </View>
                  </View>
                  <View style={[styles.modalDetailRow, { marginTop: Spacing.three }]}>
                    <Ionicons name="location-outline" size={18} color={Colors.light.secondary} />
                    <View style={{ marginLeft: Spacing.three, flex: 1 }}>
                      <Text style={styles.modalDetailLabel}>Location</Text>
                      <Text style={styles.modalDetailValue}>{selectedEvent.location}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.modalSectionLabel}>About This Event</Text>
                <Text style={styles.modalDescription}>{selectedEvent.description}</Text>

                <TouchableOpacity
                  style={styles.modalMapButton}
                  onPress={() => handleMapOpen(selectedEvent.location)}
                >
                  <Ionicons name="navigate" size={18} color="#fff" />
                  <Text style={styles.modalMapButtonText}>Open in Maps</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerIcons: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: Spacing.one,
  },
  headerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  categoryBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebeef3',
  },
  categoryScroll: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  catChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    backgroundColor: '#f0f4f8',
    marginRight: Spacing.two,
  },
  catChipActive: {
    backgroundColor: Colors.light.primary,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  catChipTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: Spacing.four,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: Spacing.three,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: Spacing.four,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ebeef3',
  },
  eventImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#eee',
  },
  eventOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventContent: {
    padding: Spacing.four,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.two,
    lineHeight: 23,
  },
  eventMeta: {
    marginBottom: Spacing.three,
    gap: Spacing.one,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  metaText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  eventExcerpt: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 10,
    gap: 6,
  },
  mapButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal styles
  modalSafe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#eee',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: Spacing.five,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
    lineHeight: 30,
    marginBottom: Spacing.four,
  },
  modalDetailBox: {
    backgroundColor: '#f7f9ff',
    borderRadius: 16,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    borderWidth: 1,
    borderColor: '#ebeef3',
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  modalDetailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.three,
  },
  modalDescription: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.five,
  },
  modalMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    padding: Spacing.four,
    borderRadius: 14,
    gap: Spacing.two,
  },
  modalMapButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
