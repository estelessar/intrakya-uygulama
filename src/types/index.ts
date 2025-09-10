// User Types
export interface User {
  id: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  name: string; // Alias for fullName
  profileImage?: string;
  userType: 'buyer' | 'seller' | 'admin';
  isVerified: boolean;
  addresses: Address[];
  isGuest?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  title: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  neighborhood: string;
  addressLine: string;
  postalCode: string;
  isDefault: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  category: Category;
  sellerId: string;
  seller: Seller;
  images: string[];
  variants?: ProductVariant[];
  specifications: Record<string, string>;
  stock: number;
  rating: number;
  reviewCount: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  parentId?: string;
  children?: Category[];
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
}

export interface Seller {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  commissionRate: number; // Komisyon oranı (varsayılan %10)
  totalEarnings: number; // Toplam kazanç
  totalCommissionPaid: number; // Ödenen toplam komisyon
  bankAccount?: BankAccount; // Ödeme bilgileri
  taxNumber?: string; // Vergi numarası
  companyName?: string; // Şirket adı
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  sellerId?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  trackingNumber?: string;
  cargoCompany?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

// Payment Types
export interface PaymentMethod {
  type: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  cardToken?: string;
  installments?: number;
  bankAccount?: BankAccount;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  iban: string;
  accountHolderName?: string;
  branchCode?: string;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user: User;
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  images?: string[];
  sellerResponse?: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
}

// Offer Types
export interface Offer {
  id: string;
  productId: string;
  product: Product;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: Seller;
  originalPrice: number;
  offeredPrice: number;
  quantity: number;
  message?: string;
  status: OfferStatus;
  sellerResponse?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type OfferStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'expired' 
  | 'cancelled';

// Comment Types
export interface Comment {
  id: string;
  productId: string;
  userId: string;
  user: User;
  content: string;
  rating?: number;
  images?: string[];
  replies: CommentReply[];
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  user: User;
  content: string;
  isSeller: boolean;
  createdAt: Date;
}

// Commission Types
export interface Commission {
  id: string;
  orderId: string;
  sellerId: string;
  seller: Seller;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  amount: number; // Alias for commissionAmount
  rate: number; // Alias for commissionRate
  status: CommissionStatus;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CommissionStatus = 
  | 'pending' 
  | 'calculated' 
  | 'paid' 
  | 'cancelled';

export interface CommissionReport {
  period: string; // YYYY-MM formatında
  totalOrders: number;
  totalOrderAmount: number;
  totalCommissionAmount: number;
  paidCommissionAmount: number;
  pendingCommissionAmount: number;
  sellerCommissions: SellerCommissionSummary[];
}

export interface SellerCommissionSummary {
  id: string;
  sellerId: string;
  sellerName: string;
  orderCount: number;
  totalOrderAmount: number;
  commissionAmount: number;
  commissionRate: number;
  status: CommissionStatus;
}

export interface Transaction {
  id: string;
  type: 'commission_payment' | 'seller_earning' | 'refund' | 'withdrawal' | 'advertisement';
  amount: number;
  sellerId?: string;
  orderId?: string;
  commissionId?: string;
  withdrawalId?: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Wallet & Balance Types
export interface SellerWallet {
  id: string;
  sellerId: string;
  balance: number; // Ana bakiye
  availableBalance: number; // Çekilebilir bakiye
  pendingBalance: number; // Bekleyen bakiye (henüz onaylanmamış)
  totalEarnings: number; // Toplam kazanç
  totalWithdrawn: number; // Toplam çekilen miktar
  lastUpdated: Date;
}

export interface WithdrawalRequest {
  id: string;
  sellerId: string;
  seller: Seller;
  amount: number;
  bankAccount: BankAccount;
  status: WithdrawalStatus;
  requestDate: Date;
  processedDate?: Date;
  adminNote?: string;
  transactionId?: string;
}

export type WithdrawalStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'completed';

export interface CargoCompany {
  id: string;
  name: string;
  logo: string;
  trackingUrl?: string;
  isActive: boolean;
  deliveryTime: string;
  price: number;
}

export interface Advertisement {
  id: string;
  sellerId: string;
  seller: Seller;
  productId: string;
  product: Product;
  type: 'featured' | 'top_list' | 'category_highlight';
  cost: number;
  duration: number; // gün cinsinden
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled' | 'paused';
  impressions: number;
  clicks: number;
  budget: number;
  spent: number;
  title: string;
  description: string;
  packageId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  AuthStack: undefined;
  MainStack: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  PreferredLanguage: { firstName: string };
  ChooseInterests: { firstName: string; selectedLanguage: string };
};

export type MainStackParamList = {
  TabNavigator: undefined;
  // TODO: Add main screens when they are created
};

export type TabParamList = {
  // TODO: Add tab screens when they are created
};