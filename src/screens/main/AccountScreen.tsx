import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import BottomNavigation from '../../components/BottomNavigation';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const getMenuItems = () => {
    const baseItems = [
      {
        id: 1,
        title: 'Cüzdanım',
        icon: 'wallet-outline',
        route: 'MyWallet',
      },
      {
        id: 2,
        title: 'Siparişlerim',
        icon: 'bag-outline',
        route: 'MyOrders',
      },
      {
        id: 3,
        title: 'Ayarlar',
        icon: 'settings-outline',
        route: 'Settings',
      },
    ];

    if (user?.userType !== 'seller') {
      baseItems.push({
        id: 4,
        title: 'Satıcı Ol',
        icon: 'storefront-outline',
        route: 'BecomeSeller',
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    // Çıkış işlemi
    console.log('Çıkış yapılıyor...');
  };

  const handleMenuPress = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerButton} />
        <Text style={styles.headerTitle}>Hesabım</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setMenuModalVisible(true)}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.fullName || 'Kullanıcı'}</Text>
              <Text style={styles.userRole}>{user?.userType === 'seller' ? 'Satıcı' : 'Müşteri'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={18} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.route)}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={24} color="#000000" />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="log-out-outline" size={24} color="#000000" />
            </View>
            <Text style={styles.menuText}>Çıkış Yap</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={menuModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                setMenuModalVisible(false);
                navigation.navigate('SellerProfile' as never);
              }}
            >
              <Ionicons name="person-outline" size={20} color="#000000" />
              <Text style={styles.modalItemText}>Profil</Text>
            </TouchableOpacity>
            
            <View style={styles.modalDivider} />
            
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                setMenuModalVisible(false);
                navigation.navigate('NotificationOptions' as never);
              }}
            >
              <Ionicons name="notifications-outline" size={20} color="#000000" />
              <Text style={styles.modalItemText}>Bildirimler</Text>
            </TouchableOpacity>
            
            <View style={styles.modalDivider} />
            
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                setMenuModalVisible(false);
                // Yardım sayfasına yönlendir
              }}
            >
              <Ionicons name="help-circle-outline" size={20} color="#000000" />
              <Text style={styles.modalItemText}>Yardım</Text>
            </TouchableOpacity>
            
            <View style={styles.modalDivider} />
            
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                setMenuModalVisible(false);
                navigation.navigate('Home' as never);
              }}
            >
              <Ionicons name="home-outline" size={20} color="#000000" />
              <Text style={styles.modalItemText}>Ana Menü</Text>
            </TouchableOpacity>
            
            <View style={styles.modalDivider} />
            
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                setMenuModalVisible(false);
                navigation.navigate('BecomeSeller' as never);
              }}
            >
              <Ionicons name="storefront-outline" size={20} color="#FFD700" />
              <Text style={[styles.modalItemText, { color: '#FFD700' }]}>Satıcı Ol</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomNavigation activeTab="account" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  divider: {
    height: 1,
    backgroundColor: '#FFD700',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
  },
  userRole: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    fontFamily: 'System',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#FFD700',
    marginLeft: 64,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
    fontFamily: 'System',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
  },
});

export default AccountScreen;