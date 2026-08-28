import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MultilingualText } from '@/types';

export interface CategoryItemStore {
  id: number;
  name: MultilingualText | string;
  image: string;
  isActive: boolean;
  showOnHome?: boolean;
  createdAt: number;
  parentId?: number | null;
  order?: number;
}

interface CategoryState {
  categories: CategoryItemStore[];
  addCategory: (category: Omit<CategoryItemStore, 'id' | 'createdAt'>) => void;
  updateCategory: (id: number, category: Partial<CategoryItemStore>) => void;
  removeCategory: (id: number) => void;
  toggleCategoryActive: (id: number) => void;
  toggleCategoryShowOnHome: (id: number) => void;
  reorderCategory: (id: number, direction: 'up' | 'down') => void;
}

const defaultCategories: CategoryItemStore[] = [
  {
    id: 1,
    name: { uz: 'Soatlar', ru: 'Часы', en: 'Watches' },
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    isActive: true,
    showOnHome: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2,
    name: { uz: 'Sumkalar', ru: 'Сумки', en: 'Bags' },
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200',
    isActive: true,
    showOnHome: true,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: 3,
    name: { uz: 'Poyabzallar', ru: 'Обувь', en: 'Footwear' },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
    isActive: true,
    showOnHome: true,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 4,
    name: { uz: 'Taqinchoqlar', ru: 'Ювелирные изделия', en: 'Jewelry' },
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200',
    isActive: true,
    showOnHome: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 5,
    name: { uz: 'Kiyimlar', ru: 'Одежда', en: 'Apparel' },
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200',
    isActive: true,
    showOnHome: true,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 6,
    name: { uz: 'Parfyumeriya', ru: 'Парфюмерия', en: 'Fragrance' },
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200',
    isActive: true,
    showOnHome: true,
    createdAt: Date.now(),
  },
];

const getInitialCategories = (): CategoryItemStore[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('store-categories-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.categories && Array.isArray(parsed.state.categories)) {
          return parsed.state.categories;
        }
      }
    } catch (e) {}
  }
  return defaultCategories;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: getInitialCategories(),

      addCategory: (cat) =>
        set((state) => {
          const nextId = state.categories.length > 0
            ? Math.max(...state.categories.map((c) => c.id)) + 1
            : 1;

          return {
            categories: [
              ...state.categories,
              {
                ...cat,
                id: nextId,
                showOnHome: cat.showOnHome ?? true,
                createdAt: Date.now(),
              },
            ],
          };
        }),

      updateCategory: (id, updatedFields) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updatedFields } : c
          ),
        })),

      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      toggleCategoryActive: (id) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),

      toggleCategoryShowOnHome: (id) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, showOnHome: !(c.showOnHome ?? true) } : c
          ),
        })),

      reorderCategory: (id, direction) =>
        set((state) => {
          const index = state.categories.findIndex((c) => c.id === id);
          if (index === -1) return state;

          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.categories.length) return state;

          const newCategories = [...state.categories];
          const [moved] = newCategories.splice(index, 1);
          newCategories.splice(targetIndex, 0, moved);

          return { categories: newCategories };
        }),
    }),
    {
      name: 'store-categories-storage',
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);
