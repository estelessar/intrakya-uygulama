import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Commission,
  CommissionReport,
  SellerCommissionSummary,
  Transaction,
  CommissionStatus
} from '../../types';

// Async Thunks
export const calculateCommission = createAsyncThunk(
  'commission/calculate',
  async (params: { orderId: string; sellerId: string; orderAmount: number }) => {
    // API çağrısı simülasyonu
    const commissionRate = 0.10; // %10 komisyon
    const commissionAmount = params.orderAmount * commissionRate;
    
    const commission: Commission = {
      id: `comm_${Date.now()}`,
      orderId: params.orderId,
      sellerId: params.sellerId,
      seller: {} as any, // API'den gelecek
      orderAmount: params.orderAmount,
      commissionRate,
      commissionAmount,
      amount: commissionAmount, // Alias for commissionAmount
      rate: commissionRate, // Alias for commissionRate
      status: 'calculated',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return commission;
  }
);

export const fetchCommissions = createAsyncThunk(
  'commission/fetchAll',
  async (params?: { sellerId?: string; status?: CommissionStatus }) => {
    // API çağrısı simülasyonu
    const mockCommissions: Commission[] = [];
    return mockCommissions;
  }
);

export const fetchCommissionReport = createAsyncThunk(
  'commission/fetchReport',
  async (period: string) => {
    // API çağrısı simülasyonu
    const mockReport: CommissionReport = {
      period,
      totalOrders: 0,
      totalOrderAmount: 0,
      totalCommissionAmount: 0,
      paidCommissionAmount: 0,
      pendingCommissionAmount: 0,
      sellerCommissions: []
    };
    return mockReport;
  }
);

export const payCommission = createAsyncThunk(
  'commission/pay',
  async (commissionId: string) => {
    // API çağrısı simülasyonu
    return { commissionId, paymentDate: new Date() };
  }
);

export const fetchSellerEarnings = createAsyncThunk(
  'commission/fetchSellerEarnings',
  async (params: { sellerId: string; period: 'week' | 'month' | 'year' }) => {
    // API çağrısı simülasyonu
    const mockEarnings = {
      totalEarnings: 0,
      totalCommissionPaid: 0,
      pendingCommissions: [],
      recentTransactions: [],
      summary: {
        totalEarnings: 0,
        totalCommissionPaid: 0,
        pendingCommissions: [],
        commissionRate: 10,
        grossSales: 0,
        totalCommission: 0,
        totalOrders: 0
      },
      commissions: []
    };
    return mockEarnings;
  }
);

interface CommissionState {
  commissions: Commission[];
  currentReport: CommissionReport | null;
  sellerEarnings: {
    totalEarnings: number;
    totalCommissionPaid: number;
    pendingCommissions: Commission[];
    recentTransactions: Transaction[];
    summary: {
      totalEarnings: number;
      totalCommissionPaid: number;
      pendingCommissions: Commission[];
      commissionRate: number;
      grossSales: number;
      totalCommission: number;
      totalOrders: number;
    };
    commissions: Commission[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommissionState = {
  commissions: [],
  currentReport: null,
  sellerEarnings: null,
  loading: false,
  error: null
};

const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateCommissionStatus: (state, action: PayloadAction<{ id: string; status: CommissionStatus }>) => {
      const commission = state.commissions.find(c => c.id === action.payload.id);
      if (commission) {
        commission.status = action.payload.status;
        commission.updatedAt = new Date();
      }
    },
    addCommission: (state, action: PayloadAction<Commission>) => {
      state.commissions.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Calculate Commission
      .addCase(calculateCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.commissions.push(action.payload);
      })
      .addCase(calculateCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Komisyon hesaplama hatası';
      })
      
      // Fetch Commissions
      .addCase(fetchCommissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.loading = false;
        state.commissions = action.payload;
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Komisyon listesi yükleme hatası';
      })
      
      // Fetch Commission Report
      .addCase(fetchCommissionReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommissionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchCommissionReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Komisyon raporu yükleme hatası';
      })
      
      // Pay Commission
      .addCase(payCommission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payCommission.fulfilled, (state, action) => {
        state.loading = false;
        const commission = state.commissions.find(c => c.id === action.payload.commissionId);
        if (commission) {
          commission.status = 'paid';
          commission.paymentDate = action.payload.paymentDate;
          commission.updatedAt = new Date();
        }
      })
      .addCase(payCommission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Komisyon ödeme hatası';
      })
      
      // Fetch Seller Earnings
      .addCase(fetchSellerEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerEarnings = action.payload;
      })
      .addCase(fetchSellerEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Satıcı kazanç bilgileri yükleme hatası';
      });
  }
});

export const { clearError, updateCommissionStatus, addCommission } = commissionSlice.actions;
export default commissionSlice.reducer;
export const commissionReducer = commissionSlice.reducer;

// Selectors
export const selectCommissions = (state: any) => state.commission.commissions;
export const selectCommissionReport = (state: any) => state.commission.currentReport;
export const selectSellerEarnings = (state: any) => state.commission.sellerEarnings;
export const selectCommissionLoading = (state: any) => state.commission.loading;
export const selectCommissionError = (state: any) => state.commission.error;

// Utility functions
export const calculateCommissionAmount = (orderAmount: number, commissionRate: number = 0.10): number => {
  return orderAmount * commissionRate;
};

export const getSellerNetEarning = (orderAmount: number, commissionRate: number = 0.10): number => {
  return orderAmount - calculateCommissionAmount(orderAmount, commissionRate);
};