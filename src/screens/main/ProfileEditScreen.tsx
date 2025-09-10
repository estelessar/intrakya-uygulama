import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import BottomNavigation from '../../components/BottomNavigation';

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('Ahmet Şahin');
  const [email, setEmail] = useState('ahmet.sahin@email.com');
  const [phone, setPhone] = useState('+90 532 123 45 67');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await SecureStore.getItemAsync('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.log('Profil fotoğrafı yüklenirken hata:', error);
    }
  };

  const handleUpdateChanges = async () => {
    try {
      // Save profile image to SecureStore
      if (profileImage) {
        await SecureStore.setItemAsync('profileImage', profileImage);
      }
      
      // Handle other profile data updates here
      console.log('Profil güncellendi');
      Alert.alert('Başarılı', 'Profiliniz başarıyla güncellendi!');
      navigation.goBack();
    } catch (error) {
      console.log('Profil güncellenirken hata:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gereklidir.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Düzenle</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Separator */}
      <View style={styles.separator} />
      
      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.placeholderText}>Fotoğraf Seç</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={24} color="#666666" />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Ad Soyad"
              placeholderTextColor="#999999"
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={24} color="#666666" />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="E-posta"
              placeholderTextColor="#999999"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Image 
              source={{ uri: 'https://flagcdn.com/w20/tr.png' }} 
              style={styles.flagIcon}
            />
            <Ionicons name="chevron-down" size={24} color="#666666" style={styles.dropdownIcon} />
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Telefon Numarası"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
            />
          </View>
        </View>
        
        {/* Update Button */}
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={handleUpdateChanges}
        >
          <Text style={styles.updateButtonText}>Değişiklikleri Kaydet</Text>
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
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
  profileSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  profileImagePlaceholder: {
    width: 151,
    height: 151,
    borderRadius: 75.5,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 151,
    height: 151,
    borderRadius: 75.5,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'System',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    marginLeft: 12,
    fontFamily: 'System',
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    marginLeft: 12,
    fontFamily: 'System',
  },
  flagIcon: {
    width: 28,
    height: 20,
    borderRadius: 2,
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  updateButton: {
    width: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  bottomIndicator: {
    alignItems: 'center',
    paddingVertical: 19,
    paddingBottom: 10,
  },
  indicator: {
    width: 135,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
});

export default ProfileEditScreen;