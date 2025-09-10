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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

type NavigationProp = StackNavigationProp<MainStackParamList, 'EditAddress'>;

interface RouteParams {
  addressId: string;
  title: string;
  address: string;
  isDefault?: boolean;
}

const EditAddressScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const params = route.params as RouteParams;
  
  const [title, setTitle] = useState(params?.title || '');
  const [address, setAddress] = useState(params?.address || '');
  const [isDefault, setIsDefault] = useState(params?.isDefault || false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSaveAddress = () => {
    if (!title.trim() || !address.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    
    // TODO: Update address in storage/database
    Alert.alert('Başarılı', 'Adres başarıyla güncellendi!', [
      {
        text: 'Tamam',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleDeleteAddress = () => {
    Alert.alert(
      'Adresi Sil',
      'Bu adresi silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            // TODO: Delete address from storage/database
            Alert.alert('Başarılı', 'Adres başarıyla silindi!', [
              {
                text: 'Tamam',
                onPress: () => navigation.goBack(),
              },
            ]);
          },
        },
      ]
    );
  };

  const toggleDefault = () => {
    setIsDefault(!isDefault);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adresi Düzenle</Text>
        <TouchableOpacity onPress={handleDeleteAddress} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapPin}>
              <Ionicons name="location" size={24} color="#FFD700" />
            </View>
            <Text style={styles.mapLabel}>Konum</Text>
          </View>
        </View>
        
        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>BAŞLIK</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Başlık girin"
                placeholderTextColor="#999999"
              />
            </View>
          </View>
          
          {/* Address Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>ADRES</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Adres girin"
                placeholderTextColor="#999999"
                multiline
              />
            </View>
          </View>
          
          {/* Default Address Checkbox */}
          <TouchableOpacity onPress={toggleDefault} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isDefault && styles.checkboxChecked]}>
              {isDefault && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Bunu varsayılan adres yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleSaveAddress} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
        </TouchableOpacity>
        
        <BottomNavigation />
      </View>
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
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 0,
  },
  scrollView: {
    flex: 1,
  },
  mapContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  mapPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 8,
  },
  mapLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    fontFamily: 'System',
    minHeight: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#707070',
    fontFamily: 'System',
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  saveButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
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

export default EditAddressScreen;