import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchSellerEarnings } from '../../store/slices/commissionSlice';
import { Commission, SellerCommissionSummary } from '../../types';

interface SellerEarningsScreenProps {
  navigation: any;
}

const SellerEarningsScreen: React.FC<SellerEarningsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { sellerEarnings, loading, error } = useAppSelector(state => state.commission);
  const { user } = useAppSelector(state => state.auth);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEarnings();
  }, [selectedPeriod]);

  const loadEarnings = async () => {
    if (user?.id) {
      await dispatch(fetchSellerEarnings({
        sellerId: user.id,
        period: selectedPeriod
      }));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEarnings();
    setRefreshing(false);
  };

  const renderPeriodButton = (period: 'week' | 'month' | 'year', label: string) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.selectedPeriodButton
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text style={[
        styles.periodButtonText,
        selectedPeriod === period && styles.selectedPeriodButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderCommissionItem = ({ item }: { item: Commission }) => (
    <View style={styles.commissionItem}>
      <View style={styles.commissionHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Sipariş #{item.orderId}</Text>
          <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</Text>
        </View>
        <View style={styles.amountInfo}>
          <Text style={styles.orderAmount}>₺{item.orderAmount.toFixed(2)}</Text>
          <Text style={styles.commissionAmount}>-₺{item.amount.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.commissionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Komisyon Oranı:</Text>
          <Text style={styles.detailValue}>%{item.rate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Net Kazanç:</Text>
          <Text style={styles.netEarning}>₺{(item.orderAmount - item.amount).toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Durum:</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'paid' ? styles.paidBadge : styles.pendingBadge
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'paid' ? styles.paidText : styles.pendingText
            ]}>
              {item.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const summary = sellerEarnings?.summary;
  const commissions = sellerEarnings?.commissions || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kazançlarım</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Period Selection */}
        <View style={styles.periodSelection}>
          {renderPeriodButton('week', 'Bu Hafta')}
          {renderPeriodButton('month', 'Bu Ay')}
          {renderPeriodButton('year', 'Bu Yıl')}
        </View>

        {/* Earnings Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.mainSummaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="wallet" size={32} color="#4CAF50" />
              <Text style={styles.summaryTitle}>Toplam Kazanç</Text>
            </View>
            <Text style={styles.totalEarnings}>
              ₺{summary?.totalEarnings?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.summarySubtitle}>
              {selectedPeriod === 'week' ? 'Bu hafta' : 
               selectedPeriod === 'month' ? 'Bu ay' : 'Bu yıl'} kazancınız
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="trending-up" size={24} color="#2196F3" />
              <Text style={styles.summaryLabel}>Brüt Satış</Text>
              <Text style={styles.summaryValue}>₺{summary?.grossSales?.toFixed(2) || '0.00'}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Ionicons name="remove-circle" size={24} color="#FF5722" />
              <Text style={styles.summaryLabel}>Komisyon</Text>
              <Text style={styles.summaryValue}>₺{summary?.totalCommission?.toFixed(2) || '0.00'}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Ionicons name="cube" size={24} color="#9C27B0" />
              <Text style={styles.summaryLabel}>Satılan Ürün</Text>
              <Text style={styles.summaryValue}>{summary?.totalOrders || 0}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Ionicons name="stats-chart" size={24} color="#FF9800" />
              <Text style={styles.summaryLabel}>Komisyon Oranı</Text>
              <Text style={styles.summaryValue}>%{summary?.commissionRate || 10}</Text>
            </View>
          </View>
        </View>

        {/* Commission History */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Komisyon Geçmişi</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
          ) : commissions.length > 0 ? (
            <FlatList
              data={commissions}
              renderItem={renderCommissionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Henüz komisyon kaydı bulunmuyor</Text>
              <Text style={styles.emptySubtext}>İlk satışınızı yaptığınızda burada görünecek</Text>
            </View>
          )}
        </View>

        {/* Commission Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color="#FFD700" />
              <Text style={styles.infoTitle}>Komisyon Bilgileri</Text>
            </View>
          <Text style={styles.infoText}>
            • Her satıştan %10 komisyon alınmaktadır{"\n"}
            • Komisyonlar otomatik olarak hesaplanır{"\n"}
            • Ödemeler aylık olarak yapılır{"\n"}
            • Detaylı raporlar için destek ekibiyle iletişime geçin
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
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
    fontFamily: 'System',
  },
  infoButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  periodSelection: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedPeriodButton: {
    backgroundColor: '#FFD700',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'System',
  },
  selectedPeriodButtonText: {
    color: '#000000',
  },
  summaryContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mainSummaryCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
    fontFamily: 'System',
  },
  totalEarnings: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'System',
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'System',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  historyContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'System',
  },
  commissionItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  commissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
    fontFamily: 'System',
  },
  commissionAmount: {
    fontSize: 14,
    color: '#FF5722',
    fontFamily: 'System',
  },
  commissionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'System',
  },
  netEarning: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    fontFamily: 'System',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidBadge: {
    backgroundColor: '#E8F5E8',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
  },
  paidText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#FF9800',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'System',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'System',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
    fontFamily: 'System',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'System',
  },
});

export default SellerEarningsScreen;