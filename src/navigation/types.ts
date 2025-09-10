export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  PreferredLanguage: {
    firstName: string;
  };
  ChooseInterests: {
    firstName: string;
    selectedLanguage: string;
  };
  AccountCreated: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Categories: undefined;
  Account: undefined;
  Search: undefined;
  Cart: undefined;
  Favorites: undefined;
  Messages: undefined;
  Orders: undefined;
  ProductDetail: {
    productId: string;
    productName?: string;
    productPrice?: number;
    productImage?: string;
    sellerId?: string;
  };
  ProfileEdit: undefined;
  MyOrders: undefined;
  OrderTrack: { 
    orderId: string;
    trackingNumber: string;
  };
  LeaveReview: {
    productId: string;
    productName: string;
    sellerId: string;
  };
  MyWallet: undefined;
  PaymentMethod: undefined;
  AddNewCard: undefined;
  MyAddress: undefined;
  AddNewAddress: undefined;
  EditAddress: {
    addressId: string;
    title: string;
    address: string;
    isDefault?: boolean;
  };
  MyPromocodes: undefined;
  BecomeSeller: undefined;
  SellerProfile: {
    sellerId: string;
    sellerName: string;
  };
  SellerDashboard: undefined;
  AddProduct: undefined;
  MySales: undefined;
  SellerList: undefined;
  Settings: undefined;
  NotificationOptions: undefined;
  // Added Checkout screen route
  Checkout: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      image: string;
      quantity: number;
      seller: string;
    }>;
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  OrderDetail: {
    orderId: string;
  };
  ChatDetail: {
    sellerId: string;
    sellerName: string;
    sellerAvatar: string;
    productId?: string;
    productName?: string;
    productImage?: string;
  };
  // Satıcı Panel Ekranları
  ProductList: undefined;
  SellerOrders: undefined;
  SellerWallet: undefined;
  SellerEarnings: undefined;
  BankInfo: undefined;
  BankAccount: undefined;
  WithdrawalRequest: undefined;
  Withdrawal: undefined;
  AdvertisementPackages: {
    productId: string;
    productName: string;
  };
  MyAdvertisements: undefined;
  ProductSelection: undefined;
  CargoSelection: {
    orderId: string;
  };
};

export type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Search: undefined;
  Cart: undefined;
  Account: undefined;
  Seller: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Seller Stack ParamList for seller screens
export type SellerStackParamList = {
  SellerDashboard: undefined;
  AddProduct: {
    productId?: string;
  };
  ProductList: undefined;
  SellerOrders: undefined;
  SellerWallet: undefined;
  SellerEarnings: undefined;
  BankInfo: undefined;
  BankAccount: undefined;
  WithdrawalRequest: undefined;
  Withdrawal: undefined;
  AdvertisementPackages: {
    productId: string;
    productName: string;
  };
  MyAdvertisements: undefined;
  ProductSelection: undefined;
  CargoSelection: {
    orderId: string;
  };
};

// Navigation prop types
import { StackNavigationProp } from '@react-navigation/stack';

export type MainStackNavigationProp = StackNavigationProp<MainStackParamList>;
export type SellerStackNavigationProp = StackNavigationProp<SellerStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;