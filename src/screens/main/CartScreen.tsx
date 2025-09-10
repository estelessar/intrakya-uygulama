import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  seller: string;
  quantity: number;
  inStock: boolean;
  maxQuantity: number;
  discount?: number;
}

type CartScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Cart'>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'iPhone 14 Pro Max 256GB',
      price: 42000,
      originalPrice: 45000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
      seller: 'TechStore',
      quantity: 1,
      inStock: true,
      maxQuantity: 5,
      discount: 7
    },
    {
      id: '2',
      name: 'AirPods Pro 2. Nesil',
      price: 3200,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300',
      seller: 'AudioTech',
      quantity: 2,
      inStock: true,
      maxQuantity: 10,
      discount: 9
    },
    {
      id: '3',
      name: 'Samsung Galaxy S23 Ultra',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300',
      seller: 'MobileWorld',
      quantity: 1,
      inStock: false,
      maxQuantity: 3
    },
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.min(newQuantity, item.maxQuantity) };
      }
      return item;
    }));
  };

  const removeItem = (itemId: string) => {
    Alert.alert(
      'Ürünü Kaldır',
      'Bu ürünü sepetinizden kaldırmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: () => {
            setCartItems(cartItems.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const itemDiscounts = cartItems.reduce((total, item) => {
      if (item.originalPrice) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
    return itemDiscounts + promoDiscount;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = subtotal > 500 ? 0 : 29.99;
    return subtotal - discount + shipping;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, !item.inStock && styles.outOfStockItem]}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>%{item.discount}</Text>
          </View>
        )}
        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Stokta Yok</Text>
          </View>
        )}
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemSeller}>{item.seller}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₺{item.price.toLocaleString()}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>₺{item.originalPrice.toLocaleString()}</Text>
          )}
        </View>
        
        {item.inStock ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
            >
              <Ionicons 
                name="add" 
                size={16} 
                color={item.quantity >= item.maxQuantity ? "#ccc" : "#000"} 
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.outOfStockLabel}>Stokta bulunmuyor</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Sepetiniz boş</Text>
      <Text style={styles.emptySubtitle}>
        Alışverişe başlamak için ürünleri sepetinize ekleyin.
      </Text>
      <TouchableOpacity 
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Text style={styles.shopNowText}>Alışverişe Başla</Text>
      </TouchableOpacity>
    </View>
  );

  const handleCheckout = () => {
    navigation.navigate('Checkout', {
      items: cartItems,
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      total: total
    });
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const shipping = subtotal > 500 ? 0 : 29.99;
  const total = calculateTotal();
  const inStockItems = cartItems.filter(item => item.inStock);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sepetim</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {cartItems.length > 0 ? (
        <>
          {/* Cart Items Count */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{cartItems.length} ürün</Text>
            <TouchableOpacity style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>Sepeti Temizle</Text>
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Order Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Sipariş Özeti</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ara Toplam ({inStockItems.length} ürün)</Text>
              <Text style={styles.summaryValue}>₺{subtotal.toLocaleString()}</Text>
            </View>
            
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>İndirim</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>-₺{discount.toLocaleString()}</Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Kargo</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}
              </Text>
            </View>
            
            {subtotal < 500 && (
              <Text style={styles.freeShippingNote}>
                ₺{(500 - subtotal).toLocaleString()} daha alışveriş yapın, kargo ücretsiz olsun!
              </Text>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Toplam</Text>
              <Text style={styles.totalValue}>₺{total.toLocaleString()}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <View style={styles.checkoutContainer}>
            <TouchableOpacity 
              style={[
                styles.checkoutButton,
                inStockItems.length === 0 && styles.disabledCheckoutButton
              ]}
              disabled={inStockItems.length === 0}
              onPress={handleCheckout}
            >
              <Text style={[
                styles.checkoutText,
                inStockItems.length === 0 && styles.disabledCheckoutText
              ]}>
                {inStockItems.length === 0 ? 'Sepetinizde stokta ürün yok' : 'Ödemeye Geç'}
              </Text>
              {inStockItems.length > 0 && (
                <Ionicons name="arrow-forward" size={20} color="#000" />
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <EmptyCart />
      )}

      <BottomNavigation activeTab="cart" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  countText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
    fontFamily: 'System',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cartItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
  },
  outOfStockItem: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  itemImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '600',
    fontFamily: 'System',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'System',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  itemSeller: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'System',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
    fontFamily: 'System',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 12,
    fontFamily: 'System',
  },
  outOfStockLabel: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
    fontFamily: 'System',
  },
  removeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'System',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'System',
  },
  discountValue: {
    color: '#4CAF50',
  },
  freeShippingNote: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
    marginTop: 4,
    fontFamily: 'System',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
  checkoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledCheckoutButton: {
    backgroundColor: '#f0f0f0',
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
    fontFamily: 'System',
  },
  disabledCheckoutText: {
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: 'System',
  },
  shopNowButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shopNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
});

export default CartScreen;