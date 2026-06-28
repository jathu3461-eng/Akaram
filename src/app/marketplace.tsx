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
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore, type MarketplaceItem } from '@/store/app-store';
import { marketplaceItems as initialProducts, marketplaceCategories } from '@/data/mock-data';

const { width } = Dimensions.get('window');

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const { state: appState, addToCart, removeFromCart, cartTotal, clearCart } = useAppStore();

  const [products, setProducts] = useState<MarketplaceItem[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isPostAdVisible, setIsPostAdVisible] = useState(false);

  // Post Ad form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeller, setNewSeller] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const filteredProducts = products.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleAddToCart = (product: MarketplaceItem) => {
    addToCart(product);
    Alert.alert('Added to Cart', `${product.title} has been added to your cart.`);
  };

  const handlePostAd = () => {
    if (!newTitle || !newPrice || !newDesc || !newSeller || !newPhone) {
      Alert.alert('Error', 'Please fill in all required fields marked with *');
      return;
    }
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum)) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }
    const newAd: MarketplaceItem = {
      id: Date.now().toString(),
      title: newTitle,
      price: priceNum,
      category: newCategory || 'Other',
      location: newLoc || 'Canada',
      postedDate: 'Just now',
      image: 'https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: newDesc,
      seller: newSeller,
      sellerPhone: newPhone,
      condition: newCondition || 'Not specified',
    };
    setProducts([newAd, ...products]);
    setIsPostAdVisible(false);
    setNewTitle(''); setNewPrice(''); setNewDesc('');
    setNewSeller(''); setNewPhone(''); setNewLoc('');
    setNewCategory(''); setNewCondition('');
    Alert.alert('Success!', 'Your classified ad has been posted successfully.');
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Marketplace</Text>
            <Text style={styles.headerSub}>Classified Ads</Text>
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={() => setIsCartVisible(true)}>
            <Ionicons name="bag-outline" size={24} color={Colors.light.text} />
            {appState.cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {appState.cart.reduce((a, b) => a + b.quantity, 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search classified ads..."
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

      {/* Category Chips */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={marketplaceCategories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, selectedCategory === item && styles.activeChip]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.chipText, selectedCategory === item && styles.activeChipText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chipsScroll}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.rowWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => setSelectedProduct(item)} activeOpacity={0.85}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            {item.condition && (
              <View style={styles.conditionBadge}>
                <Text style={styles.conditionText}>{item.condition}</Text>
              </View>
            )}
            <View style={styles.productContent}>
              <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
              <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.productMeta}>
                <Ionicons name="location-outline" size={11} color={Colors.light.textSecondary} />
                <Text style={styles.productLocation}>{item.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="storefront-outline" size={52} color={Colors.light.border} />
            <Text style={styles.emptyText}>No ads found</Text>
          </View>
        }
        contentContainerStyle={styles.gridContainer}
      />

      {/* FAB - Post Ad */}
      <TouchableOpacity style={styles.fab} onPress={() => setIsPostAdVisible(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Product Detail Modal */}
      <Modal visible={selectedProduct !== null} animationType="slide" onRequestClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Ad Details</Text>
              <View style={{ width: 24 }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedProduct.image }} style={styles.detailImage} />
              <View style={styles.detailBody}>
                <Text style={styles.detailPrice}>${selectedProduct.price.toLocaleString()}</Text>
                <Text style={styles.detailTitle}>{selectedProduct.title}</Text>
                <View style={styles.detailMetaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={Colors.light.textSecondary} />
                    <Text style={styles.metaText}>{selectedProduct.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={Colors.light.textSecondary} />
                    <Text style={styles.metaText}>{selectedProduct.postedDate}</Text>
                  </View>
                  {selectedProduct.condition && (
                    <View style={styles.metaItem}>
                      <Ionicons name="checkmark-circle-outline" size={14} color={Colors.light.success} />
                      <Text style={[styles.metaText, { color: Colors.light.success }]}>{selectedProduct.condition}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.divider} />
                <Text style={styles.sectionLabel}>Description</Text>
                <Text style={styles.detailDesc}>{selectedProduct.description}</Text>
                <View style={styles.divider} />
                <Text style={styles.sectionLabel}>Seller</Text>
                <View style={styles.sellerCard}>
                  <View style={styles.sellerAvatar}>
                    <Text style={styles.sellerAvatarText}>{selectedProduct.seller[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sellerName}>{selectedProduct.seller}</Text>
                    <Text style={styles.sellerSub}>Classified Ad Poster</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.addCartBtn} onPress={() => handleAddToCart(selectedProduct)}>
                  <Ionicons name="bag-add-outline" size={18} color="#fff" />
                  <Text style={styles.addCartBtnText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => Alert.alert('Contact Seller', `Phone: ${selectedProduct.sellerPhone}`)}
                >
                  <Ionicons name="call-outline" size={18} color={Colors.light.primary} />
                  <Text style={styles.callBtnText}>Contact Seller</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* Cart Modal */}
      <Modal visible={isCartVisible} animationType="slide" onRequestClose={() => setIsCartVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsCartVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Shopping Cart</Text>
            <View style={{ width: 24 }} />
          </View>
          <FlatList
            data={appState.cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                <View style={styles.cartItemContent}>
                  <Text style={styles.cartItemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cartItemPrice}>${item.price.toLocaleString()} x {item.quantity}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.cartRemove}>
                  <Ionicons name="trash-outline" size={20} color={Colors.light.error} />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="bag-handle-outline" size={52} color={Colors.light.border} />
                <Text style={styles.emptyText}>Your cart is empty</Text>
              </View>
            }
            contentContainerStyle={{ padding: Spacing.four }}
          />
          {appState.cart.length > 0 && (
            <View style={styles.cartFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalVal}>${cartTotal.toLocaleString()}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => {
                  Alert.alert('Order Placed!', 'Thank you for your order!', [
                    { text: 'OK', onPress: () => { clearCart(); setIsCartVisible(false); } }
                  ]);
                }}
              >
                <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Post Ad Modal */}
      <Modal visible={isPostAdVisible} animationType="slide" onRequestClose={() => setIsPostAdVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsPostAdVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Post Classified Ad</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={{ padding: Spacing.four }}>
            <Text style={styles.label}>Ad Title *</Text>
            <TextInput style={styles.formInput} placeholder="e.g. Traditional Pure Silk Saree" value={newTitle} onChangeText={setNewTitle} />

            <View style={styles.formRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Price ($) *</Text>
                <TextInput style={styles.formInput} placeholder="0.00" keyboardType="numeric" value={newPrice} onChangeText={setNewPrice} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Condition</Text>
                <TextInput style={styles.formInput} placeholder="New / Used" value={newCondition} onChangeText={setNewCondition} />
              </View>
            </View>

            <Text style={styles.label}>Category *</Text>
            <TextInput style={styles.formInput} placeholder="e.g. Vehicles, Clothing" value={newCategory} onChangeText={setNewCategory} />

            <Text style={styles.label}>Location</Text>
            <TextInput style={styles.formInput} placeholder="e.g. Toronto, ON" value={newLoc} onChangeText={setNewLoc} />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.formInput, { height: 100, textAlignVertical: 'top' }]}
              multiline numberOfLines={4}
              placeholder="Provide details about condition, pickup options..."
              value={newDesc} onChangeText={setNewDesc}
            />

            <Text style={styles.label}>Your Name *</Text>
            <TextInput style={styles.formInput} placeholder="Full Name" value={newSeller} onChangeText={setNewSeller} />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput style={styles.formInput} placeholder="+1 416-..." keyboardType="phone-pad" value={newPhone} onChangeText={setNewPhone} />

            <TouchableOpacity style={styles.submitBtn} onPress={handlePostAd}>
              <Text style={styles.submitBtnText}>Submit Classified Ad</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
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
    paddingHorizontal: Spacing.four,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
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
  cartButton: { padding: 4, position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.primary,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
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
  gridContainer: { padding: 12 },
  rowWrapper: { justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 12 },
  productCard: {
    width: width * 0.44,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: { width: '100%', height: 130, backgroundColor: '#f3f4f6' },
  conditionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  conditionText: { color: '#fff', fontSize: 9, fontWeight: '600' },
  productContent: { padding: 10 },
  productPrice: { fontSize: 16, fontWeight: '800', color: Colors.light.primary, marginBottom: 3 },
  productTitle: { fontSize: 12, fontWeight: '700', color: Colors.light.text, lineHeight: 17, marginBottom: 5, height: 34 },
  productMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  productLocation: { fontSize: 10, color: Colors.light.textSecondary },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginTop: 12 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.light.primary,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
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
  closeButton: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  detailImage: { width: '100%', height: 260, backgroundColor: '#f3f4f6' },
  detailBody: { padding: Spacing.four },
  detailPrice: { fontSize: 26, fontWeight: '800', color: Colors.light.primary, marginBottom: 5 },
  detailTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.text, lineHeight: 24, marginBottom: 12 },
  detailMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.light.textSecondary },
  divider: { height: 1, backgroundColor: Colors.light.border, marginVertical: 14 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 8 },
  detailDesc: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 22 },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceContainerLow,
    padding: 12,
    borderRadius: 14,
    marginBottom: Spacing.three,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerAvatarText: { fontSize: 18, fontWeight: '800', color: Colors.light.primary },
  sellerName: { fontSize: 14, fontWeight: '700', color: Colors.light.text },
  sellerSub: { fontSize: 11, color: Colors.light.textSecondary },
  addCartBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  addCartBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  callBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  callBtnText: { color: Colors.light.primary, fontWeight: '700', fontSize: 15 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cartItemImage: { width: 55, height: 55, borderRadius: 10, marginRight: 12, backgroundColor: '#f3f4f6' },
  cartItemContent: { flex: 1 },
  cartItemTitle: { fontSize: 14, fontWeight: '700', color: Colors.light.text },
  cartItemPrice: { fontSize: 13, color: Colors.light.primary, fontWeight: '600', marginTop: 2 },
  cartRemove: { padding: 8 },
  cartFooter: {
    padding: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: '#fff',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.light.textSecondary },
  totalVal: { fontSize: 22, fontWeight: '800', color: Colors.light.primary },
  checkoutBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.light.text, marginBottom: 5, marginTop: 12 },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  formRow: { flexDirection: 'row' },
  submitBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
