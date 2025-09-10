import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../../navigation/types'
import BottomNavigation from '../../components/BottomNavigation';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

interface SellerData {
  id: string;
  username: string;
  profileImage: string;
  followers: number;
  following: number;
  totalProducts: number;
  biography: string;
  rating: number;
  totalReviews: number;
  joinDate: string;
}

const SellerProfileScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [activeTab, setActiveTab] = useState<'products' | 'archive'>('products');
  const [menuVisible, setMenuVisible] = useState(false);

  // Demo satıcı verisi
  const sellerData: SellerData = {
    id: '1',
    username: 'teknoloji_dunyasi',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    followers: 15420,
    following: 892,
    totalProducts: 156,
    biography: 'Teknoloji ürünleri konusunda uzman satıcı. Kaliteli ve orijinal ürünler sunuyoruz. 5 yıllık deneyim.',
    rating: 4.8,
    totalReviews: 2341,
    joinDate: '2019-03-15',
  };

  // Demo ürün verisi
  const demoProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      price: 65999,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop&crop=center',
      rating: 4.9,
      reviews: 234,
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      price: 45999,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center',
      rating: 4.7,
      reviews: 189,
    },
    {
      id: '3',
      name: 'MacBook Air M3',
      price: 89999,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&crop=center',
      rating: 4.8,
      reviews: 156,
    },
    {
      id: '4',
      name: 'AirPods Pro 2',
      price: 12999,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop&crop=center',
      rating: 4.6,
      reviews: 298,
    },
  ];

  const archivedProducts: Product[] = [
    {
      id: '5',
      name: 'iPhone 14 Pro',
      price: 55999,
      image: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=300&h=300&fit=crop&crop=center',
      rating: 4.8,
      reviews: 445,
    },
    {
      id: '6',
      name: 'iPad Air 5',
      price: 35999,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&crop=center',
      rating: 4.7,
      reviews: 223,
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('tr-TR') + ' ₺';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
      );
    }

    return stars;
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', {
        productId: item.id,
        productName: item.name,
        productPrice: item.price,
        productImage: item.image,
      })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productRating}>
          <View style={styles.stars}>
            {renderStars(item.rating)}
          </View>
          <Text style={styles.reviewCount}>({item.reviews})</Text>
        </View>
        <Text style={styles.productPrice}>₺{item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Satıcı Profili</Text>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profil Bilgileri */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: sellerData.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(sellerData.totalProducts)}
                </Text>
                <Text style={styles.statLabel}>Ürün</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(sellerData.followers)}
                </Text>
                <Text style={styles.statLabel}>Takipçi</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(sellerData.following)}
                </Text>
                <Text style={styles.statLabel}>Takip</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.username}>@{sellerData.username}</Text>
            <Text style={styles.biography}>{sellerData.biography}</Text>
            
            <View style={styles.ratingSection}>
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {renderStars(sellerData.rating)}
                </View>
                <Text style={styles.ratingText}>
                  {sellerData.rating} ({formatNumber(sellerData.totalReviews)} değerlendirme)
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Takip Et</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'products' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('products')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'products' && styles.activeTabText,
              ]}
            >
              Ürünler ({demoProducts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'archive' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('archive')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'archive' && styles.activeTabText,
              ]}
            >
              Arşiv ({archivedProducts.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ürün Listesi */}
        <View style={styles.productsContainer}>
          <FlatList
            data={activeTab === 'products' ? demoProducts : archivedProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert('Bilgi', 'Satıcıyı şikayet et özelliği yakında eklenecek.');
              }}
            >
              <Ionicons name="flag-outline" size={20} color="#E63946" />
              <Text style={[styles.menuItemText, { color: '#E63946' }]}>Şikayet Et</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert('Bilgi', 'Satıcıyı engelle özelliği yakında eklenecek.');
              }}
            >
              <Ionicons name="ban-outline" size={20} color="#E63946" />
              <Text style={[styles.menuItemText, { color: '#E63946' }]}>Engelle</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert('Bilgi', 'Paylaş özelliği yakında eklenecek.');
              }}
            >
              <Ionicons name="share-outline" size={20} color="#000" />
              <Text style={styles.menuItemText}>Paylaş</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert('Bilgi', 'Satıcı ol özelliği yakında eklenecek.');
              }}
            >
              <Ionicons name="storefront-outline" size={20} color="#FFD700" />
              <Text style={[styles.menuItemText, { color: '#FFD700' }]}>Satıcı Ol</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 1000,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  moreButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profileInfo: {
    marginTop: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  biography: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingSection: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  messageButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  productsContainer: {
    padding: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '50%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#000',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
  },
});

export default SellerProfileScreen;