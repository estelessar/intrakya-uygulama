import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SellerWallet, WithdrawalRequest, Transaction, BankAccount } from '../../types';

// Async Thunks
export const fetchSellerWallet = createAsyncThunk(
  'wallet/fetchSellerWallet',
  async (sellerId: string) => {
    // API çağrısı simülasyonu
    const response = await fetch(`/api/sellers/${sellerId}/wallet`);
    return response.json();
  }
);

export const updateBalance = createAsyncThunk(
  'wallet/updateBalance',
  async ({ sellerId, amount, type }: { sellerId: string; amount: number; type: 'add' | 'subtract' }) => {
    const response = await fetch(`/api/sellers/${sellerId}/wallet/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, type })
    });
    return response.json();
  }
);

export const createWithdrawalRequest = createAsyncThunk(
  'wallet/createWithdrawalRequest',
  async ({ sellerId, amount, bankAccount }: { sellerId: string; amount: number; bankAccount: BankAccount }) => {
    const response = await fetch('/api/withdrawal-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId, amount, bankAccount })
    });
    return response.json();
  }
);

export const fetchWithdrawalRequests = createAsyncThunk(
  'wallet/fetchWithdrawalRequests',
  async (sellerId: string) => {
    const response = await fetch(`/api/sellers/${sellerId}/withdrawal-requests`);
    return response.json();
  }
);

export const fetchTransactionHistory = createAsyncThunk(
  'wallet/fetchTransactionHistory',
  async ({ sellerId, page = 1, limit = 20 }: { sellerId: string; page?: number; limit?: number }) => {
    const response = await fetch(`/api/sellers/${sellerId}/transactions?page=${page}&limit=${limit}`);
    return response.json();
  }
);

export const processEarning = createAsyncThunk(
  'wallet/processEarning',
  async ({ sellerId, orderId, amount }: { sellerId: string; orderId: string; amount: number }) => {
    const response = await fetch('/api/wallet/process-earning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId, orderId, amount })
    });
    return response.json();
  }
);

export const spendOnAdvertisement = createAsyncThunk(
  'wallet/spendOnAdvertisement',
  async ({ sellerId, amount, adType, productId }: { sellerId: string; amount: number; adType: string; productId: string }) => {
    const response = await fetch('/api/wallet/spend-advertisement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId, amount, adType, productId })
    });
    return response.json();
  }
);

export const updateBankInfo = createAsyncThunk(
  'wallet/updateBankInfo',
  async (bankInfo: BankAccount) => {
    const response = await fetch('/api/bank-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bankInfo)
    });
    return response.json();
  }
);

export const fetchBankInfo = createAsyncThunk(
  'wallet/fetchBankInfo',
  async (sellerId: string) => {
    const response = await fetch(`/api/sellers/${sellerId}/bank-info`);
    return response.json();
  }
);

// State Interface
interface WalletState {
  wallet: SellerWallet | null;
  withdrawalRequests: WithdrawalRequest[];
  transactions: Transaction[];
  bankInfo: BankAccount | null;
  loading: boolean;
  error: string | null;
  withdrawalLoading: boolean;
  transactionLoading: boolean;
}

// Initial State
const initialState: WalletState = {
  wallet: null,
  withdrawalRequests: [],
  transactions: [],
  bankInfo: null,
  loading: false,
  error: null,
  withdrawalLoading: false,
  transactionLoading: false,
};

// Slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetWallet: (state) => {
      state.wallet = null;
      state.withdrawalRequests = [];
      state.transactions = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Seller Wallet
    builder
      .addCase(fetchSellerWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerWallet.fulfilled, (state, action: PayloadAction<SellerWallet>) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchSellerWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Bakiye bilgileri alınamadı';
      })

    // Update Balance
    builder
      .addCase(updateBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBalance.fulfilled, (state, action: PayloadAction<SellerWallet>) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(updateBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Bakiye güncellenemedi';
      })

    // Create Withdrawal Request
    builder
      .addCase(createWithdrawalRequest.pending, (state) => {
        state.withdrawalLoading = true;
        state.error = null;
      })
      .addCase(createWithdrawalRequest.fulfilled, (state, action: PayloadAction<WithdrawalRequest>) => {
        state.withdrawalLoading = false;
        state.withdrawalRequests.unshift(action.payload);
      })
      .addCase(createWithdrawalRequest.rejected, (state, action) => {
        state.withdrawalLoading = false;
        state.error = action.error.message || 'Para çekme talebi oluşturulamadı';
      })

    // Fetch Withdrawal Requests
    builder
      .addCase(fetchWithdrawalRequests.pending, (state) => {
        state.withdrawalLoading = true;
      })
      .addCase(fetchWithdrawalRequests.fulfilled, (state, action: PayloadAction<WithdrawalRequest[]>) => {
        state.withdrawalLoading = false;
        state.withdrawalRequests = action.payload;
      })
      .addCase(fetchWithdrawalRequests.rejected, (state, action) => {
        state.withdrawalLoading = false;
        state.error = action.error.message || 'Para çekme talepleri alınamadı';
      })

    // Fetch Transaction History
    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.transactionLoading = true;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.transactionLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.transactionLoading = false;
        state.error = action.error.message || 'İşlem geçmişi alınamadı';
      })

    // Process Earning
    builder
      .addCase(processEarning.fulfilled, (state, action: PayloadAction<{ wallet: SellerWallet; transaction: Transaction }>) => {
        state.wallet = action.payload.wallet;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(processEarning.rejected, (state, action) => {
        state.error = action.error.message || 'Kazanç işlenemedi';
      })

    // Spend on Advertisement
    builder
      .addCase(spendOnAdvertisement.fulfilled, (state, action: PayloadAction<{ wallet: SellerWallet; transaction: Transaction }>) => {
        state.wallet = action.payload.wallet;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(spendOnAdvertisement.rejected, (state, action) => {
        state.error = action.error.message || 'Reklam ödemesi yapılamadı';
      })

    // Update Bank Info
    builder
      .addCase(updateBankInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBankInfo.fulfilled, (state, action: PayloadAction<BankAccount>) => {
        state.loading = false;
        state.bankInfo = action.payload;
      })
      .addCase(updateBankInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Banka bilgileri güncellenemedi';
      })

    // Fetch Bank Info
    builder
      .addCase(fetchBankInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankInfo.fulfilled, (state, action: PayloadAction<BankAccount>) => {
        state.loading = false;
        state.bankInfo = action.payload;
      })
      .addCase(fetchBankInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Banka bilgileri alınamadı';
      });
  },
});

export const { clearError, resetWallet } = walletSlice.actions;
export default walletSlice.reducer;
export const walletReducer = walletSlice.reducer;