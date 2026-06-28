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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { useAppStore, type MarketplaceItem } from '@/store/app-store';
import { marketplaceItems as initialProducts, marketplaceCategories as categories } from '@/data/mock-data';

const { width } = Dimensions.get('window');

export default function MarketplaceScreen() {
  const { state: appState, addToCart, removeFromCart, cartTotal, clearCart } = useAppStore();
  
  const [products, setProducts] = useState<MarketplaceItem[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);

  // Modals state
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isPostAdVisible, setIsPostAdVisible] = useState(false);

  // New Ad Form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Furniture');
  const [newLoc, setNewLoc] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeller, setNewSeller] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: MarketplaceItem) => {
    addToCart(product);
    Alert.alert('Success', `${product.title} has been added to your cart.`);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const handlePostAd = () => {
    if (!newTitle || !newPrice || !newDesc || !newSeller || !newPhone) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum)) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }

    const newAd: MarketplaceItem = {
      id: (products.length + 1).toString(),
      title: newTitle,
      price: priceNum,
      category: newCategory,
      location: newLoc || 'Toronto, ON',
      postedDate: 'Just now',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
      description: newDesc,
      seller: newSeller,
      sellerPhone: newPhone,
    };

    setProducts([newAd, ...products]);
    setIsPostAdVisible(false);
    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setNewSeller('');
    setNewPhone('');
    setNewLoc('');

    Alert.alert('Success', 'Your classified ad has been posted successfully!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.light.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Marketplace..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => setIsCartVisible(true)}>
          <Ionicons name="bag-outline" size={24} color={Colors.light.text} />
          {appState.cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{appState.cart.reduce((a, b) => a + b.quantity, 0)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Categories Chips */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...categories]}
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

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.rowWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => setSelectedProduct(item)}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productContent}>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.productLocation}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
        contentContainerStyle={styles.gridContainer}
      />

      {/* Floating Action Button for Posting Ad */}
      <TouchableOpacity style={styles.fab} onPress={() => setIsPostAdVisible(true)}>
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Product Detail Modal */}
      <Modal
        visible={selectedProduct !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>Ad Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedProduct.image }} style={styles.detailImage} />
              <View style={styles.detailBody}>
                <Text style={styles.detailPrice}>${selectedProduct.price.toFixed(2)}</Text>
                <Text style={styles.detailTitle}>{selectedProduct.title}</Text>
                
                <View style={styles.metaRow}>
                  <View style={styles.metaCol}>
                    <Ionicons name="location-outline" size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.metaText}>{selectedProduct.location}</Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Ionicons name="time-outline" size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.metaText}>{selectedProduct.postedDate}</Text>
                  </View>
                </View>

                <View style={styles.divider} />
                
                <Text style={styles.detailSectionTitle}>Description</Text>
                <Text style={styles.detailDesc}>{selectedProduct.description}</Text>

                <View style={styles.divider} />

                <Text style={styles.detailSectionTitle}>Seller Information</Text>
                <View style={styles.sellerCard}>
                  <View style={styles.sellerAvatar}>
                    <Text style={styles.sellerAvatarText}>{selectedProduct.seller[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sellerName}>{selectedProduct.seller}</Text>
                    <Text style={styles.sellerLabel}>Classified Ad Poster</Text>
                  </View>
                </View>

                {/* Actions */}
                <TouchableOpacity style={styles.addCartBtn} onPress={() => handleAddToCart(selectedProduct)}>
                  <Ionicons name="bag-add-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.addCartBtnText}>Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.addCartBtn, { backgroundColor: '#ffffff', borderWidth: 1, borderColor: Colors.light.primary, marginTop: Spacing.two }]}
                  onPress={() => Alert.alert('Contact Seller', `Phone: ${selectedProduct.sellerPhone}`)}
                >
                  <Ionicons name="call-outline" size={20} color={Colors.light.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.addCartBtnText, { color: Colors.light.primary }]}>Contact Seller</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* Cart Modal */}
      <Modal
        visible={isCartVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsCartVisible(false)}
      >
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
                  <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)} style={styles.cartRemove}>
                  <Ionicons name="trash-outline" size={20} color={Colors.light.error} />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="bag-handle-outline" size={48} color={Colors.light.textSecondary} />
                <Text style={styles.emptyText}>Your cart is empty</Text>
              </View>
            }
            contentContainerStyle={{ padding: Spacing.four }}
          />

          {appState.cart.length > 0 && (
            <View style={styles.cartFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Grand Total:</Text>
                <Text style={styles.totalVal}>${cartTotal.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => {
                  Alert.alert('Checkout Complete', 'Thank you for your simulated order!', [
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
      <Modal
        visible={isPostAdVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsPostAdVisible(false)}
      >
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
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Traditional Pure Silk Saree"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <View style={styles.formRow}>
              <View style={{ flex: 1, marginRight: Spacing.two }}>
                <Text style={styles.label}>Price ($) *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 150"
                  keyboardType="numeric"
                  value={newPrice}
                  onChangeText={setNewPrice}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Category *</Text>
                <View style={styles.dropdownBg}>
                  <TextInput
                    style={[styles.formInput, { borderWidth: 0, marginBottom: 0 }]}
                    placeholder="Furniture, Clothing..."
                    value={newCategory}
                    onChangeText={setNewCategory}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Toronto, ON"
              value={newLoc}
              onChangeText={setNewLoc}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.formInput, { height: 100, textAlignVertical: 'top' }]}
              multiline
              numberOfLines={4}
              placeholder="Provide details about condition, sizes, pick-up options..."
              value={newDesc}
              onChangeText={setNewDesc}
            />

            <Text style={styles.label}>Seller Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Your Name"
              value={newSeller}
              onChangeText={setNewSeller}
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Your Phone Number"
              keyboardType="phone-pad"
              value={newPhone}
              onChangeText={setNewPhone}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handlePostAd}>
              <Text style={styles.submitBtnText}>Submit Classified Ad</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    justifyContent: 'space-between',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginRight: Spacing.three,
  },
  searchIcon: {
    marginRight: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  cartButton: {
    padding: Spacing.one,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
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
  },
  activeChipText: {
    color: '#ffffff',
  },
  gridContainer: {
    padding: Spacing.three,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.one,
    marginBottom: Spacing.three,
  },
  productCard: {
    width: width * 0.44,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  productContent: {
    padding: Spacing.three,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.secondary,
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 18,
    marginBottom: Spacing.two,
    height: 36,
  },
  productLocation: {
    fontSize: 10,
    color: Colors.light.textSecondary,
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.light.secondary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
    padding: Spacing.one,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  detailImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#eee',
  },
  detailBody: {
    padding: Spacing.four,
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.secondary,
    marginBottom: Spacing.one,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: Spacing.two,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    marginBottom: Spacing.three,
  },
  metaCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.three,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  detailDesc: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.four,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffdbcf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  sellerAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sellerLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  addCartBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCartBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: Spacing.three,
    backgroundColor: '#eee',
  },
  cartItemContent: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  cartItemPrice: {
    fontSize: 13,
    color: Colors.light.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  cartRemove: {
    padding: Spacing.two,
  },
  cartFooter: {
    padding: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: '#ffffff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.secondary,
  },
  checkoutBtn: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.one,
    marginTop: Spacing.three,
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
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownBg: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  submitBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.five,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
