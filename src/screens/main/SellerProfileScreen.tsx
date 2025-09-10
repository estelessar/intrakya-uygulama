import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';

type SellerProfileRouteProp = RouteProp<MainStackParamList, 'SellerProfile'>;
type SellerProfileNavigationProp = StackNavigationProp<MainStackParamList, 'SellerProfile'>;

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  soldCount: number;
}

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  productName: string;
}

const SellerProfileScreen: React.FC = () => {
  const navigation = useNavigation<SellerProfileNavigationProp>();
  const route = useRoute<SellerProfileRouteProp>();
  const { sellerId, sellerName } = route.params;
  
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');
  
  // Demo seller data
  const sellerData = {
    id: sellerId,
    name: sellerName,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    rating: 4.8,
    reviewCount: 1247,
    productCount: 156,
    followerCount: 3420,
    joinDate: '2020',
    location: 'İstanbul, Türkiye',
    description: 'Kaliteli ve uygun fiyatlı ürünler sunuyoruz. Müşteri memnuniyeti bizim önceliğimizdir.',
    responseTime: '2 saat içinde',
    responseRate: '98%',
    isVerified: true,
    isFollowing: false,
    // Komisyon bilgileri
    commissionRate: 10, // %10 komisyon oranı
    totalEarnings: 45750.50, // Toplam kazanç
    totalCommissionPaid: 5083.39, // Ödenen toplam komisyon
    lastCommissionPayment: '2024-01-15',
    monthlyEarnings: 12450.75, // Bu ay kazanç
    monthlyCommission: 1383.42 // Bu ay komisyon
  };
  
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Bluetooth Kulaklık',
      price: 299,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      rating: 4.7,
      soldCount: 234
    },
    {
      id: '2',
      name: 'Akıllı Saat Pro',
      price: 899,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      rating: 4.9,
      soldCount: 156
    },
    {
      id: '3',
      name: 'Wireless Şarj Cihazı',
      price: 149,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300',
      rating: 4.5,
      soldCount: 89
    },
    {
      id: '4',
      name: 'USB-C Hub',
      price: 199,
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300',
      rating: 4.6,
      soldCount: 67
    }
  ];
  
  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Ahmet Yılmaz',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 5,
      comment: 'Harika bir satıcı! Ürün açıklaması ile birebir aynı geldi. Kargo çok hızlıydı.',
      date: '2024-01-15',
      productName: 'Premium Bluetooth Kulaklık'
    },
    {
      id: '2',
      userName: 'Zeynep Kaya',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      rating: 4,
      comment: 'Ürün kaliteli, satıcı çok ilgili. Teşekkürler!',
      date: '2024-01-12',
      productName: 'Akıllı Saat Pro'
    },
    {
      id: '3',
      userName: 'Mehmet Demir',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 5,
      comment: 'Çok memnun kaldım. Kesinlikle tavsiye ederim.',
      date: '2024-01-10',
      productName: 'Wireless Şarj Cihazı'
    }
  ];

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.image,
      sellerId: sellerId
    });
  };

  const handleFollowPress = () => {
    Alert.alert(
      sellerData.isFollowing ? 'Takibi Bırak' : 'Takip Et',
      `${sellerName} ${sellerData.isFollowing ? 'takip listenden çıkarılsın' : 'takip listene eklensin'} mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: sellerData.isFollowing ? 'Takibi Bırak' : 'Takip Et', 
          onPress: () => {
            Alert.alert('Başarılı', sellerData.isFollowing ? 'Takip bırakıldı' : 'Takip edildi');
          }
        }
      ]
    );
  };

  const handleMessagePress = () => {
    navigation.navigate('ChatDetail', {
      sellerId: sellerId,
      sellerName: sellerName,
      sellerAvatar: sellerData.avatar
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productRating}>
          {renderStars(Math.floor(item.rating))}
          <Text style={styles.ratingText}>({item.rating})</Text>
        </View>
        <Text style={styles.soldCount}>{item.soldCount} satıldı</Text>
        <Text style={styles.productPrice}>₺{item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.userAvatar }} style={styles.reviewerAvatar} />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.userName}</Text>
          <View style={styles.reviewRating}>
            {renderStars(item.rating)}
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      <Text style={styles.reviewProduct}>Ürün: {item.productName}</Text>
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
        <Text style={styles.headerTitle}>Satıcı Profili</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <Image source={{ uri: sellerData.coverImage }} style={styles.coverImage} />
        
        {/* Seller Info */}
        <View style={styles.sellerInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: sellerData.avatar }} style={styles.sellerAvatar} />
            {sellerData.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </View>
          
          <View style={styles.sellerDetails}>
            <Text style={styles.sellerName}>{sellerData.name}</Text>
            <Text style={styles.sellerLocation}>{sellerData.location}</Text>
            <Text style={styles.joinDate}>{sellerData.joinDate} yılından beri üye</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{sellerData.rating}</Text>
                <Text style={styles.statLabel}>Puan</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{sellerData.reviewCount}</Text>
                <Text style={styles.statLabel}>Değerlendirme</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{sellerData.productCount}</Text>
                <Text style={styles.statLabel}>Ürün</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{sellerData.followerCount}</Text>
                <Text style={styles.statLabel}>Takipçi</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>{sellerData.description}</Text>
        </View>
        
        {/* Response Info */}
        <View style={styles.responseInfo}>
          <View style={styles.responseItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.responseText}>Yanıt süresi: {sellerData.responseTime}</Text>
          </View>
          <View style={styles.responseItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
            <Text style={styles.responseText}>Yanıt oranı: {sellerData.responseRate}</Text>
          </View>
        </View>
        
        {/* Commission Info */}
        <View style={styles.commissionInfo}>
          <Text style={styles.commissionTitle}>Komisyon Bilgileri</Text>
          <View style={styles.commissionRow}>
            <View style={styles.commissionItem}>
              <Ionicons name="analytics" size={20} color="#FFD700" />
              <View style={styles.commissionDetails}>
                <Text style={styles.commissionLabel}>Komisyon Oranı</Text>
                <Text style={styles.commissionValue}>%{sellerData.commissionRate}</Text>
              </View>
            </View>
            <View style={styles.commissionItem}>
              <Ionicons name="wallet-outline" size={20} color="#4CAF50" />
              <View style={styles.commissionDetails}>
                <Text style={styles.commissionLabel}>Toplam Kazanç</Text>
                <Text style={styles.commissionValue}>₺{sellerData.totalEarnings.toLocaleString()}</Text>
              </View>
            </View>
          </View>
          <View style={styles.commissionRow}>
            <View style={styles.commissionItem}>
              <Ionicons name="card-outline" size={20} color="#FF5722" />
              <View style={styles.commissionDetails}>
                <Text style={styles.commissionLabel}>Ödenen Komisyon</Text>
                <Text style={styles.commissionValue}>₺{sellerData.totalCommissionPaid.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.commissionItem}>
              <Ionicons name="calendar-outline" size={20} color="#2196F3" />
              <View style={styles.commissionDetails}>
                <Text style={styles.commissionLabel}>Bu Ay Kazanç</Text>
                <Text style={styles.commissionValue}>₺{sellerData.monthlyEarnings.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.followButton]}
            onPress={handleFollowPress}
          >
            <Ionicons 
              name={sellerData.isFollowing ? "person-remove" : "person-add"} 
              size={20} 
              color={sellerData.isFollowing ? "#666" : "#000"} 
            />
            <Text style={[
              styles.actionButtonText,
              sellerData.isFollowing ? styles.unfollowText : styles.followText
            ]}>
              {sellerData.isFollowing ? 'Takibi Bırak' : 'Takip Et'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.messageButton]}
            onPress={handleMessagePress}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#000" />
            <Text style={styles.actionButtonText}>Mesaj Gönder</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'products' && styles.activeTab]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
              Ürünler ({sellerData.productCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Değerlendirmeler ({sellerData.reviewCount})
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'products' ? (
            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={reviews}
              renderItem={renderReview}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  sellerInfo: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    marginTop: -30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  sellerDetails: {
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  sellerLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'System',
  },
  joinDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
    fontFamily: 'System',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontFamily: 'System',
  },
  descriptionSection: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontFamily: 'System',
  },
  responseInfo: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  responseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'System',
  },
  commissionInfo: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  commissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    fontFamily: 'System',
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  commissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  commissionDetails: {
    marginLeft: 8,
    flex: 1,
  },
  commissionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'System',
  },
  commissionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  followButton: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
  },
  messageButton: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'System',
  },
  followText: {
    color: '#000',
  },
  unfollowText: {
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'System',
  },
  activeTabText: {
    color: '#FFD700',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'System',
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'System',
  },
  soldCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontFamily: 'System',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
  reviewCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'System',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'System',
  },
  reviewProduct: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    fontFamily: 'System',
  },
});

export default SellerProfileScreen;