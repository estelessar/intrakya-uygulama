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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

type SellerListNavigationProp = StackNavigationProp<MainStackParamList, 'SellerList'>;

interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
  isVerified: boolean;
  productCount: number;
  joinDate: string;
  description: string;
  responseTime: string;
  badges: string[];
}

const SellerListScreen: React.FC = () => {
  const navigation = useNavigation<SellerListNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'products'>('rating');
  
  // Demo data
  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'electronics', name: 'Elektronik' },
    { id: 'fashion', name: 'Moda' },
    { id: 'home', name: 'Ev & Yaşam' },
    { id: 'sports', name: 'Spor' },
    { id: 'books', name: 'Kitap' },
    { id: 'beauty', name: 'Kozmetik' },
  ];
  
  const sellersData: Seller[] = [
    {
      id: '1',
      name: 'TechStore İstanbul',
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      rating: 4.8,
      reviewCount: 1247,
      location: 'İstanbul, Türkiye',
      category: 'electronics',
      isVerified: true,
      productCount: 156,
      joinDate: '2020-03-15',
      description: 'En kaliteli elektronik ürünleri uygun fiyatlarla sunuyoruz.',
      responseTime: '2 saat içinde',
      badges: ['Güvenilir Satıcı', 'Hızlı Kargo']
    },
    {
      id: '2',
      name: 'Moda Dünyası',
      avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
      rating: 4.6,
      reviewCount: 892,
      location: 'Ankara, Türkiye',
      category: 'fashion',
      isVerified: true,
      productCount: 234,
      joinDate: '2019-08-22',
      description: 'Trend moda ürünleri ve aksesuar çeşitleri.',
      responseTime: '1 saat içinde',
      badges: ['Trend Takipçisi', 'Kaliteli Ürün']
    },
    {
      id: '3',
      name: 'Ev Dekorasyon',
      avatar: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
      rating: 4.7,
      reviewCount: 567,
      location: 'İzmir, Türkiye',
      category: 'home',
      isVerified: false,
      productCount: 89,
      joinDate: '2021-01-10',
      description: 'Evinizi güzelleştiren dekoratif ürünler.',
      responseTime: '4 saat içinde',
      badges: ['Yaratıcı Tasarım']
    },
    {
      id: '4',
      name: 'Spor Merkezi',
      avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
      rating: 4.5,
      reviewCount: 423,
      location: 'Bursa, Türkiye',
      category: 'sports',
      isVerified: true,
      productCount: 178,
      joinDate: '2020-11-05',
      description: 'Spor malzemeleri ve fitness ekipmanları.',
      responseTime: '3 saat içinde',
      badges: ['Spor Uzmanı', 'Kaliteli Ürün']
    },
    {
      id: '5',
      name: 'Kitap Dünyası',
      avatar: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200',
      rating: 4.9,
      reviewCount: 1156,
      location: 'İstanbul, Türkiye',
      category: 'books',
      isVerified: true,
      productCount: 567,
      joinDate: '2018-05-12',
      description: 'Geniş kitap koleksiyonu ve hızlı teslimat.',
      responseTime: '30 dakika içinde',
      badges: ['Kitap Uzmanı', 'Hızlı Teslimat', 'Güvenilir Satıcı']
    },
    {
      id: '6',
      name: 'Güzellik Merkezi',
      avatar: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200',
      rating: 4.4,
      reviewCount: 334,
      location: 'Antalya, Türkiye',
      category: 'beauty',
      isVerified: false,
      productCount: 123,
      joinDate: '2021-09-18',
      description: 'Kozmetik ve kişisel bakım ürünleri.',
      responseTime: '6 saat içinde',
      badges: ['Doğal Ürün']
    },
  ];

  const getFilteredSellers = () => {
    let filtered = sellersData;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(seller => 
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(seller => seller.category === selectedCategory);
    }
    
    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
        break;
      case 'products':
        filtered.sort((a, b) => b.productCount - a.productCount);
        break;
    }
    
    return filtered;
  };

  const handleSellerPress = (seller: Seller) => {
    navigation.navigate('SellerProfile', {
      sellerId: seller.id,
      sellerName: seller.name
    });
  };

  const renderSellerCard = ({ item }: { item: Seller }) => (
    <TouchableOpacity 
      style={styles.sellerCard}
      onPress={() => handleSellerPress(item)}
    >
      <View style={styles.sellerHeader}>
        <Image source={{ uri: item.avatar }} style={styles.sellerAvatar} />
        <View style={styles.sellerInfo}>
          <View style={styles.sellerNameRow}>
            <Text style={styles.sellerName} numberOfLines={1}>{item.name}</Text>
            {item.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={styles.verifiedIcon} />
            )}
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount} değerlendirme)</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color="#666" />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.sellerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.productCount}</Text>
          <Text style={styles.statLabel}>Ürün</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.responseTime}</Text>
          <Text style={styles.statLabel}>Yanıt Süresi</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{new Date(item.joinDate).getFullYear()}</Text>
          <Text style={styles.statLabel}>Üyelik</Text>
        </View>
      </View>
      
      {item.badges.length > 0 && (
        <View style={styles.badgesContainer}>
          {item.badges.slice(0, 2).map((badge, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
          {item.badges.length > 2 && (
            <Text style={styles.moreBadges}>+{item.badges.length - 2}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCategoryTab = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.id && styles.activeCategoryTab
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[
        styles.categoryTabText,
        selectedCategory === item.id && styles.activeCategoryTabText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Satıcılar</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Satıcı ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sırala:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'rating' && styles.activeSortButton]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.activeSortButtonText]}>Puan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'newest' && styles.activeSortButton]}
          onPress={() => setSortBy('newest')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'newest' && styles.activeSortButtonText]}>En Yeni</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'products' && styles.activeSortButton]}
          onPress={() => setSortBy('products')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'products' && styles.activeSortButtonText]}>Ürün Sayısı</Text>
        </TouchableOpacity>
      </View>

      {/* Sellers List */}
      <FlatList
        data={getFilteredSellers()}
        renderItem={renderSellerCard}
        keyExtractor={(item) => item.id}
        style={styles.sellersList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sellersListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="storefront-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Satıcı bulunamadı</Text>
            <Text style={styles.emptySubtext}>Arama kriterlerinizi değiştirmeyi deneyin</Text>
          </View>
        }
      />

      <BottomNavigation />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'System',
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'System',
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryTab: {
    backgroundColor: '#FFD700',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'System',
  },
  activeCategoryTabText: {
    color: '#000',
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
    fontFamily: 'System',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  activeSortButton: {
    backgroundColor: '#FFD700',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'System',
  },
  activeSortButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  sellersList: {
    flex: 1,
  },
  sellersListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 100,
  },
  sellerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sellerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sellerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    fontFamily: 'System',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
    fontFamily: 'System',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'System',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'System',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'System',
  },
  sellerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
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
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '500',
    fontFamily: 'System',
  },
  moreBadges: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    fontFamily: 'System',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
});

export default SellerListScreen;