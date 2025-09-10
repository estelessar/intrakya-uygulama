import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchCargoCompanies,
  updateOrderCargo,
  updateOrderStatus,
} from '../../store/slices/orderSlice';
import { CargoCompany, Order } from '../../types';

interface CargoSelectionScreenProps {
  navigation: any;
  route: {
    params: {
      order: Order;
    };
  };
}

const CargoSelectionScreen: React.FC<CargoSelectionScreenProps> = ({ navigation, route }) => {
  const { order } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { cargoCompanies, cargoLoading, isLoading } = useSelector(
    (state: RootState) => state.orders
  );

  const [selectedCargo, setSelectedCargo] = useState<CargoCompany | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [step, setStep] = useState<'select' | 'tracking'>('select');

  useEffect(() => {
    dispatch(fetchCargoCompanies());
  }, []);

  const handleCargoSelect = (cargo: CargoCompany) => {
    setSelectedCargo(cargo);
    setStep('tracking');
  };

  const handleConfirmShipment = async () => {
    if (!selectedCargo) {
      Alert.alert('Hata', 'Lütfen bir kargo firması seçin.');
      return;
    }

    if (!trackingNumber.trim()) {
      Alert.alert('Hata', 'Lütfen takip numarası girin.');
      return;
    }

    try {
      await dispatch(updateOrderCargo({
        orderId: order.id,
        cargoCompanyId: selectedCargo.id,
        trackingNumber: trackingNumber.trim(),
      })).unwrap();

      Alert.alert(
        'Başarılı',
        'Sipariş kargoya verildi olarak işaretlendi.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Kargo bilgileri güncellenirken bir hata oluştu.');
    }
  };

  const renderCargoCompany = (cargo: CargoCompany) => (
    <TouchableOpacity
      key={cargo.id}
      style={[
        styles.cargoCard,
        selectedCargo?.id === cargo.id && styles.selectedCargoCard,
      ]}
      onPress={() => handleCargoSelect(cargo)}
    >
      <View style={styles.cargoHeader}>
        <View style={styles.cargoLogo}>
          <Image
            source={{ uri: cargo.logo }}
            style={styles.logoImage}
            defaultSource={require('../../../assets/placeholder-logo.svg')}
          />
        </View>
        <View style={styles.cargoInfo}>
          <Text style={styles.cargoName}>{cargo.name}</Text>
          <Text style={styles.cargoDelivery}>Teslimat: {cargo.deliveryTime}</Text>
        </View>
        <View style={styles.cargoPrice}>
          <Text style={styles.priceText}>{cargo.price} TL</Text>
        </View>
      </View>
      
      {selectedCargo?.id === cargo.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.selectedText}>Seçildi</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (cargoLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Kargo firmaları yükleniyor...</Text>
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
        <Text style={styles.headerTitle}>
          {step === 'select' ? 'Kargo Firması Seç' : 'Takip Numarası'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'select' ? (
          <>
            {/* Sipariş Bilgileri */}
            <View style={styles.orderInfo}>
              <Text style={styles.sectionTitle}>Sipariş Bilgileri</Text>
              <View style={styles.orderCard}>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                </Text>
                <Text style={styles.orderAmount}>{order.totalAmount} TL</Text>
              </View>
            </View>

            {/* Kargo Firmaları */}
            <View style={styles.cargoSection}>
              <Text style={styles.sectionTitle}>Kargo Firması Seçin</Text>
              {cargoCompanies
                .filter(cargo => cargo.isActive)
                .map(renderCargoCompany)
              }
            </View>
          </>
        ) : (
          <>
            {/* Seçilen Kargo */}
            <View style={styles.selectedCargoSection}>
              <Text style={styles.sectionTitle}>Seçilen Kargo Firması</Text>
              <View style={styles.selectedCargoInfo}>
                <View style={styles.cargoLogo}>
                  <Image
                    source={{ uri: selectedCargo?.logo }}
                    style={styles.logoImage}
                    defaultSource={require('../../../assets/placeholder-logo.svg')}
                  />
                </View>
                <View style={styles.cargoDetails}>
                  <Text style={styles.cargoName}>{selectedCargo?.name}</Text>
                  <Text style={styles.cargoDelivery}>Teslimat: {selectedCargo?.deliveryTime}</Text>
                  <Text style={styles.cargoPrice}>{selectedCargo?.price} TL</Text>
                </View>
              </View>
            </View>

            {/* Takip Numarası */}
            <View style={styles.trackingSection}>
              <Text style={styles.sectionTitle}>Takip Numarası</Text>
              <Text style={styles.trackingDescription}>
                Kargo firmasından aldığınız takip numarasını girin.
              </Text>
              <TextInput
                style={styles.trackingInput}
                placeholder="Takip numarasını girin"
                value={trackingNumber}
                onChangeText={setTrackingNumber}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {/* Geri Dön Butonu */}
            <TouchableOpacity
              style={styles.backToSelectionButton}
              onPress={() => setStep('select')}
            >
              <Ionicons name="arrow-back" size={16} color="#007AFF" />
              <Text style={styles.backToSelectionText}>Kargo Firması Değiştir</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Alt Buton */}
      {step === 'tracking' && (
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!trackingNumber.trim() || isLoading) && styles.disabledButton,
            ]}
            onPress={handleConfirmShipment}
            disabled={!trackingNumber.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFF" />
                <Text style={styles.confirmButtonText}>Kargoya Verildi</Text>
              </>
            )}
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  orderInfo: {
    marginBottom: 24,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cargoSection: {
    marginBottom: 24,
  },
  cargoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCargoCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  cargoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cargoLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  cargoInfo: {
    flex: 1,
  },
  cargoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cargoDelivery: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cargoPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  selectedText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  selectedCargoSection: {
    marginBottom: 24,
  },
  selectedCargoInfo: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cargoDetails: {
    flex: 1,
    marginLeft: 12,
  },
  trackingSection: {
    marginBottom: 24,
  },
  trackingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  trackingInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  backToSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backToSelectionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  bottomSection: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CargoSelectionScreen;