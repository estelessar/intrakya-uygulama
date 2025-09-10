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

type MySalesNavigationProp = StackNavigationProp<MainStackParamList, 'MySales'>;

interface SaleItem {
  id: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerAvatar: string;
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  orderDate: string;
  trackingNumber?: string;
  customerPhone?: string;
  shippingAddress: string;
  paymentMethod: string;
}

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

const MySalesScreen: React.FC = () => {
  const navigation = useNavigation<MySalesNavigationProp>();
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  
  // Demo data
  const salesStats: SalesStats = {
    totalSales: 156,
    totalRevenue: 45680,
    pendingOrders: 8,
    completedOrders: 148
  };
  
  const salesData: SaleItem[] = [
    {
      id: '1',
      productName: 'Premium Bluetooth Kulaklık',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      customerName: 'Ahmet Yılmaz',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      quantity: 2,
      price: 299,
      total: 598,
      status: 'pending',
      orderDate: '2024-01-20',
      customerPhone: '+90 555 123 4567',
      shippingAddress: 'Kadıköy, İstanbul',
      paymentMethod: 'Kredi Kartı'
    },
    {
      id: '2',
      productName: 'Akıllı Saat Pro',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      customerName: 'Zeynep Kaya',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      quantity: 1,
      price: 899,
      total: 899,
      status: 'preparing',
      orderDate: '2024-01-20',
      trackingNumber: 'TK123456789',
      customerPhone: '+90 555 987 6543',
      shippingAddress: 'Çankaya, Ankara',
      paymentMethod: 'Kapıda Ödeme'
    },
    {
      id: '3',
      productName: 'Wireless Şarj Cihazı',
      productImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300',
      customerName: 'Mehmet Demir',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      quantity: 3,
      price: 149,
      total: 447,
      status: 'shipped',
      orderDate: '2024-01-19',
      trackingNumber: 'TK987654321',
      customerPhone: '+90 555 456 7890',
      shippingAddress: 'Konak, İzmir',
      paymentMethod: 'Kredi Kartı'
    },
    {
      id: '4',
      productName: 'USB-C Hub',
      productImage: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300',
      customerName: 'Fatma Özkan',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      quantity: 1,
      price: 199,
      total: 199,
      status: 'delivered',
      orderDate: '2024-01-18',
      trackingNumber: 'TK456789123',
      customerPhone: '+90 555 321 6547',
      shippingAddress: 'Nilüfer, Bursa',
      paymentMethod: 'Havale/EFT'
    },
    {
      id: '5',
      productName: 'Gaming Mouse',
      productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
      customerName: 'Can Arslan',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      quantity: 1,
      price: 259,
      total: 259,
      status: 'cancelled',
      orderDate: '2024-01-17',
      customerPhone: '+90 555 789 1234',
      shippingAddress: 'Bornova, İzmir',
      paymentMethod: 'Kredi Kartı'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#9C27B0';
      case 'shipped': return '#673AB7';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      case 'returned': return '#795548';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'confirmed': return 'Onaylandı';
      case 'preparing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      case 'returned': return 'İade Edildi';
      default: return status;
    }
  };

  const getFilteredSales = () => {
    switch (selectedTab) {
      case 'pending':
        return salesData.filter(item => item.status === 'pending');
      case 'active':
        return salesData.filter(item => ['confirmed', 'preparing', 'shipped'].includes(item.status));
      case 'completed':
        return salesData.filter(item => ['delivered', 'cancelled', 'returned'].includes(item.status));
      default:
        return salesData;
    }
  };

  const handleSalePress = (sale: SaleItem) => {
    navigation.navigate('OrderDetail', {
      orderId: sale.id
    });
  };

  const handleStatusUpdate = (saleId: string, newStatus: string) => {
    Alert.alert(
      'Durum Güncelle',
      `Sipariş durumunu "${getStatusText(newStatus)}" olarak güncellemek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Güncelle',
          onPress: () => {
            // Here you would update the status in your backend
            Alert.alert('Başarılı', 'Sipariş durumu güncellendi.');
          }
        }
      ]
    );
  };

  const handleContactCustomer = (sale: SaleItem) => {
    Alert.alert(
      'Müşteriyle İletişim',
      `${sale.customerName} ile iletişime geçmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ara',
          onPress: () => {
            // Here you would initiate a phone call
            Alert.alert('Arama', `${sale.customerPhone} aranıyor...`);
          }
        },
        {
          text: 'Mesaj',
          onPress: () => {
            navigation.navigate('ChatDetail', {
              sellerId: 'current-seller',
              sellerName: 'Mağazam',
              sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
              productId: sale.id,
              productName: sale.productName,
              productImage: sale.productImage
            });
          }
        }
      ]
    );
  };

  const renderSaleItem = ({ item }: { item: SaleItem }) => (
    <TouchableOpacity 
      style={styles.saleCard}
      onPress={() => handleSalePress(item)}
    >
      <View style={styles.saleHeader}>
        <Image source={{ uri: item.productImage }} style={styles.productImage} />
        <View style={styles.saleInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
          <Text style={styles.customerName}>Müşteri: {item.customerName}</Text>
          <Text style={styles.orderDate}>{item.orderDate}</Text>
        </View>
        <View style={styles.saleStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          <Text style={styles.saleTotal}>₺{item.total.toLocaleString()}</Text>
        </View>
      </View>
      
      <View style={styles.saleDetails}>
        <Text style={styles.detailText}>Adet: {item.quantity} • Birim: ₺{item.price}</Text>
        <Text style={styles.detailText}>Adres: {item.shippingAddress}</Text>
        <Text style={styles.detailText}>Ödeme: {item.paymentMethod}</Text>
        {item.trackingNumber && (
          <Text style={styles.detailText}>Takip: {item.trackingNumber}</Text>
        )}
      </View>
      
      <View style={styles.saleActions}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusUpdate(item.id, 'confirmed')}
          >
            <Text style={styles.actionButtonText}>Onayla</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'confirmed' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.prepareButton]}
            onPress={() => handleStatusUpdate(item.id, 'preparing')}
          >
            <Text style={styles.actionButtonText}>Hazırla</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'preparing' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.shipButton]}
            onPress={() => handleStatusUpdate(item.id, 'shipped')}
          >
            <Text style={styles.actionButtonText}>Kargola</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.contactButton]}
          onPress={() => handleContactCustomer(item)}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#FFD700" />
          <Text style={[styles.actionButtonText, styles.contactButtonText]}>İletişim</Text>
        </TouchableOpacity>
      </View>
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
        <Text style={styles.headerTitle}>Satışlarım</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{salesStats.totalSales}</Text>
          <Text style={styles.statLabel}>Toplam Satış</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>₺{salesStats.totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Toplam Gelir</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{salesStats.pendingOrders}</Text>
          <Text style={styles.statLabel}>Bekleyen</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{salesStats.completedOrders}</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { key: 'all', label: 'Tümü' },
          { key: 'pending', label: 'Bekleyen' },
          { key: 'active', label: 'Aktif' },
          { key: 'completed', label: 'Tamamlanan' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              selectedTab === tab.key && styles.activeTabButton
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sales List */}
      <FlatList
        data={getFilteredSales()}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
        style={styles.salesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.salesListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Henüz satış bulunmuyor</Text>
            <Text style={styles.emptySubtext}>İlk ürününüzü ekleyerek satışa başlayın</Text>
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
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
    marginTop: 4,
    fontFamily: 'System',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'System',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  salesList: {
    flex: 1,
  },
  salesListContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  saleCard: {
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
  saleHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  saleInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  customerName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'System',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'System',
  },
  saleStatus: {
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
  saleTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'System',
  },
  saleDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'System',
  },
  saleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  prepareButton: {
    backgroundColor: '#2196F3',
  },
  shipButton: {
    backgroundColor: '#9C27B0',
  },
  contactButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'System',
  },
  contactButtonText: {
    color: '#FFD700',
    marginLeft: 4,
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

export default MySalesScreen;