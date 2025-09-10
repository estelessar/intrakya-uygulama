import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';

type OrderDetailRouteProp = RouteProp<MainStackParamList, 'OrderDetail'>;
type OrderDetailNavigationProp = StackNavigationProp<MainStackParamList, 'OrderDetail'>;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
}

const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const route = useRoute<OrderDetailRouteProp>();
  const { orderId } = route.params;

  // Demo order data - normally would fetch from API
  const [orderDetail] = useState<OrderDetail>({
    id: orderId,
    orderNumber: 'TM2024001234',
    status: 'shipped',
    orderDate: '15 Ocak 2024',
    estimatedDelivery: '18 Ocak 2024',
    items: [
      {
        id: '1',
        name: 'iPhone 14 Pro Max',
        price: 45000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
        sellerId: '1',
        sellerName: 'TechStore'
      },
      {
        id: '2',
        name: 'iPhone Kılıfı',
        price: 150,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300',
        sellerId: '1',
        sellerName: 'TechStore'
      }
    ],
    subtotal: 45300,
    shipping: 0,
    discount: 300,
    total: 45000,
    shippingAddress: {
      name: 'Ahmet Yılmaz',
      phone: '+90 555 123 4567',
      address: 'Atatürk Mah. İstiklal Cad. No:123 Daire:5 Kadıköy/İstanbul'
    },
    paymentMethod: 'Kredi Kartı (**** 1234)',
    trackingNumber: 'TK123456789TR'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'confirmed': return '#007AFF';
      case 'shipped': return '#34C759';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'confirmed': return 'Onaylandı';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Siparişi İptal Et',
      'Bu siparişi iptal etmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: () => {
            // Handle order cancellation
            Alert.alert('Başarılı', 'Siparişiniz iptal edildi.');
          }
        }
      ]
    );
  };

  const handleTrackOrder = () => {
    if (orderDetail.trackingNumber) {
      navigation.navigate('OrderTrack', {
        orderId: orderDetail.id,
        trackingNumber: orderDetail.trackingNumber
      });
    }
  };

  const handleContactSeller = (sellerId: string, sellerName: string) => {
    navigation.navigate('SellerProfile', {
      sellerId,
      sellerName
    });
  };

  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.orderItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSeller}>Satıcı: {item.sellerName}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemQuantity}>Adet: {item.quantity}</Text>
          <Text style={styles.itemPrice}>₺{item.price.toLocaleString()}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.contactButton}
        onPress={() => handleContactSeller(item.sellerId, item.sellerName)}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#FFD700" />
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
        <Text style={styles.headerTitle}>Sipariş Detayı</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.orderNumber}>#{orderDetail.orderNumber}</Text>
              <Text style={styles.orderDate}>{orderDetail.orderDate}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(orderDetail.status) }
            ]}>
              <Text style={styles.statusText}>{getStatusText(orderDetail.status)}</Text>
            </View>
          </View>
          
          {orderDetail.status === 'shipped' && (
            <View style={styles.deliveryInfo}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.deliveryText}>
                Tahmini Teslimat: {orderDetail.estimatedDelivery}
              </Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sipariş Ürünleri</Text>
          <View style={styles.itemsContainer}>
            {orderDetail.items.map(renderOrderItem)}
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Ionicons name="location-outline" size={20} color="#FFD700" />
              <Text style={styles.addressName}>{orderDetail.shippingAddress.name}</Text>
            </View>
            <Text style={styles.addressPhone}>{orderDetail.shippingAddress.phone}</Text>
            <Text style={styles.addressText}>{orderDetail.shippingAddress.address}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
          <View style={styles.paymentCard}>
            <Ionicons name="card-outline" size={20} color="#FFD700" />
            <Text style={styles.paymentText}>{orderDetail.paymentMethod}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ara Toplam</Text>
              <Text style={styles.summaryValue}>₺{orderDetail.subtotal.toLocaleString()}</Text>
            </View>
            
            {orderDetail.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>İndirim</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>-₺{orderDetail.discount.toLocaleString()}</Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Kargo</Text>
              <Text style={styles.summaryValue}>
                {orderDetail.shipping === 0 ? 'Ücretsiz' : `₺${orderDetail.shipping.toFixed(2)}`}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Toplam</Text>
              <Text style={styles.totalValue}>₺{orderDetail.total.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bottomContainer}>
        {orderDetail.status === 'shipped' && orderDetail.trackingNumber && (
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={handleTrackOrder}
          >
            <Ionicons name="location-outline" size={20} color="#000" />
            <Text style={styles.trackButtonText}>Kargo Takip</Text>
          </TouchableOpacity>
        )}
        
        {(orderDetail.status === 'pending' || orderDetail.status === 'confirmed') && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelOrder}
          >
            <Text style={styles.cancelButtonText}>Siparişi İptal Et</Text>
          </TouchableOpacity>
        )}
      </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'System',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'System',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontFamily: 'System',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'System',
  },
  itemsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
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
    marginBottom: 4,
    fontFamily: 'System',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    fontFamily: 'System',
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
    fontFamily: 'System',
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'System',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'System',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 8,
    fontFamily: 'System',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
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
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    gap: 12,
  },
  trackButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 6,
    fontFamily: 'System',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
});

export default OrderDetailScreen;