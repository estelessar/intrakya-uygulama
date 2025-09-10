// Colors - Türkiye pazarına uygun renk paleti
export const COLORS = {
  primary: '#E53E3E', // Kırmızı - Türk bayrağından ilham
  primaryLight: '#FC8181',
  primaryDark: '#C53030',
  
  secondary: '#3182CE', // Mavi
  secondaryLight: '#63B3ED',
  secondaryDark: '#2C5282',
  
  success: '#38A169',
  warning: '#D69E2E',
  error: '#E53E3E',
  
  background: '#FFFFFF',
  surface: '#F7FAFC',
  card: '#FFFFFF',
  
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    disabled: '#A0ADB8',
    inverse: '#FFFFFF',
  },
  
  border: '#E2E8F0',
  divider: '#EDF2F7',
  
  // Gradient colors
  gradient: {
    primary: ['#E53E3E', '#C53030'],
    secondary: ['#3182CE', '#2C5282'],
  },
};

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Screen Dimensions
export const SCREEN = {
  width: 375, // Default iPhone width for design
  height: 812, // Default iPhone height for design
};

// Turkish specific constants
export const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
  'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
  'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır',
  'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun',
  'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir',
  'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya',
  'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop',
  'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
  'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale',
  'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis',
  'Osmaniye', 'Düzce'
];

// Payment methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const;

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Cargo companies
export const CARGO_COMPANIES = {
  ARAS: 'aras',
  MNG: 'mng',
  PTT: 'ptt',
  YURTICI: 'yurtici',
} as const;