import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

interface City {
  name: string;
  slug: string;
}

interface Province {
  name: string;
  slug: string;
  cities: City[];
}

const PROVINCES: Province[] = [
  {
    name: 'Ontario',
    slug: 'ontario',
    cities: [
      { name: 'Toronto', slug: 'toronto' },
      { name: 'Scarborough', slug: 'scarborough' },
      { name: 'Markham', slug: 'markham' },
      { name: 'Brampton', slug: 'brampton' },
      { name: 'Mississauga', slug: 'mississauga' },
      { name: 'Ottawa', slug: 'ottawa' },
      { name: 'Hamilton', slug: 'hamilton' },
      { name: 'London', slug: 'london' },
      { name: 'Kitchener', slug: 'kitchener' },
      { name: 'Vaughan', slug: 'vaughan' },
      { name: 'Windsor', slug: 'windsor' },
    ],
  },
  {
    name: 'Quebec',
    slug: 'quebec',
    cities: [
      { name: 'Montreal', slug: 'montreal' },
      { name: 'Laval', slug: 'laval' },
      { name: 'Gatineau', slug: 'gatineau' },
      { name: 'Longueuil', slug: 'longueuil' },
    ],
  },
  {
    name: 'British Columbia',
    slug: 'british-columbia',
    cities: [
      { name: 'Vancouver', slug: 'vancouver' },
      { name: 'Surrey', slug: 'surrey' },
      { name: 'Burnaby', slug: 'burnaby' },
      { name: 'Richmond', slug: 'richmond' },
      { name: 'Abbotsford', slug: 'abbotsford' },
      { name: 'Kelowna', slug: 'kelowna' },
    ],
  },
  {
    name: 'Alberta',
    slug: 'alberta',
    cities: [
      { name: 'Calgary', slug: 'calgary' },
      { name: 'Edmonton', slug: 'edmonton' },
      { name: 'Lethbridge', slug: 'lethbridge' },
    ],
  },
];

const CATEGORIES = [
  { name: 'Food & Dining', slug: 'food-dining', icon: 'restaurant-outline' as const, tamilName: 'உணவகங்கள்', count: 124 },
  { name: 'Real Estate & Housing', slug: 'real-estate', icon: 'home-outline' as const, tamilName: 'ரியல் எஸ்டேட்', count: 38 },
  { name: 'Home Services', slug: 'home-services', icon: 'build-outline' as const, tamilName: 'வீட்டு சேவைகள்', count: 52 },
  { name: 'Professional Services', slug: 'professional-services', icon: 'briefcase-outline' as const, tamilName: 'தொழில் சேவைகள்', count: 89 },
  { name: 'Health & Medicine', slug: 'health-medicine', icon: 'medkit-outline' as const, tamilName: 'மருத்துவம்', count: 67 },
  { name: 'Beauty & Wellness', slug: 'beauty-wellness', icon: 'sparkles-outline' as const, tamilName: 'அழகு & ஆரோக்கியம்', count: 41 },
  { name: 'Automotive', slug: 'automotive', icon: 'car-outline' as const, tamilName: 'வாகன சேவைகள்', count: 45 },
  { name: 'Community & Religion', slug: 'community-religion', icon: 'people-outline' as const, tamilName: 'சமூகம் & மதம்', count: 56 },
  { name: 'Tourism & Attractions', slug: 'tourism-attractions', icon: 'map-outline' as const, tamilName: 'சுற்றுலா', count: 34 },
  { name: 'Education', slug: 'education', icon: 'school-outline' as const, tamilName: 'கல்வி', count: 28 },
  { name: 'Farming & Agriculture', slug: 'farming-agriculture', icon: 'leaf-outline' as const, tamilName: 'விவசாயம்', count: 19 },
  { name: 'Other', slug: 'other', icon: 'ellipsis-horizontal-outline' as const, tamilName: 'மற்றவை', count: 22 },
];

export default function BrowseScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'locations' | 'categories'>('locations');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProvinces = useMemo(() => {
    if (!searchQuery.trim()) return PROVINCES;
    const query = searchQuery.toLowerCase();
    return PROVINCES.map((prov) => {
      const matchingCities = prov.cities.filter((city) =>
        city.name.toLowerCase().includes(query)
      );
      if (prov.name.toLowerCase().includes(query) || matchingCities.length > 0) {
        return {
          ...prov,
          cities: matchingCities.length > 0 ? matchingCities : prov.cities,
        };
      }
      return null;
    }).filter((prov): prov is Province => prov !== null);
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES;
    const query = searchQuery.toLowerCase();
    return CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.tamilName.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleSelectLocation = (locName: string) => {
    router.push({
      pathname: '/directory',
      params: { loc: locName },
    });
  };

  const handleSelectCategory = (catName: string) => {
    // Map standard Rork names to Directory screen format
    let cleanCat = catName;
    if (catName === 'Food & Dining') cleanCat = 'Restaurants';
    if (catName === 'Real Estate & Housing') cleanCat = 'Real Estate';
    if (catName === 'Farming & Agriculture') cleanCat = 'Farming';
    
    router.push({
      pathname: '/directory',
      params: { category: cleanCat },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Browse Directory</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab Row */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'locations' && styles.tabActive]}
          onPress={() => {
            setActiveTab('locations');
            setSearchQuery('');
          }}
        >
          <Ionicons
            name="location-outline"
            size={16}
            color={activeTab === 'locations' ? '#ffffff' : Colors.light.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'locations' && styles.tabTextActive]}>
            By Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'categories' && styles.tabActive]}
          onPress={() => {
            setActiveTab('categories');
            setSearchQuery('');
          }}
        >
          <Ionicons
            name="grid-outline"
            size={16}
            color={activeTab === 'categories' ? '#ffffff' : Colors.light.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>
            By Category
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              activeTab === 'locations'
                ? 'Search provinces or cities...'
                : 'Search categories...'
            }
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* List content */}
      {activeTab === 'locations' ? (
        <FlatList
          data={filteredProvinces}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.provinceSection}>
              {/* Province Header */}
              <TouchableOpacity
                style={styles.provinceHeader}
                onPress={() => handleSelectLocation(item.name)}
              >
                <View style={styles.provinceLeft}>
                  <View style={styles.locationIconContainer}>
                    <Ionicons name="map-outline" size={18} color={Colors.light.primary} />
                  </View>
                  <View>
                    <Text style={styles.locationName}>{item.name}</Text>
                    <Text style={styles.locationCityCount}>{item.cities.length} Cities</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
              </TouchableOpacity>

              {/* Cities list (Grid format) */}
              <View style={styles.citiesGrid}>
                {item.cities.map((city) => (
                  <TouchableOpacity
                    key={city.slug}
                    style={styles.cityChip}
                    onPress={() => handleSelectLocation(`${city.name}, ${item.slug === 'quebec' ? 'QC' : item.slug === 'british-columbia' ? 'BC' : item.slug === 'alberta' ? 'AB' : 'ON'}`)}
                  >
                    <Text style={styles.cityChipText}>{city.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleSelectCategory(item.name)}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name={item.icon} size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryNameText}>{item.name}</Text>
                <Text style={styles.categoryTamilName}>{item.tamilName}</Text>
              </View>
              <View style={styles.categoryCount}>
                <Text style={styles.categoryCountText}>{item.count}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: 'Plus Jakarta Sans',
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.light.surfaceVariant,
    borderRadius: 12,
    padding: 4,
    marginTop: 12,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    fontFamily: 'Plus Jakarta Sans',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    height: 44,
    fontFamily: 'Plus Jakarta Sans',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  provinceSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  provinceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  provinceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ffebeb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'Plus Jakarta Sans',
  },
  locationCityCount: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: 'Plus Jakarta Sans',
    marginTop: 1,
  },
  citiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  cityChip: {
    backgroundColor: Colors.light.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cityChipText: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffebeb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'Plus Jakarta Sans',
  },
  categoryTamilName: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
    fontFamily: 'Plus Jakarta Sans',
  },
  categoryCount: {
    backgroundColor: Colors.light.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    fontFamily: 'Plus Jakarta Sans',
  },
});
