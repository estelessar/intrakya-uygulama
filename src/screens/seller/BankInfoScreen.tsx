import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SellerStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateBankInfo, fetchBankInfo } from '../../store/slices/walletSlice';

type BankInfoScreenNavigationProp = StackNavigationProp<SellerStackParamList, 'BankInfo'>;
type BankInfoScreenRouteProp = RouteProp<SellerStackParamList, 'BankInfo'>;

interface BankInfoScreenProps {
  navigation: BankInfoScreenNavigationProp;
  route: BankInfoScreenRouteProp;
}

const BankInfoScreen: React.FC<BankInfoScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { bankInfo, loading } = useAppSelector(state => state.wallet);
  
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolderName: '',
    iban: '',
    accountNumber: '',
    branchCode: '',
  });

  useEffect(() => {
    loadBankInfo();
  }, []);

  useEffect(() => {
    if (bankInfo) {
      setFormData({
        bankName: bankInfo.bankName || '',
        accountHolderName: bankInfo.accountHolderName || '',
        iban: bankInfo.iban || '',
        accountNumber: bankInfo.accountNumber || '',
        branchCode: bankInfo.branchCode || '',
      });
    }
  }, [bankInfo]);

  const loadBankInfo = async () => {
    try {
      const { user } = useAppSelector(state => state.auth);
      if (user?.id) {
        await dispatch(fetchBankInfo(user.id)).unwrap();
      }
    } catch (error) {
      // Bank info might not exist yet, which is fine
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatIban = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Add spaces every 4 characters
    const formatted = cleaned.replace(/.{4}/g, '$& ').trim();
    
    return formatted;
  };

  const handleIbanChange = (value: string) => {
    const formatted = formatIban(value);
    if (formatted.replace(/\s/g, '').length <= 26) { // Turkish IBAN length
      handleInputChange('iban', formatted);
    }
  };

  const validateForm = () => {
    if (!formData.bankName.trim()) {
      Alert.alert('Hata', 'Banka adı zorunludur.');
      return false;
    }
    if (!formData.accountHolderName.trim()) {
      Alert.alert('Hata', 'Hesap sahibi adı zorunludur.');
      return false;
    }
    if (!formData.iban.trim()) {
      Alert.alert('Hata', 'IBAN zorunludur.');
      return false;
    }
    
    const cleanIban = formData.iban.replace(/\s/g, '');
    if (cleanIban.length !== 26) {
      Alert.alert('Hata', 'IBAN 26 karakter olmalıdır.');
      return false;
    }
    
    if (!cleanIban.startsWith('TR')) {
      Alert.alert('Hata', 'IBAN TR ile başlamalıdır.');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(updateBankInfo({
        ...formData,
        iban: formData.iban.replace(/\s/g, ''), // Remove spaces for storage
      })).unwrap();
      
      Alert.alert('Başarılı', 'Banka bilgileri başarıyla güncellendi!', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Banka bilgileri güncellenirken bir hata oluştu.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Banka Bilgileri</Text>
        <Text style={styles.subtitle}>
          Para çekme işlemleri için banka bilgilerinizi güncel tutun.
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Banka Adı *</Text>
          <TextInput
            style={styles.input}
            value={formData.bankName}
            onChangeText={(value) => handleInputChange('bankName', value)}
            placeholder="Örn: Türkiye İş Bankası"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hesap Sahibi Adı *</Text>
          <TextInput
            style={styles.input}
            value={formData.accountHolderName}
            onChangeText={(value) => handleInputChange('accountHolderName', value)}
            placeholder="Ad Soyad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>IBAN *</Text>
          <TextInput
            style={styles.input}
            value={formData.iban}
            onChangeText={handleIbanChange}
            placeholder="TR00 0000 0000 0000 0000 0000 00"
            maxLength={31} // 26 characters + 5 spaces
          />
          <Text style={styles.helperText}>
            IBAN numaranızı TR ile başlayacak şekilde girin
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hesap Numarası</Text>
          <TextInput
            style={styles.input}
            value={formData.accountNumber}
            onChangeText={(value) => handleInputChange('accountNumber', value)}
            placeholder="Hesap numarası (opsiyonel)"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Şube Kodu</Text>
          <TextInput
            style={styles.input}
            value={formData.branchCode}
            onChangeText={(value) => handleInputChange('branchCode', value)}
            placeholder="Şube kodu (opsiyonel)"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Önemli Bilgiler</Text>
          <Text style={styles.infoText}>
            • Banka bilgileri güvenli bir şekilde şifrelenerek saklanır{"\n"}
            • Para çekme işlemleri sadece kayıtlı hesaba yapılır{"\n"}
            • Bilgilerinizi güncel tutmayı unutmayın
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BankInfoScreen;