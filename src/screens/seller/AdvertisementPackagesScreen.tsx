import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchAdPackages,
  createAdvertisement,
} from '../../store/slices/advertisementSlice';
import { spendOnAdvertisement } from '../../store/slices/walletSlice';

interface AdvertisementPackagesScreenProps {
  navigation: any;
  route: {
    params: {
      productId: string;
      productName: string;
    };
  };
}

const AdvertisementPackagesScreen: React.FC<AdvertisementPackagesScreenProps> = ({
  navigation,
  route,
}) => {
  const { productId, productName } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { adPackages, packagesLoading, error } = useSelector(
    (state: RootState) => state.advertisement
  );
  const { wallet } = useSelector((state: RootState) => state.wallet);
  const { user } = useSelector((state: RootState) => state.auth);

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchAdPackages());
  }, [dispatch]);

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'featured':
        return 'star';
      case 'category_top':
        return 'trending-up';
      case 'homepage_banner':
        return 'megaphone';
      case 'search_boost':
        return 'search';
      default:
        return 'pricetag';
    }
  };

  const getPackageColor = (type: string) => {
    switch (type) {
      case 'featured':
        return '#FF9500';
      case 'category_top':
        return '#007AFF';
      case 'homepage_banner':
        return '#FF3B30';
      case 'search_boost':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleCreateAdvertisement = async () => {
    if (!selectedPackage || !user) {
      Alert.alert('Hata', 'Lütfen bir paket seçin.');
      return;
    }

    const selectedPkg = adPackages.find(pkg => pkg.id === selectedPackage);
    if (!selectedPkg) {
      Alert.alert('Hata', 'Seçilen paket bulunamadı.');
      return;
    }

    if (!wallet || wallet.availableBalance < selectedPkg.price) {
      Alert.alert(
        'Yetersiz Bakiye',
        `Bu reklam paketi için ${selectedPkg.price} TL gerekli. Mevcut bakiyeniz: ${wallet?.availableBalance || 0} TL`
      );
      return;
    }

    Alert.alert(
      'Reklam Oluştur',
      `"${selectedPkg.name}" paketini ${selectedPkg.price} TL karşılığında satın almak istediğinizden emin misiniz?\n\nÜrün: ${productName}`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Satın Al',
          onPress: async () => {
            setIsCreating(true);
            try {
              // Önce reklam oluştur
              await dispatch(createAdvertisement({
                sellerId: user.id,
                productId,
                packageId: selectedPackage,
                duration: selectedPkg.duration,
              })).unwrap();

              // Sonra bakiyeden düş
              await dispatch(spendOnAdvertisement({
                sellerId: user.id,
                amount: selectedPkg.price,
                adType: selectedPkg.type,
                productId: productId,
              })).unwrap();

              Alert.alert(
                'Başarılı',
                'Reklamınız başarıyla oluşturuldu ve yayına alındı!',
                [
                  {
                    text: 'Tamam',
                    onPress: () => navigation.navigate('MyAdvertisements'),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Hata', 'Reklam oluşturulurken bir hata oluştu.');
            } finally {
              setIsCreating(false);
            }
          },
        },
      ]
    );
  };

  if (packagesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reklam Paketleri</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Paketler yükleniyor...</Text>
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
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reklam Paketleri</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Ionicons name="cube-outline" size={20} color="#666" />
        <Text style={styles.productName} numberOfLines={1}>
          {productName}
        </Text>
      </View>

      {/* Balance Info */}
      {wallet && (
        <View style={styles.balanceInfo}>
          <Ionicons name="wallet-outline" size={20} color="#007AFF" />
          <Text style={styles.balanceText}>
            Mevcut Bakiye: {wallet.availableBalance.toFixed(2)} TL
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {adPackages.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          const canAfford = wallet ? wallet.availableBalance >= pkg.price : false;
          const packageColor = getPackageColor(pkg.type);

          return (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard,
                isSelected && styles.selectedPackageCard,
                !canAfford && styles.disabledPackageCard,
              ]}
              onPress={() => canAfford && handlePackageSelect(pkg.id)}
              disabled={!canAfford}
            >
              <View style={styles.packageHeader}>
                <View style={[styles.packageIcon, { backgroundColor: packageColor }]}>
                  <Ionicons
                    name={getPackageIcon(pkg.type) as any}
                    size={24}
                    color="#FFF"
                  />
                </View>
                <View style={styles.packageTitleContainer}>
                  <Text style={[
                    styles.packageName,
                    !canAfford && styles.disabledText,
                  ]}>
                    {pkg.name}
                  </Text>
                  <Text style={[
                    styles.packageDescription,
                    !canAfford && styles.disabledText,
                  ]}>
                    {pkg.description}
                  </Text>
                </View>
                <View style={styles.packagePrice}>
                  <Text style={[
                    styles.priceText,
                    !canAfford && styles.disabledText,
                  ]}>
                    {pkg.price} TL
                  </Text>
                  <Text style={[
                    styles.durationText,
                    !canAfford && styles.disabledText,
                  ]}>
                    {pkg.duration} gün
                  </Text>
                </View>
              </View>

              <View style={styles.packageFeatures}>
                {pkg.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={canAfford ? packageColor : '#CCC'}
                    />
                    <Text style={[
                      styles.featureText,
                      !canAfford && styles.disabledText,
                    ]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {!canAfford && (
                <View style={styles.insufficientBalanceWarning}>
                  <Ionicons name="warning" size={16} color="#FF3B30" />
                  <Text style={styles.warningText}>Yetersiz bakiye</Text>
                </View>
              )}

              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.createButton,
            (!selectedPackage || isCreating) && styles.disabledButton,
          ]}
          onPress={handleCreateAdvertisement}
          disabled={!selectedPackage || isCreating}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="rocket" size={20} color="#FFF" />
              <Text style={styles.createButtonText}>Reklamı Başlat</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  placeholder: {
    width: 40,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFBF0',
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 8,
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
  packageCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPackageCard: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFBF0',
  },
  disabledPackageCard: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packageTitleContainer: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  packageDescription: {
    fontSize: 12,
    color: '#666',
  },
  packagePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  packageFeatures: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  disabledText: {
    color: '#999',
  },
  insufficientBalanceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FFE5E5',
  },
  warningText: {
    fontSize: 12,
    color: '#FF3B30',
    marginLeft: 4,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});

export default AdvertisementPackagesScreen;