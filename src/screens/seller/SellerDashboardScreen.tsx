import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  scaleWidth,
  scaleHeight,
  responsiveFontSize,
  responsivePadding,
  responsiveMargin,
  screenData
} from '../../utils/responsive';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSellerWallet } from '../../store/slices/walletSlice';
import { fetchOrdersBySeller } from '../../store/slices/orderSlice';
import { fetchMyAdvertisements } from '../../store/slices/advertisementSlice';
import { fetchProductsBySeller } from '../../store/slices/productSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { SellerStackParamList } from '../../navigation/types';

type SellerDashboardScreenNavigationProp = StackNavigationProp<
  SellerStackParamList,
  'SellerDashboard'
>;

interface Props {
  navigation: SellerDashboardScreenNavigationProp;
}

const SellerDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { wallet } = useAppSelector((state) => state.wallet);
  const { orders } = useAppSelector((state) => state.orders);
  const { myAdvertisements } = useAppSelector((state) => state.advertisement);
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSellerWallet(user.id));
      dispatch(fetchOrdersBySeller(user.id));
      dispatch(fetchMyAdvertisements(user.id));
      dispatch(fetchProductsBySeller(user.id));
    }
  }, [dispatch, user?.id]);

  const sellerOrders = orders.filter(order => order.sellerId === user?.id);
  const pendingOrders = sellerOrders.filter(order => order.status === 'pending');
  const activeAds = myAdvertisements.filter(ad => ad.status === 'active');
  const sellerProducts = products.filter(product => product.sellerId === user?.id);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'addProduct':
        navigation.navigate('AddProduct', {});
        break;
      case 'manageOrders':
        navigation.navigate('SellerOrders');
        break;
      case 'viewWallet':
        navigation.navigate('SellerWallet');
        break;
      case 'manageAds':
        navigation.navigate('MyAdvertisements');
        break;
      case 'viewProducts':
        navigation.navigate('ProductList');
        break;
      default:
        Alert.alert('Bilgi', 'Bu özellik yakında eklenecek.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
          <Text style={styles.backButtonText}>Ana Sayfa</Text>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Hoş geldin, {user?.fullName}!</Text>
        <Text style={styles.subtitle}>Satıcı Panelin</Text>
      </View>

      {/* Özet Kartları */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>₺{wallet?.balance?.toFixed(2) || '0.00'}</Text>
          <Text style={styles.summaryLabel}>Bakiye</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{sellerProducts.length}</Text>
          <Text style={styles.summaryLabel}>Ürünlerim</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{pendingOrders.length}</Text>
          <Text style={styles.summaryLabel}>Bekleyen Sipariş</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{activeAds.length}</Text>
          <Text style={styles.summaryLabel}>Aktif Reklam</Text>
        </View>
      </View>

      {/* Hızlı İşlemler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('addProduct')}
          >
            <Text style={styles.quickActionText}>Ürün Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('manageOrders')}
          >
            <Text style={styles.quickActionText}>Siparişlerim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('viewWallet')}
          >
            <Text style={styles.quickActionText}>Cüzdanım</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('manageAds')}
          >
            <Text style={styles.quickActionText}>Reklamlarım</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Son Siparişler */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Siparişler</Text>
          <TouchableOpacity onPress={() => handleQuickAction('manageOrders')}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {sellerOrders.slice(0, 3).map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>Sipariş #{order.id.slice(-6)}</Text>
              <Text style={styles.orderAmount}>₺{order.totalAmount.toFixed(2)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
            </View>
          </View>
        ))}
        {sellerOrders.length === 0 && (
          <Text style={styles.emptyText}>Henüz sipariş yok</Text>
        )}
      </View>

      {/* Performans */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bu Ay</Text>
        <View style={styles.performanceContainer}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>{sellerOrders.length}</Text>
            <Text style={styles.performanceLabel}>Toplam Sipariş</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>
              ₺{sellerOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
            </Text>
            <Text style={styles.performanceLabel}>Toplam Satış</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>
              ₺{wallet?.totalEarnings?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.performanceLabel}>Toplam Kazanç</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#FFA500';
    case 'preparing':
      return '#2196F3';
    case 'shipped':
      return '#9C27B0';
    case 'delivered':
      return '#4CAF50';
    case 'cancelled':
      return '#F44336';
    default:
      return '#757575';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Bekliyor';
    case 'preparing':
      return 'Hazırlanıyor';
    case 'shipped':
      return 'Kargoda';
    case 'delivered':
      return 'Teslim Edildi';
    case 'cancelled':
      return 'İptal';
    default:
      return status;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#000000',
    padding: responsivePadding.md,
    paddingTop: screenData.isTablet ? responsivePadding.xl : scaleHeight(40),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveMargin.sm,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: responsiveFontSize.lg,
    fontWeight: '500',
    marginLeft: responsiveMargin.xs,
  },
  welcomeText: {
    fontSize: screenData.isTablet ? responsiveFontSize.xxxl + 4 : responsiveFontSize.xxxl,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: responsiveMargin.xs,
  },
  subtitle: {
    fontSize: responsiveFontSize.lg,
    color: 'rgba(255, 215, 0, 0.8)',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: responsivePadding.sm,
    gap: responsiveMargin.xs,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: scaleWidth(10),
    padding: responsivePadding.sm,
    flex: 1,
    minWidth: screenData.isTablet ? '22%' : '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: screenData.isTablet ? responsiveFontSize.xxl : responsiveFontSize.xl,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: responsiveMargin.xs,
  },
  summaryLabel: {
    fontSize: responsiveFontSize.sm,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: responsiveMargin.sm,
    borderRadius: scaleWidth(10),
    padding: responsivePadding.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveMargin.sm,
  },
  sectionTitle: {
    fontSize: screenData.isTablet ? responsiveFontSize.xl + 2 : responsiveFontSize.xl,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: responsiveMargin.sm,
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: responsiveFontSize.md,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsiveMargin.xs,
  },
  quickActionButton: {
    backgroundColor: '#FFD700',
    borderRadius: scaleWidth(8),
    padding: responsivePadding.sm,
    flex: 1,
    minWidth: screenData.isTablet ? '22%' : '45%',
    alignItems: 'center',
  },
  quickActionText: {
    color: '#000000',
    fontSize: responsiveFontSize.md,
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsivePadding.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: responsiveFontSize.md,
    fontWeight: '500',
    color: '#333',
  },
  orderAmount: {
    fontSize: responsiveFontSize.lg,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: responsivePadding.xs,
    paddingVertical: responsivePadding.xs / 2,
    borderRadius: scaleWidth(12),
  },
  statusText: {
    color: 'white',
    fontSize: responsiveFontSize.sm,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: responsivePadding.md,
    fontSize: responsiveFontSize.md,
  },
  performanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: screenData.isTablet ? responsiveFontSize.xl : responsiveFontSize.lg,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: responsiveMargin.xs,
  },
  performanceLabel: {
    fontSize: responsiveFontSize.sm,
    color: '#666',
    textAlign: 'center',
  },
});

export default SellerDashboardScreen;