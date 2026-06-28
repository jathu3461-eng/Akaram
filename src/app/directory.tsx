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
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

import { businesses, categories as mockCategories } from '@/data/mock-data';
import type { Business } from '@/store/app-store';

const categories = ['All', ...mockCategories.map(c => c.name)];


export default function DirectoryScreen() {
  const params = useLocalSearchParams<{ q?: string; loc?: string; category?: string; id?: string }>();
  
  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'All');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // If a specific ID is passed in params, auto-open details
  useEffect(() => {
    if (params.id) {
      const biz = businesses.find(b => b.id === params.id);
      if (biz) setSelectedBusiness(biz);
    }
  }, [params.id]);

  const filteredBusinesses = businesses.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    const matchesLocation =
      !params.loc || item.location.toLowerCase().includes(params.loc.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleCall = (phone?: string) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email?: string) => {
    if (email) Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (url?: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.light.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search local businesses..."
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

      {/* Categories Chips */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedCategory === item && styles.activeChip,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === item && styles.activeChipText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chipsScroll}
        />
      </View>

      {/* Business Directory List */}
      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.businessCard}
            onPress={() => setSelectedBusiness(item)}
          >
            <Image source={{ uri: item.image }} style={styles.businessImage} />
            <View style={styles.businessInfo}>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryTag}>{item.category}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#FFCC00" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.businessName}>{item.name}</Text>
              <Text style={styles.businessDesc} numberOfLines={2}>{item.description}</Text>
              
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={Colors.light.textSecondary} />
                <Text style={styles.locationText}>{item.address}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No businesses found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search criteria or category filter.</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Business Details Modal */}
      <Modal
        visible={selectedBusiness !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedBusiness(null)}
      >
        {selectedBusiness && (
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedBusiness(null)} style={styles.closeButton}>
                <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
                <Text style={styles.closeButtonText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>{selectedBusiness.name}</Text>
              <TouchableOpacity onPress={() => handleWebsite(selectedBusiness.website)}>
                <Ionicons name="share-outline" size={22} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedBusiness.image }} style={styles.modalImage} />
              
              <View style={styles.modalBody}>
                {/* Category & Ratings */}
                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalCategory}>{selectedBusiness.category}</Text>
                  <View style={styles.modalRating}>
                    <Ionicons name="star" size={16} color="#FFCC00" />
                    <Text style={styles.modalRatingText}>{selectedBusiness.rating} ({selectedBusiness.reviews} reviews)</Text>
                  </View>
                </View>

                {/* About Description */}
                <Text style={styles.modalSectionTitle}>About</Text>
                <Text style={styles.modalDesc}>{selectedBusiness.description}</Text>

                {/* Detail Information Box */}
                <View style={styles.infoBox}>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={20} color={Colors.light.primary} style={styles.infoIcon} />
                    <View>
                      <Text style={styles.infoLabel}>Hours</Text>
                      <Text style={styles.infoValue}>{selectedBusiness.hours}</Text>
                    </View>
                  </View>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color={Colors.light.primary} style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Address</Text>
                      <Text style={styles.infoValue}>{selectedBusiness.address}</Text>
                    </View>
                  </View>
                </View>

                {/* Interactive Contact Buttons */}
                <Text style={styles.modalSectionTitle}>Connect</Text>
                <View style={styles.contactRow}>
                  <TouchableOpacity style={styles.contactBtn} onPress={() => handleCall(selectedBusiness.phone)}>
                    <Ionicons name="call-outline" size={22} color="#ffffff" />
                    <Text style={styles.contactBtnText}>Call Now</Text>
                  </TouchableOpacity>
                  
                  {selectedBusiness.email && (
                    <TouchableOpacity style={[styles.contactBtn, styles.contactBtnSecondary]} onPress={() => handleEmail(selectedBusiness.email!)}>
                      <Ionicons name="mail-outline" size={22} color={Colors.light.primary} />
                      <Text style={[styles.contactBtnText, styles.contactBtnTextSecondary]}>Email Us</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {selectedBusiness.website && (
                  <TouchableOpacity style={styles.websiteBtn} onPress={() => handleWebsite(selectedBusiness.website!)}>
                    <Ionicons name="globe-outline" size={20} color={Colors.light.secondary} />
                    <Text style={styles.websiteBtnText}>Visit Official Website</Text>
                  </TouchableOpacity>
                )}

                {/* Mock Map View */}
                <Text style={styles.modalSectionTitle}>Location Map</Text>
                <View style={styles.mockMap}>
                  <Ionicons name="map-outline" size={32} color={Colors.light.textSecondary} />
                  <Text style={styles.mockMapText}>Interactive Map Preview</Text>
                  <Text style={styles.mockMapSubtext}>{selectedBusiness.address}</Text>
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
    fontFamily: 'Plus Jakarta Sans',
  },
  categoriesContainer: {
    paddingVertical: Spacing.two,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  chipsScroll: {
    paddingHorizontal: Spacing.four,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two - 2,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceContainer,
    marginRight: Spacing.two,
  },
  activeChip: {
    backgroundColor: Colors.light.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    fontFamily: 'Plus Jakarta Sans',
  },
  activeChipText: {
    color: '#ffffff',
  },
  listContainer: {
    padding: Spacing.four,
  },
  businessCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  businessImage: {
    width: 100,
    height: '100%',
    minHeight: 110,
    backgroundColor: '#eee',
  },
  businessInfo: {
    flex: 1,
    padding: Spacing.three,
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    marginLeft: 3,
  },
  businessName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  businessDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginLeft: 3,
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
  emptySubtext: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.one,
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
    marginLeft: 2,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    maxWidth: '60%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  modalBody: {
    padding: Spacing.four,
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  modalCategory: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 4,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  modalDesc: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.three,
    marginTop: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  infoIcon: {
    marginRight: Spacing.three,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  contactBtnSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  contactBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  contactBtnTextSecondary: {
    color: Colors.light.primary,
  },
  websiteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  websiteBtnText: {
    color: Colors.light.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
  mockMap: {
    backgroundColor: Colors.light.surfaceContainer,
    height: 150,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.three,
  },
  mockMapText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: Spacing.two,
  },
  mockMapSubtext: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
