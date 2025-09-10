import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNavigation from '../../components/BottomNavigation';

type NavigationProp = StackNavigationProp<any>;

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  type: 'navigation' | 'switch';
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [darkMode, setDarkMode] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNotificationOptions = () => {
    navigation.navigate('NotificationOptions');
  };

  const handleLanguage = () => {
    Alert.alert('Dil', 'Bu özellik yakında gelecek!');
  };

  const handleCurrency = () => {
    navigation.navigate('PaymentMethod');
  };

  const handleAboutUs = () => {
    Alert.alert('Hakkımızda', 'INTRAKYA - AL & SAT - En iyi alışveriş deneyimi!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Gizlilik Politikası', 'Bu özellik yakında gelecek!');
  };

  const handleFAQs = () => {
    Alert.alert('Sık Sorulan Sorular', 'Bu özellik yakında gelecek!');
  };

  const handleSendFeedback = () => {
    Alert.alert('Geri Bildirim Gönder', 'Bu özellik yakında gelecek!');
  };

  const handleContactUs = () => {
    Alert.alert('Bize Ulaşın', 'E-posta: info@intrakya.com\nTelefon: +90 555 123 4567');
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    Alert.alert('Karanlık Mod', value ? 'Karanlık mod açıldı!' : 'Karanlık mod kapatıldı!');
  };

  const handleInviteFriends = () => {
    Alert.alert('Arkadaş Davet Et', 'Bu özellik yakında gelecek!');
  };

  const settingsItems: SettingItem[] = [
    {
      id: '1',
      title: 'Bildirim Seçenekleri',
      icon: 'notifications-outline',
      type: 'navigation',
      onPress: handleNotificationOptions,
    },
    {
      id: '2',
      title: 'Dil',
      icon: 'language-outline',
      type: 'navigation',
      onPress: handleLanguage,
    },
    {
      id: '3',
      title: 'Para Birimi',
      icon: 'card-outline',
      type: 'navigation',
      onPress: handleCurrency,
    },
    {
      id: '4',
      title: 'Hakkımızda',
      icon: 'information-circle-outline',
      type: 'navigation',
      onPress: handleAboutUs,
    },
    {
      id: '5',
      title: 'Gizlilik Politikası',
      icon: 'shield-checkmark-outline',
      type: 'navigation',
      onPress: handlePrivacyPolicy,
    },
    {
      id: '6',
      title: 'Sık Sorulan Sorular',
      icon: 'help-circle-outline',
      type: 'navigation',
      onPress: handleFAQs,
    },
    {
      id: '7',
      title: 'Geri Bildirim Gönder',
      icon: 'chatbubble-outline',
      type: 'navigation',
      onPress: handleSendFeedback,
    },
    {
      id: '8',
      title: 'Bize Ulaşın',
      icon: 'call-outline',
      type: 'navigation',
      onPress: handleContactUs,
    },
    {
      id: '9',
      title: 'Karanlık Mod',
      icon: 'moon-outline',
      type: 'switch',
      switchValue: darkMode,
      onSwitchChange: handleDarkModeToggle,
    },
    {
      id: '10',
      title: 'Arkadaş Davet Et',
      icon: 'person-add-outline',
      type: 'navigation',
      onPress: handleInviteFriends,
    },
  ];

  const renderSettingItem = (item: SettingItem, index: number) => {
    return (
      <View key={item.id}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={item.type === 'navigation' ? item.onPress : undefined}
          disabled={item.type === 'switch'}
        >
          <View style={styles.settingLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon as any} size={24} color="#666666" />
            </View>
            <Text style={styles.settingTitle}>{item.title}</Text>
          </View>
          <View style={styles.settingRight}>
            {item.type === 'navigation' ? (
              <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
            ) : (
              <Switch
                value={item.switchValue}
                onValueChange={item.onSwitchChange}
                trackColor={{ false: '#E2E8F0', true: '#FFD700' }}
                thumbColor={item.switchValue ? '#000000' : '#FFFFFF'}
                ios_backgroundColor="#E2E8F0"
              />
            )}
          </View>
        </TouchableOpacity>
        {index < settingsItems.length - 1 && <View style={styles.separator} />}
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
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Separator */}
      <View style={styles.headerSeparator} />
      
      {/* Settings List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsContainer}>
          {settingsItems.map((item, index) => renderSettingItem(item, index))}
        </View>
      </ScrollView>
      
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    fontFamily: 'System',
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  headerSeparator: {
    height: 1,
    backgroundColor: '#000000',
    width: '100%',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  settingsContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  settingRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 64,
    marginVertical: 4,
  },
  homeIndicator: {
    alignItems: 'center',
    paddingVertical: 19,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  indicator: {
    width: 135,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
});

export default SettingsScreen;