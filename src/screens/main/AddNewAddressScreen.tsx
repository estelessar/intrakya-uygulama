import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<MainStackParamList, 'AddNewAddress'>;

const AddNewAddressScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [title, setTitle] = useState('Ev');
  const [address, setAddress] = useState('Bahçelievler Mahallesi, Adnan Kahveci Bulvarı No:32/5, Bahçelievler, İstanbul 34180');
  const [isDefault, setIsDefault] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddAddress = () => {
    if (!title.trim() || !address.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    
    // TODO: Add address to storage/database
    Alert.alert('Başarılı', 'Adres başarıyla eklendi!', [
      {
        text: 'Tamam',
        onPress: () => navigation.goBack(),
      },
    ]);
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
        <Text style={styles.headerTitle}>Yeni Adres Ekle</Text>
        <View style={styles.placeholder} />
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
            <Text style={styles.mapLabel}>Red's Java House</Text>
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
        <TouchableOpacity onPress={handleAddAddress} style={styles.addButton}>
          <Text style={styles.addButtonText}>Adres Ekle</Text>
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

export default AddNewAddressScreen;