import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import * as SecureStore from 'expo-secure-store';
import { loginSuccess } from '../store/slices/authSlice';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Uygulama açılışında kaydedilmiş kullanıcı bilgilerini kontrol et
  useEffect(() => {
    checkSavedCredentials();
  }, []);

  const checkSavedCredentials = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync('userToken');
      const savedEmail = await SecureStore.getItemAsync('userEmail');
      
      if (savedToken && savedEmail) {
        // Kaydedilmiş bilgiler varsa otomatik giriş yap
        const userData = {
          id: '1',
          name: 'Ahmet Şahin',
          fullName: 'Ahmet Şahin',
          email: savedEmail,
          phoneNumber: '+90 555 123 4567',
          userType: 'seller' as const, // Satıcı olarak ayarlandı
          isVerified: true,
          addresses: [],
          isGuest: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        dispatch(loginSuccess({ 
          user: userData, 
          token: savedToken 
        }));
      }
    } catch (error) {
      console.log('Kaydedilmiş bilgiler kontrol edilirken hata:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;