import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainStackNavigationProp } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

type NavigationProp = MainStackNavigationProp;

// Demo kullanıcı verileri
const demoUserData = {
  firstName: 'Ahmet',
  lastName: 'Yılmaz',
  email: 'ahmet.yilmaz@email.com',
  phone: '0555 123 45 67',
  address: 'Kadıköy, İstanbul',
  identityNumber: '12345678901',
};

const BecomeSellerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [sellerType, setSellerType] = useState<'individual' | 'corporate'>('individual');
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: '',
    businessType: '',
    description: '',
    identityNumber: '',
    firstName: '',
    lastName: '',
  });

  // Kullanıcı verilerini otomatik doldur
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      firstName: demoUserData.firstName,
      lastName: demoUserData.lastName,
      email: demoUserData.email,
      phone: demoUserData.phone,
      address: demoUserData.address,
      identityNumber: demoUserData.identityNumber,
      contactPerson: `${demoUserData.firstName} ${demoUserData.lastName}`, // Kurumsal için
    }));
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Validate required fields based on seller type
    let requiredFields: string[] = [];
    
    if (sellerType === 'individual') {
      requiredFields = ['identityNumber', 'businessType'];
    } else {
      requiredFields = ['companyName', 'taxNumber', 'businessType'];
    }
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim());
    
    if (missingFields.length > 0) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    // Demo başarı mesajı ve profil sayfasına yönlendirme
    const sellerTypeText = sellerType === 'individual' ? 'Bireysel' : 'Kurumsal';
    Alert.alert(
      'Tebrikler!',
      `${sellerTypeText} satıcı başvurunuz onaylandı! Artık satıcı profilinizi görüntüleyebilirsiniz.`,
      [
        {
          text: 'Profili Görüntüle',
          onPress: () => navigation.navigate('SellerDashboard'),
        },
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Satıcı Olma</Text>
          <View style={styles.placeholder} />
        </View>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="storefront" size={48} color="#000000" />
            </View>
            <Text style={styles.welcomeTitle}>INTRAKYA'da Satıcı Olun!</Text>
            <Text style={styles.welcomeDescription}>
              Milyonlarca müşteriye ulaşın ve işinizi büyütün. Satıcı olmak için aşağıdaki formu doldurun.
            </Text>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Satıcı Avantajları</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
              <Text style={styles.benefitText}>Geniş müşteri kitlesine erişim</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
              <Text style={styles.benefitText}>Kolay ürün yönetimi</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
              <Text style={styles.benefitText}>Güvenli ödeme sistemi</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
              <Text style={styles.benefitText}>7/24 satıcı desteği</Text>
            </View>
          </View>

          {/* Seller Type Selection */}
          <View style={styles.sellerTypeSection}>
            <Text style={styles.sectionTitle}>Satıcı Türü</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setSellerType('individual')}
              >
                <View style={styles.radioButton}>
                  {sellerType === 'individual' && <View style={styles.radioButtonSelected} />}
                </View>
                <Text style={styles.radioText}>Bireysel Satıcı</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => setSellerType('corporate')}
              >
                <View style={styles.radioButton}>
                  {sellerType === 'corporate' && <View style={styles.radioButtonSelected} />}
                </View>
                <Text style={styles.radioText}>Kurumsal Satıcı</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Başvuru Formu</Text>
            
            {/* Kullanıcı Bilgileri - Sadece Görüntüleme */}
            <View style={styles.userInfoSection}>
              <Text style={styles.sectionTitle}>Kullanıcı Bilgileriniz</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ad Soyad:</Text>
                  <Text style={styles.infoValue}>{formData.firstName} {formData.lastName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>E-posta:</Text>
                  <Text style={styles.infoValue}>{formData.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Telefon:</Text>
                  <Text style={styles.infoValue}>{formData.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Adres:</Text>
                  <Text style={styles.infoValue}>{formData.address}</Text>
                </View>
              </View>
            </View>

            {/* Satıcılığa Özel Bilgiler */}
            {sellerType === 'individual' ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>T.C. Kimlik Numarası *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.identityNumber}
                    onChangeText={(value) => updateFormData('identityNumber', value)}
                    placeholder="11 haneli kimlik numaranız"
                    placeholderTextColor="#999999"
                    keyboardType="numeric"
                    maxLength={11}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Şirket/Mağaza Adı *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.companyName}
                    onChangeText={(value) => updateFormData('companyName', value)}
                    placeholder="Şirket adınızı girin"
                    placeholderTextColor="#999999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Vergi Numarası *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.taxNumber}
                    onChangeText={(value) => updateFormData('taxNumber', value)}
                    placeholder="Vergi numaranızı girin"
                    placeholderTextColor="#999999"
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}



            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>İş Türü *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.businessType}
                onChangeText={(value) => updateFormData('businessType', value)}
                placeholder="Örn: Elektronik, Giyim, Ev & Yaşam"
                placeholderTextColor="#999999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>İşletme Açıklaması</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                placeholder="İşletmeniz hakkında kısa bilgi verin"
                placeholderTextColor="#999999"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Başvuru Gönder</Text>
            </TouchableOpacity>
            
            <Text style={styles.noteText}>
              * Zorunlu alanlar{"\n"}
              Başvurunuz 2-3 iş günü içinde değerlendirilecektir.
            </Text>
          </View>
        </ScrollView>
        <BottomNavigation />
      </KeyboardAvoidingView>
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
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  benefitsSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sellerTypeSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF8DC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginHorizontal: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  radioText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
    fontFamily: 'System',
    marginLeft: 12,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFF8DC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    fontFamily: 'System',
    borderWidth: 1,
    borderColor: '#FFD700',
    minHeight: 48,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  noteText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 20,
  },
  userInfoSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  infoCard: {
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE55C',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    fontFamily: 'System',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
    flex: 2,
    textAlign: 'right',
  },
});

export default BecomeSellerScreen;