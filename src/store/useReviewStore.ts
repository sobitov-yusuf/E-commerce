import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReviewRecord {
  id: number;
  productId: number;
  productName: string;
  user: string;
  rating: number;
  comment: string;
  pros?: string;
  cons?: string;
  date: string;
  createdAt: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  images?: string[];
  helpfulCount?: number;
  adminReply?: {
    text: string;
    date: string;
    author: string;
  };
}

interface ReviewState {
  reviews: ReviewRecord[];
  addReview: (review: Omit<ReviewRecord, 'id' | 'createdAt' | 'status' | 'date'>) => void;
  updateReviewStatus: (id: number, status: 'APPROVED' | 'REJECTED') => void;
  addAdminReply: (id: number, text: string, author?: string) => void;
  toggleHelpful: (id: number) => void;
  deleteReview: (id: number) => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (reviewData) => {
        const nextId = Date.now();
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const newReview: ReviewRecord = {
          ...reviewData,
          id: nextId,
          createdAt: Date.now(),
          date: dateStr,
          status: 'PENDING',
        };

        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }));
      },

      updateReviewStatus: (id, status) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      addAdminReply: (id, text, author = 'Do\'kon Ma\'muriyati') => {
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  adminReply: {
                    text,
                    date: dateStr,
                    author,
                  },
                }
              : r
          ),
        }));
      },

      toggleHelpful: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
          ),
        })),

      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'store-reviews-storage',
      partialize: (state) => ({ reviews: state.reviews }),
    }
  )
);
