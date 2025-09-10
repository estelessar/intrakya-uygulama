import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Order, OrderStatus, CargoCompany } from '../../types';
import { calculateCommission } from './commissionSlice';

// Async Thunk for fetching cargo companies
export const fetchCargoCompanies = createAsyncThunk(
  'orders/fetchCargoCompanies',
  async () => {
    try {
      // Gerçek uygulamada API'den gelecek
      const cargoCompanies: CargoCompany[] = [
        {
          id: 'aras',
          name: 'Aras Kargo',
          logo: 'https://example.com/aras-logo.png',
          isActive: true,
          deliveryTime: '1-3 gün',
          price: 15.99
        },
        {
          id: 'yurtici',
          name: 'Yurtiçi Kargo',
          logo: 'https://example.com/yurtici-logo.png',
          isActive: true,
          deliveryTime: '1-2 gün',
          price: 12.99
        },
        {
          id: 'mng',
          name: 'MNG Kargo',
          logo: 'https://example.com/mng-logo.png',
          isActive: true,
          deliveryTime: '2-4 gün',
          price: 10.99
        },
        {
          id: 'ptt',
          name: 'PTT Kargo',
          logo: 'https://example.com/ptt-logo.png',
          isActive: true,
          deliveryTime: '2-5 gün',
          price: 8.99
        },
        {
          id: 'ups',
          name: 'UPS Kargo',
          logo: 'https://example.com/ups-logo.png',
          isActive: true,
          deliveryTime: '1-2 gün',
          price: 25.99
        }
      ];
      
      return cargoCompanies;
    } catch (error) {
      throw new Error('Kargo firmaları yüklenirken hata oluştu');
    }
  }
);

// Async Thunk for updating order cargo info
export const updateOrderCargo = createAsyncThunk(
  'orders/updateCargo',
  async ({ orderId, cargoCompanyId, trackingNumber }: {
    orderId: string;
    cargoCompanyId: string;
    trackingNumber?: string;
  }) => {
    try {
      // Gerçek uygulamada API'ye gönderilecek
      const updatedOrder = {
        orderId,
        cargoCompanyId,
        trackingNumber,
        status: 'shipped' as OrderStatus,
        updatedAt: new Date()
      };
      
      return updatedOrder;
    } catch (error) {
      throw new Error('Kargo bilgileri güncellenirken hata oluştu');
    }
  }
);

// Async Thunk for fetching orders by seller
export const fetchOrdersBySeller = createAsyncThunk(
  'orders/fetchBySeller',
  async (sellerId: string) => {
    try {
      // Gerçek uygulamada API'den satıcının siparişlerini çekeceğiz
      // Şimdilik mock data döndürüyoruz
      const mockOrders: Order[] = [
        {
          id: `order_${Date.now()}_1`,
          orderNumber: `TM${Date.now().toString().slice(-8)}`,
          userId: 'user_1',
          items: [
            {
              id: 'item_1',
              productId: 'product_1',
              product: {
                 id: 'product_1',
                 name: 'Örnek Ürün',
                 description: 'Örnek ürün açıklaması',
                 price: 100,
                 categoryId: 'cat_1',
                 category: { id: 'cat_1', name: 'Kategori', icon: 'icon' },
                 sellerId: sellerId,
                 seller: { id: sellerId, name: 'Satıcı' } as any,
                 images: [],
                 specifications: {},
                 stock: 10,
                 rating: 4.5,
                 reviewCount: 10,
                 status: 'active',
                 createdAt: new Date(),
                 updatedAt: new Date()
               },
              quantity: 1,
              price: 100,
              totalPrice: 100
            }
          ],
          subtotal: 100,
           shippingCost: 0,
           totalAmount: 100,
           status: 'pending' as OrderStatus,
           paymentStatus: 'pending',
           paymentMethod: { type: 'credit_card' },
          shippingAddress: {
             id: 'addr_1',
             title: 'Ev',
             fullName: 'Test User',
             phoneNumber: '+90 555 123 4567',
             city: 'İstanbul',
             district: 'Kadıköy',
             neighborhood: 'Test Mahalle',
             addressLine: 'Test Adres',
             postalCode: '34000',
             isDefault: true
           },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      return mockOrders;
    } catch (error) {
      throw new Error('Satıcı siparişleri yüklenirken hata oluştu');
    }
  }
);

// Async Thunk for creating order with commission calculation
export const createOrderWithCommission = createAsyncThunk(
  'orders/createWithCommission',
  async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>, { dispatch }) => {
    try {
      // 1. Sipariş oluştur
      const order: Order = {
        ...orderData,
        id: `order_${Date.now()}`,
        orderNumber: `TM${Date.now().toString().slice(-8)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // 2. Her sipariş kalemi için komisyon hesapla
      const commissionPromises = order.items.map(item => {
        if (item.product.seller) {
          return dispatch(calculateCommission({
            orderId: order.id,
            sellerId: item.product.sellerId,
            orderAmount: item.totalPrice
          }));
        }
        return null;
      }).filter(Boolean);
      
      // 3. Tüm komisyonları hesapla
      await Promise.all(commissionPromises);
      
      return order;
    } catch (error) {
      throw new Error('Sipariş oluşturma ve komisyon hesaplama hatası');
    }
  }
);

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  cargoCompanies: CargoCompany[];
  isLoading: boolean;
  cargoLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  cargoCompanies: [],
  isLoading: false,
  cargoLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createOrderStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.isLoading = false;
      state.orders.unshift(action.payload);
      state.selectedOrder = action.payload;
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>
    ) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((order) => order.id === orderId);
      
      if (order) {
        order.status = status;
        order.updatedAt = new Date();
      }
      
      if (state.selectedOrder?.id === orderId) {
        state.selectedOrder.status = status;
        state.selectedOrder.updatedAt = new Date();
      }
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    processOrderWithCommission: (state, action: PayloadAction<Order>) => {
      // Sipariş işlenirken komisyon hesaplama için işaretleme
      const order = action.payload;
      state.orders.unshift(order);
      state.selectedOrder = order;
    },
    updateOrderCargoInfo: (
      state,
      action: PayloadAction<{ orderId: string; cargoCompanyId: string; trackingNumber?: string }>
    ) => {
      const { orderId, cargoCompanyId, trackingNumber } = action.payload;
      const order = state.orders.find((order) => order.id === orderId);
      
      if (order) {
        order.cargoCompany = cargoCompanyId;
        order.trackingNumber = trackingNumber;
        order.status = 'shipped';
        order.updatedAt = new Date();
      }
      
      if (state.selectedOrder?.id === orderId) {
        state.selectedOrder.cargoCompany = cargoCompanyId;
        state.selectedOrder.trackingNumber = trackingNumber;
        state.selectedOrder.status = 'shipped';
        state.selectedOrder.updatedAt = new Date();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders By Seller
      .addCase(fetchOrdersBySeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersBySeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersBySeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Satıcı siparişleri yüklenirken hata oluştu';
      })
      // Create Order With Commission
      .addCase(createOrderWithCommission.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderWithCommission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        state.selectedOrder = action.payload;
      })
      .addCase(createOrderWithCommission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Sipariş oluşturma hatası';
      })
      .addCase(fetchCargoCompanies.pending, (state) => {
        state.cargoLoading = true;
        state.error = null;
      })
      .addCase(fetchCargoCompanies.fulfilled, (state, action) => {
        state.cargoLoading = false;
        state.cargoCompanies = action.payload;
      })
      .addCase(fetchCargoCompanies.rejected, (state, action) => {
        state.cargoLoading = false;
        state.error = action.error.message || 'Kargo firmaları yüklenirken hata oluştu';
      })
      .addCase(updateOrderCargo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderCargo.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orderId, cargoCompanyId, trackingNumber, status } = action.payload;
        const order = state.orders.find((order) => order.id === orderId);
        
        if (order) {
          order.cargoCompany = cargoCompanyId;
          order.trackingNumber = trackingNumber;
          order.status = status;
          order.updatedAt = action.payload.updatedAt;
        }
        
        if (state.selectedOrder?.id === orderId) {
          state.selectedOrder.cargoCompany = cargoCompanyId;
          state.selectedOrder.trackingNumber = trackingNumber;
          state.selectedOrder.status = status;
          state.selectedOrder.updatedAt = action.payload.updatedAt;
        }
      })
      .addCase(updateOrderCargo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Kargo bilgileri güncellenirken hata oluştu';
      });
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  updateOrderStatus,
  setSelectedOrder,
  clearError,
  processOrderWithCommission,
  updateOrderCargoInfo,
} = orderSlice.actions;

export default orderSlice.reducer;