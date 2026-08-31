'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Sparkles,
  Image as ImageIcon,
  Check,
  Star,
  MessageSquare,
  LayoutGrid,
  List,
  AlertTriangle,
  Boxes,
  Flame,
  Search,
  ChevronDown,
  Layers,
  CheckCircle2,
  X,
  Upload,
} from 'lucide-react';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useReviewStore } from '@/store/useReviewStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useStaffStore } from '@/store/useStaffStore';

interface CatalogHubProps {
  searchQuery: string;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  openConfirmDialog?: (title: string, msg: string, onConfirm: () => void) => void;
}

export function CatalogHub({ searchQuery, triggerHaptic, openConfirmDialog }: CatalogHubProps) {
  const { lang } = useLanguageStore();
  const { hasPermission } = useStaffStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories, addCategory, toggleCategoryActive, removeCategory } = useCategoryStore();
  const { reviews, updateReviewStatus, addAdminReply } = useReviewStore();

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories' | 'reviews'>('products');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productNameUz, setProductNameUz] = useState('');
  const [productNameRu, setProductNameRu] = useState('');
  const [productNameEn, setProductNameEn] = useState('');
  const [productDescUz, setProductDescUz] = useState('');
  const [productDescRu, setProductDescRu] = useState('');
  const [productDescEn, setProductDescEn] = useState('');
  const [productPrice, setProductPrice] = useState('180000');
  const [productCategory, setProductCategory] = useState('1');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  // Review Reply State
  const [replyReviewId, setReplyReviewId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const canManageCatalog = hasPermission('MANAGE_CATALOG');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = typeof p.name === 'object' ? (p.name as any)[lang] || p.name.uz : String(p.name);
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [products, searchQuery, lang]);

  // Mini HUD Stats
  const outOfStockCount = products.filter((p) => (p as any).stock_count === 0).length;
  const lowStockCount = products.filter((p) => (p as any).stock_count > 0 && (p as any).stock_count <= 5).length;

  // AI Auto-translate with Gemini + Google Fallback
  const handleAiTranslate = async () => {
    if (!productNameUz.trim()) return;
    triggerHaptic('medium');
    setIsTranslating(true);

    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productNameUz,
          description: productDescUz || `${productNameUz} - eng yuqori sifatli mahsulot.`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProductNameRu(data.data.name_ru || '');
        setProductNameEn(data.data.name_en || '');
        setProductDescRu(data.data.description_ru || '');
        setProductDescEn(data.data.description_en || '');
      }
    } catch (e) {
      console.warn('Translate error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Safe Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic('light');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setProductImages([...productImages, data.data.url]);
      }
    } catch (err) {
      console.warn('Upload error:', err);
    }
  };

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductNameUz('');
    setProductNameRu('');
    setProductNameEn('');
    setProductDescUz('');
    setProductDescRu('');
    setProductDescEn('');
    setProductPrice('180000');
    setProductImages(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500']);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productNameUz.trim()) return;
    triggerHaptic('medium');

    const productPayload: any = {
      id: editingProductId || Date.now(),
      name: {
        uz: productNameUz,
        ru: productNameRu || productNameUz,
        en: productNameEn || productNameUz,
      },
      description: {
        uz: productDescUz || productNameUz,
        ru: productDescRu || productNameRu || productNameUz,
        en: productDescEn || productNameEn || productNameUz,
      },
      base_price: parseInt(productPrice, 10) || 180000,
      images: productImages.length > 0 ? productImages : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
      category_id: parseInt(productCategory, 10) || 1,
      is_active: true,
      is_popular: true,
      stock_count: 25,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setShowProductModal(false);
  };

  const getCategoryName = (name: any) => {
    if (typeof name === 'object' && name) return name[lang] || name.uz || '';
    return String(name || '');
  };

  return (
    <div className="space-y-6">
      {/* 1. Sub Navigation & Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('products');
              triggerHaptic('light');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'products'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{lang === 'uz' ? `Mahsulotlar (${products.length})` : `Товары (${products.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('categories');
              triggerHaptic('light');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'categories'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'uz' ? `Kategoriyalar (${categories.length})` : `Категории (${categories.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('reviews');
              triggerHaptic('light');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'reviews'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>{lang === 'uz' ? `Sharhlar (${reviews.length})` : `Отзывы (${reviews.length})`}</span>
          </button>
        </div>

        {/* Add Product Trigger */}
        {activeSubTab === 'products' && canManageCatalog && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-[#161F30] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-[#1F293D] shadow-2xs' : 'text-gray-400'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white dark:bg-[#1F293D] shadow-2xs' : 'text-gray-400'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenNewProduct}
              className="px-3.5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-black dark:hover:bg-gray-100 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'uz' ? 'Yangi tovar qo\'shish' : 'Добавить товар'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. PRODUCTS TAB */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          {/* Mini HUD Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#111827] rounded-xl p-3 border border-gray-200/80 dark:border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Jami Tovarlar</span>
              <div className="text-base font-black text-gray-950 dark:text-white">{products.length} ta</div>
            </div>
            <div className="bg-white dark:bg-[#111827] rounded-xl p-3 border border-gray-200/80 dark:border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Mashhurlar</span>
              <div className="text-base font-black text-amber-500">
                {products.filter((p) => p.is_popular).length} ta
              </div>
            </div>
            <div className="bg-white dark:bg-[#111827] rounded-xl p-3 border border-gray-200/80 dark:border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Tugagan (0 dona)</span>
              <div className="text-base font-black text-red-600">{outOfStockCount} ta</div>
            </div>
            <div className="bg-white dark:bg-[#111827] rounded-xl p-3 border border-gray-200/80 dark:border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Kam Qolgan (≤5)</span>
              <div className="text-base font-black text-amber-600">{lowStockCount} ta</div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredProducts.map((p) => {
                const name = typeof p.name === 'object' ? (p.name as any)[lang] || p.name.uz : String(p.name);
                const img = p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';

                return (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square w-full bg-gray-50 dark:bg-[#161F30] overflow-hidden relative">
                        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {p.is_popular && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase shadow-xs">
                            TOP
                          </span>
                        )}
                      </div>

                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[32px] leading-snug">
                          {name}
                        </h4>
                        <div className="text-xs font-black text-gray-950 dark:text-white">
                          {Number(p.base_price).toLocaleString()} UZS
                        </div>
                      </div>
                    </div>

                    {canManageCatalog && (
                      <div className="p-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProductId(p.id);
                            setProductNameUz(typeof p.name === 'object' ? (p.name as any).uz : String(p.name || ''));
                            setProductNameRu(typeof p.name === 'object' ? (p.name as any).ru : String(p.name || ''));
                            setProductNameEn(typeof p.name === 'object' ? (p.name as any).en : String(p.name || ''));
                            setProductPrice(String(p.base_price));
                            setProductImages(p.images || []);
                            setShowProductModal(true);
                          }}
                          className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-950 p-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#161F30] border-b border-gray-200/80 dark:border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Mahsulot</th>
                    <th className="py-3 px-4">Narxi</th>
                    <th className="py-3 px-4">Qoldiq</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {filteredProducts.map((p) => {
                    const name = typeof p.name === 'object' ? (p.name as any)[lang] || p.name.uz : String(p.name);
                    const img = p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100';

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-[#161F30]/50">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img src={img} alt={name} className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                          <span className="font-bold text-gray-950 dark:text-white line-clamp-1">{name}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-950 dark:text-white">
                          {Number(p.base_price).toLocaleString()} UZS
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600">
                          {(p as any).stock_count || 25} dona
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. CATEGORIES TAB */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img src={c.image} alt={getCategoryName(c.name)} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                <div>
                  <h4 className="text-xs font-bold text-gray-950 dark:text-white">{getCategoryName(c.name)}</h4>
                  <span className="text-[10px] text-gray-400">ID: #{c.id}</span>
                </div>
              </div>

              {canManageCatalog && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleCategoryActive(c.id)}
                    className={`text-xs font-bold p-1 ${c.isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                  >
                    {c.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCategory(c.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. REVIEWS MODERATION TAB */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-950 dark:text-white">
            Xaridorlar Sharhlari ({reviews.length})
          </div>

          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-950 dark:text-white">{r.user}</span>
                    <span className="text-[10px] text-gray-400">({r.date})</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 font-normal leading-relaxed">
                  {r.comment}
                </p>

                {/* Admin Reply */}
                {r.adminReply?.text ? (
                  <div className="bg-gray-50 dark:bg-[#161F30] p-3 rounded-xl border border-gray-200/60 dark:border-white/10 text-xs">
                    <span className="font-bold text-emerald-600 block text-[10px] uppercase">Do'kon ma'muriyati javobi:</span>
                    <p className="text-gray-800 dark:text-gray-200 mt-0.5">{r.adminReply.text}</p>
                  </div>
                ) : (
                  canManageCatalog && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Do'kon nomidan javob yozish..."
                        value={replyReviewId === r.id ? replyText : ''}
                        onChange={(e) => {
                          setReplyReviewId(r.id);
                          setReplyText(e.target.value);
                        }}
                        className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (replyText.trim() && replyReviewId === r.id) {
                            addAdminReply(r.id, replyText.trim(), 'Do\'kon ma\'muriyati');
                            setReplyText('');
                            setReplyReviewId(null);
                            triggerHaptic('light');
                          }
                        }}
                        className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs"
                      >
                        Javob berish
                      </button>
                    </div>
                  )
                )}

                {/* Actions */}
                {canManageCatalog && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10 text-xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status: {r.status}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateReviewStatus(r.id, 'APPROVED')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-xs hover:bg-emerald-100"
                      >
                        Tasdiqlash
                      </button>
                      <button
                        type="button"
                        onClick={() => updateReviewStatus(r.id, 'REJECTED')}
                        className="px-2.5 py-1 bg-red-50 text-red-600 font-bold rounded-lg text-xs hover:bg-red-100"
                      >
                        Rad etish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PRODUCT CREATE / EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 max-w-xl w-full border border-gray-200 dark:border-white/10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                {editingProductId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
              </h3>
              <button onClick={() => setShowProductModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Name (UZ) & AI Translate Trigger */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-900 dark:text-white">
                    Mahsulot Nomi (O'zbekcha)
                  </label>
                  <button
                    type="button"
                    onClick={handleAiTranslate}
                    disabled={isTranslating || !productNameUz.trim()}
                    className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isTranslating ? 'Tarjima qilinmoqda...' : '✨ Gemini AI Tarjima'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={productNameUz}
                  onChange={(e) => setProductNameUz(e.target.value)}
                  placeholder="Nike Air Force 1 '07 Oq Krossovka"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              {/* RU & EN Auto-filled Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">Nom (Ruscha)</label>
                  <input
                    type="text"
                    value={productNameRu}
                    onChange={(e) => setProductNameRu(e.target.value)}
                    placeholder="Кроссовки Nike Air Force 1 '07"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">Nom (Inglizcha)</label>
                  <input
                    type="text"
                    value={productNameEn}
                    onChange={(e) => setProductNameEn(e.target.value)}
                    placeholder="Nike Air Force 1 '07 White Sneakers"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">Narxi (UZS)</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">Kategoriya</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{getCategoryName(cat.name)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Images & Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 dark:text-white block">Rasmlar Galereyasi</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {productImages.map((img, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProductImages(productImages.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 bg-red-600 text-white w-4 h-4 flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <label className="w-14 h-14 rounded-xl border border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#161F30] text-gray-400">
                    <Upload className="w-4 h-4" />
                    <span className="text-[8px] mt-0.5">Yuklash</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs shadow-md mt-4"
              >
                Mahsulotni saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
