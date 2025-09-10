/**
 * Register Screen - INTRAKYA Marketplace
 * Developed by: ADN Bilişim Teknolojileri
 * User registration with form validation
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { scaleWidth, scaleHeight, scaleFont } from '../../utils/responsive';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    
    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    
    // Şifre uzunluk kontrolü
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    
    // Demo kayıt işlemi
    Alert.alert('Başarılı', `Kayıt olundu! Hoş geldiniz ${firstName} ${lastName}. Dil seçimi için yönlendiriliyorsunuz.`, [
      {
        text: 'Tamam',
        onPress: () => {
          // Formu temizle ve onboarding'e yönlendir
          setFirstName('');
          setLastName('');
          setEmail('');
          setPhoneNumber('');
          setPassword('');
          navigation.navigate('PreferredLanguage', { firstName });
        }
      }
    ]);
  };



  const { height: screenHeight } = Dimensions.get('window');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.scrollContent, { minHeight: screenHeight * 0.9 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>INTRAKYA'ya Katılın</Text>
            <Text style={styles.subtitle}>AL & SAT - Yeni hesap oluşturun</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ad</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Adınızı girin"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Soyad</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Soyadınızı girin"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-posta</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="E-posta adresinizi girin"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Telefon Numarası</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Telefon numaranızı girin"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Şifrenizi girin"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Register */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Alert.alert('Demo', 'Google ile kayıt demo modunda çalışmıyor.')}
            >
              <View style={styles.socialButtonContent}>
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text style={styles.socialButtonText}>Google ile Kayıt Ol</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Alert.alert('Demo', 'Facebook ile kayıt demo modunda çalışmıyor.')}
            >
              <View style={styles.socialButtonContent}>
                <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                <Text style={styles.socialButtonText}>Facebook ile Kayıt Ol</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleHeight(40),
    paddingBottom: scaleHeight(20),
  },
  header: {
    marginBottom: scaleHeight(24),
    alignItems: 'center',
  },
  title: {
    fontSize: scaleFont(26),
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: scaleHeight(6),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scaleFont(16),
    color: '#666666',
    textAlign: 'center',
  },
  form: {
    marginBottom: scaleHeight(20),
  },
  inputContainer: {
    marginBottom: scaleHeight(16),
  },
  label: {
    fontSize: scaleFont(14),
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: scaleHeight(8),
  },
  input: {
    height: scaleHeight(48),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scaleWidth(8),
    paddingHorizontal: scaleWidth(14),
    fontSize: scaleFont(15),
    backgroundColor: '#FAFAFA',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scaleWidth(8),
    backgroundColor: '#FAFAFA',
  },
  passwordInput: {
    flex: 1,
    height: scaleHeight(48),
    paddingHorizontal: scaleWidth(14),
    fontSize: scaleFont(15),
  },
  eyeIcon: {
    padding: scaleWidth(15),
  },
  registerButton: {
    height: scaleHeight(48),
    backgroundColor: '#FFD700',
    borderRadius: scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleHeight(8),
    marginVertical: scaleHeight(8),
  },
  registerButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000000',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleHeight(16),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: scaleWidth(16),
    fontSize: scaleFont(14),
    color: '#666666',
  },
  socialContainer: {
    marginBottom: scaleHeight(20),
  },
  socialButton: {
    height: scaleHeight(48),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleHeight(10),
    backgroundColor: '#FFFFFF',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: scaleWidth(12),
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleHeight(20),
  },
  loginText: {
    fontSize: scaleFont(14),
    color: '#666666',
  },
  loginLink: {
    fontSize: scaleFont(14),
    color: '#FFD700',
    fontWeight: '600',
    paddingVertical: scaleHeight(8),
    paddingHorizontal: scaleWidth(8),
  },
});

export default RegisterScreen;