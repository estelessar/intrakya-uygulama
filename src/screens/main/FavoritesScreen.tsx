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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../../components/BottomNavigation';
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../../navigation/types'

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  seller: string;
  inStock: boolean;
  discount?: number;
}

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([
    {
      id: '1',
      name: 'iPhone 14 Pro Max 256GB',
      price: 42000,
      originalPrice: 45000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
      rating: 4.8,
      seller: 'TechStore',
      inStock: true,
      discount: 7
    },
    {
      id: '2',
      name: 'Samsung Galaxy S23 Ultra',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300',
      rating: 4.6,
      seller: 'MobileWorld',
      inStock: true
    },
    {
      id: '3',
      name: 'MacBook Air M2 13"',
      price: 28000,
      originalPrice: 30000,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300',
      rating: 4.9,
      seller: 'AppleStore',
      inStock: false,
      discount: 7
    },
    {
      id: '4',
      name: 'AirPods Pro 2. Nesil',
      price: 3200,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300',
      rating: 4.7,
      seller: 'AudioTech',
      inStock: true,
      discount: 9
    },
    {
      id: '5',
      name: 'Sony WH-1000XM4 Kulaklık',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300',
      rating: 4.5,
      seller: 'SoundStore',
      inStock: true
    },
  ]);

  const removeFavorite = (productId: string) => {
    Alert.alert(
      'Favorilerden Çıkar',
      'Bu ürünü favorilerinizden çıkarmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkar',
          style: 'destructive',
          onPress: () => {
            setFavorites(favorites.filter(item => item.id !== productId));
          },
        },
      ]
    );
  };

  const addToCart = (product: FavoriteProduct) => {
    if (!product.inStock) {
      Alert.alert('Stokta Yok', 'Bu ürün şu anda stokta bulunmuyor.');
      return;
    }
    Alert.alert('Sepete Eklendi', `${product.name} sepetinize eklendi.`);
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteProduct }) => (
    <TouchableOpacity 
      style={styles.favoriteCard}
      onPress={() => navigation.navigate('ProductDetail', {
        productId: item.id,
        productName: item.name,
        productPrice: item.price,
        productImage: item.image,
      })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
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
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productSeller}>{item.seller}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviewCount}>(234 değerlendirme)</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₺{item.price.toLocaleString()}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>₺{item.originalPrice.toLocaleString()}</Text>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.addToCartButton,
              !item.inStock && styles.disabledButton
            ]}
            onPress={() => addToCart(item)}
            disabled={!item.inStock}
          >
            <Ionicons 
              name={item.inStock ? "cart-outline" : "ban-outline"} 
              size={16} 
              color={item.inStock ? "#000" : "#999"} 
            />
            <Text style={[
              styles.addToCartText,
              !item.inStock && styles.disabledText
            ]}>
              {item.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFavorite(item.id)}
          >
            <Ionicons name="heart" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Henüz favori ürününüz yok</Text>
      <Text style={styles.emptySubtitle}>
        Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.
      </Text>
      <TouchableOpacity 
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Text style={styles.shopNowText}>Alışverişe Başla</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.headerTitle}>Favorilerim</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Favorites Count */}
      {favorites.length > 0 && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{favorites.length} favori ürün</Text>
          <TouchableOpacity style={styles.clearAllButton}>
            <Text style={styles.clearAllText}>Tümünü Temizle</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyFavorites />
      )}

      <BottomNavigation activeTab="favorites" />
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
    paddingBottom: 100,
  },
  favoriteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
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
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 10,
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
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  productSeller: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'System',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'System',
  },
  reviewCount: {
    fontSize: 10,
    color: '#999',
    marginLeft: 4,
    fontFamily: 'System',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 16,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
    fontFamily: 'System',
  },
  disabledText: {
    color: '#999',
  },
  removeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
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

export default FavoritesScreen;