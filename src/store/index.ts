import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import commissionSlice from './slices/commissionSlice';
import paymentSlice from './slices/paymentSlice';
import walletSlice from './slices/walletSlice';
import advertisementSlice from './slices/advertisementSlice';
import offerSlice from './slices/offerSlice';
import commentSlice from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    cart: cartSlice,
    orders: orderSlice,
    commission: commissionSlice,
    payment: paymentSlice,
    wallet: walletSlice,
    advertisement: advertisementSlice,
    offers: offerSlice,
    comments: commentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Date objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks';