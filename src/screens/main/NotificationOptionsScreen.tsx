import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNavigation from '../../components/BottomNavigation';

type NavigationProp = StackNavigationProp<any>;

interface NotificationSetting {
  id: string;
  title: string;
  value: boolean;
}

const NotificationOptionsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { id: '1', title: 'Genel Bildirimler', value: true },
    { id: '2', title: 'Ses', value: true },
    { id: '3', title: 'Titreşim', value: false },
    { id: '4', title: 'Özel Teklifler', value: true },
    { id: '5', title: 'Promosyon ve İndirimler', value: false },
    { id: '6', title: 'Ödemeler', value: true },
    { id: '7', title: 'Uygulama Güncellemeleri', value: true },
    { id: '8', title: 'Yeni Ürün Bildirimleri', value: false },
    { id: '9', title: 'Yeni İpuçları', value: false },
  ]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const toggleSetting = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, value: !setting.value }
          : setting
      )
    );
  };

  const renderNotificationItem = (item: NotificationSetting, index: number) => {
    const isFirst = index === 0;
    const isLast = index === notificationSettings.length - 1;
    
    return (
      <View key={item.id}>
        {!isFirst && <View style={styles.separator} />}
        <View style={styles.notificationItem}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Switch
            value={item.value}
            onValueChange={() => toggleSetting(item.id)}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E7EB"
            style={styles.switch}
          />
        </View>
        {isLast && <View style={styles.separator} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Options</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Separator */}
      <View style={styles.headerSeparator} />
      
      {/* Notification Settings */}
      <View style={styles.content}>
        <View style={styles.notificationContainer}>
          {notificationSettings.map((item, index) => renderNotificationItem(item, index))}
        </View>
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
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  headerSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
  content: {
    flex: 1,
  },
  notificationContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  switch: {
    width: 40,
    height: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 16,
    marginRight: 16,
  },
  homeIndicator: {
    alignItems: 'center',
    paddingVertical: 19,
    paddingBottom: 10,
    marginTop: 177,
  },
  indicator: {
    width: 135,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 5,
  },
});

export default NotificationOptionsScreen;