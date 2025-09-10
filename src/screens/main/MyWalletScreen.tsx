import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

type MyWalletScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MyWallet'>;

const MyWalletScreen = () => {
  const navigation = useNavigation<MyWalletScreenNavigationProp>();
  const [amount, setAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('visa');

  const walletBalance = 255.00;

  const paymentMethods = [
    { id: 'creditCard', name: 'Kredi Kartı', icon: '💳' },
    { id: 'bankCard', name: 'Banka Kartı', icon: '🏦' },
    { id: 'papara', name: 'Papara', icon: '📱' },
    { id: 'iyzico', name: 'İyzico', icon: '💰' },
  ];

  const handleAddToWallet = () => {
    // Cüzdana para ekleme işlemi
    console.log('Para ekleniyor:', amount, selectedPayment);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cüzdanım</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wallet Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Cüzdan Bakiyem</Text>
            <Text style={styles.balanceAmount}>₺{walletBalance.toFixed(2)}</Text>
          </View>
          <Text style={styles.balanceSubtext}>En fazla ₺1000 ekleyebilirsiniz</Text>
        </View>

        {/* Amount Input Section */}
        <View style={styles.amountSection}>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₺</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Miktar Girin"
              placeholderTextColor="#707070"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.limitText}>
            Para ekleme limiti ayda ₺1000 ve yılda ₺10000'dır.
          </Text>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Ödeme Yöntemi Seçin</Text>
          <View style={styles.paymentMethodsContainer}>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedPayment === 'visa' && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment('visa')}
          >
            <View style={styles.paymentMethodContent}>
              <View style={styles.visaLogo}>
                <Text style={styles.visaText}>VISA</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedPayment === 'mastercard' && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment('mastercard')}
          >
            <View style={styles.paymentMethodContent}>
              <View style={styles.mastercardLogo}>
                <View style={styles.mastercardCircle1} />
                <View style={styles.mastercardCircle2} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedPayment === 'papara' && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment('papara')}
          >
            <View style={styles.paymentMethodContent}>
              <View style={styles.paparaLogo}>
                <Text style={styles.paparaText}>papara</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              selectedPayment === 'iyzico' && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment('iyzico')}
          >
            <View style={styles.paymentMethodContent}>
              <View style={styles.iyzicoLogo}>
                <Text style={styles.iyzicoText}>iyzico</Text>
              </View>
            </View>
          </TouchableOpacity>
          </View>
          
          {/* View All Payment Methods Button */}
          <TouchableOpacity 
            style={styles.viewAllPaymentsButton}
            onPress={() => navigation.navigate('PaymentMethod')}
          >
            <Text style={styles.viewAllPaymentsText}>Tüm Ödeme Yöntemlerini Gör</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Add to Wallet Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddToWallet}
        >
          <Text style={styles.addButtonText}>Cüzdana Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFD700',
    fontFamily: 'System',
  },
  balanceSubtext: {
    fontSize: 16,
    color: '#707070',
    fontFamily: 'System',
  },
  amountSection: {
    marginBottom: 32,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
    fontFamily: 'System',
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    fontFamily: 'System',
  },
  limitText: {
    fontSize: 16,
    color: '#707070',
    lineHeight: 24,
    fontFamily: 'System',
  },
  paymentSection: {
    marginTop: 32,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    fontFamily: 'System',
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paymentMethod: {
    width: '48%',
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPayment: {
    borderColor: '#FFD700',
    backgroundColor: '#FFF9E6',
  },
  paymentMethodContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaLogo: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#1A1F71',
    borderRadius: 4,
  },
  visaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mastercardCircle1: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EB001B',
    marginRight: -8,
  },
  mastercardCircle2: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5F00',
  },
  paparaLogo: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paparaText: {
    color: '#6C5CE7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iyzicoLogo: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  iyzicoText: {
    color: '#00BCD4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  viewAllPaymentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  viewAllPaymentsText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default MyWalletScreen;