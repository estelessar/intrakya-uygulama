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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

type SellerDashboardNavigationProp = StackNavigationProp<MainStackParamList, 'SellerDashboard'>;

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  productName: string;
  quantity: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  customerAvatar: string;
}

interface TopProduct {
  id: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
  stock: number;
}

const SellerDashboardScreen: React.FC = () => {
  const navigation = useNavigation<SellerDashboardNavigationProp>();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');
  
  // Demo data
  const stats: DashboardStats = {
    totalSales: 1247,
    totalOrders: 856,
    totalProducts: 45,
    totalRevenue: 125400,
    pendingOrders: 23,
    completedOrders: 833
  };
  
  const recentOrders: RecentOrder[] = [
    {
      id: '1',
      customerName: 'Ahmet Yılmaz',
      productName: 'Premium Bluetooth Kulaklık',
      quantity: 2,
      total: 598,
      status: 'pending',
      date: '2024-01-20',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      id: '2',
      customerName: 'Zeynep Kaya',
      productName: 'Akıllı Saat Pro',
      quantity: 1,
      total: 899,
      status: 'processing',
      date: '2024-01-20',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
    },
    {
      id: '3',
      customerName: 'Mehmet Demir',
      productName: 'Wireless Şarj Cihazı',
      quantity: 3,
      total: 447,
      status: 'shipped',
      date: '2024-01-19',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    {
      id: '4',
      customerName: 'Fatma Özkan',
      productName: 'USB-C Hub',
      quantity: 1,
      total: 199,
      status: 'delivered',
      date: '2024-01-19',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
  ];
  
  const topProducts: TopProduct[] = [
    {
      id: '1',
      name: 'Premium Bluetooth Kulaklık',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      sales: 234,
      revenue: 70020,
      stock: 45
    },
    {
      id: '2',
      name: 'Akıllı Saat Pro',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      sales: 156,
      revenue: 140244,
      stock: 23
    },
    {
      id: '3',
      name: 'Wireless Şarj Cihazı',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300',
      sales: 89,
      revenue: 13261,
      stock: 67
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'processing': return '#2196F3';
      case 'shipped': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'processing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      default: return status;
    }
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleViewAllOrders = () => {
    navigation.navigate('MySales');
  };

  const handleOrderPress = (order: RecentOrder) => {
    navigation.navigate('OrderDetail', {
      orderId: order.id
    });
  };

  const handleProductPress = (product: TopProduct) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      sellerId: 'current-seller'
    });
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const renderRecentOrder = ({ item }: { item: RecentOrder }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => handleOrderPress(item)}
    >
      <Image source={{ uri: item.customerAvatar }} style={styles.customerAvatar} />
      <View style={styles.orderInfo}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
        <Text style={styles.orderDetails}>{item.quantity} adet • ₺{item.total.toLocaleString()}</Text>
      </View>
      <View style={styles.orderStatus}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTopProduct = ({ item }: { item: TopProduct }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productStats}>
          <Text style={styles.productSales}>{item.sales} satış</Text>
          <Text style={styles.productRevenue}>₺{item.revenue.toLocaleString()}</Text>
        </View>
        <Text style={styles.productStock}>Stok: {item.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
            <Text style={styles.backButtonText}>Ana Sayfa</Text>
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Satıcı Paneli</Text>
            <Text style={styles.headerSubtitle}>Hoş geldin, Satıcı!</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['today', 'week', 'month'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText
              ]}>
                {period === 'today' ? 'Bugün' : period === 'week' ? 'Bu Hafta' : 'Bu Ay'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {renderStatCard('Toplam Satış', stats.totalSales, 'trending-up', '#4CAF50')}
          {renderStatCard('Siparişler', stats.totalOrders, 'receipt', '#2196F3')}
          {renderStatCard('Ürünler', stats.totalProducts, 'cube', '#FF9800')}
          {renderStatCard('Gelir', `₺${stats.totalRevenue.toLocaleString()}`, 'wallet', '#9C27B0')}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddProduct}
            >
              <Ionicons name="add-circle" size={24} color="#FFD700" />
              <Text style={styles.actionButtonText}>Ürün Ekle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleViewAllOrders}
            >
              <Ionicons name="list" size={24} color="#FFD700" />
              <Text style={styles.actionButtonText}>Siparişler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="analytics" size={24} color="#FFD700" />
              <Text style={styles.actionButtonText}>Analitik</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="settings" size={24} color="#FFD700" />
              <Text style={styles.actionButtonText}>Ayarlar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son Siparişler</Text>
            <TouchableOpacity onPress={handleViewAllOrders}>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentOrders}
            renderItem={renderRecentOrder}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>En Çok Satan Ürünler</Text>
          <FlatList
            data={topProducts}
            renderItem={renderTopProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topProductsList}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{stats.pendingOrders}</Text>
              <Text style={styles.summaryLabel}>Bekleyen</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{stats.completedOrders}</Text>
              <Text style={styles.summaryLabel}>Tamamlanan</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{Math.round((stats.completedOrders / stats.totalOrders) * 100)}%</Text>
              <Text style={styles.summaryLabel}>Başarı Oranı</Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 215, 0, 0.8)',
    marginTop: 2,
    fontFamily: 'System',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activePeriodButton: {
    backgroundColor: '#FFD700',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'System',
  },
  activePeriodText: {
    color: '#000',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    marginHorizontal: '1%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'System',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'System',
  },
  quickActions: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    fontFamily: 'System',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  section: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
    fontFamily: 'System',
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
    fontFamily: 'System',
  },
  productName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'System',
  },
  orderDetails: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'System',
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'System',
  },
  orderDate: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'System',
  },
  topProductsList: {
    paddingRight: 16,
  },
  productCard: {
    width: 140,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productStats: {
    marginVertical: 4,
  },
  productSales: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    fontFamily: 'System',
  },
  productStock: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'System',
  },
  orderSummary: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 80,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'System',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'System',
  },
});

export default SellerDashboardScreen;