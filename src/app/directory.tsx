import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Linking,
  Modal,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { businesses, categories as mockCategories } from '@/data/mock-data';
import type { Business } from '@/store/app-store';

const allCategories = ['All', ...mockCategories.map(c => c.name)];

export default function DirectoryScreen() {
  const params = useLocalSearchParams<{ q?: string; loc?: string; category?: string; id?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'All');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (params.id) {
      const biz = businesses.find(b => b.id === params.id);
      if (biz) setSelectedBusiness(biz);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.category) setSelectedCategory(params.category);
  }, [params.category]);

  const filteredBusinesses = businesses.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.address && item.address.toLowerCase().includes(q));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLocation = !params.loc || item.location.toLowerCase().includes(params.loc.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Business Directory</Text>
          <Text style={styles.screenCount}>{filteredBusinesses.length} listings</Text>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.light.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search businesses..."
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

      {/* Category Chips */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={allCategories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, selectedCategory === item && styles.activeChip]}
              onPress={() => setSelectedCategory(item)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, selectedCategory === item && styles.activeChipText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chipsScroll}
        />
      </View>

      {/* Business List */}
      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.businessCard} onPress={() => setSelectedBusiness(item)} activeOpacity={0.85}>
            <Image source={{ uri: item.image }} style={styles.businessImage} />
            <View style={styles.businessInfo}>
              <View style={styles.categoryRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryTag}>{item.category}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.businessName}>{item.name}</Text>
              <Text style={styles.businessDesc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color={Colors.light.textSecondary} />
                <Text style={styles.locationText}>{item.address || item.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={52} color={Colors.light.border} />
            <Text style={styles.emptyText}>No businesses found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or category.</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Business Detail Modal */}
      <Modal
        visible={selectedBusiness !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedBusiness(null)}
      >
        {selectedBusiness && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedBusiness(null)} style={styles.closeButton}>
                <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
                <Text style={styles.closeButtonText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>{selectedBusiness.name}</Text>
              <TouchableOpacity onPress={() => selectedBusiness.website && Linking.openURL(selectedBusiness.website)}>
                <Ionicons name="share-outline" size={22} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedBusiness.image }} style={styles.modalImage} />

              <View style={styles.modalBody}>
                {/* Category & Rating */}
                <View style={styles.modalMetaRow}>
                  <View style={[styles.categoryBadge, { backgroundColor: '#FEF2F2' }]}>
                    <Text style={[styles.categoryTag, { fontSize: 12 }]}>{selectedBusiness.category}</Text>
                  </View>
                  <View style={styles.modalRating}>
                    {[1,2,3,4,5].map(i => (
                      <Ionicons key={i} name={i <= Math.floor(selectedBusiness.rating) ? "star" : "star-outline"} size={15} color="#F59E0B" />
                    ))}
                    <Text style={styles.modalRatingText}>{selectedBusiness.rating} ({selectedBusiness.reviews} reviews)</Text>
                  </View>
                </View>

                <Text style={styles.businessNameLarge}>{selectedBusiness.name}</Text>

                {/* About */}
                <Text style={styles.modalSectionTitle}>About / விபரம்</Text>
                <Text style={styles.modalDesc}>{selectedBusiness.description}</Text>

                {/* Info Box */}
                <View style={styles.infoBox}>
                  {selectedBusiness.hours && (
                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={18} color={Colors.light.primary} style={styles.infoIcon} />
                      <View>
                        <Text style={styles.infoLabel}>Hours</Text>
                        <Text style={styles.infoValue}>{selectedBusiness.hours}</Text>
                      </View>
                    </View>
                  )}
                  {selectedBusiness.address && (
                    <>
                      <View style={styles.infoDivider} />
                      <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={18} color={Colors.light.primary} style={styles.infoIcon} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoLabel}>Address</Text>
                          <Text style={styles.infoValue}>{selectedBusiness.address}</Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>

                {/* Contact Buttons */}
                <Text style={styles.modalSectionTitle}>Connect / தொடர்பு</Text>
                <View style={styles.contactRow}>
                  <TouchableOpacity
                    style={styles.contactBtn}
                    onPress={() => Linking.openURL(`tel:${selectedBusiness.phone}`)}
                  >
                    <Ionicons name="call-outline" size={20} color="#fff" />
                    <Text style={styles.contactBtnText}>Call Now</Text>
                  </TouchableOpacity>
                  {selectedBusiness.email && (
                    <TouchableOpacity
                      style={[styles.contactBtn, styles.contactBtnSecondary]}
                      onPress={() => Linking.openURL(`mailto:${selectedBusiness.email}`)}
                    >
                      <Ionicons name="mail-outline" size={20} color={Colors.light.primary} />
                      <Text style={[styles.contactBtnText, { color: Colors.light.primary }]}>Email Us</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {selectedBusiness.website && (
                  <TouchableOpacity
                    style={styles.websiteBtn}
                    onPress={() => Linking.openURL(selectedBusiness.website!)}
                  >
                    <Ionicons name="globe-outline" size={18} color={Colors.light.secondary} />
                    <Text style={styles.websiteBtnText}>Visit Website</Text>
                  </TouchableOpacity>
                )}

                {/* Location Map Placeholder */}
                <Text style={styles.modalSectionTitle}>Location</Text>
                <View style={styles.mockMap}>
                  <Ionicons name="map-outline" size={30} color={Colors.light.border} />
                  <Text style={styles.mockMapText}>{selectedBusiness.address || selectedBusiness.location}</Text>
                </View>
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  screenTitle: { fontSize: 20, fontWeight: '800', color: Colors.light.text },
  screenCount: { fontSize: 12, color: Colors.light.textSecondary },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 7,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.light.text },
  categoriesContainer: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  chipsScroll: { paddingHorizontal: Spacing.four },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceContainer,
    marginRight: 8,
  },
  activeChip: { backgroundColor: Colors.light.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.light.textSecondary },
  activeChipText: { color: '#fff' },
  listContainer: { padding: Spacing.three },
  businessCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  businessImage: {
    width: 100,
    minHeight: 115,
    backgroundColor: '#f3f4f6',
  },
  businessInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  categoryBadge: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  categoryTag: { fontSize: 10, fontWeight: '700', color: Colors.light.primary, textTransform: 'uppercase' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 12, fontWeight: '700', color: Colors.light.text, marginLeft: 2 },
  businessName: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 4 },
  businessDesc: { fontSize: 12, color: Colors.light.textSecondary, lineHeight: 16, marginBottom: 7 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { fontSize: 11, color: Colors.light.textSecondary },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginTop: 12 },
  emptySubtext: { fontSize: 13, color: Colors.light.textSecondary, textAlign: 'center', marginTop: 4 },
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
  closeButton: { flexDirection: 'row', alignItems: 'center' },
  closeButtonText: { fontSize: 15, fontWeight: '600', color: Colors.light.text, marginLeft: 2 },
  modalTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text, maxWidth: '60%' },
  modalImage: { width: '100%', height: 210, backgroundColor: '#f3f4f6' },
  modalBody: { padding: Spacing.four },
  modalMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalRating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  modalRatingText: { fontSize: 12, fontWeight: '600', color: Colors.light.text, marginLeft: 5 },
  businessNameLarge: { fontSize: 22, fontWeight: '800', color: Colors.light.text, marginBottom: Spacing.three, lineHeight: 28 },
  modalSectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.light.text, marginTop: Spacing.three, marginBottom: 8 },
  modalDesc: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 22 },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  infoIcon: { marginRight: 12, marginTop: 2 },
  infoLabel: { fontSize: 10, color: Colors.light.textSecondary, textTransform: 'uppercase', fontWeight: '600' },
  infoValue: { fontSize: 14, color: Colors.light.text, fontWeight: '500', marginTop: 2 },
  infoDivider: { height: 1, backgroundColor: Colors.light.border },
  contactRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  contactBtn: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  contactBtnSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  contactBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  websiteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 10,
    gap: 8,
  },
  websiteBtnText: { color: Colors.light.secondary, fontWeight: '700', fontSize: 14 },
  mockMap: {
    backgroundColor: Colors.light.surfaceContainer,
    height: 120,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 12,
    gap: 8,
  },
  mockMapText: { fontSize: 12, color: Colors.light.textSecondary, textAlign: 'center' },
});
