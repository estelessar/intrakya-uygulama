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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BankAccount } from '../../types';

interface BankAccountScreenProps {
  navigation: any;
}

const BankAccountScreen: React.FC<BankAccountScreenProps> = ({ navigation }) => {
  const [bankAccount, setBankAccount] = useState<BankAccount>({
    bankName: '',
    accountNumber: '',
    iban: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadBankAccount();
  }, []);

  const loadBankAccount = async () => {
    setLoading(true);
    try {
      // API çağrısı simülasyonu
      const response = await fetch('/api/seller/bank-account');
      if (response.ok) {
        const data = await response.json();
        setBankAccount(data);
      }
    } catch (error) {
      console.error('Banka hesabı bilgileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!bankAccount.bankName.trim()) {
      newErrors.bankName = 'Banka adı gereklidir';
    }

    if (!bankAccount.accountNumber.trim()) {
      newErrors.accountNumber = 'Hesap numarası gereklidir';
    } else if (!/^\d{8,17}$/.test(bankAccount.accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = 'Geçerli bir hesap numarası giriniz';
    }

    if (!bankAccount.iban.trim()) {
      newErrors.iban = 'IBAN gereklidir';
    } else if (!/^TR\d{24}$/.test(bankAccount.iban.replace(/\s/g, ''))) {
      newErrors.iban = 'Geçerli bir Türk IBAN giriniz (TR ile başlamalı)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatIban = (iban: string): string => {
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    return cleaned.replace(/(\w{4})/g, '$1 ').trim();
  };

  const formatAccountNumber = (accountNumber: string): string => {
    const cleaned = accountNumber.replace(/\s/g, '');
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleIbanChange = (text: string) => {
    const formatted = formatIban(text);
    setBankAccount(prev => ({ ...prev, iban: formatted }));
    if (errors.iban) {
      setErrors(prev => ({ ...prev, iban: '' }));
    }
  };

  const handleAccountNumberChange = (text: string) => {
    const formatted = formatAccountNumber(text);
    setBankAccount(prev => ({ ...prev, accountNumber: formatted }));
    if (errors.accountNumber) {
      setErrors(prev => ({ ...prev, accountNumber: '' }));
    }
  };

  const handleBankNameChange = (text: string) => {
    setBankAccount(prev => ({ ...prev, bankName: text }));
    if (errors.bankName) {
      setErrors(prev => ({ ...prev, bankName: '' }));
    }
  };

  const saveBankAccount = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/seller/bank-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bankAccount,
          iban: bankAccount.iban.replace(/\s/g, ''),
          accountNumber: bankAccount.accountNumber.replace(/\s/g, ''),
        }),
      });

      if (response.ok) {
        Alert.alert('Başarılı', 'Banka hesabı bilgileri kaydedildi', [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Hata', 'Banka hesabı bilgileri kaydedilemedi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

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
        <Text style={styles.headerTitle}>Banka Hesabı</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            Para çekme işlemleri için banka hesabı bilgilerinizi güncel tutunuz.
            Tüm bilgiler güvenli şekilde saklanmaktadır.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Banka Adı</Text>
            <TextInput
              style={[styles.input, errors.bankName && styles.inputError]}
              value={bankAccount.bankName}
              onChangeText={handleBankNameChange}
              placeholder="Örn: Türkiye İş Bankası"
              placeholderTextColor="#999"
            />
            {errors.bankName && (
              <Text style={styles.errorText}>{errors.bankName}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hesap Numarası</Text>
            <TextInput
              style={[styles.input, errors.accountNumber && styles.inputError]}
              value={bankAccount.accountNumber}
              onChangeText={handleAccountNumberChange}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={23} // 16 digits + 3 spaces
            />
            {errors.accountNumber && (
              <Text style={styles.errorText}>{errors.accountNumber}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>IBAN</Text>
            <TextInput
              style={[styles.input, errors.iban && styles.inputError]}
              value={bankAccount.iban}
              onChangeText={handleIbanChange}
              placeholder="TR12 3456 7890 1234 5678 9012 34"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              maxLength={31} // 26 characters + 5 spaces
            />
            {errors.iban && (
              <Text style={styles.errorText}>{errors.iban}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveBankAccount}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Kaydet</Text>
          )}
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BankAccountScreen;