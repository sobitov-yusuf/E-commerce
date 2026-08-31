import { create } from 'zustand';
import { MultilingualText, ProductBadge } from '@/types';

export interface ProductItem {
  id: number;
  category_id?: number;
  name: MultilingualText | any;
  description?: MultilingualText | any;
  base_price: number;
  old_price?: number | null;
  badge?: ProductBadge | 'TOP' | 'SALE' | 'NEW' | 'NONE' | null;
  images: string[];
  stock?: number;
  is_active: boolean;
  sku?: string;
  category?: any;
  variants?: any[];
  reviews?: any[];
  rating?: number;
  reviewsCount?: number;
  created_at?: Date | string;
}

interface ProductState {
  products: ProductItem[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: any) => Promise<boolean>;
  updateProduct: (id: number, updates: Partial<ProductItem>) => Promise<boolean>;
  removeProduct: (id: number) => Promise<boolean>;
  updateStock: (id: number, newStock: number) => void;
  deductStock: (id: number, quantity: number, variantId?: number) => void;
  restoreStock: (id: number, quantity: number, variantId?: number) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        set({ products: data.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      console.error('Fetch products error:', err);
      set({ isLoading: false, error: err.message });
    }
  },

  addProduct: async (newProduct) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success && data.data) {
        set({ products: [data.data, ...get().products] });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Add product error:', e);
      return false;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...data.data } : p)),
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Update product error:', e);
      return false;
    }
  },

  removeProduct: async (id) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        set({ products: get().products.filter((p) => p.id !== id) });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Delete product error:', e);
      return false;
    }
  },

  updateStock: (id, newStock) => {
    set({
      products: get().products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p)),
    });
  },

  deductStock: (id, quantity, variantId) => {
    set({
      products: get().products.map((p) => {
        if (p.id === id) {
          const updatedStock = Math.max(0, (p.stock || 0) - quantity);
          return { ...p, stock: updatedStock };
        }
        return p;
      }),
    });
  },

  restoreStock: (id, quantity, variantId) => {
    set({
      products: get().products.map((p) => {
        if (p.id === id) {
          const updatedStock = (p.stock || 0) + quantity;
          return { ...p, stock: updatedStock };
        }
        return p;
      }),
    });
  },
}));
