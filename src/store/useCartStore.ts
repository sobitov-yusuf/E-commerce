'use client';

// Universal Telegram Mini App (TMA) E-Commerce — Zustand Persistent Cart Store
// Handles Cart Items, Quantities, Promocode Application, and Total Price Calculations

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, Promocode } from '@/types';

export interface CartStoreItem {
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
}

interface CartStore {
  items: CartStoreItem[];
  appliedPromocode: Promocode | null;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  removeItem: (productId: number, variantId?: number | null) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: number | null) => void;
  applyPromocode: (promocode: Promocode) => void;
  removePromocode: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotalPrice: (deliveryFee?: number) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromocode: null,

      addItem: (product, variant = null, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              (variant ? item.variant?.id === variant.id : !item.variant)
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated };
          } else {
            return {
              items: [...state.items, { product, variant, quantity }],
            };
          }
        });
      },

      removeItem: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter((item) => {
            if (item.product.id !== productId) return true;
            if (variantId !== null && variantId !== undefined) {
              return (item.variant?.id ?? null) !== variantId;
            }
            return false;
          }),
        }));
      },

      updateQuantity: (productId, quantity, variantId = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              if (variantId === null || variantId === undefined || (item.variant?.id ?? null) === variantId) {
                return { ...item, quantity };
              }
            }
            return item;
          }),
        }));
      },

      applyPromocode: (promocode) => {
        set({ appliedPromocode: promocode });
      },

      removePromocode: () => {
        set({ appliedPromocode: null });
      },

      clearCart: () => {
        set({ items: [], appliedPromocode: null });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const unitPrice = item.variant?.price
            ? Number(item.variant.price)
            : Number(item.product.base_price);
          return total + unitPrice * item.quantity;
        }, 0);
      },

      getDiscountAmount: () => {
        const { appliedPromocode } = get();
        const subtotal = get().getSubtotal();
        if (!appliedPromocode) return 0;

        if (appliedPromocode.min_order_amount && subtotal < Number(appliedPromocode.min_order_amount)) {
          return 0;
        }

        if (appliedPromocode.discount_type === 'PERCENT') {
          return (subtotal * Number(appliedPromocode.discount_value)) / 100;
        } else {
          return Number(appliedPromocode.discount_value);
        }
      },

      getTotalPrice: (deliveryFee = 0) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal - discount + deliveryFee);
      },
    }),
    {
      name: 'tma_shopping_cart',
    }
  )
);
