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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchSellerWallet,
  fetchTransactionHistory,
} from '../../store/slices/walletSlice';
import { Transaction } from '../../types';

interface SellerWalletScreenProps {
  navigation: any;
}

const SellerWalletScreen: React.FC<SellerWalletScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, transactions, loading, transactionLoading } = useSelector(
    (state: RootState) => state.wallet
  );

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Satıcı ID'sini gerçek uygulamada auth state'den alacağız
    const sellerId = 'seller-123';
    
    dispatch(fetchSellerWallet(sellerId));
    dispatch(fetchTransactionHistory({ sellerId }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'seller_earning': return 'arrow-down-circle';
      case 'withdrawal': return 'arrow-up-circle';
      case 'advertisement': return 'megaphone';
      case 'commission_payment': return 'card';
      case 'refund': return 'return-down-back';
      default: return 'swap-horizontal';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'seller_earning': return '#4CAF50';
      case 'withdrawal': return '#F44336';
      case 'advertisement': return '#FF9800';
      case 'commission_payment': return '#2196F3';
      case 'refund': return '#9C27B0';
      default: return '#666';
    }
  };

  const getTransactionTitle = (type: string) => {
    switch (type) {
      case 'seller_earning': return 'Satış Kazancı';
      case 'withdrawal': return 'Para Çekme';
      case 'advertisement': return 'Reklam Ödemesi';
      case 'commission_payment': return 'Komisyon Ödemesi';
      case 'refund': return 'İade';
      default: return 'İşlem';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'pending': return 'Beklemede';
      case 'failed': return 'Başarısız';
      default: return status;
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(item.type) + '20' }]}>
          <Ionicons
            name={getTransactionIcon(item.type) as any}
            size={20}
            color={getTransactionColor(item.type)}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{getTransactionTitle(item.type)}</Text>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.createdAt).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          {
            color: item.type === 'seller_earning' ? '#4CAF50' : 
                   item.type === 'withdrawal' || item.type === 'advertisement' ? '#F44336' : '#333'
          }
        ]}>
          {item.type === 'seller_earning' ? '+' : 
           item.type === 'withdrawal' || item.type === 'advertisement' ? '-' : ''}
          {item.amount} TL
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Cüzdan</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('BankAccount')}
        >
          <Ionicons name="settings-outline" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Bakiye Kartları */}
        <View style={styles.balanceSection}>
          <View style={styles.mainBalanceCard}>
            <Text style={styles.balanceLabel}>Çekilebilir Bakiye</Text>
            <Text style={styles.balanceAmount}>{wallet?.availableBalance || 0} TL</Text>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => navigation.navigate('Withdrawal')}
            >
              <Ionicons name="arrow-up-circle" size={20} color="#FFF" />
              <Text style={styles.withdrawButtonText}>Para Çek</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceRow}>
            <View style={styles.balanceCard}>
              <Text style={styles.cardLabel}>Bekleyen Bakiye</Text>
              <Text style={styles.cardAmount}>{wallet?.pendingBalance || 0} TL</Text>
            </View>
            <View style={styles.balanceCard}>
              <Text style={styles.cardLabel}>Toplam Kazanç</Text>
              <Text style={styles.cardAmount}>{wallet?.totalEarnings || 0} TL</Text>
            </View>
          </View>

          <View style={styles.balanceRow}>
            <View style={styles.balanceCard}>
              <Text style={styles.cardLabel}>Toplam Çekilen</Text>
              <Text style={styles.cardAmount}>{wallet?.totalWithdrawn || 0} TL</Text>
            </View>
            <View style={styles.balanceCard}>
              <Text style={styles.cardLabel}>Son Güncelleme</Text>
              <Text style={styles.cardDate}>
                {wallet?.lastUpdated ? 
                  new Date(wallet.lastUpdated).toLocaleDateString('tr-TR') : 
                  'Bilinmiyor'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Hızlı Aksiyonlar */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Withdrawal')}
            >
              <Ionicons name="arrow-up-circle" size={32} color="#FFD700" />
              <Text style={styles.actionText}>Para Çek</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('BankAccount')}
            >
              <Ionicons name="card" size={32} color="#FFD700" />
              <Text style={styles.actionText}>Hesap Bilgileri</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Advertisement')}
            >
              <Ionicons name="megaphone" size={32} color="#FFD700" />
              <Text style={styles.actionText}>Reklam Ver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* İşlem Geçmişi */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>İşlem Geçmişi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          {transactionLoading ? (
            <View style={styles.transactionLoading}>
              <ActivityIndicator size="small" color="#FFD700" />
            </View>
          ) : transactions.length > 0 ? (
            <FlatList
              data={transactions.slice(0, 5)} // Son 5 işlemi göster
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyTransactions}>
              <Ionicons name="document-outline" size={48} color="#CCC" />
              <Text style={styles.emptyTransactionsText}>Henüz işlem bulunmuyor</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  settingsButton: {
    padding: 8,
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
  content: {
    flex: 1,
  },
  balanceSection: {
    padding: 16,
  },
  mainBalanceCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: '#FFD700',
    fontSize: 14,
    opacity: 0.8,
  },
  balanceAmount: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  withdrawButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDate: {
    fontSize: 14,
    color: '#333',
  },
  actionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  transactionsSection: {
    padding: 16,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
  },
  transactionLoading: {
    padding: 20,
    alignItems: 'center',
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  transactionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '500',
  },
  separator: {
    height: 8,
  },
  emptyTransactions: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTransactionsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
});

export default SellerWalletScreen;