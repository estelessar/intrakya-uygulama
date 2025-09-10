import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

type NavigationProp = StackNavigationProp<MainStackParamList, 'MyPromocodes'>;

const MyPromocodesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [couponCode, setCouponCode] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddPromocode = () => {
    if (!couponCode.trim()) {
      Alert.alert('Hata', 'Lütfen kupon kodunu girin.');
    return;
  }
  
  // Demo promocodes
  const demoCodes = ['YENI20', 'INDIRIM50', 'HOSGELDIN'];
  const isValidCode = demoCodes.includes(couponCode.toUpperCase());
  
  if (isValidCode) {
    Alert.alert('Başarılı', `${couponCode.toUpperCase()} promosyon kodu başarıyla eklendi!`, [
      {
        text: 'Tamam',
        onPress: () => setCouponCode(''),
      },
    ]);
  } else {
    Alert.alert('Hata', 'Geçersiz promosyon kodu. Demo kodlar: YENI20, INDIRIM50, HOSGELDIN', [
      {
        text: 'Tamam',
      },
    ]);
  }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promosyon Kodlarım</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Empty State */}
        <View style={styles.emptyStateContainer}>
          {/* Placeholder Image */}
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Place Holder</Text>
          </View>
          
          {/* Title */}
          <Text style={styles.emptyTitle}>
            Henüz Promosyon{"\n"}Kodunuz Yok!
          </Text>
          
          {/* Description */}
          <Text style={styles.emptyDescription}>
            Promosyon kodlarınızı buradan takip edebilir ve yeni kodlar ekleyebilirsiniz.
          </Text>
          
          {/* Coupon Code Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="ticket-outline" size={24} color="#707070" />
            <TextInput
              style={styles.textInput}
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="Kupon Kodunuzu Girin"
              placeholderTextColor="#707070"
            />
          </View>
          
          {/* Add Promocode Button */}
          <TouchableOpacity onPress={handleAddPromocode} style={styles.addButton}>
            <Text style={styles.addButtonText}>Promosyon Kodu Ekle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
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
    backgroundColor: '#FFD700',
    marginHorizontal: 0,
  },
  scrollView: {
    flex: 1,
  },
  emptyStateContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    alignItems: 'center',
  },
  placeholderImage: {
    width: 343,
    height: 313,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#C0C0C0',
    fontFamily: 'System',
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  emptyDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#707070',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 24,
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    color: '#000000',
    fontFamily: 'System',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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

export default MyPromocodesScreen;