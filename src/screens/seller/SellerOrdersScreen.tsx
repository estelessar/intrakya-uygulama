import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  updateOrderStatus,
} from '../../store/slices/orderSlice';
import { Order, OrderStatus } from '../../types';

interface SellerOrdersScreenProps {
  navigation: any;
}

const SellerOrdersScreen: React.FC<SellerOrdersScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);

  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'preparing' | 'shipped' | 'delivered'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Gerçek uygulamada satıcının kendi siparişlerini filtreleyeceğiz
  const sellerId = 'seller-123'; // Auth state'den gelecek

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    // Gerçek uygulamada API'den satıcının siparişlerini çekeceğiz
    // dispatch(fetchSellerOrders(sellerId));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getFilteredOrders = () => {
    let filteredOrders = orders.filter(order => 
      order.items.some(item => item.product.sellerId === sellerId)
    );

    if (selectedTab !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === selectedTab);
    }

    return filteredOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#9C27B0';
      case 'shipped': return '#4CAF50';
      case 'delivered': return '#8BC34A';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'confirmed': return 'Onaylandı';
      case 'preparing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getNextAction = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return { text: 'Hazırlamaya Başla', nextStatus: 'preparing' as OrderStatus };
      case 'preparing':
        return { text: 'Kargoya Ver', nextStatus: null }; // Kargo seçimi ekranına yönlendir
      default:
        return null;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    Alert.alert(
      'Sipariş Durumu',
      `Sipariş durumunu "${getStatusText(newStatus)}" olarak güncellemek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Güncelle',
          onPress: () => {
            dispatch(updateOrderStatus({ orderId, status: newStatus }));
          },
        },
      ]
    );
  };

  const handleCargoSelection = (order: Order) => {
    navigation.navigate('CargoSelection', { order });
  };

  const renderTabButton = (tab: typeof selectedTab, title: string, count: number) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        selectedTab === tab && styles.activeTabButton,
      ]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        selectedTab === tab && styles.activeTabButtonText,
      ]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }: { item: Order }) => {
    const nextAction = getNextAction(item.status);
    const sellerItems = item.items.filter(orderItem => orderItem.product.sellerId === sellerId);
    const sellerTotal = sellerItems.reduce((sum, orderItem) => sum + orderItem.totalPrice, 0);

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {sellerItems.map((orderItem, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.productName} numberOfLines={1}>
                {orderItem.product.name}
              </Text>
              <Text style={styles.productQuantity}>
                {orderItem.quantity} adet × {orderItem.price} TL
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Toplam:</Text>
            <Text style={styles.totalAmount}>{sellerTotal.toFixed(2)} TL</Text>
          </View>

          <View style={styles.orderActions}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            >
              <Ionicons name="eye-outline" size={16} color="#007AFF" />
              <Text style={styles.detailButtonText}>Detay</Text>
            </TouchableOpacity>

            {nextAction && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  if (nextAction.nextStatus) {
                    handleStatusUpdate(item.id, nextAction.nextStatus);
                  } else {
                    handleCargoSelection(item);
                  }
                }}
              >
                <Text style={styles.actionButtonText}>{nextAction.text}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {item.trackingNumber && (
          <View style={styles.trackingInfo}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.trackingText}>
              Takip No: {item.trackingNumber}
            </Text>
            {item.cargoCompany && (
              <Text style={styles.cargoText}> - {item.cargoCompany}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const filteredOrders = getFilteredOrders();
  const orderCounts = {
    all: orders.filter(order => order.items.some(item => item.product.sellerId === sellerId)).length,
    pending: orders.filter(order => 
      order.status === 'pending' && order.items.some(item => item.product.sellerId === sellerId)
    ).length,
    preparing: orders.filter(order => 
      order.status === 'preparing' && order.items.some(item => item.product.sellerId === sellerId)
    ).length,
    shipped: orders.filter(order => 
      order.status === 'shipped' && order.items.some(item => item.product.sellerId === sellerId)
    ).length,
    delivered: orders.filter(order => 
      order.status === 'delivered' && order.items.some(item => item.product.sellerId === sellerId)
    ).length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Siparişlerim</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {renderTabButton('all', 'Tümü', orderCounts.all)}
        {renderTabButton('pending', 'Beklemede', orderCounts.pending)}
        {renderTabButton('preparing', 'Hazırlanıyor', orderCounts.preparing)}
        {renderTabButton('shipped', 'Kargoda', orderCounts.shipped)}
        {renderTabButton('delivered', 'Teslim Edildi', orderCounts.delivered)}
      </ScrollView>

      {/* Orders List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Siparişler yükleniyor...</Text>
        </View>
      ) : filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          style={styles.ordersList}
          contentContainerStyle={styles.ordersContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>Sipariş Bulunamadı</Text>
          <Text style={styles.emptyDescription}>
            {selectedTab === 'all' 
              ? 'Henüz hiç siparişiniz bulunmuyor.'
              : `"${getStatusText(selectedTab as OrderStatus)}" durumunda sipariş bulunmuyor.`
            }
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  refreshButton: {
    padding: 8,
  },
  tabsContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTabButton: {
    backgroundColor: '#FFD700',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#000000',
  },
  tabBadge: {
    marginLeft: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  productQuantity: {
    fontSize: 12,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 4,
  },
  detailButtonText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  trackingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  cargoText: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SellerOrdersScreen;