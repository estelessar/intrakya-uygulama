import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

type PaymentMethodScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'PaymentMethod'
>;

const PaymentMethodScreen = () => {
  const navigation = useNavigation<PaymentMethodScreenNavigationProp>();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'visa',
      type: 'card',
      name: 'Visa',
      number: '**** 4864',
      icon: 'card',
      connected: false,
    },
    {
      id: 'mastercard',
      type: 'card',
      name: 'Mastercard',
      number: '**** 3597',
      icon: 'card',
      connected: false,
    },
    {
      id: 'applepay',
      type: 'digital',
      name: 'Apple Pay',
      number: '',
      icon: 'logo-apple',
      connected: true,
    },
    {
      id: 'googlepay',
      type: 'digital',
      name: 'Google Pay',
      number: '',
      icon: 'logo-google',
      connected: true,
    },
    {
      id: 'paypal',
      type: 'digital',
      name: 'PayPal',
      number: '',
      icon: 'logo-paypal',
      connected: true,
    },
    {
      id: 'amazonpay',
      type: 'digital',
      name: 'Amazon Pay',
      number: '',
      icon: 'logo-amazon',
      connected: false,
    },
  ];

  const renderPaymentMethod = (method: any) => {
    const isCard = method.type === 'card';
    
    return (
      <View key={method.id} style={styles.paymentMethodContainer}>
        <View style={styles.paymentMethodRow}>
          <View style={styles.paymentMethodLeft}>
            {isCard ? (
              <View style={[styles.cardIcon, method.id === 'visa' ? styles.visaIcon : styles.mastercardIcon]}>
                <Text style={styles.cardIconText}>
                  {method.id === 'visa' ? 'VISA' : 'MC'}
                </Text>
              </View>
            ) : (
              <View style={styles.digitalIcon}>
                <Ionicons name={method.icon as any} size={24} color="#000" />
              </View>
            )}
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodName}>{method.name}</Text>
              {method.number && (
                <Text style={styles.paymentMethodNumber}>{method.number}</Text>
              )}
            </View>
          </View>
          <View style={styles.paymentMethodRight}>
            {isCard ? (
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={16} color="#666" />
              </TouchableOpacity>
            ) : (
              <Text style={[styles.connectionStatus, method.connected ? styles.connected : styles.notConnected]}>
                {method.connected ? 'Bağlandı' : 'Bağlanmadı'}
              </Text>
            )}
          </View>
        </View>
        {method.id !== 'amazonpay' && <View style={styles.separator} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödeme Yöntemi</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Methods List */}
        <View style={styles.paymentMethodsList}>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Add New Card Button */}
        <TouchableOpacity 
          style={styles.addCardButton}
          onPress={() => navigation.navigate('AddNewCard')}
        >
          <Text style={styles.addCardButtonText}>Yeni Kart Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  paymentMethodsList: {
    marginTop: 32,
  },
  paymentMethodContainer: {
    marginBottom: 16,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 46,
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  visaIcon: {
    backgroundColor: '#1a1f71',
  },
  mastercardIcon: {
    backgroundColor: '#eb001b',
  },
  cardIconText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  digitalIcon: {
    width: 46,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    color: '#707070',
    marginBottom: 2,
  },
  paymentMethodNumber: {
    fontSize: 14,
    color: '#707070',
  },
  paymentMethodRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    padding: 8,
  },
  connectionStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  connected: {
    color: '#000',
  },
  notConnected: {
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 8,
  },
  addCardButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 236,
    marginBottom: 32,
  },
  addCardButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PaymentMethodScreen;