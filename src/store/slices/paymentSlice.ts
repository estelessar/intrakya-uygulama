import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentMethod, PaymentStatus } from '../../types';

interface PaymentData {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  sellerId: string;
  commissionRate: number;
}

interface PaymentResult {
  paymentId: string;
  orderId: string;
  totalAmount: number;
  sellerAmount: number;
  commissionAmount: number;
  status: PaymentStatus;
  transactionId: string;
  createdAt: Date;
}

interface PaymentState {
  payments: PaymentResult[];
  isProcessing: boolean;
  error: string | null;
  currentPayment: PaymentResult | null;
}

const initialState: PaymentState = {
  payments: [],
  isProcessing: false,
  error: null,
  currentPayment: null,
};

// Async Thunk for processing payment with commission deduction
export const processPaymentWithCommission = createAsyncThunk(
  'payment/processWithCommission',
  async (paymentData: PaymentData, { rejectWithValue }) => {
    try {
      const { orderId, amount, method, sellerId, commissionRate } = paymentData;
      
      // Komisyon hesaplama
      const commissionAmount = amount * (commissionRate / 100);
      const sellerAmount = amount - commissionAmount;
      
      // Ödeme işlemi simülasyonu
      const paymentResult: PaymentResult = {
        paymentId: `pay_${Date.now()}`,
        orderId,
        totalAmount: amount,
        sellerAmount,
        commissionAmount,
        status: 'completed' as PaymentStatus,
        transactionId: `txn_${Date.now()}`,
        createdAt: new Date(),
      };
      
      // Gerçek uygulamada burada ödeme gateway'i ile iletişim kurulur
      // Şimdilik başarılı ödeme simülasyonu yapıyoruz
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return paymentResult;
    } catch (error) {
      return rejectWithValue('Ödeme işlemi başarısız oldu');
    }
  }
);

// Async Thunk for refunding payment
export const refundPayment = createAsyncThunk(
  'payment/refund',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      // İade işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        paymentId,
        status: 'refunded' as PaymentStatus,
        refundedAt: new Date(),
      };
    } catch (error) {
      return rejectWithValue('İade işlemi başarısız oldu');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    setCurrentPayment: (state, action: PayloadAction<PaymentResult | null>) => {
      state.currentPayment = action.payload;
    },
    resetPaymentState: (state) => {
      state.isProcessing = false;
      state.error = null;
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process Payment with Commission
      .addCase(processPaymentWithCommission.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(processPaymentWithCommission.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.payments.unshift(action.payload);
        state.currentPayment = action.payload;
      })
      .addCase(processPaymentWithCommission.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      })
      // Refund Payment
      .addCase(refundPayment.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.isProcessing = false;
        const payment = state.payments.find(p => p.paymentId === action.payload.paymentId);
        if (payment) {
          payment.status = action.payload.status;
        }
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearPaymentError,
  setCurrentPayment,
  resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;