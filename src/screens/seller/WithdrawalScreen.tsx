import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchSellerWallet,
  createWithdrawalRequest,
  fetchWithdrawalRequests,
} from '../../store/slices/walletSlice';
import { WithdrawalRequest, BankAccount } from '../../types';

interface WithdrawalScreenProps {
  navigation: any;
}

const WithdrawalScreen: React.FC<WithdrawalScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, withdrawalRequests, loading, withdrawalLoading } = useSelector(
    (state: RootState) => state.wallet
  );

  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Satıcı ID'sini gerçek uygulamada auth state'den alacağız
    const sellerId = 'seller-123';
    
    dispatch(fetchSellerWallet(sellerId));
    dispatch(fetchWithdrawalRequests(sellerId));
    
    // Banka hesaplarını yükle
    try {
      const response = await fetch('/api/seller/bank-accounts');
      if (response.ok) {
        const accounts = await response.json();
        setBankAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedBankAccount(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Banka hesapları yüklenemedi:', error);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || !selectedBankAccount) {
      Alert.alert('Hata', 'Lütfen çekilecek tutarı ve banka hesabını seçiniz');
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    
    if (amount <= 0) {
      Alert.alert('Hata', 'Geçerli bir tutar giriniz');
      return;
    }

    if (amount > (wallet?.availableBalance || 0)) {
      Alert.alert('Hata', 'Yetersiz bakiye');
      return;
    }

    if (amount < 50) {
      Alert.alert('Hata', 'Minimum çekim tutarı 50 TL\'dir');
      return;
    }

    Alert.alert(
      'Para Çekme Talebi',
      `${amount} TL tutarında para çekme talebi oluşturulacak. Onaylıyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            try {
              await dispatch(createWithdrawalRequest({
                sellerId: 'seller-123',
                amount,
                bankAccount: selectedBankAccount,
              })).unwrap();
              
              Alert.alert('Başarılı', 'Para çekme talebiniz oluşturuldu. İnceleme süreci 1-3 iş günü sürmektedir.');
              setWithdrawalAmount('');
              setActiveTab('history');
            } catch (error) {
              Alert.alert('Hata', 'Para çekme talebi oluşturulamadı');
            }
          },
        },
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

  const renderWithdrawalRequest = ({ item }: { item: WithdrawalRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <Text style={styles.requestAmount}>{item.amount} TL</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.requestDetails}>
        <Text style={styles.requestDate}>
          Talep Tarihi: {new Date(item.requestDate).toLocaleDateString('tr-TR')}
        </Text>
        <Text style={styles.bankInfo}>
          {item.bankAccount.bankName} - {item.bankAccount.iban}
        </Text>
        {item.adminNote && (
          <Text style={styles.adminNote}>Not: {item.adminNote}</Text>
        )}
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
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Para Çekme</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Çekilebilir Bakiye</Text>
        <Text style={styles.balanceAmount}>{wallet?.availableBalance || 0} TL</Text>
        <Text style={styles.pendingBalance}>
          Bekleyen: {wallet?.pendingBalance || 0} TL
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'withdraw' && styles.activeTab]}
          onPress={() => setActiveTab('withdraw')}
        >
          <Text style={[styles.tabText, activeTab === 'withdraw' && styles.activeTabText]}>
            Para Çek
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

      {activeTab === 'withdraw' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Çekilecek Tutar</Text>
              <TextInput
                style={styles.input}
                value={withdrawalAmount}
                onChangeText={setWithdrawalAmount}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <Text style={styles.inputNote}>Minimum çekim tutarı: 50 TL</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Banka Hesabı</Text>
              {bankAccounts.length > 0 ? (
                <View style={styles.bankAccountSelector}>
                  {bankAccounts.map((account, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.bankAccountOption,
                        selectedBankAccount === account && styles.selectedBankAccount,
                      ]}
                      onPress={() => setSelectedBankAccount(account)}
                    >
                      <View style={styles.bankAccountInfo}>
                        <Text style={styles.bankName}>{account.bankName}</Text>
                        <Text style={styles.iban}>{account.iban}</Text>
                      </View>
                      {selectedBankAccount === account && (
                        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noBankAccount}>
                  <Text style={styles.noBankAccountText}>
                    Henüz banka hesabı eklenmemiş
                  </Text>
                  <TouchableOpacity
                    style={styles.addBankButton}
                    onPress={() => navigation.navigate('BankAccount')}
                  >
                    <Text style={styles.addBankButtonText}>Banka Hesabı Ekle</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.withdrawButton,
                (!withdrawalAmount || !selectedBankAccount || withdrawalLoading) &&
                  styles.withdrawButtonDisabled,
              ]}
              onPress={handleWithdrawal}
              disabled={!withdrawalAmount || !selectedBankAccount || withdrawalLoading}
            >
              {withdrawalLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.withdrawButtonText}>Para Çekme Talebi Oluştur</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.historyContainer}>
          {withdrawalRequests.length > 0 ? (
            <FlatList
              data={withdrawalRequests}
              renderItem={renderWithdrawalRequest}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.historyList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={64} color="#CCC" />
              <Text style={styles.emptyStateText}>Henüz para çekme talebiniz bulunmuyor</Text>
            </View>
          )}
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
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
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
  balanceCard: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.8,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  pendingBalance: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.7,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  inputNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bankAccountSelector: {
    gap: 12,
  },
  bankAccountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  selectedBankAccount: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  bankAccountInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  iban: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  noBankAccount: {
    alignItems: 'center',
    padding: 20,
  },
  noBankAccountText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  addBankButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addBankButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  withdrawButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  withdrawButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  withdrawButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
    padding: 16,
  },
  historyList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  requestDetails: {
    gap: 4,
  },
  requestDate: {
    fontSize: 14,
    color: '#666',
  },
  bankInfo: {
    fontSize: 14,
    color: '#333',
  },
  adminNote: {
    fontSize: 12,
    color: '#F44336',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default WithdrawalScreen;