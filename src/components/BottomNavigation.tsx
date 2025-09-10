import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const currentRoute = activeTab || route.name;

  const navItems = [
    {
      id: 'home',
      icon: 'home-outline',
      activeIcon: 'home',
      label: 'Ana Sayfa',
      route: 'Home',
    },
    {
      id: 'categories',
      icon: 'grid-outline',
      activeIcon: 'grid',
      label: 'Kategoriler',
      route: 'Categories',
    },
    {
      id: 'search',
      icon: 'search-outline',
      activeIcon: 'search',
      label: 'Ara',
      route: 'Search',
    },
    {
      id: 'favorites',
      icon: 'heart-outline',
      activeIcon: 'heart',
      label: 'Favoriler',
      route: 'Favorites',
    },
    {
      id: 'cart',
      icon: 'bag-outline',
      activeIcon: 'bag',
      label: 'Sepet',
      route: 'Cart',
    },
    {
      id: 'account',
      icon: 'person-outline',
      activeIcon: 'person',
      label: 'Hesap',
      route: 'Account',
    },
  ];

  const handleNavigation = (route: string) => {
    navigation.navigate(route as never);
  };

  const isActive = (itemId: string, itemRoute: string) => {
    return currentRoute.toLowerCase() === itemId || 
           currentRoute.toLowerCase() === itemRoute.toLowerCase();
  };

  return (
    <>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => {
          const active = isActive(item.id, item.route);
          
          if (active) {
            return (
              <View key={item.id} style={styles.activeNavItem}>
                <Ionicons 
                  name={item.activeIcon as any} 
                  size={20} 
                  color="#000000" 
                />
                <Text style={styles.activeNavText}>{item.label}</Text>
              </View>
            );
          }
          
          return (
            <TouchableOpacity 
              key={item.id}
              style={styles.navItem} 
              onPress={() => handleNavigation(item.route)}
            >
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color="#666666" 
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.indicator} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  navItem: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'transparent',
  },
  activeNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  activeNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
    fontFamily: 'System',
  },
  homeIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 120,
  },
  indicator: {
    width: 134,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
});

export default BottomNavigation;