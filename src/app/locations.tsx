import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { locations } from '@/data/mock-data';

const CITY_IMAGES: Record<string, string> = {
  'Toronto, ON': 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Scarborough, ON': 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Markham, ON': 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Brampton, ON': 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Mississauga, ON': 'https://images.pexels.com/photos/1036657/pexels-photo-1036657.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Montreal, QC': 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Vancouver, BC': 'https://images.pexels.com/photos/2382681/pexels-photo-2382681.jpeg?auto=compress&cs=tinysrgb&w=100',
  'Calgary, AB': 'https://images.pexels.com/photos/1769734/pexels-photo-1769734.jpeg?auto=compress&cs=tinysrgb&w=100',
};

export default function LocationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Locations</Text>
          <Text style={styles.headerSub}>Tamil communities across Canada</Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item}
        contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isAll = item === 'All Locations';
          return (
            <TouchableOpacity
              style={styles.locationItem}
              onPress={() => router.push({ pathname: '/directory', params: { loc: isAll ? '' : item } })}
              activeOpacity={0.8}
            >
              <View style={styles.locationLeft}>
                <View style={[styles.locationIconBg, isAll && { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons
                    name={isAll ? 'globe-outline' : 'location-outline'}
                    size={20}
                    color={isAll ? '#2563EB' : Colors.light.primary}
                  />
                </View>
                <View>
                  <Text style={styles.locationText}>{item}</Text>
                  {!isAll && (
                    <Text style={styles.locationSub}>
                      {item.includes(', ON') ? 'Ontario'
                        : item.includes(', QC') ? 'Quebec'
                        : item.includes(', BC') ? 'British Columbia'
                        : item.includes(', AB') ? 'Alberta'
                        : 'Canada'}
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.light.border} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.text, textAlign: 'center' },
  headerSub: { fontSize: 12, color: Colors.light.textSecondary, textAlign: 'center' },
  listContainer: { padding: Spacing.three },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  locationLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  locationIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: { fontSize: 15, fontWeight: '700', color: Colors.light.text },
  locationSub: { fontSize: 11, color: Colors.light.textSecondary, marginTop: 2 },
});
