import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';

type CheckoutRouteProp = RouteProp<MainStackParamList, 'Checkout'>;
type CheckoutNavigationProp = StackNavigationProp<MainStackParamList, 'Checkout'>;

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'cash';
  name: string;
  details: string;
  icon: string;
}

interface Address {
  id: string;
  title: string;
  fullAddress: string;
  isDefault: boolean;
}

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<CheckoutNavigationProp>();
  const route = useRoute<CheckoutRouteProp>();
  const { items, subtotal, discount, shipping, total } = route.params;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('1');
  const [selectedAddress, setSelectedAddress] = useState<string>('1');
  const [promoCode, setPromoCode] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Kredi Kartı',
      details: '**** **** **** 1234',
      icon: 'card-outline'
    },
    {
      id: '2',
      type: 'wallet',
      name: 'Dijital Cüzdan',
      details: '₺2,450.00 bakiye',
      icon: 'wallet-outline'
    },
    {
      id: '3',
      type: 'cash',
      name: 'Kapıda Ödeme',
      details: 'Nakit veya kart ile',
      icon: 'cash-outline'
    }
  ];

  const addresses: Address[] = [
    {
      id: '1',
      title: 'Ev',
      fullAddress: 'Atatürk Mah. İstiklal Cad. No:123 Kadıköy/İstanbul',
      isDefault: true
    },
    {
      id: '2',
      title: 'İş',
      fullAddress: 'Levent Mah. Büyükdere Cad. No:456 Şişli/İstanbul',
      isDefault: false
    }
  ];

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Sipariş Başarılı!',
        'Siparişiniz başarıyla oluşturuldu. Sipariş takip sayfasından durumunu kontrol edebilirsiniz.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.selectedCard
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View style={styles.paymentMethodContent}>
        <Ionicons 
          name={method.icon as any} 
          size={24} 
          color={selectedPaymentMethod === method.id ? '#FFD700' : '#666'} 
        />
        <View style={styles.paymentMethodInfo}>
          <Text style={styles.paymentMethodName}>{method.name}</Text>
          <Text style={styles.paymentMethodDetails}>{method.details}</Text>
        </View>
      </View>
      <View style={[
        styles.radioButton,
        selectedPaymentMethod === method.id && styles.selectedRadio
      ]}>
        {selectedPaymentMethod === method.id && (
          <View style={styles.radioInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAddress = (address: Address) => (
    <TouchableOpacity
      key={address.id}
      style={[
        styles.addressCard,
        selectedAddress === address.id && styles.selectedCard
      ]}
      onPress={() => setSelectedAddress(address.id)}
    >
      <View style={styles.addressContent}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressTitle}>{address.title}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Varsayılan</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText}>{address.fullAddress}</Text>
      </View>
      <View style={[
        styles.radioButton,
        selectedAddress === address.id && styles.selectedRadio
      ]}>
        {selectedAddress === address.id && (
          <View style={styles.radioInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödeme</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Değiştir</Text>
            </TouchableOpacity>
          </View>
          {addresses.map(renderAddress)}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
          <View style={styles.orderSummary}>
            <Text style={styles.itemCount}>{items.length} ürün</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ara Toplam</Text>
              <Text style={styles.summaryValue}>₺{subtotal.toLocaleString()}</Text>
            </View>
            
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>İndirim</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>-₺{discount.toLocaleString()}</Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Kargo</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Toplam</Text>
              <Text style={styles.totalValue}>₺{total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promosyon Kodu</Text>
          <View style={styles.promoContainer}>
            <View style={styles.promoInputContainer}>
              <Ionicons name="pricetag-outline" size={20} color="#666" />
              <Text style={styles.promoInput}>Promosyon kodu girin</Text>
            </View>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.placeOrderButton, isProcessing && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          <Text style={[styles.placeOrderText, isProcessing && styles.disabledText]}>
            {isProcessing ? 'İşleniyor...' : `₺${total.toLocaleString()} - Siparişi Tamamla`}
          </Text>
          {!isProcessing && (
            <Ionicons name="arrow-forward" size={20} color="#000" />
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  changeText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
    fontFamily: 'System',
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFBF0',
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
    fontFamily: 'System',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    fontFamily: 'System',
  },
  orderSummary: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'System',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'System',
  },
  discountValue: {
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
  paymentMethodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    marginLeft: 12,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  paymentMethodDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontFamily: 'System',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#FFD700',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  promoInput: {
    flex: 1,
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
    fontFamily: 'System',
  },
  applyButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  placeOrderButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
    fontFamily: 'System',
  },
  disabledText: {
    color: '#999',
  },
});

export default CheckoutScreen;