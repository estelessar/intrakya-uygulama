import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, Category } from '../../types';

interface ProductState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  searchResults: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: string;
    rating?: number;
  };
}

const initialState: ProductState = {
  products: [],
  categories: [],
  featuredProducts: [],
  searchResults: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {},
};

// Async Thunk for fetching products by seller
export const fetchProductsBySeller = createAsyncThunk(
  'products/fetchBySeller',
  async (sellerId: string) => {
    try {
      // Gerçek uygulamada API'den satıcının ürünlerini çekeceğiz
      // Şimdilik mock data döndürüyoruz
      const mockProducts: Product[] = [];
      return mockProducts;
    } catch (error) {
      throw new Error('Satıcı ürünleri yüklenirken hata oluştu');
    }
  }
);

// Alias for fetchProductsBySeller
export const fetchSellerProducts = fetchProductsBySeller;

// Add product async thunk
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData: Partial<Product>) => {
    try {
      // Gerçek uygulamada API'ye post isteği gönderilecek
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newProduct: Product = {
        id: `product_${Date.now()}`,
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        categoryId: productData.categoryId || '',
        category: productData.category || { id: '', name: '', icon: '' },
        sellerId: productData.sellerId || '',
        seller: productData.seller || { id: '', name: '' } as any,
        images: productData.images || [],
        specifications: productData.specifications || {},
        stock: productData.stock || 0,
        rating: 0,
        reviewCount: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return newProduct;
    } catch (error) {
      throw new Error('Ürün eklenirken hata oluştu');
    }
  }
);

// Delete product async thunk
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string) => {
    try {
      // Gerçek uygulamada API'ye delete isteği gönderilecek
      await new Promise(resolve => setTimeout(resolve, 1000));
      return productId;
    } catch (error) {
      throw new Error('Ürün silinirken hata oluştu');
    }
  }
);

// Update product status async thunk
export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ productId, status }: { productId: string; status: 'active' | 'inactive' }) => {
    try {
      // Gerçek uygulamada API'ye update isteği gönderilecek
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { productId, status };
    } catch (error) {
      throw new Error('Ürün durumu güncellenirken hata oluştu');
    }
  }
);

// Original fetchProductsBySeller implementation
export const fetchProductsBySellerOriginal = createAsyncThunk(
  'products/fetchBySellerOriginal',
  async (sellerId: string) => {
    try {
      // Gerçek uygulamada API'den satıcının ürünlerini çekeceğiz
      // Şimdilik mock data döndürüyoruz
      const mockProducts: Product[] = [
        {
          id: `product_${Date.now()}_1`,
          name: 'Örnek Ürün 1',
          description: 'Satıcının örnek ürün açıklaması',
          price: 150,
          categoryId: 'cat_1',
          category: { id: 'cat_1', name: 'Elektronik', icon: 'phone-portrait' },
          sellerId: sellerId,
          seller: { id: sellerId, name: 'Satıcı Adı' } as any,
          images: ['https://via.placeholder.com/300'],
          specifications: {
            'Marka': 'Örnek Marka',
            'Model': 'Örnek Model',
            'Garanti': '2 Yıl'
          },
          stock: 25,
          rating: 4.2,
          reviewCount: 15,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: `product_${Date.now()}_2`,
          name: 'Örnek Ürün 2',
          description: 'Satıcının ikinci örnek ürün açıklaması',
          price: 89,
          categoryId: 'cat_2',
          category: { id: 'cat_2', name: 'Giyim', icon: 'shirt' },
          sellerId: sellerId,
          seller: { id: sellerId, name: 'Satıcı Adı' } as any,
          images: ['https://via.placeholder.com/300'],
          specifications: {
            'Beden': 'M',
            'Renk': 'Mavi',
            'Kumaş': '%100 Pamuk'
          },
          stock: 50,
          rating: 4.7,
          reviewCount: 32,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      return mockProducts;
    } catch (error) {
      throw new Error('Satıcı ürünleri yüklenirken hata oluştu');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.isLoading = false;
      state.products = action.payload;
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    fetchFeaturedProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Product[]>) => {
      state.searchResults = action.payload;
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products By Seller
      .addCase(fetchProductsBySeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsBySeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsBySeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Satıcı ürünleri yüklenirken hata oluştu';
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(product => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ürün silinirken hata oluştu';
      })
      
      // Update Product Status
      .addCase(updateProductStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { productId, status } = action.payload;
        const product = state.products.find(p => p.id === productId);
        if (product) {
          product.status = status;
          product.updatedAt = new Date();
        }
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ürün durumu güncellenirken hata oluştu';
      })
      
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ürün eklenirken hata oluştu';
      });
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchCategoriesSuccess,
  fetchFeaturedProductsSuccess,
  setSelectedProduct,
  setSearchQuery,
  setSearchResults,
  setFilters,
  clearFilters,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
export const productReducer = productSlice.reducer;