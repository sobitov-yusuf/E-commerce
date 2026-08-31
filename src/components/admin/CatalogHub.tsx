'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  Star,
  Check,
  X,
  Upload,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useReviewStore } from '@/store/useReviewStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useStaffStore } from '@/store/useStaffStore';

interface CatalogHubProps {
  searchQuery?: string;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  openConfirmDialog?: (title: string, msg: string, onConfirm: () => void) => void;
}

export function CatalogHub({ triggerHaptic, openConfirmDialog }: CatalogHubProps) {
  const { lang, t } = useLanguageStore();
  const { hasPermission } = useStaffStore();
  const { products, addProduct, removeProduct, fetchProducts } = useProductStore();
  const { categories, addCategory, removeCategory, fetchCategories } = useCategoryStore();
  const { reviews, updateReviewStatus, addAdminReply } = useReviewStore();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'reviews'>('products');

  // Product Form Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [nameUz, setNameUz] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descUz, setDescUz] = useState('');
  const [descRu, setDescRu] = useState('');
  const [descEn, setDescEn] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [badge, setBadge] = useState<'NEW' | 'TOP' | 'SALE' | 'NONE'>('NONE');
  const [imageUrl, setImageUrl] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Category Form Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catNameUz, setCatNameUz] = useState('');
  const [catNameRu, setCatNameRu] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catImage, setCatImage] = useState('');

  const canManageCatalog = hasPermission('MANAGE_CATALOG');

  // Gemini AI Auto Translation
  const handleGeminiTranslate = async () => {
    if (!nameUz.trim()) return;
    triggerHaptic('medium');
    setIsTranslating(true);

    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameUz, description: descUz }),
      });
      const data = await res.json();
      if (data.success && data.translations) {
        setNameRu(data.translations.name?.ru || nameUz);
        setNameEn(data.translations.name?.en || nameUz);
        setDescRu(data.translations.description?.ru || descUz);
        setDescEn(data.translations.description?.en || descUz);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Submit New Product to Supabase
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameUz.trim() || !basePrice || !categoryId) return;
    triggerHaptic('medium');

    const success = await addProduct({
      name: { uz: nameUz.trim(), ru: nameRu.trim() || nameUz.trim(), en: nameEn.trim() || nameUz.trim() },
      description: { uz: descUz.trim(), ru: descRu.trim() || descUz.trim(), en: descEn.trim() || descUz.trim() },
      base_price: parseFloat(basePrice),
      original_price: oldPrice ? parseFloat(oldPrice) : null,
      images: imageUrl.trim() ? [imageUrl.trim()] : [],
      category_id: categoryId,
      badge: badge === 'NONE' ? null : badge,
      stock: 50,
      is_active: true,
      sku: `SKU-${Date.now()}`,
    });

    if (success) {
      setShowProductModal(false);
      setNameUz('');
      setNameRu('');
      setNameEn('');
      setDescUz('');
      setDescRu('');
      setDescEn('');
      setBasePrice('');
      setOldPrice('');
      setImageUrl('');
    }
  };

  // Submit New Category to Supabase
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameUz.trim()) return;
    triggerHaptic('medium');

    const success = await addCategory({
      name: { uz: catNameUz.trim(), ru: catNameRu.trim() || catNameUz.trim(), en: catNameEn.trim() || catNameUz.trim() },
      slug: catNameUz.toLowerCase().replace(/\s+/g, '-'),
      image: catImage.trim() || null,
      isActive: true,
    });

    if (success) {
      setShowCategoryModal(false);
      setCatNameUz('');
      setCatNameRu('');
      setCatNameEn('');
      setCatImage('');
    }
  };

  const getProductName = (name: any) => {
    if (typeof name === 'object' && name) return name[lang] || name.uz || '';
    return String(name || '');
  };

  const getCategoryName = (name: any) => {
    if (typeof name === 'object' && name) return name[lang] || name.uz || '';
    return String(name || '');
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('products');
              triggerHaptic('light');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Mahsulotlar ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('categories');
              triggerHaptic('light');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Toifalar ({categories.length})</span>
          </button>
        </div>

        {canManageCatalog && (
          <div>
            {activeTab === 'products' && (
              <button
                type="button"
                onClick={() => {
                  setShowProductModal(true);
                  triggerHaptic('light');
                }}
                className="px-3.5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-black dark:hover:bg-gray-100 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi mahsulot</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(true);
                  triggerHaptic('light');
                }}
                className="px-3.5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-black dark:hover:bg-gray-100 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi toifa</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 1. PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#161F30] border-b border-gray-200/80 dark:border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Tovar</th>
                    <th className="py-3 px-4">Toifa</th>
                    <th className="py-3 px-4">Asosiy Narx</th>
                    <th className="py-3 px-4">Zaxira</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {products.map((p) => {
                    const img = p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-[#161F30]/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={img} alt={getProductName(p.name)} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                            <div>
                              <div className="font-bold text-gray-950 dark:text-white line-clamp-1">{getProductName(p.name)}</div>
                              <div className="text-[10px] text-gray-400 font-mono">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {p.category ? getCategoryName(p.category.name) : 'Birlamchi'}
                        </td>
                        <td className="py-3 px-4 font-black text-gray-950 dark:text-white">
                          {Number(p.base_price).toLocaleString()} UZS
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600">
                          {p.stock} ta
                        </td>
                        <td className="py-3 px-4 text-right">
                          {canManageCatalog && (
                            <button
                              type="button"
                              onClick={() => removeProduct(p.id)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              Hozircha mahsulotlar yo'q. "Yangi mahsulot" tugmasi orqali qo'shing.
            </div>
          )}
        </div>
      )}

      {/* 2. CATEGORIES GRID */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                {cat.image ? (
                  <img src={cat.image} alt={getCategoryName(cat.name)} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#161F30] flex items-center justify-center font-bold text-gray-400">
                    📂
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-gray-950 dark:text-white">{getCategoryName(cat.name)}</h4>
                  <p className="text-[10px] text-gray-400">/{cat.slug}</p>
                </div>
              </div>

              {canManageCatalog && (
                <button
                  type="button"
                  onClick={() => removeCategory(String(cat.id))}
                  className="text-gray-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Creation Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 max-w-lg w-full border border-gray-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-900 dark:text-white" />
                <span>Yangi mahsulot qo'shish</span>
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                    Tovar Nomi (O'zbekcha)
                  </label>
                  <button
                    type="button"
                    onClick={handleGeminiTranslate}
                    disabled={isTranslating || !nameUz.trim()}
                    className="text-[10px] font-bold text-purple-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isTranslating ? 'Tarjima qilinmoqda...' : '✨ Gemini AI Tarjima'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={nameUz}
                  onChange={(e) => setNameUz(e.target.value)}
                  placeholder="Erkaklar krossovkasi Nike Air"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
                />
              </div>

              {(nameRu || nameEn) && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                    placeholder="Ruscha nomi"
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Inglizcha nomi"
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Asosiy Narx (UZS)
                  </label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="250000"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Eski Narx (Chegirma uchun)
                  </label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="300000"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Toifasi (Kategoriya)
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                  >
                    <option value="">Toifani tanlang</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {getCategoryName(c.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Maxsus Nishon (Badge)
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                  >
                    <option value="NONE">Oddiy</option>
                    <option value="TOP">TOP (Mashhur)</option>
                    <option value="NEW">NEW (Yangi)</option>
                    <option value="SALE">SALE (Chegirma)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                  Rasm URL manzili
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xs mt-2"
              >
                Mahsulotni saqlash (Supabase DB)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 max-w-sm w-full border border-gray-200 dark:border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white">Yangi toifa yaratish</h3>
              <button onClick={() => setShowCategoryModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                  Toifa Nomi (O'zbekcha)
                </label>
                <input
                  type="text"
                  required
                  value={catNameUz}
                  onChange={(e) => setCatNameUz(e.target.value)}
                  placeholder="Poyabzallar"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                  Ikonka / Rasm URL
                </label>
                <input
                  type="url"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs mt-2"
              >
                Toifani saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
