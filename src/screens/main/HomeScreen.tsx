import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store/hooks';
import BottomNavigation from '../../components/BottomNavigation';
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from '../../navigation/types'
import {
  scaleWidth,
  scaleHeight,
  responsiveFontSize,
  responsivePadding,
  responsiveMargin,
  screenData,
  getCardWidth,
  getResponsiveColumns
} from '../../utils/responsive';

// Mock data - Figma tasarımına göre
const categories = [
  { id: '1', name: 'Giyim', icon: 'shirt' },
    { id: '2', name: 'Elektronik', icon: 'phone-portrait' },
  { id: '3', name: 'Kozmetik', icon: 'color-palette-outline' },
  { id: '4', name: 'Fitness', icon: 'fitness-outline' },
];

const newArrivals = [
  {
    id: '1',
    name: 'Fire-Boltt Phoenix Smart Watch with Bluetooth Calling 1.3", 120+ Sports Modes, 240 * 240 PX High Res with SpO2, Heart Rate Monitoring & IP67 Rating',
    price: '₺1,250.00',
    image: 'https://picsum.photos/400/400?random=1',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'All-in-One PC 12th Gen Intel Core i5-1235U 24-inch FHD Anti Glare Desktop (8GB RAM/512GB/Win 11)',
    price: '₺18,500.00',
    image: 'https://picsum.photos/400/400?random=2',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Western Dresses for Women | Short A-Line Dress for Girls | Maxi Dress for Women',
    price: '₺380.00',
    image: 'https://picsum.photos/400/400?random=3',
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Girl\'s Alloy Rose Gold Plated Dual Heart Pendant for mom with Crystal Stones',
    price: '₺450.00',
    image: 'https://picsum.photos/400/400?random=4',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Baby Gift Pack Series, Pack of 1 set, white',
    price: '₺265.00',
    image: 'https://picsum.photos/400/400?random=5',
    rating: 4.8,
  },
];

const featuredProducts = [
  {
    id: '1',
    name: 'Samsung Galaxy A14 5G (8 GB RAM, 128 GB ROM, Light Green)',
    price: '₺8,500.00',
    image: 'https://picsum.photos/400/400?random=10',
    rating: 4.6,
  },
  {
    id: '2',
    name: 'Full Body Mini Massager Gun (15 Mins Auto Off Timer, Dark Blue)',
    price: '₺890.00',
    image: 'https://picsum.photos/400/400?random=11',
    rating: 5.0,
  },
  {
    id: '3',
    name: 'NIVEA Sun Lotion, SPF 50, with UVA & UVB Protection, Water Resistant Sunscreen, 125 ml',
    price: '₺150.00',
    image: 'https://picsum.photos/400/400?random=12',
    rating: 4.5,
  },
];

const brands = [
  { id: '1', name: 'Nike', logo: 'https://picsum.photos/200/80?random=20' },
  { id: '2', name: 'Samsung', logo: 'https://picsum.photos/200/80?random=21' },
  { id: '3', name: 'Intel', logo: 'https://picsum.photos/200/80?random=22' },
  { id: '4', name: 'Apple', logo: 'https://picsum.photos/200/80?random=23' },
  { id: '5', name: 'Adidas', logo: 'https://picsum.photos/200/80?random=24' },
  { id: '6', name: 'Sony', logo: 'https://picsum.photos/200/80?random=25' },
  { id: '7', name: 'LG', logo: 'https://picsum.photos/200/80?random=26' },
  { id: '8', name: 'Puma', logo: 'https://picsum.photos/200/80?random=27' },
];

const topSellers = [
  {
    id: '1',
    name: 'TechMart Store',
    rating: 4.9,
    totalSales: '15.2K',
    image: 'https://picsum.photos/200/200?random=30',
    verified: true,
  },
  {
    id: '2',
    name: 'Fashion Hub',
    rating: 4.8,
    totalSales: '12.8K',
    image: 'https://picsum.photos/200/200?random=31',
    verified: true,
  },
  {
    id: '3',
    name: 'ElectroWorld',
    rating: 4.7,
    totalSales: '9.5K',
    image: 'https://picsum.photos/200/200?random=32',
    verified: true,
  },
  {
    id: '4',
    name: 'HomeDecor Plus',
    rating: 4.6,
    totalSales: '8.1K',
    image: 'https://picsum.photos/200/200?random=33',
    verified: false,
  },
];

const bestSellers = [
  {
    id: '1',
    name: 'Kısa Yaz Elbisesi',
    price: '₺680.00',
    originalPrice: '₺800.00',
    image: 'https://picsum.photos/400/500?random=40',
    rating: 5.0,
    onSale: true,
  },
  {
    id: '2',
    name: 'Bluetooth Hoparlör',
    price: '₺580.00',
    image: 'https://picsum.photos/400/500?random=41',
    rating: 4.5,
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { user } = useAppSelector((state) => state.auth);
  const userName = user?.email?.split('@')[0] || 'Kullanıcı';
  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Categories')}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon as any} size={24} color="#333" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTopSeller = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.topSellerCard}
      onPress={() => navigation.navigate('SellerProfile' as never)}
    >
      <View style={styles.topSellerImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.topSellerImage} 
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error)}
        />
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#FFD700" />
          </View>
        )}
      </View>
      <View style={styles.topSellerInfo}>
        <Text style={styles.topSellerName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.topSellerStats}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingTextSmall}>{item.rating}</Text>
          </View>
          <Text style={styles.salesText}>{item.totalSales} satış</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNewArrival = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.newArrivalCard}
      onPress={() => navigation.navigate('ProductDetail', {
        productId: item.id,
        productName: item.name,
        productPrice: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')),
        productImage: item.image,
      })}
    >
      <View style={styles.newArrivalRow}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.newArrivalImage} 
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error)}
        />
        <View style={styles.newArrivalInfo}>
          <Text style={styles.newArrivalName} numberOfLines={3}>
            {item.name}
          </Text>
          <Text style={styles.newArrivalPrice}>{item.price}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.newArrivalActions}>
          <TouchableOpacity style={styles.wishlistButton}>
            <Ionicons name="heart-outline" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addToCartButton}>
            <Ionicons name="add" size={20} color="#FF4C3B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedProduct = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.featuredProductCard}
      onPress={() => navigation.navigate('ProductDetail', {
        productId: item.id,
        productName: item.name,
        productPrice: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')),
        productImage: item.image,
      })}
    >
      <View style={styles.featuredProductImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.featuredProductImage} 
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error)}
        />
        <TouchableOpacity style={styles.wishlistButtonFeatured}>
          <Ionicons name="heart-outline" size={16} color="#999" />
        </TouchableOpacity>
      </View>
      <View style={styles.featuredProductInfo}>
        <Text style={styles.featuredProductName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.featuredProductPrice}>{item.price}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingTextSmall}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBrand = ({ item }: { item: any }) => (
    <View style={styles.brandCard}>
      <View style={styles.brandLogoContainer}>
        <Image 
          source={{ uri: item.logo }} 
          style={styles.brandLogo} 
          resizeMode="contain"
          onError={(error) => console.log('Image load error:', error)}
        />
      </View>
      <Text style={styles.brandName}>{item.name}</Text>
    </View>
  );

  const renderBestSeller = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.bestSellerCard}
      onPress={() => navigation.navigate('ProductDetail', {
        productId: item.id,
        productName: item.name,
        productPrice: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')),
        productImage: item.image,
      })}
    >
      <View style={styles.bestSellerImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.bestSellerImage} 
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error)}
        />
        {item.onSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>İndirim</Text>
          </View>
        )}
        <TouchableOpacity style={styles.wishlistButtonBestSeller}>
          <Ionicons name="heart-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      <View style={styles.bestSellerInfo}>
        <Text style={styles.bestSellerName}>{item.name}</Text>
        <View style={styles.bestSellerPriceContainer}>
          <Text style={styles.bestSellerPrice}>{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.bestSellerOriginalPrice}>{item.originalPrice}</Text>
          )}
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity>
              <Ionicons name="menu" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.appTitle}>INTRAKYA</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Ionicons name="search" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.divider} />

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Merhaba, {userName}</Text>
          <Text style={styles.subtitle}>Parmaklarınızın ucunda en iyi ürünleri bulun</Text>
        </View>



        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          />
        </View>

        {/* Top Sellers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>En İyi Satıcılar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SellerList')}>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topSellers}
            renderItem={renderTopSeller}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.topSellerList}
          />
        </View>

        {/* Best Sellers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>En Çok Satanlar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={bestSellers}
            renderItem={renderBestSeller}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bestSellerList}
          />
        </View>

        {/* Choose Brands */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Marka Seç</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={brands}
            renderItem={renderBrand}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.brandList}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Öne Çıkan Ürünler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={renderFeaturedProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredProductList}
          />
        </View>



        {/* New Arrivals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yeni Gelenler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryFilterContainer}>
            <TouchableOpacity style={styles.categoryFilterActive}>
              <Text style={styles.categoryFilterActiveText}>Tümü</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryFilter}>
              <Text style={styles.categoryFilterText}>Giyim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryFilter}>
              <Text style={styles.categoryFilterText}>Elektronik</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryFilter}>
              <Text style={styles.categoryFilterText}>Kozmetik</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryFilter}>
              <Text style={styles.categoryFilterText}>Fitness</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.newArrivalContainer}>
            {newArrivals.map((item) => (
              <View key={item.id}>
                {renderNewArrival({ item })}
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
      
      <BottomNavigation activeTab="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: responsivePadding.md,
    paddingVertical: responsivePadding.sm,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: responsiveFontSize.xl,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: responsiveMargin.md,
  },
  greetingSection: {
    paddingHorizontal: responsivePadding.md,
    paddingVertical: responsivePadding.md,
  },
  greeting: {
    fontSize: screenData.isTablet ? responsiveFontSize.xxxl + 4 : responsiveFontSize.xxxl,
    fontWeight: '600',
    color: '#000',
    marginBottom: responsiveMargin.xs,
  },
  subtitle: {
    fontSize: responsiveFontSize.md,
    color: '#666',
    lineHeight: scaleHeight(20),
  },

  section: {
    marginVertical: responsiveMargin.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsivePadding.md,
    marginBottom: responsiveMargin.sm,
  },
  sectionTitle: {
    fontSize: screenData.isTablet ? responsiveFontSize.xl + 2 : responsiveFontSize.xl,
    fontWeight: '600',
    color: '#000',
  },
  viewAllText: {
    fontSize: responsiveFontSize.md,
    color: '#FFD700',
    fontWeight: '500',
  },
  categoryList: {
    paddingHorizontal: responsivePadding.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: responsiveMargin.md,
    width: scaleWidth(70),
  },
  categoryIcon: {
    width: scaleWidth(60),
    height: scaleWidth(60),
    borderRadius: scaleWidth(30),
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveMargin.xs,
  },
  categoryName: {
    fontSize: responsiveFontSize.sm,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  bestSellerList: {
    paddingHorizontal: responsivePadding.md,
  },
  topSellerList: {
    paddingHorizontal: responsivePadding.md,
  },
  topSellerCard: {
    width: screenData.isTablet ? scaleWidth(140) : scaleWidth(120),
    marginRight: responsiveMargin.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: scaleWidth(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    padding: responsivePadding.sm,
  },
  topSellerImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: responsiveMargin.xs,
  },
  topSellerImage: {
    width: scaleWidth(60),
    height: scaleWidth(60),
    borderRadius: scaleWidth(30),
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: scaleWidth(8),
    backgroundColor: '#FFFFFF',
    borderRadius: scaleWidth(8),
  },
  topSellerInfo: {
    alignItems: 'center',
  },
  topSellerName: {
    fontSize: responsiveFontSize.sm,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: responsiveMargin.xs,
  },
  topSellerStats: {
    alignItems: 'center',
  },
  salesText: {
    fontSize: responsiveFontSize.xs,
    color: '#666',
    marginTop: 2,
  },
  bestSellerCard: {
    width: screenData.isTablet ? scaleWidth(200) : scaleWidth(170),
    marginRight: responsiveMargin.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: scaleWidth(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  bestSellerImageContainer: {
    position: 'relative',
  },
  bestSellerImage: {
    width: '100%',
    height: screenData.isTablet ? scaleHeight(140) : scaleHeight(120),
    borderTopLeftRadius: scaleWidth(12),
    borderTopRightRadius: scaleWidth(12),
    resizeMode: 'cover',
  },
  saleBadge: {
    position: 'absolute',
    top: responsivePadding.xs,
    left: responsivePadding.xs,
    backgroundColor: '#FF4C3B',
    paddingHorizontal: responsivePadding.xs,
    paddingVertical: 2,
    borderRadius: scaleWidth(4),
  },
  saleBadgeText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize.xs,
    fontWeight: '600',
  },
  wishlistButtonBestSeller: {
    position: 'absolute',
    top: responsivePadding.xs,
    right: responsivePadding.xs,
    backgroundColor: '#FFFFFF',
    width: scaleWidth(30),
    height: scaleWidth(30),
    borderRadius: scaleWidth(15),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bestSellerInfo: {
    padding: responsivePadding.sm,
  },
  bestSellerName: {
    fontSize: responsiveFontSize.md,
    fontWeight: '500',
    color: '#333',
    marginBottom: responsiveMargin.xs,
  },
  bestSellerPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bestSellerPrice: {
    fontSize: responsiveFontSize.lg,
    fontWeight: '600',
    color: '#000',
  },
  bestSellerOriginalPrice: {
    fontSize: responsiveFontSize.sm,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: responsiveMargin.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: responsiveFontSize.sm,
    color: '#666',
    marginLeft: responsiveMargin.xs,
  },
  ratingTextSmall: {
    fontSize: responsiveFontSize.xs,
    color: '#666',
    marginLeft: 2,
  },
  brandList: {
    paddingHorizontal: responsivePadding.md,
  },
  brandCard: {
    alignItems: 'center',
    marginRight: responsiveMargin.md,
    width: screenData.isTablet ? scaleWidth(100) : scaleWidth(85),
    backgroundColor: '#FFFFFF',
    borderRadius: scaleWidth(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    padding: responsivePadding.sm,
  },
  brandLogoContainer: {
    width: screenData.isTablet ? scaleWidth(90) : scaleWidth(80),
    height: screenData.isTablet ? scaleWidth(90) : scaleWidth(80),
    backgroundColor: '#F8F8F8',
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: responsiveMargin.xs,
  },
  brandLogo: {
    width: screenData.isTablet ? scaleWidth(60) : scaleWidth(50),
    height: screenData.isTablet ? scaleWidth(60) : scaleWidth(50),
    resizeMode: 'contain',
  },
  brandName: {
    fontSize: responsiveFontSize.sm,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  featuredProductList: {
    paddingHorizontal: responsivePadding.md,
  },
  featuredProductCard: {
    width: screenData.isTablet ? scaleWidth(180) : scaleWidth(150),
    marginRight: responsiveMargin.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: scaleWidth(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  featuredProductImageContainer: {
    position: 'relative',
  },
  featuredProductImage: {
    width: '100%',
    height: screenData.isTablet ? scaleHeight(120) : scaleHeight(100),
    borderTopLeftRadius: scaleWidth(12),
    borderTopRightRadius: scaleWidth(12),
    resizeMode: 'cover',
  },
  wishlistButtonFeatured: {
    position: 'absolute',
    top: responsivePadding.xs,
    right: responsivePadding.xs,
    backgroundColor: '#FFFFFF',
    width: scaleWidth(24),
    height: scaleWidth(24),
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  featuredProductInfo: {
    padding: responsivePadding.sm,
  },
  featuredProductName: {
    fontSize: responsiveFontSize.sm,
    fontWeight: '500',
    color: '#333',
    marginBottom: responsiveMargin.xs,
  },
  featuredProductPrice: {
    fontSize: responsiveFontSize.md,
    fontWeight: '600',
    color: '#000',
    marginBottom: responsiveMargin.xs,
  },

  categoryFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsivePadding.md,
    marginBottom: responsiveMargin.sm,
  },
  categoryFilterActive: {
    backgroundColor: '#FFD700',
    paddingHorizontal: responsivePadding.md,
    paddingVertical: responsivePadding.xs,
    borderRadius: scaleWidth(20),
    marginRight: responsiveMargin.xs,
  },
  categoryFilterActiveText: {
    color: '#000000',
    fontSize: responsiveFontSize.md,
    fontWeight: '500',
  },
  categoryFilter: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: responsivePadding.md,
    paddingVertical: responsivePadding.xs,
    borderRadius: scaleWidth(20),
    marginRight: responsiveMargin.xs,
  },
  categoryFilterText: {
    color: '#666',
    fontSize: responsiveFontSize.md,
    fontWeight: '500',
  },
  newArrivalContainer: {
    paddingHorizontal: responsivePadding.md,
  },
  newArrivalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scaleWidth(16),
    marginBottom: responsiveMargin.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  newArrivalRow: {
    flexDirection: 'row',
    padding: responsivePadding.sm,
    alignItems: 'center',
  },
  newArrivalImage: {
    width: screenData.isTablet ? scaleWidth(100) : scaleWidth(80),
    height: screenData.isTablet ? scaleWidth(100) : scaleWidth(80),
    borderRadius: scaleWidth(8),
    resizeMode: 'cover',
  },
  newArrivalInfo: {
    flex: 1,
    marginLeft: responsiveMargin.sm,
  },
  newArrivalName: {
    fontSize: responsiveFontSize.md,
    fontWeight: '500',
    color: '#333',
    marginBottom: responsiveMargin.xs,
  },
  newArrivalPrice: {
    fontSize: responsiveFontSize.lg,
    fontWeight: '600',
    color: '#000',
    marginBottom: responsiveMargin.xs,
  },
  newArrivalActions: {
    alignItems: 'center',
  },
  wishlistButton: {
    backgroundColor: '#F5F5F5',
    width: scaleWidth(36),
    height: scaleWidth(36),
    borderRadius: scaleWidth(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveMargin.xs,
  },
  addToCartButton: {
    backgroundColor: '#FFD700',
    width: scaleWidth(36),
    height: scaleWidth(36),
    borderRadius: scaleWidth(18),
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default HomeScreen;