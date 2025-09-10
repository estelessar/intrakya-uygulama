/**
 * INTRAKYA Marketplace Mobile Application
 * Developed by: ADN Bilişim Teknolojileri
 * Copyright © 2025 ADN Bilişim Teknolojileri. All rights reserved.
 * This application is proprietary software and unauthorized copying is strictly prohibited.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppNavigator />
        <StatusBar style="auto" />
      </Provider>
    </GestureHandlerRootView>
  );
}


