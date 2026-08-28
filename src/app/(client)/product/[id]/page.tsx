'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  CreditCard,
  Check,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Lock,
  ThumbsUp,
  MessageSquarePlus,
  Zap,
  X,
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useReviewStore } from '@/store/useReviewStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ProductCard } from '@/components/home/ProductCard';

interface ReviewItem {
  id: number;
  author: string;
  date: string;
  rating: number;
  pros: string;
  cons: string;
  comment: string;
  isVerifiedBuyer: boolean;
  images?: string[];
  adminReply?: {
    text: string;
    date: string;
    author: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params?.id);
  const { t, lang } = useLanguageStore();

  const { products, currentProduct, fetchProductDetail, isLoadingDetail, fetchProducts } = useProductStore();
  const { items: cartItems, addItem: addItemToCart, updateQuantity: updateCartQuantity, removeItem: removeItemFromCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Review & Verified Buyer State
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showNotEligibleModal, setShowNotEligibleModal] = useState<boolean>(false);
  const [showAlreadyReviewedModal, setShowAlreadyReviewedModal] = useState<boolean>(false);
  const [likedReviews, setLikedReviews] = useState<number[]>([]);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewAuthor, setReviewAuthor] = useState<string>('');
  const [reviewPros, setReviewPros] = useState<string>('');
  const [reviewCons, setReviewCons] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  const orders = useOrderStore((state) => state.orders);
  const storeReviews = useReviewStore((state) => state.reviews);
  const addReviewToStore = useReviewStore((state) => state.addReview);
  const toggleHelpfulInStore = useReviewStore((state) => state.toggleHelpful);
  const maxReviewsPerProduct = useSettingsStore((state) => state.maxReviewsPerProduct) || 10;

  // Dynamic reviews list merged with verified approved reviews from useReviewStore (sorted by newest, limited by Admin FIFO setting)
  const allApprovedReviews = storeReviews.filter(
    (r) => r.productId === productId && r.status === 'APPROVED'
  );
  const approvedProductReviews = allApprovedReviews.slice(0, maxReviewsPerProduct);

  useEffect(() => {
    if (productId) {
      fetchProductDetail(productId);
      fetchProducts(lang, null, '');
      setActiveImageIndex(0);

      // Strict purchase verification: Check in all completed/active orders and local purchase history
      const hasBoughtInOrders = orders.some((o) =>
        o.items?.some((it) => it.id === productId)
      );

      let hasBoughtInStorage = false;
      try {
        const storedPurchases = localStorage.getItem('user_purchased_products');
        if (storedPurchases) {
          const list: number[] = JSON.parse(storedPurchases);
          hasBoughtInStorage = list.includes(productId);
        }
      } catch (e) {}

      setHasPurchased(hasBoughtInOrders || hasBoughtInStorage);
    }
  }, [productId, fetchProductDetail, fetchProducts, lang, orders]);

  useEffect(() => {
    if (currentProduct?.variants && currentProduct.variants.length > 0) {
      setSelectedVariantId(currentProduct.variants[0].id);
    } else {
      setSelectedVariantId(null);
    }
  }, [currentProduct]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  const product = currentProduct || products.find((p) => p.id === productId);
  const isLiked = isWishlisted(productId);

  const selectedVariant = product?.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.price || product?.base_price || 0;
  const oldPrice = product?.old_price || null;
  const hasDiscount = Boolean(oldPrice && oldPrice > currentPrice);
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice! - currentPrice) / oldPrice!) * 100)
    : 0;

  const categoryName = product?.category
    ? typeof product.category.name === 'object'
      ? (product.category.name as any)[lang] || product.category.name.uz
      : String(product.category.name || '')
    : t('nav_catalog');
  const name = product?.name ? (typeof product.name === 'object' ? (product.name as any)[lang] || product.name.uz : String(product.name)) : '';
  const desc = product?.description ? (typeof product.description === 'object' ? (product.description as any)[lang] || product.description.uz : String(product.description)) : '';

  const similarProducts = products.filter((p) => p.id !== productId).slice(0, 4);

  const itemInCart = cartItems.find((item) => item.product.id === productId);
  const currentCartQty = itemInCart ? itemInCart.quantity : 0;

  const handleAddToCart = () => {
    if (!product) return;
    triggerHaptic('medium');
    const variant = product.variants?.find((v) => v.id === selectedVariantId);
    addItemToCart(product as any, variant as any, 1);
  };
  const handleAddToCartFirstTime = handleAddToCart;

  const handleBuyNow = () => {
    if (!product) return;
    triggerHaptic('heavy');
    const variant = product.variants?.find((v) => v.id === selectedVariantId);
    if (currentCartQty === 0) {
      addItemToCart(product as any, variant as any, 1);
    }
    router.push('/cart');
  };
  const handleQuickBuy = handleBuyNow;

  const handleShare = () => {
    triggerHaptic('light');
    if (typeof window !== 'undefined' && navigator.share && product) {
      navigator
        .share({
          title: name,
          text: `${name} — Telegram do'konimizda xarid qiling!`,
          url: window.location.href,
        })
        .catch(() => {});
    }
  };

  const handleRemoveReviewPhoto = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
    setPhotoUploadError(null);
  };

  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setPhotoUploadError(null);

    if (reviewImages.length + files.length > 4) {
      setPhotoUploadError("Maksimal 4 tagacha rasm yuklashingiz mumkin.");
      return;
    }

    Array.from(files).forEach((file) => {
      // 1. Strict MIME Type Security Check
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setPhotoUploadError("Faqat JPG, PNG yoki WebP formatdagi rasmlar ruxsat etiladi.");
        return;
      }

      // 2. File Size Security Check (Max 5MB per image)
      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setPhotoUploadError("Har bir rasm hajmi 5 MB dan oshmasligi shart.");
        return;
      }

      // 3. Safe Base64 encoding
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReviewImages((prev) => [...prev, String(event.target?.result)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleOpenReviewModal = () => {
    triggerHaptic('light');
    if (!hasPurchased) {
      setShowNotEligibleModal(true);
      return;
    }
    // Anti-spam: 1 Buyer = 1 Review Check
    try {
      const alreadyReviewedLocally = localStorage.getItem(`has_reviewed_product_${productId}`);
      if (alreadyReviewedLocally) {
        setShowAlreadyReviewedModal(true);
        return;
      }
    } catch (e) {}

    setShowReviewModal(true);
  };

  const handleLikeReview = (reviewId: number) => {
    triggerHaptic('medium');
    if (likedReviews.includes(reviewId)) return;
    setLikedReviews((prev) => [...prev, reviewId]);
    toggleHelpfulInStore(reviewId);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    triggerHaptic('heavy');

    addReviewToStore({
      productId,
      productName: name || 'Mahsulot',
      user: reviewAuthor.trim(),
      rating: reviewRating,
      pros: reviewPros.trim() || 'Hammasi a\'lo',
      cons: reviewCons.trim() || 'Yo\'q',
      comment: reviewComment.trim(),
      images: reviewImages.length > 0 ? [...reviewImages] : undefined,
    });

    try {
      localStorage.setItem(`has_reviewed_product_${productId}`, 'true');
    } catch (e) {}

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewModal(false);
      setReviewComment('');
      setReviewPros('');
      setReviewCons('');
      setReviewImages([]);
      setPhotoUploadError(null);
    }, 2000);
  };

  const simulateBuyForTesting = () => {
    triggerHaptic('medium');
    try {
      const stored = localStorage.getItem('user_purchased_products');
      const list: number[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(productId)) {
        list.push(productId);
        localStorage.setItem('user_purchased_products', JSON.stringify(list));
      }
      setHasPurchased(true);
      setShowNotEligibleModal(false);
      setShowReviewModal(true);
    } catch (e) {}
  };

  if (isLoadingDetail || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-gray-500">{t('product_loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-28 sm:pb-16 animate-in fade-in max-w-7xl mx-auto px-0 sm:px-2">
      {/* 1. Breadcrumbs & Top Navigation Bar */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-500 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            router.back();
          }}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-transform duration-100 shrink-0 mr-1 shadow-2xs"
          aria-label="Orqaga"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
        </button>

        <Link href="/" className="hover:text-gray-950 transition-colors whitespace-nowrap">
          {t('nav_home')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link href="/catalog" className="hover:text-gray-950 transition-colors whitespace-nowrap">
          {t('nav_catalog')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="hover:text-gray-950 transition-colors whitespace-nowrap">
          {categoryName}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-950 font-semibold truncate max-w-[140px] sm:max-w-xs">
          {name}
        </span>
      </nav>

      {/* 2. Main 2-Column Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* LEFT COLUMN: Gallery (col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Large Image Box */}
          <div className="w-full aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200/80 relative shadow-xs group">
            <img
              src={product.images?.[activeImageIndex] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000'}
              alt={name}
              className="w-full h-full object-cover object-center select-none group-hover:scale-105 transition-transform duration-500"
            />

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase shadow-2xs">
                -{discountPercent}% {t('badge_sale')}
              </div>
            )}

            {/* Floating Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/90 border border-gray-200/80 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-gray-950 active:scale-95 transition-transform duration-100 shadow-2xs"
                title="Ulashish"
              >
                <Share2 className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  toggleWishlist(product.id);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/90 border border-gray-200/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 active:scale-95 transition-transform duration-100 shadow-2xs"
                title="Sevimlilar"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''} stroke-[2.2]`} />
              </button>
            </div>
          </div>

          {/* Thumbnails Carousel */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveImageIndex(idx);
                  }}
                  className={`w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden border transition-all active:scale-95 shrink-0 bg-white ${
                    activeImageIndex === idx
                      ? 'border-gray-900 ring-2 ring-gray-900/20 shadow-xs'
                      : 'border-gray-200/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Buy Box (col-span-5) */}
        <div className="lg:col-span-5 space-y-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200/70 shadow-xs">
          {/* Header Info */}
          <div className="space-y-1.5 border-b border-gray-100 pb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                {categoryName}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 ({approvedProductReviews.length > 0 ? approvedProductReviews.length : 3} {t('drawer_reviews_count')})</span>
              </div>
            </div>

            <h1 className="text-base sm:text-xl font-bold text-gray-950 leading-snug">
              {name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-gray-500 font-normal">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                {t('product_in_stock')}
              </span>
              <span>•</span>
              <span>{t('product_sold_count')}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-1 bg-gray-50 p-3.5 rounded-xl border border-gray-200/70">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
              {t('product_price_label')}
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-bold text-gray-950">
                {currentPrice.toLocaleString()}{' '}
                <span className="text-xs sm:text-sm font-normal text-gray-500">{t('currency')}</span>
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm font-normal text-gray-400 line-through">
                  {oldPrice!.toLocaleString()} {t('currency')}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-[11px] font-semibold text-emerald-600">
                {t('product_saved_amount')} {(oldPrice! - currentPrice).toLocaleString()} {t('currency')}
              </p>
            )}
          </div>

          {/* SKU Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">
                {t('product_variant_label')}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedVariantId(variant.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-100 active:scale-95 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 font-bold shadow-xs'
                          : 'bg-white dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span>{variant.size || variant.color || `Variant ${variant.id}`}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Desktop Buy Box — 100% Uzum Market State (State 1: Savatga qo'shish | State 2: Stepper + O'tish) */}
          <div className="hidden sm:block space-y-2.5 pt-1">
            {/* Quick buy + Wishlist */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickBuy}
                className="flex-1 h-11 bg-gray-100 dark:bg-[#1F293D] hover:bg-gray-200 dark:hover:bg-[#27354E] text-gray-900 dark:text-white font-bold text-xs rounded-lg border border-gray-200/80 dark:border-white/10 active:scale-95 transition-transform duration-100 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-gray-900 dark:text-white stroke-[2]" />
                <span>{t('product_quick_buy')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  toggleWishlist(product.id);
                }}
                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-[#1F293D] hover:bg-gray-200 dark:hover:bg-[#27354E] border border-gray-200/80 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 active:scale-95 transition-transform duration-100 shrink-0"
                title="Sevimlilar"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''} stroke-[2.2]`} />
              </button>
            </div>

            {/* State 1: 0 items in cart -> Big Full-Width "Savatga qo'shish" button */}
            {currentCartQty === 0 ? (
              <button
                type="button"
                onClick={handleAddToCartFirstTime}
                className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg font-bold text-xs sm:text-sm flex flex-col items-center justify-center active:scale-95 transition-transform duration-100 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 stroke-[2] text-white dark:text-gray-950" />
                  <span>{t('product_add_cart')}</span>
                </div>
                <span className="text-[10px] font-normal text-gray-300 dark:text-gray-600">{t('product_delivery_time')}</span>
              </button>
            ) : (
              /* State 2: > 0 items in cart -> Stepper [- X +] and [Savatga o'tish] */
              <div className="flex items-center gap-2.5">
                {/* Stepper [- 1 +] */}
                <div className="flex-1 h-12 px-3 rounded-lg bg-white dark:bg-[#1F293D] border border-gray-200 dark:border-white/10 flex items-center justify-between shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      if (currentCartQty <= 1) {
                        removeItemFromCart(product.id, selectedVariantId || undefined);
                      } else {
                        updateCartQuantity(product.id, currentCartQty - 1, selectedVariantId || undefined);
                      }
                    }}
                    className="w-8 h-8 rounded-md bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#27354E] text-gray-800 dark:text-white flex items-center justify-center font-bold text-base active:scale-95 transition-transform duration-100"
                    aria-label="Kamaytirish"
                  >
                    -
                  </button>

                  <span className="text-sm font-bold text-gray-950 dark:text-white min-w-[28px] text-center">
                    {currentCartQty} {t('pcs')}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      updateCartQuantity(product.id, currentCartQty + 1, selectedVariantId || undefined);
                    }}
                    className="w-8 h-8 rounded-md bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#27354E] text-gray-800 dark:text-white flex items-center justify-center font-bold text-base active:scale-95 transition-transform duration-100"
                    aria-label="Ko'paytirish"
                  >
                    +
                  </button>
                </div>

                {/* Savatga o'tish button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    router.push('/cart');
                  }}
                  className="flex-1 h-12 px-4 rounded-lg bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform duration-100 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2] text-white dark:text-gray-950" />
                  <span>{t('product_go_to_cart')}</span>
                </button>
              </div>
            )}

            {/* In stock / sold info badges */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-3 py-2 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                <span className="font-medium">{t('product_stock_available')}</span>
              </div>
            </div>
          </div>

          {/* Assurance Strips */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/10 text-left">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/80 dark:bg-[#161F30] border border-gray-200/70 dark:border-white/10">
              <Truck className="w-4 h-4 text-gray-900 dark:text-white shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-950 dark:text-white">{t('product_delivery_assurance_title')}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                  {t('product_delivery_assurance_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/80 dark:bg-[#161F30] border border-gray-200/70 dark:border-white/10">
              <ShieldCheck className="w-4 h-4 text-gray-900 dark:text-white shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-950 dark:text-white">{t('product_warranty_assurance_title')}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                  {t('product_warranty_assurance_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Description, Specs and Customer Reviews Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-xs p-4 sm:p-6 space-y-5">
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'desc', label: t('product_desc_title') },
            { id: 'specs', label: t('product_specs_title') },
            { id: 'reviews', label: `${t('product_reviews_title')} (${approvedProductReviews.length > 0 ? approvedProductReviews.length : 3})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs font-bold'
                  : 'bg-gray-50 dark:bg-[#161F30] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1F293D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal animate-in fade-in">
            <p>
              {desc ||
                'Ushbu mahsulot xalqaro sifat standartlariga to\'liq javob beradigan eng yuqori sifatli xomashyolardan tayyorlangan.'}
            </p>
            <div className="space-y-1.5 pt-1">
              <h4 className="font-bold text-gray-950 dark:text-white">{t('product_advantages')}</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 pl-1">
                {(() => {
                  const advList =
                    (product?.advantages && (product.advantages as any)[lang]) ||
                    product?.advantages?.uz ||
                    [
                      '100% original va sertifikatlangan mahsulot',
                      'Zamonaviy va ergonomik dizayn',
                      'Uzoq muddatli xizmat kafolati',
                    ];
                  return advList.map((adv: string, i: number) => (
                    <li key={i}>{adv}</li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Specs */}
        {activeTab === 'specs' && (
          <div className="space-y-2.5 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'Kategoriya', val: categoryName },
                { key: 'Model kodi', val: product?.specifications?.model_code || product?.sku || `SKU-${product?.id ? product.id * 892 : 1000}` },
                { key: 'Ishlab chiqaruvchi', val: product?.specifications?.brand || 'Premium Boutique Edition' },
                { key: 'Kafolat muddati', val: product?.specifications?.warranty || '12 oy rasmiy kafolat' },
                { key: 'Yetkazib berish', val: product?.specifications?.delivery || 'Butun O\'zbekiston bo\'ylab' },
                { key: 'Qadoq holati', val: product?.specifications?.package_condition || 'Muhrlangan original quti' },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/60 dark:border-white/10 text-xs"
                >
                  <span className="text-gray-400 font-medium">{spec.key}</span>
                  <span className="text-gray-950 dark:text-white font-bold">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Reviews Summary Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/70 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">4.9</div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal mt-0.5 block">
                    {approvedProductReviews.length > 0 ? approvedProductReviews.length : 3} {t('product_reviews_verified')}
                  </span>
                </div>
              </div>

              {/* Action Button: Opens modal or shows lock alert */}
              <button
                type="button"
                onClick={handleOpenReviewModal}
                className="px-3.5 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-100 shadow-xs shrink-0"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{t('product_leave_review')}</span>
              </button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {(approvedProductReviews.length > 0
                ? approvedProductReviews
                : [
                    {
                      id: 101,
                      productId,
                      productName: name,
                      user: 'Bobur Mirzayev',
                      date: '12-Avgust, 2026',
                      rating: 5,
                      pros: 'Sifati a\'lo darajada, rasmda ko\'rsatilgandek keldi.',
                      cons: 'Yo\'q, hammasi joyida.',
                      comment: 'Kuryer 2 soat ichida eshigimgacha yetkazib berdi. Rahmat!',
                      status: 'APPROVED' as const,
                      createdAt: Date.now() - 86400000,
                      images: [
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                      ],
                      adminReply: {
                        text: 'Hurmatli Bobur, xaridingiz va samimiy fikringiz uchun katta rahmat! Doim xizmatingizdamiz.',
                        date: '12-Avgust, 2026',
                        author: 'Do\'kon Ma\'muriyati',
                      },
                    },
                    {
                      id: 102,
                      productId,
                      productName: name,
                      user: 'Dilnoza Karimova',
                      date: '04-Avgust, 2026',
                      rating: 5,
                      pros: 'Qadoqlanishi juda nafis, materialiga gap yo\'q.',
                      cons: 'Mavjud emas.',
                      comment: 'Sovg\'a uchun olgandim, juda yoqdi. Yana buyurtma qilaman.',
                      status: 'APPROVED' as const,
                      createdAt: Date.now() - 172800000,
                    },
                    {
                      id: 103,
                      productId,
                      productName: name,
                      user: 'Jamshid Aliyev',
                      date: '28-Iyul, 2026',
                      rating: 4,
                      pros: 'Narxiga nisbatan sifati juda yaxshi.',
                      cons: 'O\'lchami biroz ixchamroq ekan.',
                      comment: 'Bir o\'lcham kattaroq olishni tavsiya qilaman.',
                      status: 'APPROVED' as const,
                      createdAt: Date.now() - 345600000,
                    },
                  ]
              ).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-[#111827] rounded-xl p-3.5 border border-gray-200/70 dark:border-white/10 shadow-2xs space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-950 dark:text-white">{rev.user}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[9px] font-bold">
                          {t('product_buyer_badge')}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>

                    <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                      {rev.pros && (
                        <p>
                          <strong className="text-gray-950 dark:text-white">{t('product_advantages')}</strong> {rev.pros}
                        </p>
                      )}
                      {rev.cons && (
                        <p>
                          <strong className="text-gray-950 dark:text-white">{t('product_disadvantages')}</strong> {rev.cons}
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400 italic mt-1 font-normal">"{rev.comment}"</p>
                    </div>

                    {/* Customer Photos Gallery */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        {rev.images.map((img, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedImagePreview(img)}
                            className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 cursor-pointer hover:opacity-90 hover:scale-105 transition-all bg-gray-50 dark:bg-gray-800"
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Official Store Admin Reply Banner */}
                    {rev.adminReply && (
                      <div className="mt-2 p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/40 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-indigo-900 dark:text-indigo-300">
                          <span className="flex items-center gap-1">
                            <span>👑</span>
                            <span>{t('admin_rev_store_reply_label')} ({rev.adminReply.author})</span>
                          </span>
                          <span className="text-gray-400 font-normal">{rev.adminReply.date}</span>
                        </div>
                        <p className="text-indigo-950 dark:text-indigo-200 text-xs font-medium pl-3 border-l-2 border-indigo-400">
                          {rev.adminReply.text}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Interactive Helpful / Like Button */}
                  <div className="pt-2.5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-normal">{t('product_helpful')}?</span>
                    <button
                      type="button"
                      onClick={() => handleLikeReview(rev.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                        likedReviews.includes(rev.id)
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-gray-50 dark:bg-[#161F30] hover:bg-gray-100 dark:hover:bg-[#1F293D] text-gray-600 dark:text-gray-400 border border-gray-200/80 dark:border-white/10'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${likedReviews.includes(rev.id) ? 'fill-emerald-600 dark:fill-emerald-400 text-emerald-600' : ''}`} />
                      <span>{t('product_helpful')} {(rev as any).helpfulCount ? `(${(rev as any).helpfulCount})` : ''}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Recommended Similar Products Carousel */}
      {similarProducts.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm sm:text-base font-bold text-gray-950 tracking-tight">
              {t('product_similar_title')}
            </h3>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1"
            >
              <span>{t('home_all')}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {similarProducts.map((prod) => {
              const liked = isWishlisted(prod.id);
              const itemInCart = cartItems.find((item) => item.product.id === prod.id);
              const cartQty = itemInCart ? itemInCart.quantity : 0;

              return (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isLiked={liked}
                  cartQuantity={cartQty}
                  onOpenDrawer={(id) => router.push(`/product/${id}`)}
                  onToggleWishlist={(id) => toggleWishlist(id)}
                  onAddToCart={(item, e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    triggerHaptic('medium');
                    const defVar = item.variants && item.variants[0];
                    addItemToCart(item as any, defVar as any, 1);
                  }}
                  onUpdateQuantity={(id, q) => updateCartQuantity(id, q)}
                  onRemoveFromCart={(id) => removeItemFromCart(id)}
                  triggerHaptic={triggerHaptic}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Mobile & Tablet Sticky Bottom Buy Bar (100% Uzum Market State) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 p-3 shadow-2xl pb-safe">
        {currentCartQty === 0 ? (
          /* Mobile State 1: Price preview + Full "Savatga qo'shish" button */
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-gray-400 block leading-tight font-semibold">{t('product_price_label')}</span>
              <div className="text-base font-bold text-gray-950 leading-tight">
                {currentPrice.toLocaleString()} <span className="text-[11px] font-normal text-gray-500">{t('currency')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCartFirstTime}
              className="flex-1 h-11 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-100 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span>{t('product_add_cart')}</span>
            </button>
          </div>
        ) : (
          /* Mobile State 2: Stepper [- 1 +] and [Savatga o'tish] button */
          <div className="flex items-center justify-between gap-2.5">
            {/* Stepper [- 1 +] */}
            <div className="flex-1 h-11 px-2.5 rounded-lg bg-white border border-gray-200 flex items-center justify-between shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  if (currentCartQty <= 1) {
                    removeItemFromCart(product.id, selectedVariantId || undefined);
                  } else {
                    updateCartQuantity(product.id, currentCartQty - 1, selectedVariantId || undefined);
                  }
                }}
                className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm active:scale-95"
              >
                -
              </button>

              <span className="text-xs font-bold text-gray-950 min-w-[20px] text-center">
                {currentCartQty} {t('pcs')}
              </span>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  updateCartQuantity(product.id, currentCartQty + 1, selectedVariantId || undefined);
                }}
                className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm active:scale-95"
              >
                +
              </button>
            </div>

            {/* Savatga o'tish */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                router.push('/cart');
              }}
              className="flex-1 h-11 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span>{t('product_go_to_cart')}</span>
            </button>
          </div>
        )}
      </div>

      {/* 🔒 MODAL 1: "Only Verified Buyers Can Review" Security Modal */}
      {showNotEligibleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-sm rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-950 dark:text-white">
                {t('product_modal_not_eligible_title')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
                {t('product_modal_not_eligible_desc')}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowNotEligibleModal(false);
                  handleAddToCart();
                }}
                className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold text-xs rounded-lg active:scale-95 transition-transform duration-100 shadow-xs flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Mahsulotni xarid qilish</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNotEligibleModal(false)}
                className="w-full py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-lg active:scale-95 transition-transform duration-100"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 MODAL 1.5: "Already Reviewed" Anti-Spam Modal */}
      {showAlreadyReviewedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-sm rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-950 dark:text-white">
                Siz allaqachon sharh qoldirgansiz
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
                Ushbu mahsulot uchun sizning sharhingiz qabul qilingan. Tizim xavfsizligi va haqqoniyligi uchun har bir xaridor 1 ta tovar uchun faqat 1 ta sharh qoldira oladi.
              </p>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAlreadyReviewedModal(false)}
                className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold text-xs rounded-lg active:scale-95 transition-transform duration-100 shadow-xs"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ MODAL 2: Interactive Review Submission Modal (For Verified Buyers) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[10px] font-bold">
                  ✓ {t('product_buyer_badge')}
                </span>
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('product_modal_review_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-gray-950 dark:text-white">{t('product_modal_review_success')}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Sharhingiz qabul qilindi va ma'muriyat moderatsiyasidan so'ng e'lon qilinadi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5">
                {/* 1. Rating Stars */}
                <div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setReviewRating(star);
                        }}
                        className="p-1 active:scale-125 transition-transform duration-100"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-900 dark:text-white ml-2">
                      {reviewRating} / 5
                    </span>
                  </div>
                </div>

                {/* 2. Author Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    {t('product_modal_review_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="Ismingiz..."
                    className="w-full text-xs bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white"
                  />
                </div>

                {/* 3. Pros */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    {t('product_modal_review_pros')}
                  </label>
                  <input
                    type="text"
                    value={reviewPros}
                    onChange={(e) => setReviewPros(e.target.value)}
                    placeholder="Sifatli mato, tez yetkazish..."
                    className="w-full text-xs bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white"
                  />
                </div>

                {/* 4. Cons */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    {t('product_modal_review_cons')}
                  </label>
                  <input
                    type="text"
                    value={reviewCons}
                    onChange={(e) => setReviewCons(e.target.value)}
                    placeholder="Mavjud emas / Yo'q..."
                    className="w-full text-xs bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white"
                  />
                </div>

                {/* 5. Comment */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    {t('product_modal_review_comment')} *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Mahsulot haqidagi samimiy fikringiz..."
                    className="w-full text-xs bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white resize-none"
                  />
                </div>

                {/* 6. Photo Attachments with Strict Security */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                      {t('admin_rev_photos_attached')}
                    </label>
                    <span className="text-[10px] text-gray-400">
                      {reviewImages.length} / 4 ta
                    </span>
                  </div>

                  {photoUploadError && (
                    <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{photoUploadError}</span>
                    </div>
                  )}

                  {/* Thumbnail Previews */}
                  {reviewImages.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {reviewImages.map((img, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveReviewPhoto(idx)}
                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {reviewImages.length < 4 && (
                    <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white rounded-xl cursor-pointer bg-gray-50 dark:bg-[#161F30] text-gray-600 dark:text-gray-300 transition-all text-center">
                      <Camera className="w-4 h-4" />
                      <span className="text-xs font-semibold">{t('admin_modal_upload_images')}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        multiple
                        onChange={handleReviewPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  <span className="text-[10px] text-gray-400 block">
                    Faqat JPG, PNG, WebP formatdagi xavfsiz rasmlar (Har biri maks. 5 MB)
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold text-xs rounded-lg shadow-sm active:scale-95 transition-transform duration-100"
                >
                  {t('product_modal_review_submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 🖼️ Customer Photo Lightbox */}
      {selectedImagePreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImagePreview(null)}
        >
          <div className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
            <img
              src={selectedImagePreview}
              alt="Sharh fotosi"
              className="w-full h-full object-contain max-h-[85vh] mx-auto"
            />
            <button
              type="button"
              onClick={() => setSelectedImagePreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
