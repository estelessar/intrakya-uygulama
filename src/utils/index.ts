import { Dimensions } from 'react-native';

// Screen dimensions
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Format Turkish Lira
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(price);
};

// Format Turkish phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it starts with country code
  if (cleaned.startsWith('90')) {
    const number = cleaned.substring(2);
    return `+90 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 8)} ${number.substring(8, 10)}`;
  }
  
  // Format as Turkish number
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
  }
  
  return phone;
};

// Validate Turkish phone number
export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Turkish mobile numbers start with 5 and are 10 digits total
  if (cleaned.length === 10 && cleaned.startsWith('5')) {
    return true;
  }
  
  // With country code
  if (cleaned.length === 12 && cleaned.startsWith('905')) {
    return true;
  }
  
  return false;
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice: number, discountPrice: number): number => {
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

// Format date to Turkish locale
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Format date and time to Turkish locale
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get responsive size based on screen width
export const getResponsiveSize = (size: number): number => {
  const baseWidth = 375; // iPhone 6/7/8 width
  return (SCREEN_WIDTH / baseWidth) * size;
};

// Check if device is tablet
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

// Turkish text helpers
export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1).toLocaleLowerCase('tr-TR');
};

export const toUpperCaseTurkish = (text: string): string => {
  return text.toLocaleUpperCase('tr-TR');
};

export const toLowerCaseTurkish = (text: string): string => {
  return text.toLocaleLowerCase('tr-TR');
};