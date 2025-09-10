import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Offer, OfferStatus } from '../../types';

interface OfferState {
  offers: Offer[];
  productOffers: { [productId: string]: Offer[] };
  userOffers: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  offers: [],
  productOffers: {},
  userOffers: [],
  loading: false,
  error: null,
};

// Async thunks
export const createOffer = createAsyncThunk(
  'offers/create',
  async (offerData: {
    productId: string;
    offeredPrice: number;
    quantity: number;
    message?: string;
  }) => {
    // Simulate API call
    const newOffer: Offer = {
      id: Date.now().toString(),
      productId: offerData.productId,
      product: {} as any, // Will be populated by API
      buyerId: 'current-user-id', // Will come from auth state
      buyer: {} as any,
      sellerId: 'seller-id',
      seller: {} as any,
      originalPrice: 0, // Will be set from product
      offeredPrice: offerData.offeredPrice,
      quantity: offerData.quantity,
      message: offerData.message,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return newOffer;
  }
);

export const updateOfferStatus = createAsyncThunk(
  'offers/updateStatus',
  async ({ offerId, status, response }: {
    offerId: string;
    status: OfferStatus;
    response?: string;
  }) => {
    // Simulate API call
    return { offerId, status, response };
  }
);

export const fetchProductOffers = createAsyncThunk(
  'offers/fetchProductOffers',
  async (productId: string) => {
    // Simulate API call
    const offers: Offer[] = [];
    return { productId, offers };
  }
);

export const fetchUserOffers = createAsyncThunk(
  'offers/fetchUserOffers',
  async () => {
    // Simulate API call
    const offers: Offer[] = [];
    return offers;
  }
);

const offerSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    removeOffer: (state, action: PayloadAction<string>) => {
      state.offers = state.offers.filter(offer => offer.id !== action.payload);
      state.userOffers = state.userOffers.filter(offer => offer.id !== action.payload);
      
      // Remove from productOffers
      Object.keys(state.productOffers).forEach(productId => {
        state.productOffers[productId] = state.productOffers[productId].filter(
          offer => offer.id !== action.payload
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Create offer
      .addCase(createOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.push(action.payload);
        state.userOffers.push(action.payload);
        
        const productId = action.payload.productId;
        if (!state.productOffers[productId]) {
          state.productOffers[productId] = [];
        }
        state.productOffers[productId].push(action.payload);
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Teklif oluşturulurken hata oluştu';
      })
      
      // Update offer status
      .addCase(updateOfferStatus.fulfilled, (state, action) => {
        const { offerId, status, response } = action.payload;
        
        // Update in all arrays
        const updateOffer = (offer: Offer) => {
          if (offer.id === offerId) {
            offer.status = status;
            if (response) offer.sellerResponse = response;
            offer.updatedAt = new Date();
          }
        };
        
        state.offers.forEach(updateOffer);
        state.userOffers.forEach(updateOffer);
        Object.values(state.productOffers).flat().forEach(updateOffer);
      })
      
      // Fetch product offers
      .addCase(fetchProductOffers.fulfilled, (state, action) => {
        const { productId, offers } = action.payload;
        state.productOffers[productId] = offers;
      })
      
      // Fetch user offers
      .addCase(fetchUserOffers.fulfilled, (state, action) => {
        state.userOffers = action.payload;
      });
  },
});

export const { clearError, removeOffer } = offerSlice.actions;
export default offerSlice.reducer;