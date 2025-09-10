import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../store';
import { MainStackParamList } from '../../navigation/types';
import { fetchWithdrawalRequests, createWithdrawalRequest, fetchSellerWallet } from '../../store/slices/walletSlice';
import { WithdrawalRequest, BankAccount, SellerWallet } from '../../types';

type WithdrawalRequestScreenNavigationProp = StackNavigationProp<MainStackParamList, 'WithdrawalRequest'>;
type WithdrawalRequestScreenRouteProp = RouteProp<MainStackParamList, 'WithdrawalRequest'>;

interface WithdrawalRequestScreenProps {
  navigation: WithdrawalRequestScreenNavigationProp;
  route: WithdrawalRequestScreenRouteProp;
}

const WithdrawalRequestScreen: React.FC<WithdrawalRequestScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, withdrawalRequests, loading } = useSelector((state: RootState) => state.wallet);
  
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await dispatch(fetchSellerWallet('seller-123')).unwrap();
      await dispatch(fetchWithdrawalRequests('seller-123')).unwrap();
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setAmount(numericValue);
  };

  const validateWithdrawal = () => {
    const withdrawalAmount = parseFloat(amount);
    
    if (!amount || isNaN(withdrawalAmount)) {
      Alert.alert('Hata', 'Geçerli bir tutar girin.');
      return false;
    }
    
    if (withdrawalAmount < 50) {
      Alert.alert('Hata', 'Minimum çekim tutarı 50 TL\'dir.');
      return false;
    }
    
    if (withdrawalAmount > (wallet?.availableBalance || 0)) {
      Alert.alert('Hata', 'Yetersiz bakiye.');
      return false;
    }
    
    return true;
  };

  const handleWithdrawalRequest = async () => {
    if (!validateWithdrawal()) return;

    const withdrawalAmount = parseFloat(amount);
    
    Alert.alert(
      'Para Çekme Talebi',
      `${withdrawalAmount.toFixed(2)} TL çekim talebiniz oluşturulsun mu?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            try {
              await dispatch(createWithdrawalRequest({
                sellerId: 'seller-123',
                amount: withdrawalAmount,
                bankAccount: {
                  bankName: 'Örnek Banka',
                  accountNumber: '1234567890',
                  iban: 'TR123456789012345678901234',
                },
              })).unwrap();
              
              Alert.alert('Başarılı', 'Para çekme talebiniz oluşturuldu. İnceleme süreci 1-3 iş günü sürmektedir.');
              setAmount('');
              setActiveTab('history');
              loadData();
            } catch (error) {
              Alert.alert('Hata', 'Para çekme talebi oluşturulurken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'completed': return '#2196F3';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      case 'completed': return 'Tamamlandı';
      default: return status;
    }
  };

  const renderWithdrawalItem = ({ item }: { item: WithdrawalRequest }) => (
    <View style={styles.withdrawalItem}>
      <View style={styles.withdrawalHeader}>
        <Text style={styles.withdrawalAmount}>₺{item.amount.toFixed(2)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.withdrawalDate}>
        Talep Tarihi: {new Date(item.requestDate).toLocaleDateString('tr-TR')}
      </Text>
      {item.processedDate && (
        <Text style={styles.withdrawalDate}>
          İşlem Tarihi: {new Date(item.processedDate).toLocaleDateString('tr-TR')}
        </Text>
      )}
      {item.adminNote && (
        <Text style={styles.adminNote}>Not: {item.adminNote}</Text>
      )}
    </View>
  );

  const renderRequestTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Mevcut Bakiye</Text>
        <Text style={styles.balanceAmount}>₺{wallet?.availableBalance?.toFixed(2) || '0.00'}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Para Çekme Talebi</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Çekim Tutarı (₺)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
          <Text style={styles.helperText}>
            Minimum çekim tutarı: 50 TL
          </Text>
        </View>

        <View style={styles.quickAmounts}>
          <Text style={styles.label}>Hızlı Seçim</Text>
          <View style={styles.quickAmountButtons}>
            {[100, 250, 500, 1000].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  quickAmount > (wallet?.availableBalance || 0) && styles.quickAmountButtonDisabled
                ]}
                onPress={() => quickAmount <= (wallet?.availableBalance || 0) && setAmount(quickAmount.toString())}
                disabled={quickAmount > (wallet?.availableBalance || 0)}
              >
                <Text style={[
                  styles.quickAmountText,
                  quickAmount > (wallet?.availableBalance || 0) && styles.quickAmountTextDisabled
                ]}>₺{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>



        <TouchableOpacity
          style={[
            styles.submitButton,
            (loading || !amount) && styles.submitButtonDisabled
          ]}
          onPress={handleWithdrawalRequest}
          disabled={loading || !amount}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'İşleniyor...' : 'Para Çekme Talebi Oluştur'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={withdrawalRequests}
        renderItem={renderWithdrawalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.historyList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Henüz para çekme talebiniz bulunmuyor</Text>
          </View>
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'request' && styles.activeTab]}
          onPress={() => setActiveTab('request')}
        >
          <Text style={[styles.tabText, activeTab === 'request' && styles.activeTabText]}>
            Yeni Talep
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Geçmiş
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'request' ? renderRequestTab() : renderHistoryTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingTop: 20,
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 19,
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#000000',
  },
  balanceCard: {
    backgroundColor: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    marginHorizontal: 0,
    marginTop: 0,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  balanceLabel: {
    color: '#000000',
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  balanceAmount: {
    color: '#000000',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  form: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 35,
    color: '#FFD700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 35,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: '#FFD700',
    paddingVertical: 18,
    paddingHorizontal: 0,
    fontSize: 24,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 16,
    color: '#888888',
    marginTop: 12,
    fontWeight: '500',
  },
  quickAmounts: {
    marginBottom: 40,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 18,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    borderRadius: 0,
  },
  quickAmountButtonDisabled: {
    borderColor: '#333333',
    backgroundColor: '#111111',
  },
  quickAmountText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  quickAmountTextDisabled: {
    color: '#333333',
  },
  warningBox: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  warningText: {
    color: '#FFD700',
    marginBottom: 20,
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '600',
  },
  bankInfoButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  bankInfoButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#333333',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  historyList: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  withdrawalItem: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  withdrawalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  withdrawalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 0,
  },
  statusText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  withdrawalDate: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 8,
    fontWeight: '500',
  },
  adminNote: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginTop: 15,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default WithdrawalRequestScreen;