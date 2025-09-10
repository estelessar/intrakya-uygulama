import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCommissionReport, payCommission } from '../../store/slices/commissionSlice';
import { Commission, CommissionReport, SellerCommissionSummary } from '../../types';

interface CommissionReportScreenProps {
  navigation: any;
}

const CommissionReportScreen: React.FC<CommissionReportScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { currentReport, loading, error } = useAppSelector(state => state.commission);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadReports();
  }, [selectedPeriod, selectedDate]);

  const loadReports = () => {
    dispatch(fetchCommissionReport(selectedPeriod));
  };

  const handlePayCommission = async (commissionId: string) => {
    Alert.alert(
      'Komisyon Ödemesi',
      'Bu komisyonu ödemek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Öde',
          onPress: async () => {
            try {
              await dispatch(payCommission(commissionId)).unwrap();
              Alert.alert('Başarılı', 'Komisyon ödemesi tamamlandı.');
              loadReports();
            } catch (error) {
              Alert.alert('Hata', 'Komisyon ödemesi sırasında bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const renderPeriodButton = (period: 'daily' | 'weekly' | 'monthly', label: string) => (
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

  const renderCommissionItem = ({ item }: { item: SellerCommissionSummary }) => (
    <View style={styles.commissionItem}>
      <View style={styles.commissionHeader}>
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>{item.sellerName}</Text>
          <Text style={styles.orderId}>{item.orderCount} Sipariş</Text>
        </View>
        <View style={styles.commissionAmount}>
          <Text style={styles.amountText}>₺{item.commissionAmount.toFixed(2)}</Text>
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
      
      <View style={styles.commissionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Toplam Sipariş Tutarı:</Text>
          <Text style={styles.detailValue}>₺{item.totalOrderAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Komisyon Oranı:</Text>
          <Text style={styles.detailValue}>%{(item.commissionRate * 100).toFixed(1)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Sipariş Sayısı:</Text>
          <Text style={styles.detailValue}>{item.orderCount}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => handlePayCommission(item.sellerId)}
        >
          <Ionicons name="card-outline" size={16} color="#fff" />
          <Text style={styles.payButtonText}>Öde</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const totalCommissions = currentReport?.totalCommissionAmount || 0;
  const paidCommissions = currentReport?.paidCommissionAmount || 0;
  const pendingCommissions = currentReport?.pendingCommissionAmount || 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Komisyon Raporları</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Period Selection */}
        <View style={styles.periodSelection}>
          {renderPeriodButton('daily', 'Günlük')}
          {renderPeriodButton('weekly', 'Haftalık')}
          {renderPeriodButton('monthly', 'Aylık')}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="wallet-outline" size={24} color="#4CAF50" />
            <Text style={styles.summaryLabel}>Toplam Komisyon</Text>
            <Text style={styles.summaryValue}>₺{totalCommissions.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#2196F3" />
            <Text style={styles.summaryLabel}>Ödenen</Text>
            <Text style={styles.summaryValue}>₺{paidCommissions.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Ionicons name="time-outline" size={24} color="#FF9800" />
            <Text style={styles.summaryLabel}>Bekleyen</Text>
            <Text style={styles.summaryValue}>₺{pendingCommissions.toFixed(2)}</Text>
          </View>
        </View>

        {/* Commission List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Komisyon Detayları</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
          ) : currentReport?.sellerCommissions && currentReport.sellerCommissions.length > 0 ? (
            <FlatList
              data={currentReport.sellerCommissions}
              renderItem={renderCommissionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Henüz komisyon kaydı bulunmuyor</Text>
            </View>
          )}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  placeholder: {
    width: 40,
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
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'System',
  },
  selectedPeriodButtonText: {
    color: '#fff',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
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
  listContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listTitle: {
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
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  orderId: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  commissionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
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
  commissionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'System',
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
});

export default CommissionReportScreen;