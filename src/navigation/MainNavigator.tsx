import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './types';

import HomeScreen from '../screens/main/HomeScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import AccountScreen from '../screens/main/AccountScreen';
import ProfileEditScreen from '../screens/main/ProfileEditScreen';
import MyOrdersScreen from '../screens/main/MyOrdersScreen';
import OrderTrackScreen from '../screens/main/OrderTrackScreen';
import LeaveReviewScreen from '../screens/main/LeaveReviewScreen';
import MyWalletScreen from '../screens/main/MyWalletScreen';
import PaymentMethodScreen from '../screens/main/PaymentMethodScreen';
import AddNewCardScreen from '../screens/main/AddNewCardScreen';
import MyAddressScreen from '../screens/main/MyAddressScreen';
import AddNewAddressScreen from '../screens/main/AddNewAddressScreen';
import EditAddressScreen from '../screens/main/EditAddressScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import NotificationOptionsScreen from '../screens/main/NotificationOptionsScreen';
import MyPromocodesScreen from '../screens/main/MyPromocodesScreen';
import BecomeSellerScreen from '../screens/main/BecomeSeller';
import SellerProfileScreen from '../screens/main/SellerProfile';
import MySalesScreen from '../screens/main/MySalesScreen';
import SellerListScreen from '../screens/main/SellerListScreen';
import SearchScreen from '../screens/main/SearchScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import CartScreen from '../screens/main/CartScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import OrderDetailScreen from '../screens/main/OrderDetailScreen';
import ChatDetailScreen from '../screens/main/ChatDetailScreen';
import MessagesScreen from '../screens/main/MessagesScreen';

// Satıcı ekranları
import SellerDashboardScreen from '../screens/seller/SellerDashboardScreen';
import AddProductScreen from '../screens/seller/AddProductScreen';
import ProductListScreen from '../screens/seller/ProductListScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';
import SellerWalletScreen from '../screens/seller/SellerWalletScreen';
import SellerEarningsScreen from '../screens/seller/SellerEarningsScreen';
import BankInfoScreen from '../screens/seller/BankInfoScreen';
import BankAccountScreen from '../screens/seller/BankAccountScreen';
import WithdrawalRequestScreen from '../screens/seller/WithdrawalRequestScreen';
import WithdrawalScreen from '../screens/seller/WithdrawalScreen';
import AdvertisementPackagesScreen from '../screens/seller/AdvertisementPackagesScreen';
import MyAdvertisementsScreen from '../screens/seller/MyAdvertisementsScreen';
import ProductSelectionScreen from '../screens/seller/ProductSelectionScreen';
import CargoSelectionScreen from '../screens/seller/CargoSelectionScreen';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="OrderTrack" component={OrderTrackScreen} />
      <Stack.Screen name="LeaveReview" component={LeaveReviewScreen} />
      <Stack.Screen name="MyWallet" component={MyWalletScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="AddNewCard" component={AddNewCardScreen} />
      <Stack.Screen name="MyAddress" component={MyAddressScreen} />
      <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
          name="NotificationOptions"
          component={NotificationOptionsScreen}
          options={{ headerShown: false }}
        />
      <Stack.Screen name="MyPromocodes" component={MyPromocodesScreen} />
      <Stack.Screen name="BecomeSeller" component={BecomeSellerScreen} />
      <Stack.Screen name="SellerProfile" component={SellerProfileScreen} />
      <Stack.Screen name="SellerDashboard" component={SellerDashboardScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen as any} />
      <Stack.Screen name="MySales" component={MySalesScreen} />
      
      {/* Satıcı Panel Ekranları */}
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="SellerOrders" component={SellerOrdersScreen} />
      <Stack.Screen name="SellerWallet" component={SellerWalletScreen} />
      <Stack.Screen name="SellerEarnings" component={SellerEarningsScreen} />
      <Stack.Screen name="BankInfo" component={BankInfoScreen} />
      <Stack.Screen name="BankAccount" component={BankAccountScreen} />
      <Stack.Screen name="WithdrawalRequest" component={WithdrawalRequestScreen} />
      <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
      <Stack.Screen name="AdvertisementPackages" component={AdvertisementPackagesScreen as any} />
      <Stack.Screen name="MyAdvertisements" component={MyAdvertisementsScreen} />
      <Stack.Screen name="ProductSelection" component={ProductSelectionScreen} />
      <Stack.Screen name="CargoSelection" component={CargoSelectionScreen as any} />
        <Stack.Screen name="SellerList" component={SellerListScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Orders" component={MyOrdersScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;