/**
 * Login Screen - INTRAKYA Marketplace
 * Developed by: ADN Bilişim Teknolojileri
 * Secure authentication system with credential storage
 */
import React, { useState, useEffect } from 'react';
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
import * as SecureStore from 'expo-secure-store';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess } from '../../store/slices/authSlice';
import { scaleWidth, scaleHeight, scaleFont } from '../../utils/responsive';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Kaydedilmiş kullanıcı bilgilerini yükle
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await SecureStore.getItemAsync('userEmail');
      const savedPassword = await SecureStore.getItemAsync('userPassword');
      
      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
    } catch (error) {
      console.log('Kaydedilmiş bilgiler yüklenirken hata:', error);
    }
  };

  const saveCredentials = async (email: string, password: string) => {
    try {
      await SecureStore.setItemAsync('userEmail', email);
      await SecureStore.setItemAsync('userPassword', password);
      await SecureStore.setItemAsync('userToken', 'demo-token-' + Date.now());
    } catch (error) {
      console.log('Bilgiler kaydedilirken hata:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    
    // Demo kullanıcı kontrolü
    if (email === 'test@test.com' && password === '123456') {
      try {
        // Kullanıcı bilgilerini kaydet
        await saveCredentials(email, password);
        
        // Redux state'i güncelle
        const user = {
          id: 'demo-user-id',
          name: 'Demo Kullanıcı',
          fullName: 'Demo Kullanıcı',
          email: email,
          phoneNumber: '+90 555 123 45 67',
          userType: 'buyer' as const,
          isVerified: true,
          addresses: [],
          isGuest: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        dispatch(loginSuccess({ 
          user, 
          token: 'demo-token-' + Date.now() 
        }));
        
        Alert.alert('Başarılı', 'Giriş yapıldı! Ana sayfaya yönlendiriliyorsunuz.');
      } catch (error) {
        Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu.');
      }
    } else {
      Alert.alert('Hata', 'Geçersiz e-posta veya şifre. Demo için test@test.com / 123456 kullanın.');
    }
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
          <Text style={styles.title}>INTRAKYA'ya Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>AL & SAT - Hesabınıza giriş yapın</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Alert.alert('Demo', 'Google ile giriş demo modunda çalışmıyor.')}
          >
            <View style={styles.socialButtonContent}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google ile Giriş</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Alert.alert('Demo', 'Facebook ile giriş demo modunda çalışmıyor.')}
          >
            <View style={styles.socialButtonContent}>
              <Ionicons name="logo-facebook" size={20} color="#4267B2" />
              <Text style={styles.socialButtonText}>Facebook ile Giriş</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Hesabınız yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Kayıt Ol</Text>
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
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: scaleWidth(24),
    paddingVertical: scaleHeight(40),
    justifyContent: 'center',
  },
  header: {
    marginBottom: scaleHeight(40),
    alignItems: 'center',
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: scaleHeight(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scaleFont(16),
    color: '#666666',
    textAlign: 'center',
  },
  form: {
    marginBottom: scaleHeight(32),
  },
  inputContainer: {
    marginBottom: scaleHeight(20),
  },
  label: {
    fontSize: scaleFont(14),
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: scaleHeight(8),
  },
  input: {
    height: scaleHeight(50),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scaleWidth(8),
    paddingHorizontal: scaleWidth(16),
    fontSize: scaleFont(16),
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
    height: scaleHeight(50),
    paddingHorizontal: scaleWidth(16),
    fontSize: scaleFont(16),
  },
  eyeIcon: {
    padding: scaleWidth(15),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: scaleHeight(24),
    paddingVertical: scaleHeight(8),
  },
  forgotPasswordText: {
    fontSize: scaleFont(14),
    color: '#FFD700',
    fontWeight: '500',
  },
  loginButton: {
    height: scaleHeight(50),
    backgroundColor: '#FFD700',
    borderRadius: scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scaleHeight(8),
  },
  loginButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000000',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleHeight(24),
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
    marginBottom: scaleHeight(32),
  },
  socialButton: {
    height: scaleHeight(50),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleHeight(12),
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleHeight(20),
  },
  registerText: {
    fontSize: scaleFont(14),
    color: '#666666',
  },
  registerLink: {
    fontSize: scaleFont(14),
    color: '#FFD700',
    fontWeight: '600',
    paddingVertical: scaleHeight(8),
    paddingHorizontal: scaleWidth(8),
  },
});

export default LoginScreen;