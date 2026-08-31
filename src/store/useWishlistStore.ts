'use client';

// Universal Telegram Mini App (TMA) E-Commerce — Zustand Persistent Wishlist Store

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  productIds: number[];
  items: number[];
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      get items() {
        return this.productIds;
      },

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.productIds.includes(productId);
          const updated = exists
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId];
          return {
            productIds: updated,
            items: updated,
          };
        });
      },

      isWishlisted: (productId) => {
        return get().productIds.includes(productId);
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => {
        set({ productIds: [], items: [] });
      },
    }),
    {
      name: 'tma_user_wishlist',
    }
  )
);
