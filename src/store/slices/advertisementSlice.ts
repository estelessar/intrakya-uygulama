import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Advertisement } from '../../types';

interface AdvertisementState {
  advertisements: Advertisement[];
  myAdvertisements: Advertisement[];
  isLoading: boolean;
  error: string | null;
  adPackages: AdPackage[];
  packagesLoading: boolean;
}

interface AdPackage {
  id: string;
  name: string;
  description: string;
  duration: number; // gün
  price: number;
  features: string[];
  type: 'featured' | 'category_top' | 'homepage_banner' | 'search_boost';
}

const initialState: AdvertisementState = {
  advertisements: [],
  myAdvertisements: [],
  isLoading: false,
  error: null,
  adPackages: [],
  packagesLoading: false,
};

// Reklam paketlerini getir
export const fetchAdPackages = createAsyncThunk(
  'advertisement/fetchAdPackages',
  async () => {
    // Gerçek uygulamada API'den gelecek
    const packages: AdPackage[] = [
      {
        id: 'featured-7',
        name: 'Öne Çıkan Ürün - 7 Gün',
        description: 'Ürününüz kategori sayfasında en üstte görünür',
        duration: 7,
        price: 25,
        features: ['Kategori sayfasında üst sırada', 'Özel rozet', '7 gün süre'],
        type: 'featured',
      },
      {
        id: 'featured-15',
        name: 'Öne Çıkan Ürün - 15 Gün',
        description: 'Ürününüz kategori sayfasında en üstte görünür',
        duration: 15,
        price: 45,
        features: ['Kategori sayfasında üst sırada', 'Özel rozet', '15 gün süre'],
        type: 'featured',
      },
      {
        id: 'featured-30',
        name: 'Öne Çıkan Ürün - 30 Gün',
        description: 'Ürününüz kategori sayfasında en üstte görünür',
        duration: 30,
        price: 80,
        features: ['Kategori sayfasında üst sırada', 'Özel rozet', '30 gün süre'],
        type: 'featured',
      },
      {
        id: 'category-top-7',
        name: 'Kategori Başı - 7 Gün',
        description: 'Ürününüz kategori listesinin en başında görünür',
        duration: 7,
        price: 35,
        features: ['Kategori başında görünüm', 'Yüksek görünürlük', '7 gün süre'],
        type: 'category_top',
      },
      {
        id: 'category-top-15',
        name: 'Kategori Başı - 15 Gün',
        description: 'Ürününüz kategori listesinin en başında görünür',
        duration: 15,
        price: 60,
        features: ['Kategori başında görünüm', 'Yüksek görünürlük', '15 gün süre'],
        type: 'category_top',
      },
      {
        id: 'search-boost-7',
        name: 'Arama Artırma - 7 Gün',
        description: 'Ürününüz arama sonuçlarında üst sıralarda çıkar',
        duration: 7,
        price: 20,
        features: ['Arama sonuçlarında öncelik', 'Daha fazla görünüm', '7 gün süre'],
        type: 'search_boost',
      },
      {
        id: 'homepage-banner-3',
        name: 'Ana Sayfa Banner - 3 Gün',
        description: 'Ürününüz ana sayfada banner olarak görünür',
        duration: 3,
        price: 100,
        features: ['Ana sayfa banner', 'Maksimum görünürlük', '3 gün süre'],
        type: 'homepage_banner',
      },
    ];
    
    return packages;
  }
);

// Satıcının reklamlarını getir
export const fetchMyAdvertisements = createAsyncThunk(
  'advertisement/fetchMyAdvertisements',
  async (sellerId: string) => {
    // Gerçek uygulamada API'den gelecek
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const ads: Advertisement[] = [
      {
        id: 'ad-1',
        sellerId,
        seller: {} as any,
        productId: 'product-1',
        product: {} as any,
        type: 'featured',
        cost: 25,
        duration: 7,
        packageId: 'featured-7',
        title: 'Öne Çıkan Ürün Reklamı',
        description: 'iPhone 14 Pro Max için öne çıkan ürün reklamı',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        budget: 25,
        spent: 15,
        clicks: 45,
        impressions: 1250,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    return ads;
  }
);

// Reklam oluştur
export const createAdvertisement = createAsyncThunk(
  'advertisement/createAdvertisement',
  async (adData: {
    sellerId: string;
    productId: string;
    packageId: string;
    duration: number;
    type?: 'featured' | 'top_list' | 'category_highlight';
    cost?: number;
  }) => {
    // Gerçek uygulamada API'ye gönderilecek
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newAd: Advertisement = {
      id: `ad-${Date.now()}`,
      sellerId: adData.sellerId,
      seller: {} as any,
      productId: adData.productId,
      product: {} as any,
      type: adData.type || 'featured',
      cost: adData.cost || 0,
      duration: adData.duration,
      packageId: adData.packageId,
      title: 'Yeni Reklam',
      description: 'Ürün reklamı',
      startDate: new Date(),
      endDate: new Date(Date.now() + adData.duration * 24 * 60 * 60 * 1000),
      budget: 0,
      spent: 0,
      clicks: 0,
      impressions: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return newAd;
  }
);

// Reklam durdur
export const pauseAdvertisement = createAsyncThunk(
  'advertisement/pauseAdvertisement',
  async (adId: string) => {
    // Gerçek uygulamada API'ye gönderilecek
    await new Promise(resolve => setTimeout(resolve, 1000));
    return adId;
  }
);

// Reklam devam ettir
export const resumeAdvertisement = createAsyncThunk(
  'advertisement/resumeAdvertisement',
  async (adId: string) => {
    // Gerçek uygulamada API'ye gönderilecek
    await new Promise(resolve => setTimeout(resolve, 1000));
    return adId;
  }
);

// Reklam sil
export const deleteAdvertisement = createAsyncThunk(
  'advertisement/deleteAdvertisement',
  async (adId: string) => {
    // Gerçek uygulamada API'ye gönderilecek
    await new Promise(resolve => setTimeout(resolve, 1000));
    return adId;
  }
);

const advertisementSlice = createSlice({
  name: 'advertisement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateAdvertisementStats: (state, action: PayloadAction<{
      adId: string;
      clicks: number;
      impressions: number;
      spent: number;
    }>) => {
      const { adId, clicks, impressions, spent } = action.payload;
      const ad = state.myAdvertisements.find(ad => ad.id === adId);
      if (ad) {
        ad.clicks = clicks;
        ad.impressions = impressions;
        ad.spent = spent;
        ad.updatedAt = new Date();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ad packages
      .addCase(fetchAdPackages.pending, (state) => {
        state.packagesLoading = true;
        state.error = null;
      })
      .addCase(fetchAdPackages.fulfilled, (state, action) => {
        state.packagesLoading = false;
        state.adPackages = action.payload;
      })
      .addCase(fetchAdPackages.rejected, (state, action) => {
        state.packagesLoading = false;
        state.error = action.error.message || 'Reklam paketleri yüklenirken hata oluştu';
      })
      
      // Fetch my advertisements
      .addCase(fetchMyAdvertisements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyAdvertisements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myAdvertisements = action.payload;
      })
      .addCase(fetchMyAdvertisements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Reklamlar yüklenirken hata oluştu';
      })
      
      // Create advertisement
      .addCase(createAdvertisement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdvertisement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myAdvertisements.unshift(action.payload);
      })
      .addCase(createAdvertisement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Reklam oluşturulurken hata oluştu';
      })
      
      // Pause advertisement
      .addCase(pauseAdvertisement.fulfilled, (state, action) => {
        const ad = state.myAdvertisements.find(ad => ad.id === action.payload);
        if (ad) {
          ad.status = 'paused';
          ad.updatedAt = new Date();
        }
      })
      
      // Resume advertisement
      .addCase(resumeAdvertisement.fulfilled, (state, action) => {
        const ad = state.myAdvertisements.find(ad => ad.id === action.payload);
        if (ad) {
          ad.status = 'active';
          ad.updatedAt = new Date();
        }
      })
      
      // Delete advertisement
      .addCase(deleteAdvertisement.fulfilled, (state, action) => {
        state.myAdvertisements = state.myAdvertisements.filter(
          ad => ad.id !== action.payload
        );
      });
  },
});

export const { clearError, updateAdvertisementStats } = advertisementSlice.actions;
export default advertisementSlice.reducer;