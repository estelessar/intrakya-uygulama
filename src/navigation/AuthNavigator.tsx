import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PreferredLanguageScreen from '../screens/auth/PreferredLanguageScreen';
import ChooseInterestsScreen from '../screens/auth/ChooseInterestsScreen';
import AccountCreatedScreen from '../screens/auth/AccountCreatedScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PreferredLanguage" component={PreferredLanguageScreen} />
      <Stack.Screen name="ChooseInterests" component={ChooseInterestsScreen} />
      <Stack.Screen name="AccountCreated" component={AccountCreatedScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;