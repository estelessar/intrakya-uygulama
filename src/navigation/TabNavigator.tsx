import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
import { View, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import HomeScreen from '../screens/main/HomeScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import AccountScreen from '../screens/main/AccountScreen';
import SellerDashboardScreen from '../screens/seller/SellerDashboardScreen';

const SearchScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Arama</Text>
  </View>
);

const CartScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Sepet</Text>
  </View>
);



// Tab Icon Component
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const getIconName = (tabName: string) => {
    switch (tabName) {
      case 'home':
        return focused ? 'home' : 'home-outline';
      case 'heart':
        return focused ? 'heart' : 'heart-outline';
      case 'grid':
        return focused ? 'grid' : 'grid-outline';
      case 'bag':
        return focused ? 'bag' : 'bag-outline';
      case 'person':
        return focused ? 'person' : 'person-outline';
      case 'storefront':
        return focused ? 'storefront' : 'storefront-outline';
      default:
        return 'home-outline';
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons 
        name={getIconName(name) as any} 
        size={24} 
        color={focused ? '#007AFF' : '#8E8E93'} 
      />
    </View>
  );
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isSeller = user?.userType === 'seller';

  return (
    <View style={styles.container}>
      {/* Black indicator line at the top */}
      <View style={styles.indicator} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontSize: 0, // Hide labels to match Figma design
            fontWeight: '500',
          },
          tabBarShowLabel: false, // Hide labels completely
        }}>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Categories" 
          component={CategoriesScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="grid" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="heart" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Cart" 
          component={CartScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="bag" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Account" 
          component={AccountScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
          }}
        />
        {isSeller && (
          <Tab.Screen 
            name="Seller" 
            component={SellerDashboardScreen}
            options={{
              tabBarIcon: ({ focused }) => <TabIcon name="storefront" focused={focused} />,
            }}
          />
        )}
    </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  indicator: {
    position: 'absolute',
    bottom: 80, // Position above the tab bar
    left: '50%',
    marginLeft: -67.5, // Half of width to center
    width: 135,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 2.5,
    zIndex: 1000,
  },
});

export default TabNavigator;