import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '@/constants/theme';
import { categories, businesses, obituaries, locations } from '@/data/mock-data';

const { width } = Dimensions.get('window');

// Derived mock data for home screen
const featuredBusinesses = businesses.slice(0, 3);
const latestObituaries = obituaries.slice(0, 2);

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isLocModalVisible, setIsLocModalVisible] = useState(false);

  const handleSearch = () => {
    // Navigate to Directory screen with search query parameters
    router.push({
      pathname: '/directory',
      params: { q: searchQuery, loc: location === 'All Locations' ? '' : location },
    });
  };

  const handleSelectLocation = (selectedLoc: string) => {
    setLocation(selectedLoc === 'All Locations' ? '' : selectedLoc);
    setIsLocModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Akaram</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('/more')} style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/marketplace')} style={styles.iconButton}>
              <Ionicons name="cart-outline" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Find Local Tamil Businesses in Canada</Text>
          <Text style={styles.heroSubtitle}>Connecting culture, community, and business in one place.</Text>

          {/* Search Inputs */}
          <View style={styles.searchCard}>
            <View style={styles.inputWrapper}>
              <Ionicons name="search-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="What are you looking for?"
                placeholderTextColor={Colors.light.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.inputWrapper} 
              onPress={() => setIsLocModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={20} color={Colors.light.secondary} style={styles.inputIcon} />
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text 
                  style={[
                    styles.input, 
                    !location && { color: Colors.light.textSecondary, fontSize: 14 }
                  ]}
                >
                  {location || 'Select City or Province (e.g. Toronto)'}
                </Text>
              </View>
              <Ionicons name="chevron-down-outline" size={18} color={Colors.light.textSecondary} style={{ marginRight: Spacing.one }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search Directory</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => router.push({ pathname: '/directory', params: { category: category.name } })}
              >
                <View style={styles.categoryIconBg}>
                  <Ionicons name={category.icon as any} size={24} color={Colors.light.primary} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Businesses</Text>
            <TouchableOpacity onPress={() => router.push('/directory')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {featuredBusinesses.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() => router.push({ pathname: '/directory', params: { id: item.id } })}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTag}>{item.category}</Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.cardLocationRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.light.textSecondary} />
                    <Text style={styles.cardLocationText}>{item.location}</Text>
                  </View>
                  <View style={styles.cardRatingRow}>
                    <Ionicons name="star" size={14} color="#FFCC00" />
                    <Text style={styles.cardRatingText}>{item.rating} ({item.reviews} reviews)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Obituaries / RIP Book Snippet */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Obituaries</Text>
            <TouchableOpacity onPress={() => router.push('/rip-book')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {latestObituaries.map((obituary) => (
            <TouchableOpacity
              key={obituary.id}
              style={styles.obituaryRow}
              onPress={() => router.push({ pathname: '/rip-book', params: { id: obituary.id } })}
            >
              <Image source={{ uri: obituary.image }} style={styles.obituaryImage} />
              <View style={styles.obituaryInfo}>
                <Text style={styles.obituaryName}>{obituary.name}</Text>
                <Text style={styles.obituaryMeta}>Age: {obituary.age} | Passed: {obituary.date}</Text>
                <Text style={styles.obituaryHometown}>Hometown: {obituary.hometown}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <Text style={styles.bannerTitle}>Advertise with Akaram</Text>
            <Text style={styles.bannerDescription}>Promote your business to the Tamil Canadian community — the one place to connect culture, community, and business.</Text>
            <TouchableOpacity style={styles.bannerButton} onPress={() => router.push('/more')}>
              <Text style={styles.bannerButtonText}>Learn More</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Location Picker Modal */}
      <Modal
        visible={isLocModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLocModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.locationModalContent}>
            <View style={styles.locationModalHeader}>
              <Text style={styles.locationModalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setIsLocModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={['All Locations', ...locations.filter(loc => loc !== 'All Locations')]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.locationModalItem,
                    (location === item || (item === 'All Locations' && !location)) && styles.activeLocationItem
                  ]}
                  onPress={() => handleSelectLocation(item)}
                >
                  <Ionicons 
                    name={item === 'All Locations' ? 'globe-outline' : 'location-outline'} 
                    size={20} 
                    color={(location === item || (item === 'All Locations' && !location)) ? Colors.light.primary : Colors.light.textSecondary} 
                    style={{ marginRight: Spacing.three }}
                  />
                  <Text 
                    style={[
                      styles.locationModalItemText,
                      (location === item || (item === 'All Locations' && !location)) && styles.activeLocationItemText
                    ]}
                  >
                    {item}
                  </Text>
                  {(location === item || (item === 'All Locations' && !location)) && (
                    <Ionicons name="checkmark" size={20} color={Colors.light.primary} style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingVertical: Spacing.two }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: 'Plus Jakarta Sans',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: Spacing.three,
    padding: Spacing.one,
  },
  heroSection: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: Spacing.two,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#ffdbcf',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.four,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Plus Jakarta Sans',
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.one,
  },
  searchButton: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionContainer: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'Plus Jakarta Sans',
  },
  seeAllText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  categoriesScroll: {
    paddingRight: Spacing.four,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: Spacing.four,
    width: 80,
  },
  categoryIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffdbcf',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  featuredScroll: {
    paddingRight: Spacing.four,
  },
  featuredCard: {
    width: width * 0.65,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  cardContent: {
    padding: Spacing.three,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    marginBottom: Spacing.one,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  cardLocationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  cardRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 4,
  },
  obituaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  obituaryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.three,
    backgroundColor: '#eee',
  },
  obituaryInfo: {
    flex: 1,
  },
  obituaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  obituaryMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  obituaryHometown: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: '500',
  },
  bannerContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  banner: {
    borderRadius: 20,
    padding: Spacing.five,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: Spacing.two,
  },
  bannerDescription: {
    fontSize: 13,
    color: '#ffdbcf',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.four,
  },
  bannerButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
  },
  bannerButtonText: {
    color: Colors.light.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  locationModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: Spacing.four,
  },
  locationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  locationModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#f7f9ff',
  },
  activeLocationItem: {
    backgroundColor: Colors.light.primaryContainer,
  },
  locationModalItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.text,
  },
  activeLocationItemText: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
});
