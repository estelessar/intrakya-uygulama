import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

type NavigationProp = StackNavigationProp<MainStackParamList, 'MyAddress'>;

interface AddressItem {
  id: string;
  title: string;
  address: string;
  isDefault?: boolean;
  icon: string;
}

const MyAddressScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const addresses: AddressItem[] = [
    {
      id: '1',
      title: 'Ev',
      address: 'Atatürk Mahallesi, Cumhuriyet Caddesi No:45/7, Kadıköy, İstanbul 34710',
      isDefault: true,
      icon: 'home-outline',
    },
    {
      id: '2',
      title: 'Ofis',
      address: 'Maslak Mahallesi, Büyükdere Caddesi No:255, Sarıyer, İstanbul 34398',
      icon: 'business-outline',
    },
    {
      id: '3',
      title: 'Apartman',
      address: 'Çankaya Mahallesi, Tunalı Hilmi Caddesi No:12/3, Çankaya, Ankara 06680',
      icon: 'business-outline',
    },
    {
      id: '4',
      title: 'Ebeveyn Evi',
      address: 'Alsancak Mahallesi, Kıbrıs Şehitleri Caddesi No:78, Konak, İzmir 35220',
      icon: 'home-outline',
    },
    {
      id: '5',
      title: 'Şehir Meydanı',
      address: 'Selçuklu Mahallesi, Mevlana Caddesi No:156, Selçuklu, Konya 42250',
      icon: 'location-outline',
    },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEditAddress = (addressId: string) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
      navigation.navigate('EditAddress', {
        addressId: addressToEdit.id,
        title: addressToEdit.title,
        address: addressToEdit.address,
        isDefault: addressToEdit.isDefault,
      });
    }
  };

  const handleAddNewAddress = () => {
    navigation.navigate('AddNewAddress');
  };

  const renderAddressItem = (item: AddressItem) => (
    <View key={item.id} style={styles.addressItem}>
      <View style={styles.addressIconContainer}>
        <Ionicons name={item.icon as any} size={24} color="#000" />
      </View>
      <View style={styles.addressContent}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressTitle}>{item.title}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Varsayılan</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText}>{item.address}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditAddress(item.id)}
      >
        <Ionicons name="create-outline" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adreslerim</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Address List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.addressList}>
          {addresses.map((address, index) => (
            <View key={address.id}>
              {renderAddressItem(address)}
              {index < addresses.length - 1 && <View style={styles.addressDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add New Address Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAddress}
        >
          <Text style={styles.addButtonText}>Yeni Adres Ekle</Text>
        </TouchableOpacity>
      </View>

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 54,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 0,
  },
  scrollView: {
    flex: 1,
  },
  addressList: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addressIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#707070',
    fontFamily: 'System',
  },
  editButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  addressDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 24,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  addButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  bottomIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 16,
  },
  bottomIndicator: {
    width: 135,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
});

export default MyAddressScreen;