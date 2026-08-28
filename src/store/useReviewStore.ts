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

const initialReviews: ReviewRecord[] = [
  {
    id: 101,
    productId: 2,
    user: 'Alisher Z.',
    productName: 'Luxe Parfum Elegance 100ml',
    rating: 5,
    comment: 'Juda zo\'r atir ekan, hidi 2 kun saqlandi! Hammaga tavsiya qilaman.',
    pros: 'Uzoq saqlanadi, juda nafis ifor',
    cons: 'Yo\'q',
    date: '2026-08-08',
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    status: 'APPROVED',
  },
  {
    id: 102,
    productId: 1,
    user: 'Malika S.',
    productName: 'Premium Qishki Kurtka',
    rating: 5,
    comment: 'Matosi judayam sifatli va issiq! Qish uchun juda qulay.',
    pros: 'Issiq va suv o\'tkazmaydi',
    cons: 'Yo\'q',
    date: '2026-08-07',
    createdAt: Date.now() - 48 * 60 * 60 * 1000,
    status: 'APPROVED',
  },
  {
    id: 103,
    productId: 4,
    user: 'Jasur K.',
    productName: 'Sport Krossovkalar Fly',
    rating: 4,
    comment: 'Yugurish uchun ancha yengil va qulay krossovka.',
    pros: 'Yengil, amortizatsiyasi zo\'r',
    cons: 'Oq qismi tez chang bo\'ladi',
    date: '2026-08-08',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    status: 'PENDING',
  },
];

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: initialReviews,

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
