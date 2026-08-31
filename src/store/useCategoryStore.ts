import { create } from 'zustand';

export interface MultilingualText {
  uz: string;
  ru: string;
  en: string;
}

export interface CategoryItemStore {
  id: string;
  name: MultilingualText | string;
  slug: string;
  image?: string | null;
  isActive: boolean;
  order?: number;
  _count?: {
    products: number;
  };
}

interface CategoryState {
  categories: CategoryItemStore[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<CategoryItemStore, 'id'>) => Promise<boolean>;
  updateCategory: (id: string, updates: Partial<CategoryItemStore>) => void;
  removeCategory: (id: string) => Promise<boolean>;
  toggleCategoryActive: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [], // Clean, no fake mockup
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const formatted = data.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image,
          isActive: c.is_active,
          _count: c._count,
        }));
        set({ categories: formatted, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Fetch categories error:', e);
      set({ isLoading: false });
    }
  },

  addCategory: async (category) => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: category.name,
          slug: category.slug,
          image: category.image,
          is_active: category.isActive,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const item: CategoryItemStore = {
          id: data.data.id,
          name: data.data.name,
          slug: data.data.slug,
          image: data.data.image,
          isActive: data.data.is_active,
        };
        set({ categories: [...get().categories, item] });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Add category error:', e);
      return false;
    }
  },

  updateCategory: (id, updates) => {
    set({
      categories: get().categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  },

  removeCategory: async (id) => {
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        set({ categories: get().categories.filter((c) => c.id !== id) });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Delete category error:', e);
      return false;
    }
  },

  toggleCategoryActive: (id) => {
    set({
      categories: get().categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    });
  },
}));
