'use client';

// Universal Telegram Mini App (TMA) E-Commerce — Zustand Persistent Wishlist Store

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  productIds: number[];
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.productIds.includes(productId);
          return {
            productIds: exists
              ? state.productIds.filter((id) => id !== productId)
              : [...state.productIds, productId],
          };
        });
      },

      isWishlisted: (productId) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => {
        set({ productIds: [] });
      },
    }),
    {
      name: 'tma_user_wishlist',
    }
  )
);
