import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MultilingualText, ProductBadge } from '@/types';

export interface ProductSpecifications {
  brand?: string;
  model_code?: string;
  warranty?: string;
  delivery?: string;
  package_condition?: string;
}

export interface ProductItem {
  id: number;
  category_id: number;
  name: MultilingualText;
  description: MultilingualText;
  advantages?: {
    uz?: string[];
    ru?: string[];
    en?: string[];
  };
  specifications?: ProductSpecifications;
  base_price: number;
  cost_price?: number | null;
  old_price: number | null;
  badge: ProductBadge;
  images: string[];
  tags?: string[];
  sku?: string;
  is_popular?: boolean;
  show_on_home?: boolean;
  category?: {
    id: number;
    name: MultilingualText;
  };
  variants: {
    id: number;
    size?: string | null;
    color?: string | null;
    stock_count: number;
    price?: number | null;
    cost_price?: number | null;
    sku?: string | null;
  }[];
}

const sampleFallbackProducts: ProductItem[] = [
  {
    id: 1,
    category_id: 5,
    name: { uz: 'Premium Qishki Kurtka', ru: 'Премиум Зимняя Куртка', en: 'Premium Winter Jacket' },
    description: { uz: 'Suv o\'tkazmaydigan va issiq saqlovchi matodan tayyorlangan premial kurtka. Sovuq ob-havo uchun mukammal himoya va qulaylik ta\'minlaydi.', ru: 'Водонепроницаемая премиальная куртка с ветрозащитой.', en: 'Waterproof premium winter jacket with superior thermal insulation.' },
    advantages: {
      uz: ['100% original va sifatli mato', 'Suv va shamoldan himoya', 'Issiq saqlovchi zamonaviy astar'],
      ru: ['100% оригинальная ткань', 'Защита от воды и ветра', 'Теплая современная подкладка'],
      en: ['100% genuine quality fabric', 'Wind and water resistant', 'Thermal premium lining']
    },
    specifications: {
      brand: 'Premium Boutique Edition',
      model_code: 'JKT-WIN-01',
      warranty: '12 oy rasmiy kafolat',
      delivery: 'Butun O\'zbekiston bo\'ylab',
      package_condition: 'Muhrlangan original quti'
    },
    base_price: 340000,
    cost_price: 220000,
    old_price: 420000,
    badge: 'SALE',
    is_popular: true,
    show_on_home: true,
    tags: ['qishki', 'premium', 'kurtka'],
    sku: 'JKT-WIN-01',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800'
    ],
    category: { id: 5, name: { uz: 'Kiyimlar', ru: 'Одежда', en: 'Apparel' } },
    variants: [
      { id: 101, size: 'M', color: 'Qora', stock_count: 5, price: 340000, cost_price: 220000 },
      { id: 102, size: 'L', color: 'Qora', stock_count: 2, price: 340000, cost_price: 220000 },
      { id: 103, size: 'XL', color: 'To\'q Ko\'k', stock_count: 4, price: 360000, cost_price: 230000 },
    ],
  },
  {
    id: 2,
    category_id: 6,
    name: { uz: 'Luxe Parfum Elegance 100ml', ru: 'Духи Luxe Parfum 100мл', en: 'Luxe Fragrance 100ml' },
    description: { uz: 'Fransuz parfyumerlari tomonidan yaratilgan uzoq saqlanuvchi, nafis va esda qolarli ifor. 24 soat davomida o\'z jozibasini yo\'qotmaydi.', ru: 'Стойкий и изысканный французский парфюм.', en: 'Long-lasting French luxury fragrance with subtle woody and citrus notes.' },
    advantages: {
      uz: ['24 soatgacha uzoq saqlanuvchi ifor', 'Fransuz parfyumerlari kompozitsiyasi', 'Sovg\'abop muhrlangan shisha'],
      ru: ['Стойкость аромата до 24 часов', 'Французская парфюмерная композиция', 'Подарочный флакон'],
      en: ['Up to 24h long-lasting scent', 'French perfumers composition', 'Luxury gift bottle']
    },
    specifications: {
      brand: 'Luxe Fragrance Paris',
      model_code: 'PRF-LUX-02',
      warranty: '100% original kafolat',
      delivery: 'Tezkor kuryer (2 soatda)',
      package_condition: 'Muhrlangan fransuz qutisi'
    },
    base_price: 180000,
    cost_price: 95000,
    old_price: 220000,
    badge: 'TOP',
    is_popular: true,
    show_on_home: true,
    tags: ['parfyum', 'luxe', 'elegance'],
    sku: 'PRF-LUX-02',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800'
    ],
    category: { id: 6, name: { uz: 'Parfyumeriya', ru: 'Парфюмерия', en: 'Fragrance' } },
    variants: [
      { id: 201, size: '50ml', color: 'Silver', stock_count: 8, price: 180000, cost_price: 95000 },
      { id: 202, size: '100ml', color: 'Gold', stock_count: 3, price: 240000, cost_price: 130000 },
    ],
  },
  {
    id: 3,
    category_id: 1,
    name: { uz: 'Charm Qo\'l Soati Deluxe', ru: 'Кожаные Часы Deluxe', en: 'Leather Watch Deluxe' },
    description: { uz: 'Klassik va zamonaviy uslubdagi tabiiy charm tasmasiga ega sapfir oynali qo\'l soati. Suvga chidamli va aniq mexanizm.', ru: 'Классические наручные часы с сапфировым стеклом.', en: 'Classic leather wrist watch with sapphire glass and water resistance.' },
    advantages: {
      uz: ['Qirilishga chidamli sapfir oyna', 'Tabiiy italyan charmi tasmasi', '30 metr chuqurlikkacha suvga chidamli'],
      ru: ['Сапфировое стекло с защитой от царапин', 'Ремешок из натуральной кожи', 'Водонепроницаемость 30м'],
      en: ['Scratch-resistant sapphire crystal', 'Genuine Italian leather strap', '30m water resistance']
    },
    specifications: {
      brand: 'Deluxe Chrono Swiss',
      model_code: 'WTH-DLX-03',
      warranty: '24 oy xalqaro kafolat',
      delivery: 'Butun O\'zbekiston bo\'ylab',
      package_condition: 'Yog\'och sovg\'abop quti'
    },
    base_price: 520000,
    old_price: 650000,
    badge: 'SALE',
    is_popular: true,
    show_on_home: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'
    ],
    category: { id: 1, name: { uz: 'Soatlar', ru: 'Часы', en: 'Watches' } },
    variants: [
      { id: 301, size: '42mm', color: 'Jigarrang', stock_count: 2, price: 520000 },
      { id: 302, size: '42mm', color: 'Qora', stock_count: 5, price: 520000 },
    ],
  },
  {
    id: 4,
    category_id: 3,
    name: { uz: 'Sport Krossovkalar Fly', ru: 'Спортивные Кроссовки Fly', en: 'Sport Sneakers Fly' },
    description: { uz: 'Yugurish, fitnes va kundalik kiyish uchun maxsus amortizatsiyali o\'ta yengil sport krossovkalari.', ru: 'Ультралегкие кроссовки для спорта и повседневной носки.', en: 'Ultra-lightweight athletic sneakers with responsive cushioning.' },
    advantages: {
      uz: ['100% original va sertifikatlangan mahsulot', 'Zamonaviy va ergonomik dizayn', 'Uzoq muddatli xizmat kafolati'],
      ru: ['100% оригинальный продукт', 'Современный эргономичный дизайн', 'Долговечность и комфорт'],
      en: ['100% genuine certified product', 'Modern ergonomic design', 'Long-lasting comfort guarantee']
    },
    specifications: {
      brand: 'Fly Sport Athletics',
      model_code: 'SKU-3568',
      warranty: '12 oy rasmiy kafolat',
      delivery: 'Butun O\'zbekiston bo\'ylab',
      package_condition: 'Muhrlangan original quti'
    },
    base_price: 290000,
    old_price: null,
    badge: 'NEW',
    is_popular: false,
    show_on_home: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800'
    ],
    category: { id: 3, name: { uz: 'Poyabzallar', ru: 'Обувь', en: 'Footwear' } },
    variants: [
      { id: 401, size: '40', color: 'Qizil', stock_count: 6, price: 290000 },
      { id: 402, size: '41', color: 'Qizil', stock_count: 4, price: 290000 },
      { id: 403, size: '42', color: 'Qizil', stock_count: 1, price: 290000 },
    ],
  },
  {
    id: 5,
    category_id: 4,
    name: { uz: 'Premium Oltin Zanjir Minimal', ru: 'Золотая Цепочка Minimal', en: 'Gold Necklace Minimal' },
    description: { uz: 'Nafis va zamonaviy 585 probali zarhal qoplamali zanjir. Har qanday libos bilan ajoyib uyg\'unlashadi.', ru: 'Элегантная минималистичная цепочка.', en: 'Minimalist elegant gold-plated necklace for daily luxury styling.' },
    advantages: {
      uz: ['585 probali zarhal qoplama', 'Antiallergen xavfsiz qoplama', 'Klassik va zamonaviy uslub'],
      ru: ['Позолота 585 пробы', 'Гипоаллергенное покрытие', 'Элегантный стиль'],
      en: ['585 Gold-plated finish', 'Hypoallergenic safe coating', 'Timeless luxury style']
    },
    specifications: {
      brand: 'Aura Gold Atelier',
      model_code: 'JWL-GLD-05',
      warranty: 'Umrbod sifat kafolati',
      delivery: 'Butun O\'zbekiston bo\'ylab',
      package_condition: 'Barxat quticha bilan'
    },
    base_price: 410000,
    old_price: 490000,
    badge: 'TOP',
    is_popular: true,
    show_on_home: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1611591477281-4de0ac174c40?w=800'
    ],
    category: { id: 4, name: { uz: 'Taqinchoqlar', ru: 'Ювелирные изделия', en: 'Jewelry' } },
    variants: [
      { id: 501, size: '45cm', color: 'Oltin', stock_count: 3, price: 410000 },
    ],
  },
  {
    id: 6,
    category_id: 2,
    name: { uz: 'Klassik Charm Sumka', ru: 'Классическая Кожаная Сумка', en: 'Classic Leather Handbag' },
    description: { uz: 'Yuqori sifatli tabiiy charmdan tikilgan ayollar sumkasi. Sig\'imli va qulay bo\'limlar.', ru: 'Вместительная женская кожаная сумка.', en: 'High quality genuine leather handbag with spacious compartments.' },
    advantages: {
      uz: ['100% tabiiy sifatli charm', 'Ko\'p bo\'limli sig\'imli dizayn', 'Mustahkam tilla rang furnitura'],
      ru: ['100% натуральная кожа', 'Вместительные отделения', 'Прочная фурнитура'],
      en: ['100% genuine leather', 'Spacious compartments', 'Durable gold-tone hardware']
    },
    specifications: {
      brand: 'Milano Leather House',
      model_code: 'BAG-MIL-06',
      warranty: '12 oy rasmiy kafolat',
      delivery: 'Butun O\'zbekiston bo\'ylab',
      package_condition: 'Brendli qop va quti'
    },
    base_price: 380000,
    old_price: 450000,
    badge: 'NEW',
    is_popular: true,
    show_on_home: true,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'
    ],
    category: { id: 2, name: { uz: 'Sumkalar', ru: 'Сумки', en: 'Bags' } },
    variants: [
      { id: 601, size: 'Medium', color: 'Qora', stock_count: 4, price: 380000 },
      { id: 602, size: 'Medium', color: 'Jigarrang', stock_count: 2, price: 380000 },
    ],
  },
];

const getInitialProducts = (): ProductItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('store-products-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.products && Array.isArray(parsed.state.products)) {
          return parsed.state.products;
        }
      }
    } catch (e) {}
  }
  return sampleFallbackProducts;
};

export interface ProductStore {
  products: ProductItem[];
  currentProduct: ProductItem | null;
  isLoaded: boolean;
  isLoading: boolean;
  isLoadingDetail: boolean;
  addProduct: (product: Omit<ProductItem, 'id'>) => void;
  bulkAddProducts: (newProducts: Omit<ProductItem, 'id'>[]) => void;
  duplicateProduct: (id: number) => ProductItem | null;
  updateProduct: (id: number, product: Partial<ProductItem>) => void;
  toggleProductPopular: (id: number) => void;
  toggleProductShowOnHome: (id: number) => void;
  bulkSetPopular: (ids: number[], isPopular: boolean) => void;
  bulkSetShowOnHome: (ids: number[], showOnHome: boolean) => void;
  inlineUpdateStockAndPrice: (id: number, price?: number, stock?: number) => void;
  quickUpdateStock: (id: number, delta: number) => void;
  deductStock: (items: { id: number; quantity: number; variant?: string }[]) => void;
  restoreStock: (items: { id: number; quantity: number; variant?: string }[]) => void;
  deleteProduct: (id: number) => void;
  fetchProducts: (lang?: string, categoryId?: number | null, search?: string) => Promise<void>;
  fetchProductDetail: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: getInitialProducts(),
      currentProduct: null as ProductItem | null,
      isLoaded: true,
      isLoading: false,
      isLoadingDetail: false,

      addProduct: (prod) =>
        set((state) => {
          const nextId =
            state.products.length > 0
              ? Math.max(...state.products.map((p) => p.id)) + 1
              : 1;

          const newProduct: ProductItem = {
            ...prod,
            id: nextId,
          };

          return {
            products: [newProduct, ...state.products],
          };
        }),

      bulkAddProducts: (newProducts) =>
        set((state) => {
          let currentMaxId =
            state.products.length > 0
              ? Math.max(...state.products.map((p) => p.id))
              : 0;

          const formattedProducts: ProductItem[] = newProducts.map((p) => {
            currentMaxId += 1;
            return {
              ...p,
              id: currentMaxId,
            };
          });

          return {
            products: [...formattedProducts, ...state.products],
          };
        }),

      duplicateProduct: (id) => {
        const target = get().products.find((p) => p.id === id);
        if (!target) return null;

        const nextId =
          get().products.length > 0
            ? Math.max(...get().products.map((p) => p.id)) + 1
            : 1;

        const nameUz = typeof target.name === 'object' ? `${target.name.uz} (Nusxa)` : `${target.name} (Nusxa)`;
        const nameRu = typeof target.name === 'object' ? `${target.name.ru || target.name.uz} (Копия)` : `${target.name} (Копия)`;
        const nameEn = typeof target.name === 'object' ? `${target.name.en || target.name.uz} (Copy)` : `${target.name} (Copy)`;

        const cloned: ProductItem = {
          ...target,
          id: nextId,
          name: { uz: nameUz, ru: nameRu, en: nameEn },
          sku: target.sku ? `${target.sku}-COPY` : `SKU-${nextId}`,
          variants: (target.variants || []).map((v, idx) => ({
            ...v,
            id: Date.now() + idx + 1,
          })),
        };

        set((state) => ({
          products: [cloned, ...state.products],
        }));

        return cloned;
      },

      inlineUpdateStockAndPrice: (id, price, stock) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const newPrice = price !== undefined ? price : p.base_price;
            const updatedVariants =
              p.variants && p.variants.length > 0
                ? p.variants.map((v, i) =>
                    i === 0
                      ? {
                          ...v,
                          price: newPrice,
                          stock_count: stock !== undefined ? Math.max(0, stock) : v.stock_count,
                        }
                      : v
                  )
                : [{ id: Date.now(), stock_count: stock !== undefined ? Math.max(0, stock) : 10, price: newPrice }];

            return {
              ...p,
              base_price: newPrice,
              variants: updatedVariants,
            };
          }),
        })),

      updateProduct: (id, updatedFields) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const merged = { ...p, ...updatedFields };
            if (merged.is_popular === false && merged.badge === 'TOP') {
              merged.badge = 'NONE';
            }
            return merged;
          }),
          currentProduct: state.currentProduct?.id === id
            ? { ...state.currentProduct, ...updatedFields }
            : state.currentProduct,
        })),

      toggleProductPopular: (id) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const currentIsPopular = p.is_popular === true;
            const nextPopular = !currentIsPopular;
            return {
              ...p,
              is_popular: nextPopular,
              badge: !nextPopular && p.badge === 'TOP' ? 'NONE' : p.badge,
            };
          }),
          currentProduct:
            state.currentProduct?.id === id
              ? {
                  ...state.currentProduct,
                  is_popular: !(state.currentProduct.is_popular === true),
                  badge:
                    state.currentProduct.is_popular === true && state.currentProduct.badge === 'TOP'
                      ? 'NONE'
                      : state.currentProduct.badge,
                }
              : state.currentProduct,
        })),

      toggleProductShowOnHome: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, show_on_home: !(p.show_on_home ?? true) } : p
          ),
          currentProduct:
            state.currentProduct?.id === id
              ? { ...state.currentProduct, show_on_home: !(state.currentProduct.show_on_home ?? true) }
              : state.currentProduct,
        })),

      bulkSetPopular: (ids, isPopular) =>
        set((state) => ({
          products: state.products.map((p) =>
            ids.includes(p.id)
              ? {
                  ...p,
                  is_popular: isPopular,
                  badge: !isPopular && p.badge === 'TOP' ? 'NONE' : p.badge,
                }
              : p
          ),
        })),

      bulkSetShowOnHome: (ids, showOnHome) =>
        set((state) => ({
          products: state.products.map((p) =>
            ids.includes(p.id) ? { ...p, show_on_home: showOnHome } : p
          ),
        })),

      quickUpdateStock: (id, delta) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const updatedVariants = p.variants && p.variants.length > 0
              ? p.variants.map((v, i) => i === 0 ? { ...v, stock_count: Math.max(0, (v.stock_count || 0) + delta) } : v)
              : [{ id: Date.now(), stock_count: Math.max(0, delta) }];
            return { ...p, variants: updatedVariants };
          }),
        })),

      deductStock: (items) =>
        set((state) => ({
          products: state.products.map((p) => {
            const itemMatches = items.filter((it) => it.id === p.id);
            if (itemMatches.length === 0) return p;

            let updatedVariants = p.variants ? [...p.variants] : [];
            if (updatedVariants.length === 0) {
              updatedVariants = [{ id: Date.now(), stock_count: 10 }];
            }

            itemMatches.forEach((match) => {
              if (match.variant && updatedVariants.length > 0) {
                const vIdx = updatedVariants.findIndex(
                  (v) => [v.size, v.color].filter(Boolean).join(' / ') === match.variant || v.size === match.variant
                );
                if (vIdx !== -1) {
                  updatedVariants[vIdx] = {
                    ...updatedVariants[vIdx],
                    stock_count: Math.max(0, (updatedVariants[vIdx].stock_count || 0) - match.quantity),
                  };
                } else {
                  updatedVariants[0] = {
                    ...updatedVariants[0],
                    stock_count: Math.max(0, (updatedVariants[0].stock_count || 0) - match.quantity),
                  };
                }
              } else if (updatedVariants.length > 0) {
                updatedVariants[0] = {
                  ...updatedVariants[0],
                  stock_count: Math.max(0, (updatedVariants[0].stock_count || 0) - match.quantity),
                };
              }
            });

            return { ...p, variants: updatedVariants };
          }),
        })),

      restoreStock: (items) =>
        set((state) => ({
          products: state.products.map((p) => {
            const itemMatches = items.filter((it) => it.id === p.id);
            if (itemMatches.length === 0) return p;

            let updatedVariants = p.variants ? [...p.variants] : [];
            if (updatedVariants.length === 0) {
              updatedVariants = [{ id: Date.now(), stock_count: 0 }];
            }

            itemMatches.forEach((match) => {
              if (match.variant && updatedVariants.length > 0) {
                const vIdx = updatedVariants.findIndex(
                  (v) => [v.size, v.color].filter(Boolean).join(' / ') === match.variant || v.size === match.variant
                );
                if (vIdx !== -1) {
                  updatedVariants[vIdx] = {
                    ...updatedVariants[vIdx],
                    stock_count: (updatedVariants[vIdx].stock_count || 0) + match.quantity,
                  };
                } else {
                  updatedVariants[0] = {
                    ...updatedVariants[0],
                    stock_count: (updatedVariants[0].stock_count || 0) + match.quantity,
                  };
                }
              } else if (updatedVariants.length > 0) {
                updatedVariants[0] = {
                  ...updatedVariants[0],
                  stock_count: (updatedVariants[0].stock_count || 0) + match.quantity,
                };
              }
            });

            return { ...p, variants: updatedVariants };
          }),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
        })),

      fetchProductDetail: async (id: number) => {
        set({ isLoadingDetail: true });
        try {
          const res = await fetch(`/api/products/${id}`);
          const json = await res.json();
          if (json.success && json.data?.product) {
            set({ currentProduct: json.data.product, isLoadingDetail: false });
            return;
          }
        } catch (err) {
          console.error('Error fetching product detail:', err);
        }
        const fallback = get().products.find((p) => p.id === id) || null;
        set({ currentProduct: fallback, isLoadingDetail: false });
      },

      fetchProducts: async (lang = 'uz', categoryId = null, search = '') => {
        // If products already exist in store, do NOT overwrite with server defaults
        if (get().products && get().products.length > 0 && !search && !categoryId) {
          set({ isLoaded: true, isLoading: false });
          return;
        }
        try {
          const params = new URLSearchParams({ lang, limit: '20' });
          if (search) params.append('search', search);
          if (categoryId) params.append('category_id', String(categoryId));

          const res = await fetch(`/api/products?${params.toString()}`);
          const json = await res.json();

          if (json.success && Array.isArray(json.data?.products) && json.data.products.length > 0 && (!get().products || get().products.length === 0)) {
            set({
              products: json.data.products,
              isLoaded: true,
              isLoading: false,
            });
          }
        } catch (err) {
          console.error('Error fetching products store:', err);
        } finally {
          set({ isLoaded: true, isLoading: false });
        }
      },
    }),
    {
      name: 'store-products-storage',
      partialize: (state) => ({ products: state.products }),
    }
  )
);


