'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  MessageSquare,
  Tag,
  Search,
  Printer,
  DollarSign,
  Plus,
  Trash2,
  X,
  Check,
  Ban,
  Image as ImageIcon,
  Sparkles,
  Bell,
  Send,
  Eye,
  EyeOff,
  Grid,
  Settings,
  Sun,
  Moon,
  Truck,
  CreditCard,
  Store,
  CheckCircle2,
  ExternalLink,
  Menu,
  BarChart3,
  Download,
  Users,
  ShieldCheck,
  Upload,
  UserCheck,
  UserX,
  Camera,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  UserPlus,
  AlertCircle,
  Crown,
  ShieldAlert,
  SendHorizontal,
  Flame,
  FileSpreadsheet,
  Sliders,
  Phone,
  AlertTriangle,
  Trophy,
  Boxes,
  TrendingUp,
  ArrowUpRight,
  Scale,
  Calendar,
  LineChart,
  Zap,
  PieChart,
  AlignLeft,
  Medal,
  Copy,
  MapPin,
  CheckSquare,
  Square,
  Filter,
  ArrowUpDown,
  History,
  User,
  Clock,
  ArrowRight,
  FileText,
  CheckCircle,
  Pencil,
  Layers,
  ListFilter,
  CheckCheck,
  Star,
  RefreshCw,
  LayoutGrid,
  Percent,
  Home,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useBannerStore } from '@/store/useBannerStore';
import { useCategoryStore, CategoryItemStore } from '@/store/useCategoryStore';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useOrderStore, OrderItemRecord, OrderItemProduct, OrderActivityLog } from '@/store/useOrderStore';
import { useReviewStore } from '@/store/useReviewStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useAuditStore } from '@/store/useAuditStore';
import { useStaffStore, StaffRole } from '@/store/useStaffStore';
import { useCustomerStore } from '@/store/useCustomerStore';

interface PromocodeAdmin {
  id: number;
  code: string;
  discount: number;
  minOrder: number;
  usedCount: number;
  maxUsage: number;
}

export default function AdminConsolePage() {
  const { lang, setLang, t } = useLanguageStore();
  const { theme, setTheme, initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 6 Primary Hubs
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'catalog' | 'customers' | 'marketing' | 'settings'
  >('dashboard');

  // Sub-tabs for Hubs
  const [catalogSubTab, setCatalogSubTab] = useState<'products' | 'categories' | 'reviews'>('products');
  const [marketingSubTab, setMarketingSubTab] = useState<'banners' | 'promocodes' | 'notifications'>('banners');
  const [settingsSubTab, setSettingsSubTab] = useState<'store' | 'staff' | 'audit'>('store');

  // Modals & Navigation States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMoreSheetOpen, setMobileMoreSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [orderDateFilter, setOrderDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'>('ALL');
  const [deliveryFilter, setDeliveryFilter] = useState<'ALL' | 'courier' | 'pickup'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PAYME' | 'CLICK' | 'CASH'>('ALL');
  const [orderSort, setOrderSort] = useState<'NEWEST' | 'OLDEST' | 'PRICE_DESC' | 'PRICE_ASC'>('NEWEST');
  const [openOrderFilterDropdown, setOpenOrderFilterDropdown] = useState<'date' | 'delivery' | 'payment' | 'sort' | null>(null);
  const [openProductCardMenuId, setOpenProductCardMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.custom-filter-dropdown-container')) {
        setOpenOrderFilterDropdown(null);
        setOpenProductFilterDropdown(null);
        setOpenProductFormCategoryDropdown(false);
        setOpenProductFormBadgeDropdown(false);
        setOpenCategoryFormParentDropdown(false);
        setOpenReviewFilterDropdown(null);
        setOpenProductCardMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [viewingOrder, setViewingOrder] = useState<OrderItemRecord | null>(null);
  const [showManualOrderModal, setShowManualOrderModal] = useState<boolean>(false);
  const [copiedPhoneAlert, setCopiedPhoneAlert] = useState<boolean>(false);
  const [customerFilter, setCustomerFilter] = useState<string>('ALL');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM'>('WEEK');
  const [isComparingPeriod, setIsComparingPeriod] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string>('2026-01-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-20');
  const [showCustomDateModal, setShowCustomDateModal] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'AREA' | 'BAR'>('AREA');
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number | null>(null);
  const [hoveredPaymentKey, setHoveredPaymentKey] = useState<string | null>(null);
  const [paymentChartType, setPaymentChartType] = useState<'DONUT' | 'BAR'>('DONUT');

  // Cancel Reason & Courier Assignment Modals
  const [cancelModalOrder, setCancelModalOrder] = useState<OrderItemRecord | null>(null);
  const [cancelReasonSelected, setCancelReasonSelected] = useState<string>('Mijoz rad etdi');
  const [customCancelReason, setCustomCancelReason] = useState<string>('');
  const [courierAssignModalOrder, setCourierAssignModalOrder] = useState<OrderItemRecord | null>(null);
  const [selectedCourierName, setSelectedCourierName] = useState<string>('');
  const [reorderToast, setReorderToast] = useState<boolean>(false);

  // Manual Order Creation Form State
  const [manualCustomerName, setManualCustomerName] = useState<string>('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState<string>('');
  const [manualDeliveryMethod, setManualDeliveryMethod] = useState<'courier' | 'pickup'>('courier');
  const [manualAddress, setManualAddress] = useState<string>('');
  const [manualPaymentType, setManualPaymentType] = useState<'PAYME' | 'CLICK' | 'CASH'>('CASH');
  const [manualCustomerComment, setManualCustomerComment] = useState<string>('');
  const [manualItems, setManualItems] = useState<OrderItemProduct[]>([]);
  const [manualProductSearch, setManualProductSearch] = useState<string>('');
  const [manualSelectedProductId, setManualSelectedProductId] = useState<string>('');
  const [manualSelectedVariant, setManualSelectedVariant] = useState<string>('');
  const [manualItemQuantity, setManualItemQuantity] = useState<number>(1);
  const [manualOrderSuccessAlert, setManualOrderSuccessAlert] = useState<boolean>(false);
  const [manualFormSubmitted, setManualFormSubmitted] = useState<boolean>(false);

  // Stores
  const {
    products: storeProducts,
    addProduct: addProductToStore,
    bulkAddProducts: bulkAddProductsToStore,
    duplicateProduct: duplicateProductInStore,
    updateProduct: updateProductInStore,
    toggleProductPopular,
    toggleProductShowOnHome,
    bulkSetPopular,
    bulkSetShowOnHome,
    inlineUpdateStockAndPrice: inlineUpdateStockAndPriceInStore,
    quickUpdateStock: quickUpdateStockInStore,
    deleteProduct: deleteProductFromStore,
    deductStock,
    restoreStock,
  } = useProductStore();

  const {
    orders: storeOrders,
    addOrder: addOrderToStore,
    updateOrderStatus: updateOrderStatusInStore,
    updateOrderPaymentStatus: updateOrderPaymentStatusInStore,
    assignCourier: assignCourierInStore,
    deleteOrder: deleteOrderFromStore,
    bulkUpdateStatus: bulkUpdateStatusInStore,
    bulkDeleteOrders: bulkDeleteOrdersInStore,
  } = useOrderStore();

  const {
    reviews: storeReviews,
    updateReviewStatus: updateReviewStatusInStore,
    addAdminReply: addAdminReplyInStore,
    deleteReview: deleteReviewFromStore,
  } = useReviewStore();

  const {
    categories: storeCategories,
    addCategory,
    updateCategory: updateCategoryInStore,
    removeCategory,
    toggleCategoryActive,
    toggleCategoryShowOnHome,
    reorderCategory: reorderCategoryInStore,
  } = useCategoryStore();

  const {
    banners: adminBanners,
    addBanner,
    removeBanner,
    toggleBannerActive,
  } = useBannerStore();

  const { customers: customerList, updateCustomerStatus, deleteCustomer } = useCustomerStore();
  const { logs: auditLogs, addLog, clearLogs } = useAuditStore();
  const { staff: staffList, addStaff, removeStaff, toggleStaffActive } = useStaffStore();
  const addNotificationToStore = useNotificationStore((state) => state.addNotification);
  const settings = useSettingsStore();
  const [settingsSavedAlert, setSettingsSavedAlert] = useState<boolean>(false);
  const [settingsForm, setSettingsForm] = useState({
    storeName: settings.storeName || 'PREMIUM STORE',
    supportPhone: settings.supportPhone || '+998 (90) 123-45-67',
    telegramSupport: settings.telegramSupport || 'tme_support_bot',
    workingHours: settings.workingHours || '09:00 - 22:00',
    deliveryFee: settings.deliveryFee ?? 25000,
    freeDeliveryThreshold: settings.freeDeliveryThreshold ?? 300000,
    enablePayme: settings.enablePayme !== false,
    enableClick: settings.enableClick !== false,
    enableCash: settings.enableCash !== false,
    geminiApiKey: settings.geminiApiKey || '',
    geminiModel: settings.geminiModel || 'gemini-1.5-flash',
    maxReviewsPerProduct: settings.maxReviewsPerProduct || 10,
  });

  useEffect(() => {
    setSettingsForm({
      storeName: settings.storeName || 'PREMIUM STORE',
      supportPhone: settings.supportPhone || '+998 (90) 123-45-67',
      telegramSupport: settings.telegramSupport || 'tme_support_bot',
      workingHours: settings.workingHours || '09:00 - 22:00',
      deliveryFee: settings.deliveryFee ?? 25000,
      freeDeliveryThreshold: settings.freeDeliveryThreshold ?? 300000,
      enablePayme: settings.enablePayme !== false,
      enableClick: settings.enableClick !== false,
      enableCash: settings.enableCash !== false,
      geminiApiKey: settings.geminiApiKey || '',
      geminiModel: settings.geminiModel || 'gemini-1.5-flash',
      maxReviewsPerProduct: settings.maxReviewsPerProduct || 10,
    });
  }, [settings.storeName, settings.supportPhone, settings.telegramSupport, settings.workingHours, settings.deliveryFee, settings.freeDeliveryThreshold, settings.enablePayme, settings.enableClick, settings.enableCash, settings.geminiApiKey, settings.geminiModel, settings.maxReviewsPerProduct]);
  const exportOrdersToCSV = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

    // Export either selected orders, or the currently filtered orders
    const targetOrders =
      selectedOrderIds.length > 0
        ? storeOrders.filter((o) => selectedOrderIds.includes(o.id))
        : storeOrders
            .filter((o) => (statusFilter === 'ALL' ? true : o.status === statusFilter))
            .filter((o) => (deliveryFilter === 'ALL' ? true : (o.deliveryMethod || 'courier') === deliveryFilter))
            .filter((o) => (paymentFilter === 'ALL' ? true : (o.paymentType || 'CASH') === paymentFilter))
            .filter((o) => {
              if (orderDateFilter === 'TODAY') return o.createdAt >= startOfToday;
              if (orderDateFilter === 'WEEK') return o.createdAt >= startOfWeek;
              if (orderDateFilter === 'MONTH') return o.createdAt >= startOfMonth;
              if (orderDateFilter === 'YEAR') return o.createdAt >= startOfYear;
              return true;
            })
            .filter((o) =>
              searchQuery
                ? o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  o.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  o.phone.includes(searchQuery) ||
                  (o.location && o.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (o.courierName && o.courierName.toLowerCase().includes(searchQuery.toLowerCase()))
                : true
            );

    if (targetOrders.length === 0) {
      alert("Eksport qilish uchun buyurtmalar topilmadi!");
      return;
    }

    const headers = [
      'Buyurtma ID',
      'Mijoz Ismi',
      'Telefon Raqami',
      'Yetkazish Usuli',
      'Manzil',
      'Tovarlar (Tarkibi)',
      'Tovarlar Soni',
      'Jami Summa (UZS)',
      'To\'lov Usuli',
      'To\'lov Holati',
      'Buyurtma Holati',
      'Kuryer',
      'Sana va Vaqt',
      'Mijoz Izohi',
    ];

    const escapeCsv = (val: any) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = targetOrders.map((o) => {
      const itemsStr =
        o.items && o.items.length > 0
          ? o.items.map((it) => `${it.name}${it.variant ? ` (${it.variant})` : ''} x${it.quantity}`).join('; ')
          : 'Tovarlar';

      const deliveryStr = o.deliveryMethod === 'pickup' ? 'Olib ketish (PVZ)' : 'Kuryer orqali';
      const paymentStatusStr =
        o.paymentStatus === 'PAID' ? 'To\'langan' : o.paymentStatus === 'REFUNDED' ? 'Qaytarilgan' : 'Kutilmoqda';
      const orderStatusStr =
        o.status === 'NEW'
          ? 'Yangi'
          : o.status === 'DELIVERING'
          ? 'Kuryerda'
          : o.status === 'COMPLETED'
          ? 'Yetkazildi'
          : 'Bekor qilindi';

      const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString('uz-UZ') : o.date;

      return [
        escapeCsv(o.id),
        escapeCsv(o.user),
        escapeCsv(o.phone),
        escapeCsv(deliveryStr),
        escapeCsv(o.location || 'Markaziy Filial'),
        escapeCsv(itemsStr),
        escapeCsv(o.itemsCount || o.items?.length || 1),
        escapeCsv(o.total),
        escapeCsv(o.paymentType || 'CASH'),
        escapeCsv(paymentStatusStr),
        escapeCsv(orderStatusStr),
        escapeCsv(o.courierName || 'Tayinlanmagan'),
        escapeCsv(dateStr),
        escapeCsv(o.customerComment || ''),
      ].join(';');
    });

    // \uFEFF BOM ensures Microsoft Excel properly renders Uzbek Latin & Cyrillic characters
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateTag = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Buyurtmalar_${orderDateFilter !== 'ALL' ? orderDateFilter.toLowerCase() + '_' : ''}${dateTag}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addLog({
      action: 'Buyurtmalar CSV formatida yuklab olindi',
      module: 'Orders',
      actor: 'Super Admin',
      details: `${targetOrders.length} ta buyurtma to'liq ma'lumotlar bilan eksport qilindi`,
      type: 'INFO',
    });
  };

  // Device File Upload Handler (ONLY Device Files, NO URLs)
  const handleDeviceFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Rasm hajmi 5MB dan oshmasligi kerak!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Broadcast Notification State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'PROMO' | 'ORDER' | 'SYSTEM'>('PROMO');
  const [broadcastAudience] = useState<'ALL' | 'BUYERS' | 'NON_BUYERS'>('ALL');
  const [broadcastImage, setBroadcastImage] = useState('');
  const [broadcastActionText, setBroadcastActionText] = useState('');
  const [broadcastActionLink] = useState('/catalog');
  const [broadcastSuccessAlert, setBroadcastSuccessAlert] = useState(false);

  // ==========================================
  // CATALOG HUB ENTERPRISE STATES (SPRINT 11)
  // ==========================================
  // Products Filters & Display
  const [productCategoryFilter, setProductCategoryFilter] = useState<number | 'ALL'>('ALL');
  const [productStockFilter, setProductStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [productBadgeFilter, setProductBadgeFilter] = useState<'ALL' | 'NEW' | 'TOP' | 'SALE' | 'NONE' | 'POPULAR' | 'HOME'>('ALL');
  const [productSortFilter, setProductSortFilter] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'STOCK_ASC' | 'STOCK_DESC'>('NEWEST');
  const [productViewMode, setProductViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [openProductFilterDropdown, setOpenProductFilterDropdown] = useState<'category' | 'stock' | 'badge' | 'sort' | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [quickStockToast, setQuickStockToast] = useState<string | null>(null);

  // Universal Product Create / Edit Modal State (3-Tab Architecture)
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [productModalActiveTab, setProductModalActiveTab] = useState<'general' | 'variants' | 'marketing'>('general');
  const [productModalLangTab, setProductModalLangTab] = useState<'uz' | 'ru' | 'en'>('uz');
  const [productHasVariants, setProductHasVariants] = useState<boolean>(false);
  const [productSingleStock, setProductSingleStock] = useState<string>('10');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productFormNameUz, setProductFormNameUz] = useState<string>('');
  const [productFormNameRu, setProductFormNameRu] = useState<string>('');
  const [productFormNameEn, setProductFormNameEn] = useState<string>('');
  const [productFormDescUz, setProductFormDescUz] = useState<string>('');
  const [productFormDescRu, setProductFormDescRu] = useState<string>('');
  const [productFormDescEn, setProductFormDescEn] = useState<string>('');
  const [productFormCategoryId, setProductFormCategoryId] = useState<number>(1);
  const [productFormBasePrice, setProductFormBasePrice] = useState<string>('180000');
  const [productFormCostPrice, setProductFormCostPrice] = useState<string>('110000');
  const [productFormOldPrice, setProductFormOldPrice] = useState<string>('');
  const [productFormBadge, setProductFormBadge] = useState<'NEW' | 'TOP' | 'SALE' | 'NONE'>('NEW');
  const [productFormIsPopular, setProductFormIsPopular] = useState<boolean>(false);
  const [productFormShowOnHome, setProductFormShowOnHome] = useState<boolean>(true);
  const [productFormTags, setProductFormTags] = useState<string>('premium, yangi');
  const [productFormImages, setProductFormImages] = useState<string[]>([]);
  const [productFormVariants, setProductFormVariants] = useState<
    { id: number; size: string; color: string; price: string; stock_count: string; cost_price?: string }[]
  >([
    { id: 1, size: 'Standard', color: 'Default', price: '180000', stock_count: '10', cost_price: '110000' },
  ]);
  const [productFormAdvantagesUz, setProductFormAdvantagesUz] = useState<string>('100% original va sifatli mato\nZamonaviy va ergonomik dizayn\nUzoq muddatli xizmat kafolati');
  const [productFormAdvantagesRu, setProductFormAdvantagesRu] = useState<string>('100% оригинальный продукт\nСовременный эргономичный дизайн\nДолговечность и гарантия');
  const [productFormAdvantagesEn, setProductFormAdvantagesEn] = useState<string>('100% genuine certified product\nModern ergonomic design\nLong-lasting quality guarantee');
  const [productFormBrand, setProductFormBrand] = useState<string>('Premium Boutique Edition');
  const [productFormModelCode, setProductFormModelCode] = useState<string>('');
  const [productFormWarranty, setProductFormWarranty] = useState<string>('12 oy rasmiy kafolat');
  const [productFormDelivery, setProductFormDelivery] = useState<string>('Butun O\'zbekiston bo\'ylab');
  const [productFormPackage, setProductFormPackage] = useState<string>('Muhrlangan original quti');
  const [isTranslatingProduct, setIsTranslatingProduct] = useState<boolean>(false);
  const [isAiVisionGenerating, setIsAiVisionGenerating] = useState<boolean>(false);
  const [openProductFormCategoryDropdown, setOpenProductFormCategoryDropdown] = useState<boolean>(false);
  const [openProductFormBadgeDropdown, setOpenProductFormBadgeDropdown] = useState<boolean>(false);
  const [productSavedAlert, setProductSavedAlert] = useState<boolean>(false);
  const [productClonedToast, setProductClonedToast] = useState<string | null>(null);

  // CSV Bulk Import & Export States
  const [showCsvImportModal, setShowCsvImportModal] = useState<boolean>(false);
  const [csvImportFile, setCsvImportFile] = useState<File | null>(null);
  const [csvImportText, setCsvImportText] = useState<string>('');
  const [csvImportLoading, setCsvImportLoading] = useState<boolean>(false);
  const [csvExportToast, setCsvExportToast] = useState<string | null>(null);
  const [csvImportToast, setCsvImportToast] = useState<string | null>(null);

  // Table Inline Quick Edit State
  const [inlineEditingProductId, setInlineEditingProductId] = useState<number | null>(null);
  const [inlineEditField, setInlineEditField] = useState<'price' | 'stock' | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState<string>('');

  // Category Add / Edit Form State
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryFormNameUz, setCategoryFormNameUz] = useState<string>('');
  const [categoryFormNameRu, setCategoryFormNameRu] = useState<string>('');
  const [categoryFormNameEn, setCategoryFormNameEn] = useState<string>('');
  const [categoryFormImage, setCategoryFormImage] = useState<string>('');
  const [categoryFormParentId, setCategoryFormParentId] = useState<number | null>(null);
  const [categoryFormShowOnHome, setCategoryFormShowOnHome] = useState<boolean>(true);
  const [openCategoryFormParentDropdown, setOpenCategoryFormParentDropdown] = useState<boolean>(false);
  const [categorySavedAlert, setCategorySavedAlert] = useState<boolean>(false);

  // Showcase & Popular Manager States
  const [showcaseSelectedAddProductId, setShowcaseSelectedAddProductId] = useState<string>('');
  const [showcaseSelectedAddHomeProductId, setShowcaseSelectedAddHomeProductId] = useState<string>('');
  const [showcaseToast, setShowcaseToast] = useState<string | null>(null);

  // Reviews Moderation & Reply States
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<'ALL' | '5' | '4' | '3' | '2_1'>('ALL');
  const [openReviewFilterDropdown, setOpenReviewFilterDropdown] = useState<'status' | 'rating' | null>(null);
  const [reviewActionToast, setReviewActionToast] = useState<string | null>(null);
  const [showReviewReplyModal, setShowReviewReplyModal] = useState<boolean>(false);
  const [replyingReviewId, setReplyingReviewId] = useState<number | null>(null);
  const [reviewReplyAuthor, setReviewReplyAuthor] = useState<string>("Do'kon Ma'muriyati");
  const [reviewReplyText, setReviewReplyText] = useState<string>('');
  const [selectedReviewImagePreview, setSelectedReviewImagePreview] = useState<string | null>(null);

  // Universal Premium Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: "O'chirish",
    cancelText: 'Bekor qilish',
    variant: 'danger',
    onConfirm: () => {},
  });

  const openConfirmDialog = ({
    title,
    description,
    confirmText,
    cancelText,
    variant = 'danger',
    onConfirm,
  }: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      confirmText: confirmText || "O'chirish",
      cancelText: cancelText || t('cancel') || "Bekor qilish",
      variant,
      onConfirm,
    });
  };

  // Banner Add Form State
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('/catalog');

  // Promo Add Form State
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('15');

  // Staff Add Form State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('MANAGER');

  // Promocodes List State
  const [promocodesList, setPromocodesList] = useState<PromocodeAdmin[]>([
    { id: 1, code: 'SPRING2026', discount: 15, minOrder: 150000, usedCount: 42, maxUsage: 100 },
    { id: 2, code: 'WELCOME10', discount: 10, minOrder: 100000, usedCount: 89, maxUsage: 500 },
    { id: 3, code: 'VIP20', discount: 20, minOrder: 300000, usedCount: 15, maxUsage: 50 },
  ]);

  // Analytics Dynamic Computations & Period Datasets
  const weeklyData =
    analyticsPeriod === 'TODAY'
      ? [
          { day: '09:00', amount: 35000, prevAmount: 28000 },
          { day: '12:00', amount: 80000, prevAmount: 65000 },
          { day: '15:00', amount: 120000, prevAmount: 95000 },
          { day: '18:00', amount: 190000, prevAmount: 155000 },
          { day: '21:00', amount: 95000, prevAmount: 82000 },
        ]
      : analyticsPeriod === 'MONTH'
      ? [
          { day: '1-Hafta', amount: 1800000, prevAmount: 1500000 },
          { day: '2-Hafta', amount: 2400000, prevAmount: 2000000 },
          { day: '3-Hafta', amount: 2100000, prevAmount: 1750000 },
          { day: '4-Hafta', amount: 2600000, prevAmount: 2200000 },
        ]
      : analyticsPeriod === 'YEAR'
      ? [
          { day: 'Yan', amount: 1800000, prevAmount: 1400000 },
          { day: 'Fev', amount: 2200000, prevAmount: 1750000 },
          { day: 'Mar', amount: 3100000, prevAmount: 2400000 },
          { day: 'Apr', amount: 2900000, prevAmount: 2250000 },
          { day: 'May', amount: 3800000, prevAmount: 3000000 },
          { day: 'Iyun', amount: 4200000, prevAmount: 3350000 },
          { day: 'Iyul', amount: 3900000, prevAmount: 3100000 },
          { day: 'Avg', amount: 4500000, prevAmount: 3600000 },
          { day: 'Sen', amount: 3600000, prevAmount: 2900000 },
          { day: 'Okt', amount: 4100000, prevAmount: 3250000 },
          { day: 'Noy', amount: 4800000, prevAmount: 3800000 },
          { day: 'Dek', amount: 6500000, prevAmount: 5000000 },
        ]
      : analyticsPeriod === 'CUSTOM'
      ? [
          { day: '1-10 Kun', amount: 3800000, prevAmount: 3200000 },
          { day: '11-20 Kun', amount: 5100000, prevAmount: 4300000 },
          { day: '21-30 Kun', amount: 4550000, prevAmount: 3900000 },
        ]
      : [
          { day: 'Dush', amount: 120000, prevAmount: 95000 },
          { day: 'Sesh', amount: 240000, prevAmount: 180000 },
          { day: 'Chor', amount: 190000, prevAmount: 160000 },
          { day: 'Pay', amount: 310000, prevAmount: 250000 },
          { day: 'Juma', amount: 450000, prevAmount: 380000 },
          { day: 'Shan', amount: 580000, prevAmount: 490000 },
          { day: 'Yak', amount: 290000, prevAmount: 240000 },
        ];

  // Exact Mathematical Sums and Comparison Delta
  const displayRevenue = weeklyData.reduce((sum, d) => sum + d.amount, 0);
  const prevPeriodRevenue = weeklyData.reduce((sum, d) => sum + (d.prevAmount || 0), 0);
  const totalRevenue = displayRevenue;

  const displayOrdersCount =
    analyticsPeriod === 'TODAY'
      ? 4
      : analyticsPeriod === 'MONTH'
      ? 18
      : analyticsPeriod === 'YEAR'
      ? 288
      : analyticsPeriod === 'CUSTOM'
      ? 78
      : storeOrders.length;

  const displayComparisonDelta =
    prevPeriodRevenue > 0
      ? `+${(((displayRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100).toFixed(1)}%`
      : '+18.5%';

  const maxWeeklyAmount = Math.max(
    ...weeklyData.flatMap((d) => [d.amount, isComparingPeriod ? d.prevAmount || 0 : 0]),
    100000
  );

  const pendingOrdersCount = storeOrders.filter((o) => o.status === 'NEW').length;
  const pendingReviewsCount = storeReviews.filter((r) => r.status === 'PENDING').length;
  const vipClientsCount = customerList.filter((c) => c.status === 'VIP').length;
  const averageOrderCheck = displayOrdersCount > 0 ? Math.round(displayRevenue / displayOrdersCount) : 0;

  // Chart Peak & Average Mini-HUD
  const peakChartItem = [...weeklyData].sort((a, b) => b.amount - a.amount)[0] || weeklyData[0];
  const averageIntervalRevenue =
    weeklyData.length > 0
      ? Math.round(weeklyData.reduce((acc, curr) => acc + curr.amount, 0) / weeklyData.length)
      : 0;

  // SVG Area/Spline Curve Generator
  const svgWidth = 720;
  const svgHeight = 200;
  const padLeft = 58;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 32;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const slotWidth = plotWidth / Math.max(1, weeklyData.length);

  const chartPoints = weeklyData.map((d, idx) => {
    const x = padLeft + (idx + 0.5) * slotWidth;
    const y = padTop + plotHeight - (d.amount / maxWeeklyAmount) * plotHeight;
    const prevY = padTop + plotHeight - ((d.prevAmount || 0) / maxWeeklyAmount) * plotHeight;
    return { x, y, prevY, d, idx };
  });

  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const smoothLinePath = createSmoothPath(chartPoints.map((p) => ({ x: p.x, y: p.y })));
  const smoothAreaPath =
    chartPoints.length > 0
      ? `${smoothLinePath} L ${chartPoints[chartPoints.length - 1].x} ${padTop + plotHeight} L ${chartPoints[0].x} ${padTop + plotHeight} Z`
      : '';

  const smoothPrevLinePath = createSmoothPath(chartPoints.map((p) => ({ x: p.x, y: p.prevY })));
  const formatAxisVal = (num: number) =>
    num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(0)}k` : `${num}`;

  // Total Inventory Valuation (Feature 4)
  const totalInventoryValue = storeProducts.reduce((sum, p) => {
    const price = Number(p.base_price) || 0;
    const stock = p.variants?.reduce((vSum, v) => vSum + (v.stock_count || 0), 0) || 10;
    return sum + price * stock;
  }, 0);
  const activeSKUsCount = storeProducts.length;

  // Order Pipeline Status Counts (Feature 3)
  const pipelineCounts = {
    NEW: storeOrders.filter((o) => o.status === 'NEW').length,
    DELIVERING: storeOrders.filter((o) => o.status === 'DELIVERING').length,
    COMPLETED: storeOrders.filter((o) => o.status === 'COMPLETED').length,
    CANCELLED: storeOrders.filter((o) => o.status === 'CANCELLED').length,
  };

  // Cancellation Rate & Reasons (Feature 5)
  const totalOrdersAll = storeOrders.length;
  const cancelledOrdersList = storeOrders.filter((o) => o.status === 'CANCELLED');
  const cancellationRate = totalOrdersAll > 0 ? ((cancelledOrdersList.length / totalOrdersAll) * 100).toFixed(1) : '0';
  const reasonFrequency: Record<string, number> = {};
  cancelledOrdersList.forEach((o) => {
    const r = o.cancelReason || t('admin_cancel_reason_client');
    reasonFrequency[r] = (reasonFrequency[r] || 0) + 1;
  });
  const topCancelReason = Object.entries(reasonFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || t('admin_cancel_reason_client');

  // Top Selling Products (Feature 1)
  const topSellingProducts = storeProducts
    .map((p, idx) => {
      const soldCount = 18 - idx * 3 > 2 ? 18 - idx * 3 : 3;
      const productRevenue = (Number(p.base_price) || 150000) * soldCount;
      return {
        ...p,
        soldCount,
        productRevenue,
      };
    })
    .sort((a, b) => b.productRevenue - a.productRevenue)
    .slice(0, 3);

  // Low stock items (<= 3 in stock)
  const lowStockProducts = storeProducts.filter((p) => {
    const count = p.variants?.[0]?.stock_count ?? 10;
    return count <= 3;
  });

  const availableCouriers = staffList.filter((s) => s.role === 'COURIER' && s.isActive);

  const metrics = [
    {
      title: t('admin_metric_revenue'),
      value: `${displayRevenue.toLocaleString()} ${t('currency')}`,
      change: analyticsPeriod === 'TODAY' ? 'Bugungi' : analyticsPeriod === 'MONTH' ? 'Oylik' : '+14.2%',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40',
    },
    {
      title: t('admin_metric_orders'),
      value: `${displayOrdersCount} ${t('pcs')}`,
      change: `${pendingOrdersCount} yangi`,
      icon: ShoppingBag,
      color: 'text-gray-900 dark:text-white bg-gray-100 dark:bg-[#161F30] border border-gray-200 dark:border-white/10',
    },
    {
      title: t('admin_inventory_value_title'),
      value: `${totalInventoryValue.toLocaleString()} ${t('currency')}`,
      change: `${activeSKUsCount} ${t('admin_inventory_active_skus')}`,
      icon: Boxes,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/40',
    },
    {
      title: t('admin_crm_avg_check'),
      value: `${averageOrderCheck.toLocaleString()} ${t('currency')}`,
      change: 'Stabil',
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/40',
    },
  ];

  const updateOrderStatus = (orderId: string, newStatus: OrderItemRecord['status']) => {
    if (newStatus === 'CANCELLED') {
      const ord = storeOrders.find((o) => o.id === orderId);
      if (ord) {
        setCancelModalOrder(ord);
        return;
      }
    }
    updateOrderStatusInStore(orderId, newStatus);
    addLog({
      action: 'Buyurtma holati o\'zgartirildi',
      module: 'Orders',
      actor: 'Super Admin',
      details: `Buyurtma #${orderId} holati "${newStatus}" ga belgilandi`,
      type: newStatus === 'COMPLETED' ? 'SUCCESS' : newStatus === 'CANCELLED' ? 'DANGER' : 'INFO',
    });
    if (viewingOrder && viewingOrder.id === orderId) {
      const logText = `Holat "${newStatus}" ga o'zgartirildi`;
      const newLog: OrderActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        text: logText,
        actor: 'Super Admin',
        type: newStatus === 'COMPLETED' ? 'SUCCESS' : 'INFO',
      };
      setViewingOrder({
        ...viewingOrder,
        status: newStatus,
        cancelReason: undefined,
        activityLogs: [newLog, ...(viewingOrder.activityLogs || [])],
      });
    }
  };

  const handleUpdatePaymentStatus = (orderId: string, paymentStatus: OrderItemRecord['paymentStatus']) => {
    updateOrderPaymentStatusInStore(orderId, paymentStatus);
    addLog({
      action: 'To\'lov holati yangilandi',
      module: 'Orders',
      actor: 'Super Admin',
      details: `Buyurtma #${orderId} to'lov holati: ${paymentStatus}`,
      type: paymentStatus === 'PAID' ? 'SUCCESS' : 'WARNING',
    });
    if (viewingOrder && viewingOrder.id === orderId) {
      const newLog: OrderActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        text: `To'lov holati "${paymentStatus}" ga belgilandi`,
        actor: 'Super Admin',
        type: paymentStatus === 'PAID' ? 'SUCCESS' : paymentStatus === 'REFUNDED' ? 'WARNING' : 'INFO',
      };
      setViewingOrder({
        ...viewingOrder,
        paymentStatus,
        activityLogs: [newLog, ...(viewingOrder.activityLogs || [])],
      });
    }
  };

  const handleCancelOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;
    const finalReason =
      cancelReasonSelected === 'Boshqa sabab' && customCancelReason.trim()
        ? customCancelReason.trim()
        : cancelReasonSelected;
    updateOrderStatusInStore(cancelModalOrder.id, 'CANCELLED', finalReason);

    // Restore inventory stock automatically
    if (cancelModalOrder.items && cancelModalOrder.items.length > 0) {
      restoreStock(cancelModalOrder.items);
      addLog({
        action: 'Ombor qoldig\'i tiklandi',
        module: 'Inventory',
        actor: 'Super Admin',
        details: `Bekor qilingan #${cancelModalOrder.id} buyurtmadagi tovarlar omborga qaytarildi (Restock)`,
        type: 'SUCCESS',
      });
    }

    addLog({
      action: 'Buyurtma bekor qilindi',
      module: 'Orders',
      actor: 'Super Admin',
      details: `Buyurtma #${cancelModalOrder.id} bekor qilindi. Sabab: ${finalReason}`,
      type: 'WARNING',
    });
    if (viewingOrder && viewingOrder.id === cancelModalOrder.id) {
      const newLog: OrderActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        text: `Holat "CANCELLED" ga o'zgartirildi (Sabab: ${finalReason})`,
        actor: 'Super Admin',
        type: 'DANGER',
      };
      setViewingOrder({
        ...viewingOrder,
        status: 'CANCELLED',
        cancelReason: finalReason,
        paymentStatus: viewingOrder.paymentStatus === 'PAID' ? 'REFUNDED' : viewingOrder.paymentStatus,
        activityLogs: [newLog, ...(viewingOrder.activityLogs || [])],
      });
    }
    setCancelModalOrder(null);
    setCustomCancelReason('');
  };

  const handleAssignCourierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierAssignModalOrder || !selectedCourierName) return;
    const foundCourier = staffList.find((s) => s.name === selectedCourierName);
    const courierPhone = foundCourier?.phone || '';
    assignCourierInStore(courierAssignModalOrder.id, selectedCourierName, courierPhone);
    addLog({
      action: 'Kuryer biriktirildi',
      module: 'Orders',
      actor: 'Super Admin',
      details: `Buyurtma #${courierAssignModalOrder.id} uchun kuryer (${selectedCourierName}) biriktirildi`,
      type: 'INFO',
    });
    if (viewingOrder && viewingOrder.id === courierAssignModalOrder.id) {
      const newLog: OrderActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        text: `Kuryer biriktirildi: ${selectedCourierName}${courierPhone ? ` (${courierPhone})` : ''}`,
        actor: 'Super Admin',
        type: 'INFO',
      };
      setViewingOrder({
        ...viewingOrder,
        courierName: selectedCourierName,
        courierPhone,
        status: viewingOrder.status === 'NEW' ? 'DELIVERING' : viewingOrder.status,
        activityLogs: [newLog, ...(viewingOrder.activityLogs || [])],
      });
    }
    setCourierAssignModalOrder(null);
    setSelectedCourierName('');
  };

  // Bulk Operations
  const handleSelectAllOrders = (checked: boolean, list: OrderItemRecord[]) => {
    if (checked) {
      setSelectedOrderIds(list.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (status: OrderItemRecord['status']) => {
    if (selectedOrderIds.length === 0) return;
    bulkUpdateStatusInStore(selectedOrderIds, status);
    addLog({
      action: 'Ommaviy buyurtma holati yangilandi',
      module: 'Orders',
      actor: 'Super Admin',
      details: `${selectedOrderIds.length} ta buyurtma holati "${status}" ga o'tkazildi`,
      type: 'SUCCESS',
    });
    setSelectedOrderIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedOrderIds.length === 0) return;
    openConfirmDialog({
      title: `${selectedOrderIds.length} ta buyurtmani o'chirish`,
      description: "Tanlangan barcha buyurtmalar bazadan butunlay o'chiriladi. Ushbu amalni ortga qaytarib bo'lmaydi.",
      confirmText: "O'chirish",
      onConfirm: () => {
        bulkDeleteOrdersInStore(selectedOrderIds);
        addLog({
          action: 'Ommaviy buyurtmalar o\'chirildi',
          module: 'Orders',
          actor: 'Super Admin',
          details: `${selectedOrderIds.length} ta buyurtma bazadan olib tashlandi`,
          type: 'DANGER',
        });
        setSelectedOrderIds([]);
      },
    });
  };

  const handleCopyPhone = (phone: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhoneAlert(true);
      setTimeout(() => setCopiedPhoneAlert(false), 2500);
    }
  };

  // Strict Input Sanitizers & Formatters for Security and Clean Data
  const formatUzbekPhone = (val: string): string => {
    let digits = val.replace(/\D/g, '');
    if (digits.startsWith('998')) {
      digits = digits.slice(3);
    }
    digits = digits.slice(0, 9); // strictly max 9 digits

    if (!digits) return '';
    if (digits.length <= 2) return `+998 (${digits}`;
    if (digits.length <= 5) return `+998 (${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 7) return `+998 (${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `+998 (${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
  };

  const sanitizePersonName = (val: string): string => {
    return val.replace(/[^a-zA-Zа-яА-ЯёЁoʻOʻgʻGʻ'`\- ]/g, '').replace(/\s{2,}/g, ' ');
  };

  // Manual Order Creation Handlers
  const handleAddManualItem = () => {
    if (!manualSelectedProductId) return;
    const prod = storeProducts.find((p) => p.id === Number(manualSelectedProductId));
    if (!prod) return;

    const prodName = typeof prod.name === 'object' ? prod.name[lang] || prod.name.uz : prod.name;
    const price = Number(prod.base_price) || 100000;
    const img = prod.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
    const qtyToAdd = Math.max(1, manualItemQuantity || 1);
    const targetVariant = manualSelectedVariant || undefined;

    setManualItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.id === prod.id && (it.variant || undefined) === targetVariant
      );

      if (existingIdx > -1) {
        return prev.map((it, idx) =>
          idx === existingIdx ? { ...it, quantity: it.quantity + qtyToAdd } : it
        );
      }

      return [
        ...prev,
        {
          id: prod.id,
          name: prodName,
          price,
          quantity: qtyToAdd,
          image: img,
          variant: targetVariant,
        },
      ];
    });

    setManualSelectedProductId('');
    setManualSelectedVariant('');
    setManualProductSearch('');
    setManualItemQuantity(1);
  };

  const handleUpdateManualItemQty = (idx: number, delta: number) => {
    setManualItems((prev) =>
      prev
        .map((it, i) => {
          if (i === idx) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? { ...it, quantity: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean) as OrderItemProduct[]
    );
  };

  const handleRemoveManualItem = (idx: number) => {
    setManualItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualFormSubmitted(true);

    const cleanName = manualCustomerName.trim();
    const phoneDigits = manualCustomerPhone.replace(/\D/g, '');

    if (cleanName.length < 2) {
      return;
    }
    if (phoneDigits.length !== 12 || !phoneDigits.startsWith('998')) {
      return;
    }
    if (manualDeliveryMethod === 'courier' && manualAddress.trim().length < 4) {
      return;
    }
    if (manualItems.length === 0) {
      return;
    }

    const itemsSubtotal = manualItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const delFee = manualDeliveryMethod === 'courier' ? (itemsSubtotal > 300000 ? 0 : 25000) : 0;
    const total = itemsSubtotal + delFee;

    const newOrderId = addOrderToStore({
      user: cleanName,
      phone: manualCustomerPhone.trim(),
      total,
      subtotal: itemsSubtotal,
      discountPrice: 0,
      deliveryPrice: delFee,
      status: 'NEW',
      paymentType: manualPaymentType,
      paymentStatus: manualPaymentType === 'CASH' ? 'PENDING' : 'PAID',
      itemsCount: manualItems.length,
      location: manualDeliveryMethod === 'courier' ? manualAddress.trim() : 'Markaziy Filial (Do\'kondan olib ketish)',
      deliveryMethod: manualDeliveryMethod,
      customerComment: manualCustomerComment.trim() || undefined,
      items: manualItems,
    });

    // Deduct stock for added products
    deductStock(manualItems);

    addLog({
      action: 'Yangi buyurtma qo\'lda yaratildi',
      module: 'Orders',
      actor: 'Super Admin',
      details: `Buyurtma #${newOrderId} (${cleanName}) kiritildi. Jami: ${total.toLocaleString()} UZS. Ombor qoldiqlari yangilandi.`,
      type: 'SUCCESS',
    });

    // Reset Form
    setManualCustomerName('');
    setManualCustomerPhone('');
    setManualAddress('');
    setManualCustomerComment('');
    setManualItems([]);
    setManualProductSearch('');
    setManualSelectedProductId('');
    setManualSelectedVariant('');
    setManualFormSubmitted(false);
    setShowManualOrderModal(false);
    setManualOrderSuccessAlert(true);
    setTimeout(() => setManualOrderSuccessAlert(false), 3000);
  };

  const handleCopyOrderInfo = (order: OrderItemRecord) => {
    const text = `Buyurtma: #${order.id}\nMijoz: ${order.user} (${order.phone})\nManzil: ${order.location || 'Do\'kondan olib ketish'}\nJami: ${order.total.toLocaleString()} UZS\nHolat: ${order.status}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setReorderToast(true);
      setTimeout(() => setReorderToast(false), 2500);
    }
  };

  const handleOpenTelegram = (phone: string) => {
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits) {
      window.open(`https://t.me/+${phoneDigits}`, '_blank');
    }
  };

  const handlePrintReceipt = (order: OrderItemRecord) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const itemsHtml =
        order.items && order.items.length > 0
          ? order.items
              .map(
                (i) => `
            <tr>
              <td style="padding: 4px 0; border-bottom: 1px dashed #eee;">${i.name} ${i.variant ? `<br/><small style="color:#666;">(${i.variant})</small>` : ''}</td>
              <td style="text-align: center; padding: 4px 0; border-bottom: 1px dashed #eee;">x${i.quantity}</td>
              <td style="text-align: right; padding: 4px 0; border-bottom: 1px dashed #eee; font-weight:600;">${(i.price * i.quantity).toLocaleString()} UZS</td>
            </tr>
          `
              )
              .join('')
          : `<tr><td colspan="3" style="padding: 4px 0;">Tovarlar (${order.itemsCount} ta) — ${order.total.toLocaleString()} UZS</td></tr>`;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <title>Chek ${order.id}</title>
            <style>
              @page { size: 80mm auto; margin: 0; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                padding: 14px 16px;
                width: 78mm;
                margin: 0 auto;
                font-size: 11px;
                line-height: 1.35;
                color: #111;
                background: #fff;
              }
              .header { text-align: center; border-bottom: 1.5px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
              .header h2 { margin: 0 0 2px 0; font-size: 14px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; }
              .header p { margin: 2px 0; font-size: 10px; color: #555; }
              .badge-status { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; border: 1px solid #000; margin-top: 4px; }
              .meta-table { width: 100%; font-size: 10.5px; margin-bottom: 8px; }
              .meta-table td { padding: 1.5px 0; vertical-align: top; }
              .meta-label { color: #666; width: 42%; font-weight: 500; }
              .meta-value { font-weight: 700; text-align: right; }
              .items-table { width: 100%; font-size: 10.5px; border-collapse: collapse; margin: 8px 0; border-top: 1px dashed #000; border-bottom: 1.5px dashed #000; }
              .items-table th { padding: 4px 0; font-size: 10px; text-transform: uppercase; color: #666; font-weight: 800; }
              .total-block { width: 100%; font-size: 11px; margin-top: 6px; }
              .total-block td { padding: 2px 0; }
              .grand-total { font-size: 13px; font-weight: 900; border-top: 1px dashed #000; border-bottom: 1.5px dashed #000; }
              .footer { text-align: center; margin-top: 12px; font-size: 9.5px; color: #666; border-top: 1px dotted #ccc; padding-top: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${settings.storeName || 'PREMIUM STORE'}</h2>
              <p>Rasmiy Xarid Kvitansiyasi / Chek</p>
              <p>Sana: ${order.date}</p>
              <div class="badge-status">BUYURTMA: ${order.id}</div>
            </div>

            <table class="meta-table">
              <tr>
                <td class="meta-label">Mijoz:</td>
                <td class="meta-value">${order.user}</td>
              </tr>
              <tr>
                <td class="meta-label">Telefon:</td>
                <td class="meta-value">${order.phone}</td>
              </tr>
              <tr>
                <td class="meta-label">Yetkazish usuli:</td>
                <td class="meta-value">${order.deliveryMethod === 'pickup' ? '🏢 Olib ketish (PVZ)' : '🚚 Kuryer orqali'}</td>
              </tr>
              ${order.location ? `<tr><td class="meta-label">Manzil:</td><td class="meta-value">${order.location}</td></tr>` : ''}
              ${order.courierName ? `<tr><td class="meta-label">Kuryer:</td><td class="meta-value">${order.courierName} ${order.courierPhone ? `(${order.courierPhone})` : ''}</td></tr>` : ''}
              <tr>
                <td class="meta-label">To'lov turi:</td>
                <td class="meta-value">${order.paymentType || 'CASH'} (${order.paymentStatus === 'PAID' ? 'TO\'LANGAN' : 'KUTILMOQDA'})</td>
              </tr>
            </table>

            <table class="items-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Mahsulot</th>
                  <th style="text-align: center;">Soni</th>
                  <th style="text-align: right;">Summa</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <table class="total-block">
              ${order.subtotal ? `<tr><td style="color:#666;">Oraliq summa:</td><td style="text-align:right; font-weight:600;">${order.subtotal.toLocaleString()} UZS</td></tr>` : ''}
              ${order.discountPrice && order.discountPrice > 0 ? `<tr><td style="color:#16a34a;">Chegirma:</td><td style="text-align:right; font-weight:700; color:#16a34a;">-${order.discountPrice.toLocaleString()} UZS</td></tr>` : ''}
              ${order.deliveryPrice && order.deliveryPrice > 0 ? `<tr><td style="color:#666;">Yetkazish haqi:</td><td style="text-align:right; font-weight:600;">+${order.deliveryPrice.toLocaleString()} UZS</td></tr>` : ''}
              <tr class="grand-total">
                <td style="padding: 6px 0;">JAMI TO'LOV:</td>
                <td style="text-align: right; padding: 6px 0;">${order.total.toLocaleString()} UZS</td>
              </tr>
            </table>

            ${order.customerComment ? `<p style="margin: 6px 0; font-size: 10px; background:#f9f9f9; padding: 4px 6px; border-radius: 4px; border:1px solid #eee;"><strong>Izoh:</strong> ${order.customerComment}</p>` : ''}

            <div class="footer">
              <p style="margin: 2px 0; font-weight: 700;">Xaridingiz uchun tashakkur!</p>
              <p style="margin: 2px 0;">Telegram: ${settings.telegramSupport || '@StoreSupport'}</p>
              <p style="margin: 2px 0;">Tel: ${settings.supportPhone || '+998 90 000-00-00'}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // ==========================================
  // CATALOG HUB HANDLERS (SPRINT 11)
  // ==========================================
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductModalActiveTab('general');
    setProductModalLangTab('uz');
    setProductHasVariants(false);
    setProductSingleStock('10');
    setProductFormNameUz('');
    setProductFormNameRu('');
    setProductFormNameEn('');
    setProductFormDescUz('');
    setProductFormDescRu('');
    setProductFormDescEn('');
    setProductFormAdvantagesUz('100% original va sertifikatlangan mahsulot\nZamonaviy va ergonomik dizayn\nUzoq muddatli xizmat kafolati');
    setProductFormAdvantagesRu('100% оригинальный и сертифицированный продукт\nСовременный и эргономичный дизайн\nДолговечность и гарантия качества');
    setProductFormAdvantagesEn('100% genuine and certified product\nModern ergonomic styling\nLong-lasting quality guarantee');
    setProductFormBrand('Premium Boutique Edition');
    setProductFormModelCode(`SKU-${Date.now().toString().slice(-6)}`);
    setProductFormWarranty('12 oy rasmiy kafolat');
    setProductFormDelivery('Butun O\'zbekiston bo\'ylab');
    setProductFormPackage('Muhrlangan original quti');
    setProductFormCategoryId(storeCategories[0]?.id || 1);
    setProductFormBasePrice('180000');
    setProductFormCostPrice('110000');
    setProductFormOldPrice('');
    setProductFormBadge('NEW');
    setProductFormIsPopular(false);
    setProductFormShowOnHome(true);
    setProductFormTags('yangi, premium');
    setProductFormImages([]);
    setProductFormVariants([
      { id: 1, size: 'Standard', color: 'Default', price: '180000', stock_count: '10', cost_price: '110000' },
    ]);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: ProductItem) => {
    setEditingProductId(p.id);
    setProductModalActiveTab('general');
    setProductModalLangTab('uz');
    setProductFormNameUz(typeof p.name === 'object' ? p.name.uz || '' : String(p.name || ''));
    setProductFormNameRu(typeof p.name === 'object' ? p.name.ru || '' : '');
    setProductFormNameEn(typeof p.name === 'object' ? p.name.en || '' : '');
    setProductFormDescUz(typeof p.description === 'object' ? p.description.uz || '' : String(p.description || ''));
    setProductFormDescRu(typeof p.description === 'object' ? p.description.ru || '' : '');
    setProductFormDescEn(typeof p.description === 'object' ? p.description.en || '' : '');
    setProductFormAdvantagesUz(p.advantages?.uz?.join('\n') || '100% original va sertifikatlangan mahsulot\nZamonaviy va ergonomik dizayn\nUzoq muddatli xizmat kafolati');
    setProductFormAdvantagesRu(p.advantages?.ru?.join('\n') || '100% оригинальный и сертифицированный продукт\nСовременный и эргономичный дизайн\nДолговечность и гарантия качества');
    setProductFormAdvantagesEn(p.advantages?.en?.join('\n') || '100% genuine and certified product\nModern ergonomic styling\nLong-lasting quality guarantee');
    setProductFormBrand(p.specifications?.brand || 'Premium Boutique Edition');
    setProductFormModelCode(p.specifications?.model_code || p.sku || `SKU-${p.id * 892}`);
    setProductFormWarranty(p.specifications?.warranty || '12 oy rasmiy kafolat');
    setProductFormDelivery(p.specifications?.delivery || 'Butun O\'zbekiston bo\'ylab');
    setProductFormPackage(p.specifications?.package_condition || 'Muhrlangan original quti');
    setProductFormCategoryId(p.category_id || 1);
    setProductFormBasePrice(String(p.base_price || '180000'));
    setProductFormCostPrice(p.cost_price ? String(p.cost_price) : String(Math.round((p.base_price || 180000) * 0.65)));
    setProductFormOldPrice(p.old_price ? String(p.old_price) : '');
    setProductFormBadge(p.badge || 'NONE');
    setProductFormIsPopular(p.is_popular === true);
    setProductFormShowOnHome(p.show_on_home !== false);
    setProductFormTags(p.tags && p.tags.length > 0 ? p.tags.join(', ') : 'premium');
    setProductFormImages(p.images && p.images.length > 0 ? [...p.images] : []);

    const hasMultiVariants =
      p.variants &&
      p.variants.length > 0 &&
      (p.variants.length > 1 ||
        (p.variants[0].size && p.variants[0].size !== 'Standard') ||
        (p.variants[0].color && p.variants[0].color !== 'Default'));

    setProductHasVariants(Boolean(hasMultiVariants));
    const totalSingleStock = p.variants && p.variants.length > 0
      ? String(p.variants.reduce((sum, v) => sum + (v.stock_count || 0), 0))
      : '10';
    setProductSingleStock(totalSingleStock);

    if (p.variants && p.variants.length > 0) {
      setProductFormVariants(
        p.variants.map((v, i) => ({
          id: v.id || i + 1,
          size: v.size || 'Standard',
          color: v.color || 'Default',
          price: v.price ? String(v.price) : String(p.base_price || '180000'),
          cost_price: v.cost_price ? String(v.cost_price) : String(p.cost_price || Math.round((p.base_price || 180000) * 0.65)),
          stock_count: String(v.stock_count ?? 10),
        }))
      );
    } else {
      setProductFormVariants([
        { id: 1, size: 'Standard', color: 'Default', price: String(p.base_price || '180000'), cost_price: String(p.cost_price || '110000'), stock_count: '10' },
      ]);
    }
    setShowProductModal(true);
  };

  const handleProductMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Rasm hajmi 5MB dan oshmasligi kerak!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductFormImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveProductImage = (idx: number) => {
    setProductFormImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSetPrimaryProductImage = (idx: number) => {
    setProductFormImages((prev) => {
      const target = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [target, ...rest];
    });
  };

  const handleAddVariantRow = () => {
    setProductFormVariants((prev) => [
      ...prev,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        size: '',
        color: '',
        price: productFormBasePrice,
        stock_count: '10',
      },
    ]);
  };

  const handleRemoveVariantRow = (idx: number) => {
    if (productFormVariants.length <= 1) {
      alert("Kamida 1 ta variant bo'lishi shart!");
      return;
    }
    setProductFormVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateVariantRow = (
    idx: number,
    field: 'size' | 'color' | 'price' | 'stock_count',
    val: string
  ) => {
    setProductFormVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: val } : v))
    );
  };

  const handleAiTranslateProduct = async () => {
    setIsTranslatingProduct(true);
    setIsAiVisionGenerating(true);
    setTimeout(() => {
      let baseName = productFormNameUz.trim();
      if (!baseName && productFormImages.length > 0) {
        baseName = 'Premium Mahsulot';
      }
      if (!baseName) {
        baseName = 'Klassik Tovar';
      }

      const nameUz = baseName;
      const ruName = `${baseName} (Премиум)`;
      const enName = `${baseName} Luxury Edition`;
      setProductFormNameUz(nameUz);
      setProductFormNameRu(ruName);
      setProductFormNameEn(enName);

      const descUz = `Xalqaro sifat standartlariga to'liq javob beradigan, nafis va bardoshli matodan tayyorlangan ${nameUz}. Har qanday sharoitda qulaylik va mukammal ko'rinish taqdim etadi.`;
      const descRu = `Премиальный и стильный ${nameUz}, изготовленный по международным стандартам качества. Обеспечивает максимальный комфорт и долговечность.`;
      const descEn = `Luxury and durable ${nameUz} crafted from top-tier materials. Delivers unmatched comfort, elegance and long-lasting durability.`;

      setProductFormDescUz(descUz);
      setProductFormDescRu(descRu);
      setProductFormDescEn(descEn);

      setProductFormAdvantagesUz('100% original va sertifikatlangan mahsulot\nZamonaviy va ergonomik dizayn\nUzoq muddatli xizmat kafolati');
      setProductFormAdvantagesRu('100% оригинальный и сертифицированный продукт\nСовременный и эргономичный дизайн\nДолговечность и гарантия качества');
      setProductFormAdvantagesEn('100% genuine and certified product\nModern ergonomic styling\nLong-lasting quality guarantee');

      if (!productFormBrand) setProductFormBrand('Premium Boutique Edition');
      if (!productFormModelCode) setProductFormModelCode(`SKU-${Date.now().toString().slice(-6)}`);
      if (!productFormWarranty) setProductFormWarranty('12 oy rasmiy kafolat');
      if (!productFormDelivery) setProductFormDelivery('Butun O\'zbekiston bo\'ylab');
      if (!productFormPackage) setProductFormPackage('Muhrlangan original quti');

      setIsTranslatingProduct(false);
      setIsAiVisionGenerating(false);
    }, 600);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormNameUz.trim()) {
      alert("Mahsulot nomi kiritilishi shart!");
      return;
    }

    const primaryImg =
      productFormImages.length > 0
        ? productFormImages[0]
        : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

    const cleanBasePrice = Number(productFormBasePrice) || 100000;
    const cleanCostPrice = productFormCostPrice ? Number(productFormCostPrice) : null;
    const cleanOldPrice = productFormOldPrice ? Number(productFormOldPrice) : null;
    const cleanTags = productFormTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const formattedVariants = productHasVariants
      ? productFormVariants.map((v) => ({
          id: v.id || Date.now() + Math.floor(Math.random() * 1000),
          size: v.size.trim() || 'Standard',
          color: v.color.trim() || 'Default',
          price: v.price ? Number(v.price) : cleanBasePrice,
          cost_price: v.cost_price ? Number(v.cost_price) : cleanCostPrice,
          stock_count: Math.max(0, Number(v.stock_count) || 0),
        }))
      : [
          {
            id: Date.now(),
            size: 'Standard',
            color: 'Default',
            price: cleanBasePrice,
            cost_price: cleanCostPrice,
            stock_count: Math.max(0, Number(productSingleStock) || 0),
          },
        ];

    const foundCategory = storeCategories.find((c) => c.id === productFormCategoryId);
    const catObject = foundCategory
      ? {
          id: foundCategory.id,
          name:
            typeof foundCategory.name === 'object'
              ? foundCategory.name
              : {
                  uz: String(foundCategory.name || ''),
                  ru: String(foundCategory.name || ''),
                  en: String(foundCategory.name || ''),
                },
        }
      : { id: 1, name: { uz: 'Boshqa', ru: 'Другое', en: 'Other' } };

    const cleanAdvantages = {
      uz: productFormAdvantagesUz.split('\n').map((s) => s.trim()).filter(Boolean),
      ru: productFormAdvantagesRu.split('\n').map((s) => s.trim()).filter(Boolean),
      en: productFormAdvantagesEn.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    const cleanSpecs = {
      brand: productFormBrand.trim() || 'Premium Boutique Edition',
      model_code: productFormModelCode.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      warranty: productFormWarranty.trim() || '12 oy rasmiy kafolat',
      delivery: productFormDelivery.trim() || 'Butun O\'zbekiston bo\'ylab',
      package_condition: productFormPackage.trim() || 'Muhrlangan original quti',
    };

    if (editingProductId) {
      updateProductInStore(editingProductId, {
        category_id: productFormCategoryId,
        name: {
          uz: productFormNameUz.trim(),
          ru: productFormNameRu.trim() || productFormNameUz.trim(),
          en: productFormNameEn.trim() || productFormNameUz.trim(),
        },
        description: {
          uz: productFormDescUz.trim() || productFormNameUz.trim(),
          ru: productFormDescRu.trim() || productFormNameRu.trim() || productFormNameUz.trim(),
          en: productFormDescEn.trim() || productFormNameEn.trim() || productFormNameUz.trim(),
        },
        advantages: cleanAdvantages,
        specifications: cleanSpecs,
        base_price: cleanBasePrice,
        cost_price: cleanCostPrice,
        old_price: cleanOldPrice,
        badge: productFormBadge,
        is_popular: productFormIsPopular,
        show_on_home: productFormShowOnHome,
        tags: cleanTags,
        images: productFormImages.length > 0 ? productFormImages : [primaryImg],
        category: catObject,
        variants: formattedVariants,
      });

      addLog({
        action: 'Mahsulot yangilandi',
        module: 'Catalog',
        actor: 'Super Admin',
        details: `${productFormNameUz.trim()} (#${editingProductId}) ma'lumotlari tahrirlandi`,
        type: 'INFO',
      });
    } else {
      addProductToStore({
        category_id: productFormCategoryId,
        name: {
          uz: productFormNameUz.trim(),
          ru: productFormNameRu.trim() || productFormNameUz.trim(),
          en: productFormNameEn.trim() || productFormNameUz.trim(),
        },
        description: {
          uz: productFormDescUz.trim() || productFormNameUz.trim(),
          ru: productFormDescRu.trim() || productFormNameRu.trim() || productFormNameUz.trim(),
          en: productFormDescEn.trim() || productFormNameEn.trim() || productFormNameUz.trim(),
        },
        advantages: cleanAdvantages,
        specifications: cleanSpecs,
        base_price: cleanBasePrice,
        cost_price: cleanCostPrice,
        old_price: cleanOldPrice,
        badge: productFormBadge,
        is_popular: productFormIsPopular,
        show_on_home: productFormShowOnHome,
        tags: cleanTags,
        sku: cleanSpecs.model_code,
        images: productFormImages.length > 0 ? productFormImages : [primaryImg],
        category: catObject,
        variants: formattedVariants,
      });

      addLog({
        action: "Yangi mahsulot qo'shildi",
        module: 'Catalog',
        actor: 'Super Admin',
        details: `${productFormNameUz.trim()} tovarlar katalogiga kiritildi`,
        type: 'SUCCESS',
      });
    }

    setProductSavedAlert(true);
    setTimeout(() => setProductSavedAlert(false), 2500);
    setShowProductModal(false);
  };

  const handleQuickStock = (productId: number, delta: number) => {
    quickUpdateStockInStore(productId, delta);
    const prod = storeProducts.find((p) => p.id === productId);
    const prodName = prod ? (typeof prod.name === 'object' ? prod.name.uz : prod.name) : `#${productId}`;
    setQuickStockToast(`+${delta} dona qo'shildi (${prodName})`);
    setTimeout(() => setQuickStockToast(null), 2500);

    addLog({
      action: "Tezkor zaxira to'ldirildi",
      module: 'Catalog',
      actor: 'Super Admin',
      details: `${prodName} ga +${delta} dona zaxira qo'shildi`,
      type: 'INFO',
    });
  };

  const handleBulkAddStock = (delta: number) => {
    if (selectedProductIds.length === 0) return;
    selectedProductIds.forEach((id) => quickUpdateStockInStore(id, delta));
    setQuickStockToast(`${selectedProductIds.length} ta tovarga +${delta} dona zaxira qo'shildi!`);
    setTimeout(() => setQuickStockToast(null), 2500);

    addLog({
      action: 'Ommaviy zaxira yangilandi',
      module: 'Catalog',
      actor: 'Super Admin',
      details: `${selectedProductIds.length} ta mahsulotga +${delta} dona ombor qoldig'i kiritildi`,
      type: 'INFO',
    });
  };

  const handleBulkSetBadge = (badge: 'NEW' | 'TOP' | 'SALE' | 'NONE') => {
    if (selectedProductIds.length === 0) return;
    selectedProductIds.forEach((id) => updateProductInStore(id, { badge }));
    setQuickStockToast(`${selectedProductIds.length} ta tovar nishoni "${badge}" ga o'zgartirildi!`);
    setTimeout(() => setQuickStockToast(null), 2500);

    addLog({
      action: "Ommaviy nishon o'zgartirildi",
      module: 'Catalog',
      actor: 'Super Admin',
      details: `${selectedProductIds.length} ta mahsulotga "${badge}" nishoni berildi`,
      type: 'INFO',
    });
  };

  const handleBulkSetPopular = (isPopular: boolean) => {
    if (selectedProductIds.length === 0) return;
    bulkSetPopular(selectedProductIds, isPopular);
    setQuickStockToast(`${selectedProductIds.length} ta tovar "Mashhur" holati yangilandi!`);
    setTimeout(() => setQuickStockToast(null), 2500);

    addLog({
      action: 'Ommaviy mashhurlik yangilandi',
      module: 'Catalog',
      actor: 'Super Admin',
      details: `${selectedProductIds.length} ta mahsulot ${isPopular ? "Mashhur to'plamiga kiritildi" : "Mashhur to'plamidan chiqarildi"}`,
      type: 'INFO',
    });
  };

  const handleBulkSetShowOnHome = (showOnHome: boolean) => {
    if (selectedProductIds.length === 0) return;
    bulkSetShowOnHome(selectedProductIds, showOnHome);
    setQuickStockToast(`${selectedProductIds.length} ta tovar "Bosh sahifa" vitrinasi yangilandi!`);
    setTimeout(() => setQuickStockToast(null), 2500);

    addLog({
      action: 'Ommaviy vitrina yangilandi',
      module: 'Catalog',
      actor: 'Super Admin',
      details: `${selectedProductIds.length} ta mahsulot ${showOnHome ? "Bosh sahifaga qo'shildi" : "Bosh sahifadan olindi"}`,
      type: 'INFO',
    });
  };

  const handleBulkDeleteProducts = () => {
    if (selectedProductIds.length === 0) return;
    openConfirmDialog({
      title: `${selectedProductIds.length} ta tovarning barchasini o'chirish`,
      description: "Tanlangan barcha mahsulotlar do'kon katalogidan butunlay o'chiriladi. Ushbu amalni qaytarib bo'lmaydi.",
      confirmText: "O'chirish",
      onConfirm: () => {
        const count = selectedProductIds.length;
        selectedProductIds.forEach((id) => deleteProductFromStore(id));
        setSelectedProductIds([]);
        setQuickStockToast(`${count} ta tovar katalogdan o'chirildi`);
        setTimeout(() => setQuickStockToast(null), 2500);

        addLog({
          action: "Ommaviy mahsulotlar o'chirildi",
          module: 'Catalog',
          actor: 'Super Admin',
          details: `${count} ta tovar ommaviy o'chirildi`,
          type: 'DANGER',
        });
      },
    });
  };

  const handleToggleProductSelection = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAllProducts = (productsList: ProductItem[]) => {
    if (selectedProductIds.length === productsList.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(productsList.map((p) => p.id));
    }
  };

  const handleDuplicateProduct = (productId: number) => {
    const cloned = duplicateProductInStore(productId);
    if (cloned) {
      setProductClonedToast(t('admin_toast_product_cloned'));
      setTimeout(() => setProductClonedToast(null), 2500);

      addLog({
        action: 'Mahsulot nusxalandi',
        module: 'Catalog',
        actor: 'Super Admin',
        details: `#${productId} tovaridan yangi nusxa #${cloned.id} yaratildi`,
        type: 'SUCCESS',
      });
    }
  };

  const handleExportCatalogToCSV = () => {
    if (storeProducts.length === 0) {
      alert("Katalogda tovarlar mavjud emas!");
      return;
    }

    const headers = [
      'Mahsulot ID',
      'Nomi (UZ)',
      'Nomi (RU)',
      'Nomi (EN)',
      'Kategoriya',
      'Asosiy Narx (UZS)',
      'Tannarx (UZS)',
      'Eski Narx (UZS)',
      'Nishon',
      'Jami Zaxira',
      'Variantlar',
      'Teglar',
      'Rasm URL',
    ];

    const escapeCsv = (val: any) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = storeProducts.map((p) => {
      const nameUz = typeof p.name === 'object' ? p.name.uz || '' : String(p.name || '');
      const nameRu = typeof p.name === 'object' ? p.name.ru || '' : '';
      const nameEn = typeof p.name === 'object' ? p.name.en || '' : '';
      const catName = p.category
        ? (typeof p.category.name === 'object' ? p.category.name.uz : p.category.name)
        : (storeCategories.find((c) => c.id === p.category_id)?.name as any)?.uz || 'Kategoriya';

      const totalStock = (p.variants || []).reduce((sum, v) => sum + (Number(v.stock_count) || 0), 0);
      const variantsStr = (p.variants || [])
        .map((v) => `${[v.size, v.color].filter(Boolean).join('/') || 'Std'}:${v.price || p.base_price} UZS (${v.stock_count} dona)`)
        .join('; ');

      const tagsStr = (p.tags || []).join(', ');
      const mainImg = p.images && p.images.length > 0 ? p.images[0] : '';

      return [
        escapeCsv(p.id),
        escapeCsv(nameUz),
        escapeCsv(nameRu),
        escapeCsv(nameEn),
        escapeCsv(catName),
        escapeCsv(p.base_price),
        escapeCsv(p.cost_price || ''),
        escapeCsv(p.old_price || ''),
        escapeCsv(p.badge || 'NONE'),
        escapeCsv(totalStock),
        escapeCsv(variantsStr),
        escapeCsv(tagsStr),
        escapeCsv(mainImg),
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `katalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCsvExportToast(t('admin_toast_csv_exported'));
    setTimeout(() => setCsvExportToast(null), 3000);

    addLog({
      action: 'Katalog CSV eksport qilindi',
      module: 'Catalog',
      actor: 'Super Admin',
      details: `${storeProducts.length} ta tovar CSV formatida yuklab olindi`,
      type: 'INFO',
    });
  };

  const handleDownloadCsvTemplate = () => {
    const sampleHeaders = [
      'Nomi_UZ',
      'Nomi_RU',
      'Nomi_EN',
      'Kategoriya',
      'Asosiy_Narx',
      'Tannarx',
      'Eski_Narx',
      'Nishon',
      'Ombor_Soni',
      'Variant_Olcham',
      'Variant_Rang',
      'Teglar',
      'Rasm_URL',
    ];

    const sampleRow1 = [
      '"Charm Erkaklar Kamari"',
      '"Кожаный Мужской Ремень"',
      '"Leather Men Belt"',
      '"Kiyimlar"',
      '"150000"',
      '"90000"',
      '"190000"',
      '"NEW"',
      '"25"',
      '"115cm"',
      '"Qora"',
      '"charm, kamar, erkaklar"',
      '"https://images.unsplash.com/photo-1544441893-675973e31985?w=800"',
    ];

    const sampleRow2 = [
      '"Smart Band Pro 8"',
      '"Фитнес Браслет Pro 8"',
      '"Smart Fitness Band Pro 8"',
      '"Soatlar"',
      '"280000"',
      '"180000"',
      '"350000"',
      '"TOP"',
      '"15"',
      '"Standard"',
      '"Qora"',
      '"fitnes, soat, gadjet"',
      '"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"',
    ];

    const csvContent = '\uFEFF' + [sampleHeaders.join(';'), sampleRow1.join(';'), sampleRow2.join(';')].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'katalog_namunaviy_shablon.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvImportFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCsvImportText(event.target.result);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleImportCsvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvImportText.trim()) {
      alert("Iltimos, CSV faylni yuklang yoki matnini kiriting!");
      return;
    }

    setCsvImportLoading(true);
    try {
      const cleanContent = csvImportText.replace(/^\uFEFF/, '').trim();
      const lines = cleanContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

      if (lines.length <= 1) {
        alert("CSV faylda tovarlar topilmadi!");
        setCsvImportLoading(false);
        return;
      }

      // Skip header row
      const dataRows = lines.slice(1);
      const newItems: Omit<ProductItem, 'id'>[] = [];

      dataRows.forEach((row) => {
        // Split by semicolon (;) or comma (,)
        const delimiter = row.includes(';') ? ';' : ',';
        const cols = row.split(delimiter).map((c) => c.replace(/^"|"$/g, '').trim());

        if (cols.length >= 4 && cols[0]) {
          const nameUz = cols[0] || 'Yangi Mahsulot';
          const nameRu = cols[1] || nameUz;
          const nameEn = cols[2] || nameUz;
          const catNameInput = cols[3] || 'Kiyimlar';
          const basePrice = Number(cols[4]) || 150000;
          const costPrice = cols[5] ? Number(cols[5]) : Math.round(basePrice * 0.65);
          const oldPrice = cols[6] ? Number(cols[6]) : null;
          const badgeRaw = (cols[7] || 'NEW').toUpperCase();
          const badge: 'NEW' | 'TOP' | 'SALE' | 'NONE' = ['NEW', 'TOP', 'SALE', 'NONE'].includes(badgeRaw)
            ? (badgeRaw as any)
            : 'NEW';
          const stockCount = Number(cols[8]) || 10;
          const variantSize = cols[9] || 'Standard';
          const variantColor = cols[10] || 'Default';
          const tags = cols[11] ? cols[11].split(',').map((t) => t.trim()) : ['import'];
          const imgUrl = cols[12] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

          const matchedCat = storeCategories.find(
            (c) =>
              (typeof c.name === 'object' ? c.name.uz : c.name).toLowerCase() === catNameInput.toLowerCase()
          ) || storeCategories[0];

          newItems.push({
            category_id: matchedCat?.id || 1,
            name: { uz: nameUz, ru: nameRu, en: nameEn },
            description: {
              uz: `${nameUz} - yuqori sifatli va qulay mahsulot.`,
              ru: `${nameRu} - высокое качество и надежность.`,
              en: `${nameEn} - premium quality authentic item.`,
            },
            base_price: basePrice,
            cost_price: costPrice,
            old_price: oldPrice,
            badge,
            tags,
            images: [imgUrl],
            category: matchedCat
              ? {
                  id: matchedCat.id,
                  name: typeof matchedCat.name === 'object' ? matchedCat.name : { uz: String(matchedCat.name), ru: '', en: '' },
                }
              : { id: 1, name: { uz: 'Boshqa', ru: 'Другое', en: 'Other' } },
            variants: [
              {
                id: Date.now() + Math.floor(Math.random() * 100000),
                size: variantSize,
                color: variantColor,
                price: basePrice,
                cost_price: costPrice,
                stock_count: stockCount,
              },
            ],
          });
        }
      });

      if (newItems.length === 0) {
        alert(t('admin_csv_import_error'));
        setCsvImportLoading(false);
        return;
      }

      bulkAddProductsToStore(newItems);
      setCsvImportToast(`${newItems.length} ${t('admin_toast_csv_imported')}`);
      setTimeout(() => setCsvImportToast(null), 3000);
      setShowCsvImportModal(false);
      setCsvImportText('');

      addLog({
        action: 'Katalogga CSV orqali tovarlar import qilindi',
        module: 'Catalog',
        actor: 'Super Admin',
        details: `${newItems.length} ta yangi tovar bazaga muvaffaqiyatli kiritildi`,
        type: 'SUCCESS',
      });
    } catch (err) {
      console.error('CSV parse error:', err);
      alert(t('admin_csv_import_error'));
    } finally {
      setCsvImportLoading(false);
    }
  };

  const handleInlineSave = (productId: number, field: 'price' | 'stock', value: string) => {
    const numVal = Math.max(0, Number(value) || 0);
    if (field === 'price') {
      inlineUpdateStockAndPriceInStore(productId, numVal, undefined);
    } else {
      inlineUpdateStockAndPriceInStore(productId, undefined, numVal);
    }
    setInlineEditingProductId(null);
    setInlineEditField(null);
    setQuickStockToast(t('admin_inline_edit_saved'));
    setTimeout(() => setQuickStockToast(null), 2000);
  };

  const handleAiGenerateTags = () => {
    if (!productFormNameUz.trim()) return;
    const cat = storeCategories.find((c) => c.id === productFormCategoryId);
    const catName = cat ? (typeof cat.name === 'object' ? cat.name.uz : cat.name) : 'tovar';
    const words = productFormNameUz.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const generated = Array.from(new Set([...words, catName.toLowerCase(), 'premium', 'yangi', 'trend'])).slice(0, 5).join(', ');
    setProductFormTags(generated);
  };

  // Category Handlers
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryFormNameUz('');
    setCategoryFormNameRu('');
    setCategoryFormNameEn('');
    setCategoryFormImage('');
    setCategoryFormParentId(null);
    setCategoryFormShowOnHome(true);
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: CategoryItemStore) => {
    setEditingCategoryId(cat.id);
    setCategoryFormNameUz(typeof cat.name === 'object' ? cat.name.uz || '' : String(cat.name || ''));
    setCategoryFormNameRu(typeof cat.name === 'object' ? cat.name.ru || '' : '');
    setCategoryFormNameEn(typeof cat.name === 'object' ? cat.name.en || '' : '');
    setCategoryFormImage(cat.image || '');
    setCategoryFormParentId(cat.parentId || null);
    setCategoryFormShowOnHome(cat.showOnHome !== false);
    setShowCategoryModal(true);
  };

  const handleCategoryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormNameUz.trim()) {
      alert('Kategoriya nomi kiritilishi shart!');
      return;
    }
    if (!categoryFormImage) {
      alert('Iltimos, kategoriya rasmini yuklang!');
      return;
    }

    const catNameObj = {
      uz: categoryFormNameUz.trim(),
      ru: categoryFormNameRu.trim() || categoryFormNameUz.trim(),
      en: categoryFormNameEn.trim() || categoryFormNameUz.trim(),
    };

    if (editingCategoryId) {
      updateCategoryInStore(editingCategoryId, {
        name: catNameObj,
        image: categoryFormImage,
        parentId: categoryFormParentId,
        showOnHome: categoryFormShowOnHome,
      });

      addLog({
        action: 'Kategoriya tahrirlandi',
        module: 'Catalog',
        actor: 'Super Admin',
        details: `${categoryFormNameUz.trim()} toifasi yangilandi`,
        type: 'INFO',
      });
    } else {
      addCategory({
        name: catNameObj,
        image: categoryFormImage,
        isActive: true,
        showOnHome: categoryFormShowOnHome,
        parentId: categoryFormParentId,
      });

      addLog({
        action: 'Yangi kategoriya yaratildi',
        module: 'Catalog',
        actor: 'Super Admin',
        details: `${categoryFormNameUz.trim()} toifasi tizimga qo'shildi`,
        type: 'SUCCESS',
      });
    }

    setCategorySavedAlert(true);
    setTimeout(() => setCategorySavedAlert(false), 2500);
    setShowCategoryModal(false);
  };

  const handleCategoryReorder = (catId: number, direction: 'up' | 'down') => {
    reorderCategoryInStore(catId, direction);
  };

  // Review Handlers
  const handleReviewAction = (id: number, status: 'APPROVED' | 'REJECTED') => {
    updateReviewStatusInStore(id, status);
    setReviewActionToast(status === 'APPROVED' ? 'Sharh tasdiqlandi ✓' : 'Sharh rad etildi ✕');
    setTimeout(() => setReviewActionToast(null), 2500);

    addLog({
      action: status === 'APPROVED' ? 'Sharh tasdiqlandi' : 'Sharh rad etildi',
      module: 'Catalog',
      actor: 'Super Admin',
      details: `Sharh #${id} holati "${status}" ga o'zgartirildi`,
      type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
    });
  };

  const handleOpenReviewReply = (reviewId: number) => {
    setReplyingReviewId(reviewId);
    const existing = storeReviews.find((r) => r.id === reviewId);
    setReviewReplyText(existing?.adminReply?.text || '');
    setShowReviewReplyModal(true);
  };

  const handleSaveReviewReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReviewId || !reviewReplyText.trim()) return;

    addAdminReplyInStore(replyingReviewId, reviewReplyText.trim(), reviewReplyAuthor.trim() || settings.storeName || "Do'kon Ma'muriyati");
    setReviewActionToast(t('admin_toast_reply_saved'));
    setTimeout(() => setReviewActionToast(null), 2500);
    setShowReviewReplyModal(false);
    setReplyingReviewId(null);
    setReviewReplyText('');

    addLog({
      action: "Sharhga rasmiy do'kon javobi yozildi",
      module: 'Catalog',
      actor: 'Super Admin',
      details: `Sharh #${replyingReviewId} ga javob e'lon qilindi`,
      type: 'SUCCESS',
    });
  };

  const handleApproveAllPendingReviews = () => {
    const pending = storeReviews.filter((r) => r.status === 'PENDING');
    if (pending.length === 0) return;
    pending.forEach((r) => updateReviewStatusInStore(r.id, 'APPROVED'));
    setReviewActionToast(`${pending.length} ta kutilayotgan sharh tasdiqlandi!`);
    setTimeout(() => setReviewActionToast(null), 2500);

    addLog({
      action: 'Barcha sharhlar tasdiqlandi',
      module: 'Catalog',
      actor: 'Super Admin',
      details: `${pending.length} ta yangi sharh ommaviy tasdiqlandi`,
      type: 'SUCCESS',
    });
  };

  const handleAddBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) return;
    if (!newBannerImage) {
      alert("Iltimos, banner rasmini qurilmadan yuklang!");
      return;
    }

    addBanner({
      title: { uz: newBannerTitle.trim(), ru: newBannerTitle.trim(), en: newBannerTitle.trim() },
      subtitle: { uz: 'Yangi Mavsum Aksiyasi', ru: 'Акция Нового Сезона', en: 'New Season Deals' },
      image: newBannerImage,
      link: newBannerLink.trim() || '/catalog',
      isActive: true,
    });

    addLog({
      action: 'Yangi aksiya banneri yaratildi',
      module: 'Marketing',
      actor: 'Super Admin',
      details: `${newBannerTitle.trim()} banneri e'lon qilindi`,
      type: 'SUCCESS',
    });

    setNewBannerTitle('');
    setNewBannerImage('');
    setNewBannerLink('/catalog');
  };

  const handleAddPromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const newPromo: PromocodeAdmin = {
      id: Date.now(),
      code: newPromoCode.toUpperCase().trim(),
      discount: Number(newPromoDiscount) || 10,
      minOrder: 100000,
      usedCount: 0,
      maxUsage: 100,
    };

    setPromocodesList([newPromo, ...promocodesList]);
    addLog({
      action: 'Yangi promokod yaratildi',
      module: 'Marketing',
      actor: 'Super Admin',
      details: `${newPromo.code} (-${newPromo.discount}%) promokodi faollashtirildi`,
      type: 'SUCCESS',
    });
    setNewPromoCode('');
    setShowAddPromoModal(false);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffPhone.trim()) return;

    addStaff({
      name: newStaffName.trim(),
      phone: newStaffPhone.trim(),
      role: newStaffRole,
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    });

    addLog({
      action: 'Yangi xodim qo\'shildi',
      module: 'Settings',
      actor: 'Super Admin',
      details: `${newStaffName.trim()} (${newStaffRole}) jamoaga qo'shildi`,
      type: 'SUCCESS',
    });

    setNewStaffName('');
    setNewStaffPhone('');
    setShowAddStaffModal(false);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    addNotificationToStore({
      title: broadcastTitle,
      message: broadcastMessage,
      type: broadcastType,
      image: broadcastImage.trim() || undefined,
      actionText: broadcastActionText.trim() || undefined,
      actionLink: broadcastActionText.trim() ? broadcastActionLink : undefined,
      targetAudience: broadcastAudience,
    });

    addLog({
      action: 'Ommaviy push xabarnoma yuborildi',
      module: 'Marketing',
      actor: 'Super Admin',
      details: `"${broadcastTitle}" barcha foydalanuvchilarga yo'llandi`,
      type: 'INFO',
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastImage('');
    setBroadcastActionText('');
    setBroadcastSuccessAlert(true);
    setTimeout(() => setBroadcastSuccessAlert(false), 4000);
  };


  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    settings.updateSettings(settingsForm);
    setSettingsSavedAlert(true);
    addLog({
      action: 'Tizim va do\'kon sozlamalari yangilandi',
      module: 'Settings',
      actor: 'Super Admin',
      details: 'Yetkazib berish stavkalari va to\'lov tizimlari saqlandi',
      type: 'SUCCESS',
    });
    setTimeout(() => setSettingsSavedAlert(false), 3000);
  };

  // 6 Primary Navigation Hubs Definition
  // 6 Primary Navigation Hubs Definition
  const primaryHubs = [
    {
      id: 'dashboard',
      label: t('admin_tab_dashboard'),
      icon: BarChart3,
    },
    {
      id: 'orders',
      label: t('admin_tab_orders'),
      icon: ShoppingBag,
    },
    {
      id: 'catalog',
      label: t('admin_tab_catalog_hub'),
      icon: Package,
    },
    {
      id: 'customers',
      label: t('admin_tab_customers_crm'),
      icon: Users,
    },
    {
      id: 'marketing',
      label: t('admin_tab_marketing_hub'),
      icon: Flame,
    },
    {
      id: 'settings',
      label: t('admin_tab_settings_hub'),
      icon: Settings,
    },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-900 dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. TOP NAVBAR (FULL-WIDTH & DECLUTTERED) */}
      <header className="w-full h-16 border-b border-gray-200/80 dark:border-white/10 px-3 sm:px-6 lg:px-8 flex items-center justify-between bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl sticky top-0 z-30 shrink-0">
        {/* Left: Mobile Toggle & Store Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-800 dark:text-white active:scale-95 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              <Store className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider block truncate max-w-[120px] sm:max-w-[200px]">
                {settings.storeName || 'PREMIUM STORE'}
              </span>
              <span className="text-[10px] text-gray-400 font-medium hidden sm:block">
                Admin Console Hub
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search Bar (Hidden on Dashboard and Reviews subtab) */}
        {activeTab !== 'dashboard' && !(activeTab === 'catalog' && catalogSubTab === 'reviews') ? (
          <div className="flex items-center flex-1 max-w-sm sm:max-w-md ml-4 justify-end">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder={
                  activeTab === 'catalog'
                    ? 'Tovarlarni qidirish...'
                    : activeTab === 'orders'
                    ? 'Buyurtmalarni qidirish (#ID, mijoz, tel)...'
                    : activeTab === 'customers'
                    ? 'Mijozlarni qidirish...'
                    : t('admin_cmd_placeholder')
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50/80 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </header>

      {/* 2. BODY ROW: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex flex-row min-w-0 w-full relative">
        {/* DESKTOP SIDEBAR (6 CLEAN HUBS) */}
        <aside className="hidden lg:flex w-64 border-r border-gray-200/80 dark:border-white/10 p-5 flex-col justify-between shrink-0 bg-white dark:bg-[#111827] sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto z-20">
          <div className="space-y-2">
            <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/10">
              BOSHQARUV MARKAZI
            </div>
            <div className="space-y-1 pt-1">
              {primaryHubs.map((hub) => {
                const Icon = hub.icon;
                const isActive = activeTab === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(hub.id as any);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
                      isActive
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                    <span>{hub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-white/10 pt-4 space-y-3">
            {/* Admin User Badge */}
            <div className="flex items-center gap-2.5 px-1 py-1">
              <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                A
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-gray-950 dark:text-white truncate">Admin</div>
                <div className="text-[10px] text-gray-400 font-medium truncate">{t('admin_profile_role')}</div>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold active:scale-95 transition-all"
            >
              <span>{t('admin_view_store')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT VIEWPORT */}
        <main className="flex-1 min-w-0 flex flex-col pb-24 lg:pb-12 overflow-x-hidden">
          <div className="p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 lg:space-y-8 max-w-7xl w-full mx-auto">
            {/* 1. DASHBOARD & ANALYTICS HUB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Period Filter Header */}
                {/* Period Filter Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 p-4 rounded-2xl shadow-xs">
                  <div>
                    <h2 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_tab_dashboard')}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {analyticsPeriod === 'CUSTOM'
                        ? `📅 ${customStartDate} ➔ ${customEndDate}`
                        : `Asosiy savdo ko'rsatkichlari va dinamika`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Period Pills */}
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#161F30] p-1 rounded-xl border border-gray-200/80 dark:border-white/10 overflow-x-auto no-scrollbar">
                      {[
                        { id: 'TODAY', label: t('admin_period_today') },
                        { id: 'WEEK', label: t('admin_period_week') },
                        { id: 'MONTH', label: t('admin_period_month') },
                        { id: 'YEAR', label: t('admin_period_year') },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setAnalyticsPeriod(p.id as any)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                            analyticsPeriod === p.id
                              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-2xs'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}

                      {/* Custom Range Button */}
                      <button
                        type="button"
                        onClick={() => setShowCustomDateModal(true)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 ${
                          analyticsPeriod === 'CUSTOM'
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-2xs'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{t('admin_period_custom')}</span>
                      </button>
                    </div>

                    {/* Compare to Previous Period Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsComparingPeriod(!isComparingPeriod)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                        isComparingPeriod
                          ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-xs'
                          : 'bg-gray-100 dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1F293D]'
                      }`}
                      title="O'tgan davr bilan taqqoslash"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{t('admin_period_compare')}</span>
                    </button>
                  </div>
                </div>

                {/* LOW STOCK ALERT CARD (If any item has <= 3 stock) */}
                {lowStockProducts.length > 0 && (
                  <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                            {t('admin_low_stock_title')} ({lowStockProducts.length} ta tovar)
                          </h3>
                          <p className="text-[11px] text-amber-700 dark:text-amber-400">
                            {t('admin_low_stock_desc')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                      {lowStockProducts.map((p) => {
                        const nameStr = typeof p.name === 'object' ? (p.name as any)[lang] || p.name.uz : p.name;
                        const count = p.variants?.[0]?.stock_count ?? 0;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setCatalogSubTab('products');
                              setActiveTab('catalog');
                              setSearchQuery(nameStr);
                            }}
                            className="bg-white dark:bg-[#111827] border border-amber-200/80 dark:border-amber-800/40 rounded-xl p-3 flex items-center justify-between gap-2 shadow-2xs hover:border-amber-400 dark:hover:border-amber-600 transition-all text-left group active:scale-95"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200'}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200/60 dark:border-white/10"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-gray-950 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                  {nameStr}
                                </div>
                                <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                                  ⚠️ {count} dona qoldi
                                </span>
                              </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white shrink-0 transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. ORDER PIPELINE FUNNEL (Feature 3) */}
                <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                        {t('admin_pipeline_title')}
                      </h3>
                    </div>
                    <span className="text-[11px] text-gray-400 font-semibold hidden sm:inline">
                      {t('admin_status_filter_hint')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'NEW', label: t('admin_status_new'), count: pipelineCounts.NEW, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200/70 dark:border-indigo-800/40' },
                      { id: 'DELIVERING', label: t('admin_status_delivering'), count: pipelineCounts.DELIVERING, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200/70 dark:border-amber-800/40' },
                      { id: 'COMPLETED', label: t('admin_status_completed'), count: pipelineCounts.COMPLETED, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/70 dark:border-emerald-800/40' },
                      { id: 'CANCELLED', label: t('admin_status_cancelled'), count: pipelineCounts.CANCELLED, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50/70 dark:bg-red-950/40 border-red-200/70 dark:border-red-800/40' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setStatusFilter(st.id);
                          setActiveTab('orders');
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-start justify-between gap-1.5 transition-all active:scale-95 text-left hover:shadow-xs ${st.bg}`}
                      >
                        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                          {st.label}
                        </span>
                        <div className="flex items-baseline justify-between w-full">
                          <span className={`text-xl font-extrabold ${st.color}`}>{st.count}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 opacity-60" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* METRICS CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  {metrics.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3 shadow-xs hover:border-gray-300 dark:hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 truncate max-w-[90px] sm:max-w-none">
                            {m.title}
                          </span>
                          <div className={`p-1.5 sm:p-2 rounded-xl ${m.color}`}>
                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        </div>
                        <div>
                          <div className="text-base sm:text-xl font-extrabold text-gray-950 dark:text-white truncate">
                            {m.value}
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {m.change}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ANALYTICS CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                  <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-xs relative">
                    {/* Chart Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                            {t('admin_analytics_revenue_trend')}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-200/60 dark:border-emerald-800/40">
                            ↗ {displayComparisonDelta}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {analyticsPeriod === 'CUSTOM'
                            ? `${customStartDate} ➔ ${customEndDate}`
                            : `${weeklyData.length} ta tahliliy nuqta`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Comparison Legend */}
                        {isComparingPeriod && (
                          <div className="flex items-center gap-2.5 text-[11px] font-bold">
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-xs bg-gray-950 dark:bg-white inline-block shadow-2xs" />
                              <span className="text-gray-700 dark:text-gray-300 text-[10px]">{t('admin_legend_current')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-xs bg-gray-300 dark:bg-white/30 inline-block" />
                              <span className="text-gray-400 text-[10px]">{t('admin_legend_previous')}</span>
                            </div>
                          </div>
                        )}

                        {/* Chart View Switcher (Area vs Bar) */}
                        <div className="flex items-center bg-gray-100 dark:bg-[#161F30] p-0.5 rounded-lg border border-gray-200/80 dark:border-white/10">
                          <button
                            type="button"
                            onClick={() => setChartType('AREA')}
                            className={`p-1.5 rounded-md flex items-center gap-1 text-[11px] font-bold transition-all ${
                              chartType === 'AREA'
                                ? 'bg-white dark:bg-[#111827] text-gray-950 dark:text-white shadow-2xs'
                                : 'text-gray-500 hover:text-gray-950 dark:hover:text-white'
                            }`}
                            title="To'lqinli chiziqli grafik"
                          >
                            <LineChart className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t('admin_chart_type_area')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setChartType('BAR')}
                            className={`p-1.5 rounded-md flex items-center gap-1 text-[11px] font-bold transition-all ${
                              chartType === 'BAR'
                                ? 'bg-white dark:bg-[#111827] text-gray-950 dark:text-white shadow-2xs'
                                : 'text-gray-500 hover:text-gray-950 dark:hover:text-white'
                            }`}
                            title="Ustunli zamonaviy grafik"
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t('admin_chart_type_bar')}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Chart Canvas */}
                    <div className="relative w-full h-56 select-none">
                      {/* Floating Glassmorphism Tooltip */}
                      {hoveredChartIndex !== null && chartPoints[hoveredChartIndex] && (
                        <div
                          className="absolute pointer-events-none z-20 bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-950 px-3 py-2 rounded-xl shadow-xl backdrop-blur-md text-[11px] font-bold transition-all duration-150 transform -translate-x-1/2 -translate-y-full border border-white/10 dark:border-gray-900/10 flex flex-col gap-0.5 min-w-[120px]"
                          style={{
                            left: `${(chartPoints[hoveredChartIndex].x / svgWidth) * 100}%`,
                            top: `${(chartPoints[hoveredChartIndex].y / svgHeight) * 100 - 8}%`,
                          }}
                        >
                          <div className="flex items-center justify-between text-[10px] text-gray-300 dark:text-gray-600 border-b border-white/10 dark:border-gray-900/10 pb-0.5 gap-3">
                            <span>{chartPoints[hoveredChartIndex].d.day}</span>
                            <span className="text-emerald-400 dark:text-emerald-600 font-extrabold">
                              {isComparingPeriod && chartPoints[hoveredChartIndex].d.prevAmount
                                ? `${
                                    Number(
                                      (
                                        ((chartPoints[hoveredChartIndex].d.amount -
                                          chartPoints[hoveredChartIndex].d.prevAmount) /
                                          chartPoints[hoveredChartIndex].d.prevAmount) *
                                        100
                                      ).toFixed(0)
                                    ) >= 0
                                      ? '+'
                                      : ''
                                  }${(
                                    ((chartPoints[hoveredChartIndex].d.amount -
                                      chartPoints[hoveredChartIndex].d.prevAmount) /
                                      chartPoints[hoveredChartIndex].d.prevAmount) *
                                    100
                                  ).toFixed(0)}%`
                                : `${(
                                    (chartPoints[hoveredChartIndex].d.amount / (displayRevenue || 1)) *
                                    100
                                  ).toFixed(1)}% ulush`}
                            </span>
                          </div>
                          <div className="text-xs font-black pt-0.5">
                            {chartPoints[hoveredChartIndex].d.amount.toLocaleString()} UZS
                          </div>
                          {isComparingPeriod && chartPoints[hoveredChartIndex].d.prevAmount && (
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                              O'tgan: {chartPoints[hoveredChartIndex].d.prevAmount?.toLocaleString()} UZS
                            </div>
                          )}
                        </div>
                      )}

                      {/* SVG Canvas */}
                      <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="w-full h-full overflow-visible"
                        onMouseLeave={() => setHoveredChartIndex(null)}
                      >
                        <defs>
                          {/* Area Gradient */}
                          <linearGradient id="areaGradientLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#111827" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#111827" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="areaGradientDark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#312E81" />
                            <stop offset="100%" stopColor="#111827" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid Lines and Y-Axis Labels */}
                        {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                          const yPos = padTop + plotHeight * (1 - ratio);
                          const val = Math.round(maxWeeklyAmount * ratio);
                          return (
                            <g key={idx}>
                              <line
                                x1={padLeft}
                                y1={yPos}
                                x2={svgWidth - padRight}
                                y2={yPos}
                                stroke="currentColor"
                                strokeDasharray="3 4"
                                className="text-gray-200 dark:text-white/10"
                                strokeWidth="1"
                              />
                              <text
                                x={padLeft - 8}
                                y={yPos + 3.5}
                                textAnchor="end"
                                className="text-[9px] font-bold fill-gray-400 dark:fill-gray-500"
                              >
                                {formatAxisVal(val)}
                              </text>
                            </g>
                          );
                        })}

                        {/* MODE 1: AREA / SPLINE WAVE */}
                        {chartType === 'AREA' && (
                          <>
                            {/* Previous Period Spline (if comparing) */}
                            {isComparingPeriod && (
                              <path
                                d={smoothPrevLinePath}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                className="text-gray-300 dark:text-white/30"
                              />
                            )}

                            {/* Area Gradient Fill */}
                            <path
                              d={smoothAreaPath}
                              className="fill-[url(#areaGradientLight)] dark:fill-[url(#areaGradientDark)] transition-all duration-300"
                            />

                            {/* Main Smooth Line */}
                            <path
                              d={smoothLinePath}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-950 dark:text-white transition-all duration-300"
                            />

                            {/* Interactive Points & Guides */}
                            {chartPoints.map((pt, idx) => {
                              const isHovered = hoveredChartIndex === idx;
                              return (
                                <g key={idx} className="cursor-pointer">
                                  {/* Vertical Guide Line on Hover */}
                                  {isHovered && (
                                    <line
                                      x1={pt.x}
                                      y1={padTop}
                                      x2={pt.x}
                                      y2={padTop + plotHeight}
                                      stroke="currentColor"
                                      strokeDasharray="2 3"
                                      className="text-indigo-500/80"
                                      strokeWidth="1.5"
                                    />
                                  )}

                                  {/* Previous Period Point */}
                                  {isComparingPeriod && (
                                    <circle
                                      cx={pt.x}
                                      cy={pt.prevY}
                                      r="3"
                                      className="fill-gray-300 dark:fill-white/40"
                                    />
                                  )}

                                  {/* Current Period Point */}
                                  <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isHovered ? '5' : '3.5'}
                                    className={`transition-all duration-150 ${
                                      isHovered
                                        ? 'fill-indigo-600 dark:fill-white stroke-2 stroke-white dark:stroke-gray-950'
                                        : 'fill-gray-950 dark:fill-white'
                                    }`}
                                  />

                                  {/* Invisible Hitbox for smooth hover */}
                                  <rect
                                    x={pt.x - slotWidth / 2}
                                    y={padTop}
                                    width={slotWidth}
                                    height={plotHeight + padBottom}
                                    fill="transparent"
                                    onMouseEnter={() => setHoveredChartIndex(idx)}
                                    onTouchStart={() => setHoveredChartIndex(idx)}
                                  />
                                </g>
                              );
                            })}
                          </>
                        )}

                        {/* MODE 2: MODERN NEO BARS */}
                        {chartType === 'BAR' && (
                          <>
                            {chartPoints.map((pt, idx) => {
                              const isHovered = hoveredChartIndex === idx;
                              const barSlotWidth = Math.min(36, slotWidth * 0.72);
                              const singleBarWidth = isComparingPeriod ? barSlotWidth / 2 - 2 : barSlotWidth;
                              const barHeight = Math.max(6, plotHeight - (pt.y - padTop));
                              const prevBarHeight = Math.max(6, plotHeight - (pt.prevY - padTop));

                              return (
                                <g
                                  key={idx}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredChartIndex(idx)}
                                  onTouchStart={() => setHoveredChartIndex(idx)}
                                >
                                  {/* Background Bar Track */}
                                  <rect
                                    x={pt.x - barSlotWidth / 2}
                                    y={padTop}
                                    width={barSlotWidth}
                                    height={plotHeight}
                                    rx="6"
                                    className="fill-gray-100/70 dark:fill-[#161F30]/60"
                                  />

                                  {/* Previous Period Bar (if comparing) */}
                                  {isComparingPeriod && (
                                    <rect
                                      x={pt.x - barSlotWidth / 2 + 2}
                                      y={padTop + plotHeight - prevBarHeight}
                                      width={singleBarWidth}
                                      height={prevBarHeight}
                                      rx="4"
                                      className="fill-gray-300 dark:fill-white/30 transition-all duration-300"
                                    />
                                  )}

                                  {/* Main Current Bar */}
                                  <rect
                                    x={isComparingPeriod ? pt.x - barSlotWidth / 2 + singleBarWidth + 4 : pt.x - barSlotWidth / 2}
                                    y={padTop + plotHeight - barHeight}
                                    width={singleBarWidth}
                                    height={barHeight}
                                    rx="4"
                                    className={`transition-all duration-300 ${
                                      isHovered
                                        ? 'fill-indigo-600 dark:fill-indigo-400'
                                        : 'fill-gray-950 dark:fill-white'
                                    }`}
                                  />
                                </g>
                              );
                            })}
                          </>
                        )}

                        {/* X-Axis Date Labels */}
                        {chartPoints.map((pt, idx) => (
                          <text
                            key={idx}
                            x={pt.x}
                            y={svgHeight - 10}
                            textAnchor="middle"
                            className={`text-[10px] font-bold transition-colors ${
                              hoveredChartIndex === idx
                                ? 'fill-gray-950 dark:fill-white'
                                : 'fill-gray-400 dark:fill-gray-500'
                            }`}
                          >
                            {pt.d.day}
                          </text>
                        ))}
                      </svg>
                    </div>

                    {/* 3 MINI-HUD ANALYTIC INSIGHT CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-gray-100 dark:border-white/10">
                      <div className="bg-gray-50 dark:bg-[#161F30] rounded-xl p-2.5 flex items-center gap-2.5 border border-gray-200/60 dark:border-white/5">
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate">
                            {t('admin_chart_peak')}
                          </div>
                          <div className="text-xs font-black text-gray-950 dark:text-white truncate">
                            {peakChartItem.day}: {peakChartItem.amount.toLocaleString()} UZS
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-[#161F30] rounded-xl p-2.5 flex items-center gap-2.5 border border-gray-200/60 dark:border-white/5">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate">
                            {t('admin_chart_avg')}
                          </div>
                          <div className="text-xs font-black text-gray-950 dark:text-white truncate">
                            {averageIntervalRevenue.toLocaleString()} UZS
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-[#161F30] rounded-xl p-2.5 flex items-center gap-2.5 border border-gray-200/60 dark:border-white/5">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate">
                            {t('admin_chart_growth')}
                          </div>
                          <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 truncate">
                            {displayComparisonDelta} Barqaror
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                            {t('admin_analytics_payment_split')}
                          </h3>
                          <p className="text-[10px] text-gray-400 font-semibold pt-0.5">
                            {displayRevenue.toLocaleString()} UZS
                          </p>
                        </div>

                        {/* Switcher Toggle [ PieChart | AlignLeft ] */}
                        <div className="flex items-center bg-gray-100 dark:bg-[#161F30] p-0.5 rounded-lg border border-gray-200/80 dark:border-white/10 text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => setPaymentChartType('DONUT')}
                            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                              paymentChartType === 'DONUT'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 shadow-xs'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            <PieChart className="w-3.5 h-3.5" />
                            <span>{t('admin_payment_view_donut')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentChartType('BAR')}
                            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                              paymentChartType === 'BAR'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 shadow-xs'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            <AlignLeft className="w-3.5 h-3.5" />
                            <span>{t('admin_payment_view_bar')}</span>
                          </button>
                        </div>
                      </div>

                      {/* MODE 1: DONUT LARGE VIEW */}
                      {paymentChartType === 'DONUT' && (
                        <div className="pt-2 flex flex-col items-center justify-center space-y-4">
                          {/* Large Interactive Donut */}
                          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
                            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                              {/* Background Track */}
                              <circle
                                cx="80"
                                cy="80"
                                r="62"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="15"
                                className="text-gray-100 dark:text-[#161F30]"
                              />

                              {/* Slice 1: Payme */}
                              <circle
                                cx="80"
                                cy="80"
                                r="62"
                                fill="none"
                                stroke="#00CCCC"
                                strokeWidth={hoveredPaymentKey === 'payme' ? '19' : '15'}
                                strokeDasharray={`${0.45 * 389.56} 389.56`}
                                strokeDashoffset="0"
                                className="transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentKey('payme')}
                                onMouseLeave={() => setHoveredPaymentKey(null)}
                              />

                              {/* Slice 2: Click */}
                              <circle
                                cx="80"
                                cy="80"
                                r="62"
                                fill="none"
                                stroke="#0073FF"
                                strokeWidth={hoveredPaymentKey === 'click' ? '19' : '15'}
                                strokeDasharray={`${0.35 * 389.56} 389.56`}
                                strokeDashoffset={`${-0.45 * 389.56}`}
                                className="transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentKey('click')}
                                onMouseLeave={() => setHoveredPaymentKey(null)}
                              />

                              {/* Slice 3: Cash */}
                              <circle
                                cx="80"
                                cy="80"
                                r="62"
                                fill="none"
                                stroke="#F59E0B"
                                strokeWidth={hoveredPaymentKey === 'cash' ? '19' : '15'}
                                strokeDasharray={`${0.20 * 389.56} 389.56`}
                                strokeDashoffset={`${-0.80 * 389.56}`}
                                className="transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentKey('cash')}
                                onMouseLeave={() => setHoveredPaymentKey(null)}
                              />
                            </svg>

                            {/* Center Text inside Donut */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                              {hoveredPaymentKey ? (
                                <>
                                  <span className="text-xl font-black text-gray-950 dark:text-white">
                                    {hoveredPaymentKey === 'payme'
                                      ? '45%'
                                      : hoveredPaymentKey === 'click'
                                      ? '35%'
                                      : '20%'}
                                  </span>
                                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                                    {hoveredPaymentKey === 'payme'
                                      ? 'Payme'
                                      : hoveredPaymentKey === 'click'
                                      ? 'Click'
                                      : 'Naqd pul'}
                                  </span>
                                  <span className="text-[10px] font-semibold text-gray-400">
                                    {hoveredPaymentKey === 'payme'
                                      ? `${Math.round(displayRevenue * 0.45).toLocaleString()} UZS`
                                      : hoveredPaymentKey === 'click'
                                      ? `${Math.round(displayRevenue * 0.35).toLocaleString()} UZS`
                                      : `${Math.round(displayRevenue * 0.20).toLocaleString()} UZS`}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-lg font-black text-gray-950 dark:text-white">
                                    100%
                                  </span>
                                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                                    3 xil usul
                                  </span>
                                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    Faol tushum
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Legend Pills below Large Donut */}
                          <div className="grid grid-cols-3 gap-2 w-full pt-1">
                            {[
                              { id: 'payme', label: 'Payme', percent: '45%', color: 'bg-[#00CCCC]', amount: Math.round(displayRevenue * 0.45) },
                              { id: 'click', label: 'Click', percent: '35%', color: 'bg-[#0073FF]', amount: Math.round(displayRevenue * 0.35) },
                              { id: 'cash', label: 'Naqd', percent: '20%', color: 'bg-amber-500', amount: Math.round(displayRevenue * 0.20) },
                            ].map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onMouseEnter={() => setHoveredPaymentKey(item.id)}
                                onMouseLeave={() => setHoveredPaymentKey(null)}
                                className={`p-2 rounded-xl text-center border transition-all ${
                                  hoveredPaymentKey === item.id
                                    ? 'bg-gray-100 dark:bg-[#161F30] border-gray-300 dark:border-white/20 shadow-xs'
                                    : 'bg-gray-50 dark:bg-[#161F30]/60 border-gray-200/60 dark:border-white/5 hover:bg-gray-100/80 dark:hover:bg-[#161F30]'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate">
                                    {item.label}
                                  </span>
                                </div>
                                <div className="text-xs font-black text-gray-950 dark:text-white">
                                  {item.percent}
                                </div>
                                <div className="text-[9px] text-gray-400 font-semibold truncate">
                                  {formatAxisVal(item.amount)}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* MODE 2: LINEAR BARS EXPANDED VIEW */}
                      {paymentChartType === 'BAR' && (
                        <div className="space-y-3 pt-2">
                          {[
                            {
                              id: 'payme',
                              name: 'payme',
                              label: 'Payme to\'lov tizimi',
                              badge: 'bg-[#00CCCC] text-white',
                              percent: 45,
                              amount: Math.round(displayRevenue * 0.45),
                              trackColor: 'bg-[#00CCCC]',
                            },
                            {
                              id: 'click',
                              name: 'click',
                              label: 'Click to\'lov tizimi',
                              badge: 'bg-[#0073FF] text-white',
                              percent: 35,
                              amount: Math.round(displayRevenue * 0.35),
                              trackColor: 'bg-[#0073FF]',
                            },
                            {
                              id: 'cash',
                              name: t('payment_cash_badge'),
                              label: `${t('payment_cash_name')} (Yetkazganda)`,
                              badge: 'bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200',
                              percent: 20,
                              amount: Math.round(displayRevenue * 0.20),
                              trackColor: 'bg-amber-500',
                            },
                          ].map((pm) => (
                            <div
                              key={pm.id}
                              className="p-3 bg-gray-50 dark:bg-[#161F30] rounded-xl border border-gray-200/80 dark:border-white/5 space-y-2 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                            >
                              <div className="flex items-center justify-between text-xs font-bold">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black lowercase ${pm.badge}`}>
                                    {pm.name}
                                  </span>
                                  <span className="text-gray-900 dark:text-white font-bold">
                                    {pm.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-gray-950 dark:text-white">
                                    {pm.percent}%
                                  </span>
                                  <span className="text-[11px] text-gray-400 font-semibold">
                                    ({pm.amount.toLocaleString()} UZS)
                                  </span>
                                </div>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-gray-200/80 dark:bg-white/10 overflow-hidden">
                                <div
                                  style={{ width: `${pm.percent}%` }}
                                  className={`h-full ${pm.trackColor} rounded-full transition-all duration-300`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 5. CANCELLATION RATE & REASONS METRIC (Feature 5) */}
                    <div className="p-3 bg-gray-50 dark:bg-[#161F30] rounded-xl border border-gray-200/80 dark:border-white/10 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400 font-semibold">{t('admin_cancellation_rate_title')}</span>
                        <span className="font-extrabold text-red-600 dark:text-red-400">{cancellationRate}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, Math.max(5, Number(cancellationRate)))}%` }}
                          className="h-full bg-red-500 rounded-full"
                        />
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium truncate">
                        {t('admin_cancellation_top_reason')} <span className="font-bold text-gray-700 dark:text-gray-300">{topCancelReason}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. TOP SELLING PRODUCTS LEADERBOARD (Feature 1) */}
                <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/40">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white">
                          {t('admin_top_selling_title')}
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {t('admin_top_selling_desc')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {topSellingProducts.map((p, idx) => {
                      const nameStr = typeof p.name === 'object' ? (p.name as any)[lang] || p.name.uz : p.name;
                      const catObj = storeCategories.find((c) => c.id === p.category_id);
                      const catName = catObj ? (typeof catObj.name === 'object' ? (catObj.name as any)[lang] || catObj.name.uz : catObj.name) : 'Kategoriya';
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setCatalogSubTab('products');
                            setActiveTab('catalog');
                            setSearchQuery(nameStr);
                          }}
                          className="bg-gray-50/60 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-gray-400 dark:hover:border-white/30 hover:bg-white dark:hover:bg-[#1A2438] hover:shadow-xs transition-all cursor-pointer group active:scale-98"
                          title="Boshqaruv panelida ko'rish uchun bosing"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative shrink-0">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-200/60 dark:border-white/10 group-hover:scale-105 transition-transform"
                              />
                              {idx === 0 ? (
                                <div
                                  className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 ring-2 ring-white dark:ring-gray-900 z-10"
                                  title="1-O'rin (Oltin)"
                                >
                                  <Crown className="w-3.5 h-3.5 fill-amber-100 text-amber-950 stroke-[2]" />
                                </div>
                              ) : idx === 1 ? (
                                <div
                                  className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 via-gray-400 to-slate-500 text-white flex items-center justify-center shadow-md shadow-gray-400/30 ring-2 ring-white dark:ring-gray-900 z-10"
                                  title="2-O'rin (Kumush)"
                                >
                                  <Medal className="w-3.5 h-3.5 fill-slate-100 text-slate-800 stroke-[2]" />
                                </div>
                              ) : (
                                <div
                                  className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white flex items-center justify-center shadow-md shadow-amber-900/30 ring-2 ring-white dark:ring-gray-900 z-10"
                                  title="3-O'rin (Bronza)"
                                >
                                  <Medal className="w-3.5 h-3.5 fill-amber-200 text-amber-950 stroke-[2]" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{catName}</span>
                              <h4 className="text-xs font-bold text-gray-950 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {nameStr}
                              </h4>
                              <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                {p.productRevenue.toLocaleString()} {t('currency')}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end">
                            <div className="text-xs font-black text-gray-950 dark:text-white">{p.soldCount}</div>
                            <span className="text-[10px] text-gray-400 font-semibold">{t('admin_sold_count')}</span>
                            <div className="text-[9px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 mt-0.5">
                              <span>Ochish</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. ORDERS & LOGISTICS HUB */}
            {activeTab === 'orders' && (() => {
              const now = new Date();
              const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
              const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
              const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

              const filteredOrdersList = storeOrders
                .filter((o) => (statusFilter === 'ALL' ? true : o.status === statusFilter))
                .filter((o) => (deliveryFilter === 'ALL' ? true : (o.deliveryMethod || 'courier') === deliveryFilter))
                .filter((o) => (paymentFilter === 'ALL' ? true : (o.paymentType || 'CASH') === paymentFilter))
                .filter((o) => {
                  if (orderDateFilter === 'TODAY') return o.createdAt >= startOfToday;
                  if (orderDateFilter === 'WEEK') return o.createdAt >= startOfWeek;
                  if (orderDateFilter === 'MONTH') return o.createdAt >= startOfMonth;
                  if (orderDateFilter === 'YEAR') return o.createdAt >= startOfYear;
                  return true;
                })
                .filter((o) =>
                  searchQuery
                    ? o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.phone.includes(searchQuery) ||
                      (o.location && o.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (o.courierName && o.courierName.toLowerCase().includes(searchQuery.toLowerCase()))
                    : true
                )
                .sort((a, b) => {
                  if (orderSort === 'NEWEST') return b.createdAt - a.createdAt;
                  if (orderSort === 'OLDEST') return a.createdAt - b.createdAt;
                  if (orderSort === 'PRICE_DESC') return b.total - a.total;
                  if (orderSort === 'PRICE_ASC') return a.total - b.total;
                  return 0;
                });

              const totalOrdersRevenue = storeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
              const countNew = storeOrders.filter((o) => o.status === 'NEW').length;
              const countDelivering = storeOrders.filter((o) => o.status === 'DELIVERING').length;
              const countCompleted = storeOrders.filter((o) => o.status === 'COMPLETED').length;
              const countCancelled = storeOrders.filter((o) => o.status === 'CANCELLED').length;
              const isAllSelected =
                filteredOrdersList.length > 0 &&
                filteredOrdersList.every((o) => selectedOrderIds.includes(o.id));

              return (
                <div className="space-y-4">
                  {/* CLEAN KPI METRICS STRIP */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-xl p-4 shadow-xs">
                      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('admin_orders_kpi_total')}
                      </div>
                      <div className="text-xl font-bold text-gray-950 dark:text-white mt-1">
                        {storeOrders.length} <span className="text-xs font-normal text-gray-400">ta</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                        {totalOrdersRevenue.toLocaleString()} {t('currency')}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <span>{t('admin_orders_kpi_new')}</span>
                        {countNew > 0 && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        )}
                      </div>
                      <div className="text-xl font-bold text-gray-950 dark:text-white mt-1">
                        {countNew} <span className="text-xs font-normal text-gray-400">ta</span>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
                        {countNew > 0 ? 'Qabul qilinishi kutilmoqda' : 'Yangi buyurtma yo\'q'}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-xl p-4 shadow-xs">
                      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('admin_orders_kpi_delivering')}
                      </div>
                      <div className="text-xl font-bold text-gray-950 dark:text-white mt-1">
                        {countDelivering} <span className="text-xs font-normal text-gray-400">ta</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                        Kuryerlar yetkazmoqda
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-xl p-4 shadow-xs">
                      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('admin_orders_kpi_completed')}
                      </div>
                      <div className="text-xl font-bold text-gray-950 dark:text-white mt-1">
                        {countCompleted} <span className="text-xs font-normal text-gray-400">ta</span>
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                        {storeOrders.length > 0
                          ? `${((countCompleted / storeOrders.length) * 100).toFixed(0)}% muvaffaqiyatli`
                          : '0%'}
                      </div>
                    </div>
                  </div>

                  {/* MAIN ORDERS CONTAINER */}
                  <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-xl overflow-hidden shadow-xs">
                    {/* Top Action Header */}
                    {/* Top Action Header */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-base font-bold text-gray-950 dark:text-white">
                          {t('admin_orders_title')}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Buyurtmalarni monitoring qilish, kuryer tayinlash va eksport qilish
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={exportOrdersToCSV}
                          className="px-3.5 py-2 bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                          title="Excel CSV formatida to'liq eksport qilish"
                        >
                          <Download className="w-3.5 h-3.5 text-gray-500" />
                          <span>Excel / CSV</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowManualOrderModal(true)}
                          className="px-4 py-2 bg-gray-950 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{t('admin_btn_manual_order')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Status Tabs and Filters Bar */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-gray-50/40 dark:bg-white/[0.01]">
                      {/* Status Pills Segmented Control (Strictly 5 Clear Statuses) */}
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#161F30] p-1 rounded-xl border border-gray-200/80 dark:border-white/10 overflow-x-auto no-scrollbar shrink-0">
                        {[
                          { id: 'ALL', label: t('admin_status_all'), count: storeOrders.length },
                          { id: 'NEW', label: t('admin_status_new'), count: countNew },
                          { id: 'DELIVERING', label: t('admin_status_delivering'), count: countDelivering },
                          { id: 'COMPLETED', label: t('admin_status_completed'), count: countCompleted },
                          { id: 'CANCELLED', label: t('admin_status_cancelled'), count: countCancelled },
                        ].map((st) => {
                          const isActive = statusFilter === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setStatusFilter(st.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                                isActive
                                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 shadow-2xs'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white'
                              }`}
                            >
                              <span>{st.label}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                  isActive
                                    ? 'bg-white/20 dark:bg-black/10 text-white dark:text-gray-950'
                                    : 'bg-gray-200/70 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                {st.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Clean Custom Filter Dropdowns (Sana, Yetkazish, To'lov, Saralash) */}
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* 1. Date Period Custom Dropdown */}
                        <div className="relative custom-filter-dropdown-container">
                          <button
                            type="button"
                            onClick={() => setOpenOrderFilterDropdown(openOrderFilterDropdown === 'date' ? null : 'date')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 ${
                              openOrderFilterDropdown === 'date'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                : orderDateFilter !== 'ALL'
                                ? 'bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white border-gray-300 dark:border-white/20'
                                : 'bg-white dark:bg-[#161F30] text-gray-800 dark:text-gray-200 border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <span>
                              {orderDateFilter === 'ALL'
                                ? 'Sana: Barchasi'
                                : orderDateFilter === 'TODAY'
                                ? 'Sana: Bugun'
                                : orderDateFilter === 'WEEK'
                                ? 'Sana: Oxirgi 7 kun'
                                : orderDateFilter === 'MONTH'
                                ? 'Sana: Shu oy'
                                : 'Sana: Shu yil'}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                openOrderFilterDropdown === 'date' ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {openOrderFilterDropdown === 'date' && (
                            <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-44 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100 space-y-0.5">
                              {[
                                { id: 'ALL', label: 'Barchasi' },
                                { id: 'TODAY', label: 'Bugun' },
                                { id: 'WEEK', label: 'Oxirgi 7 kun' },
                                { id: 'MONTH', label: 'Shu oy' },
                                { id: 'YEAR', label: `Shu yil (${new Date().getFullYear()})` },
                              ].map((opt) => {
                                const isSelected = orderDateFilter === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setOrderDateFilter(opt.id as any);
                                      setOpenOrderFilterDropdown(null);
                                    }}
                                    className={`w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors active:scale-95 ${
                                      isSelected
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 font-bold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30]'
                                    }`}
                                  >
                                    <span>{opt.label}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* 2. Delivery Method Custom Dropdown */}
                        <div className="relative custom-filter-dropdown-container">
                          <button
                            type="button"
                            onClick={() => setOpenOrderFilterDropdown(openOrderFilterDropdown === 'delivery' ? null : 'delivery')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 ${
                              openOrderFilterDropdown === 'delivery'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                : deliveryFilter !== 'ALL'
                                ? 'bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white border-gray-300 dark:border-white/20'
                                : 'bg-white dark:bg-[#161F30] text-gray-800 dark:text-gray-200 border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <span>
                              {deliveryFilter === 'ALL'
                                ? 'Yetkazish: Barchasi'
                                : deliveryFilter === 'courier'
                                ? 'Yetkazish: Kuryer'
                                : 'Yetkazish: PVZ'}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                openOrderFilterDropdown === 'delivery' ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {openOrderFilterDropdown === 'delivery' && (
                            <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-44 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100 space-y-0.5">
                              {[
                                { id: 'ALL', label: 'Barchasi' },
                                { id: 'courier', label: 'Kuryer orqali' },
                                { id: 'pickup', label: 'Olib ketish (PVZ)' },
                              ].map((opt) => {
                                const isSelected = deliveryFilter === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setDeliveryFilter(opt.id as any);
                                      setOpenOrderFilterDropdown(null);
                                    }}
                                    className={`w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors active:scale-95 ${
                                      isSelected
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 font-bold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30]'
                                    }`}
                                  >
                                    <span>{opt.label}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* 3. Payment Method Custom Dropdown */}
                        <div className="relative custom-filter-dropdown-container">
                          <button
                            type="button"
                            onClick={() => setOpenOrderFilterDropdown(openOrderFilterDropdown === 'payment' ? null : 'payment')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 ${
                              openOrderFilterDropdown === 'payment'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                : paymentFilter !== 'ALL'
                                ? 'bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white border-gray-300 dark:border-white/20'
                                : 'bg-white dark:bg-[#161F30] text-gray-800 dark:text-gray-200 border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <span>
                              {paymentFilter === 'ALL'
                                ? 'To\'lov: Barchasi'
                                : `To'lov: ${paymentFilter === 'CASH' ? 'Naqd pul' : paymentFilter}`}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                openOrderFilterDropdown === 'payment' ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {openOrderFilterDropdown === 'payment' && (
                            <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-40 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100 space-y-0.5">
                              {[
                                { id: 'ALL', label: 'Barchasi' },
                                { id: 'PAYME', label: 'Payme' },
                                { id: 'CLICK', label: 'Click' },
                                { id: 'CASH', label: 'Naqd pul' },
                              ].map((opt) => {
                                const isSelected = paymentFilter === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setPaymentFilter(opt.id as any);
                                      setOpenOrderFilterDropdown(null);
                                    }}
                                    className={`w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors active:scale-95 ${
                                      isSelected
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 font-bold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30]'
                                    }`}
                                  >
                                    <span>{opt.label}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* 4. Sorting Custom Dropdown */}
                        <div className="relative custom-filter-dropdown-container">
                          <button
                            type="button"
                            onClick={() => setOpenOrderFilterDropdown(openOrderFilterDropdown === 'sort' ? null : 'sort')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 ${
                              openOrderFilterDropdown === 'sort'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                : orderSort !== 'NEWEST'
                                ? 'bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white border-gray-300 dark:border-white/20'
                                : 'bg-white dark:bg-[#161F30] text-gray-800 dark:text-gray-200 border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <span>
                              {orderSort === 'NEWEST'
                                ? 'Eng yangilari'
                                : orderSort === 'OLDEST'
                                ? 'Eng eskilari'
                                : orderSort === 'PRICE_DESC'
                                ? 'Narx: Yuqoridan'
                                : 'Narx: Pastdan'}
                            </span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                openOrderFilterDropdown === 'sort' ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {openOrderFilterDropdown === 'sort' && (
                            <div className="absolute top-full right-0 mt-1.5 w-44 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100 space-y-0.5">
                              {[
                                { id: 'NEWEST', label: 'Eng yangilari' },
                                { id: 'OLDEST', label: 'Eng eskilari' },
                                { id: 'PRICE_DESC', label: 'Narx: Yuqoridan' },
                                { id: 'PRICE_ASC', label: 'Narx: Pastdan' },
                              ].map((opt) => {
                                const isSelected = orderSort === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setOrderSort(opt.id as any);
                                      setOpenOrderFilterDropdown(null);
                                    }}
                                    className={`w-full px-3 py-1.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors active:scale-95 ${
                                      isSelected
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 font-bold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30]'
                                    }`}
                                  >
                                    <span>{opt.label}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* BULK ACTIONS FLOATING TOOLBAR */}
                    {selectedOrderIds.length > 0 && (
                      <div className="m-3 sm:mx-5 p-2 bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-sm animate-in fade-in duration-150">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-950 dark:text-white px-2">
                          <CheckSquare className="w-4 h-4 text-gray-950 dark:text-white" />
                          <span>{selectedOrderIds.length} {t('admin_orders_bulk_selected')}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <button
                            type="button"
                            onClick={() => handleBulkStatusChange('DELIVERING')}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-gray-200 font-semibold active:scale-95 transition-all"
                          >
                            Kuryerga berish
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBulkStatusChange('COMPLETED')}
                            className="px-3 py-1.5 rounded-lg bg-gray-950 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold active:scale-95 transition-all"
                          >
                            Yetkazildi
                          </button>
                          <button
                            type="button"
                            onClick={handleBulkDelete}
                            className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold active:scale-95 transition-all"
                          >
                            O'chirish
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedOrderIds([])}
                            className="px-2.5 py-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-semibold text-xs"
                          >
                            Bekor qilish
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SUPER CLEAN ORDERS TABLE */}
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left text-xs min-w-[700px]">
                        <thead className="bg-gray-50/80 dark:bg-[#161F30] text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200/80 dark:border-white/10 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3 px-3 sm:px-4 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={(e) => handleSelectAllOrders(e.target.checked, filteredOrdersList)}
                                className="w-4 h-4 rounded accent-gray-950 dark:accent-white cursor-pointer"
                              />
                            </th>
                            <th className="py-3 px-3 sm:px-4">Buyurtma</th>
                            <th className="py-3 px-3 sm:px-4">Mijoz</th>
                            <th className="py-3 px-3 sm:px-4">Yetkazish & Manzil</th>
                            <th className="py-3 px-3 sm:px-4">Tovarlar</th>
                            <th className="py-3 px-3 sm:px-4">Summa & To'lov</th>
                            <th className="py-3 px-3 sm:px-4">Holat</th>
                            <th className="py-3 px-3 sm:px-4 text-right">Amallar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                          {filteredOrdersList.length > 0 ? (
                            filteredOrdersList.map((ord) => {
                              const isSelected = selectedOrderIds.includes(ord.id);
                              return (
                                <tr
                                  key={ord.id}
                                  onClick={() => setViewingOrder(ord)}
                                  className={`hover:bg-gray-50/80 dark:hover:bg-white/[0.02] cursor-pointer transition-colors ${
                                    isSelected ? 'bg-gray-50 dark:bg-white/[0.04]' : ''
                                  }`}
                                >
                                  {/* Checkbox */}
                                  <td
                                    className="py-3.5 px-3 sm:px-4 text-center"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleToggleSelectOrder(ord.id)}
                                      className="w-4 h-4 rounded accent-gray-950 dark:accent-white cursor-pointer"
                                    />
                                  </td>

                                  {/* Order ID & Date */}
                                  <td className="py-3.5 px-3 sm:px-4 font-mono">
                                    <div className="font-bold text-gray-950 dark:text-white">
                                      {ord.id}
                                    </div>
                                    <div className="text-[11px] text-gray-400 font-sans mt-0.5">
                                      {ord.date}
                                    </div>
                                  </td>

                                  {/* Customer */}
                                  <td className="py-3.5 px-3 sm:px-4">
                                    <div className="font-bold text-gray-950 dark:text-white">
                                      {ord.user}
                                    </div>
                                    <div
                                      className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <a
                                        href={`tel:${ord.phone}`}
                                        className="hover:text-gray-900 dark:hover:text-white hover:underline"
                                      >
                                        {ord.phone}
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyPhone(ord.phone)}
                                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                        title="Nusxalash"
                                      >
                                        <Copy className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Delivery & Address */}
                                  <td className="py-3.5 px-3 sm:px-4 max-w-[180px]">
                                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                                      <span>{ord.deliveryMethod === 'pickup' ? '🏢 Olib ketish' : '🚚 Kuryer'}</span>
                                      {ord.courierName && (
                                        <span className="text-[10px] text-gray-400">({ord.courierName})</span>
                                      )}
                                    </div>
                                    <div
                                      className="text-[11px] text-gray-400 truncate mt-0.5"
                                      title={ord.location || ''}
                                    >
                                      {ord.location || 'Do\'kondan'}
                                    </div>
                                  </td>

                                  {/* Products Preview */}
                                  <td className="py-3.5 px-3 sm:px-4">
                                    <div className="flex items-center gap-2">
                                      {ord.items && ord.items.length > 0 && ord.items[0].image && (
                                        <img
                                          src={ord.items[0].image}
                                          alt=""
                                          className="w-7 h-7 rounded-md object-cover bg-gray-100 shrink-0 border border-gray-200/80 dark:border-white/10"
                                        />
                                      )}
                                      <div className="min-w-0">
                                        <div className="font-semibold text-gray-900 dark:text-white truncate max-w-[130px]">
                                          {ord.items?.[0]?.name || 'Tovarlar'}
                                        </div>
                                        <div className="text-[10px] text-gray-400">
                                          {ord.itemsCount || ord.items?.length || 1} xil mahsulot
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Amount & Payment */}
                                  <td className="py-3.5 px-3 sm:px-4">
                                    <div className="font-extrabold text-gray-950 dark:text-white">
                                      {ord.total.toLocaleString()} {t('currency')}
                                    </div>
                                    <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                                      <span>{ord.paymentType || 'CASH'}</span>
                                      <span>•</span>
                                      <span
                                        className={
                                          ord.paymentStatus === 'PAID'
                                            ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                            : ord.paymentStatus === 'REFUNDED'
                                            ? 'text-amber-600 dark:text-amber-400 font-medium'
                                            : 'text-gray-400'
                                        }
                                      >
                                        {ord.paymentStatus === 'PAID'
                                          ? 'To\'langan'
                                          : ord.paymentStatus === 'REFUNDED'
                                          ? 'Qaytarilgan'
                                          : 'Kutilmoqda'}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Status Minimal Badge */}
                                  <td className="py-3.5 px-3 sm:px-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200">
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          ord.status === 'NEW'
                                            ? 'bg-blue-600'
                                            : ord.status === 'DELIVERING'
                                            ? 'bg-amber-500'
                                            : ord.status === 'COMPLETED'
                                            ? 'bg-emerald-600'
                                            : 'bg-red-600'
                                        }`}
                                      />
                                      <span>
                                        {ord.status === 'NEW'
                                          ? t('admin_status_new')
                                          : ord.status === 'DELIVERING'
                                          ? t('admin_status_delivering')
                                          : ord.status === 'COMPLETED'
                                          ? t('admin_status_completed')
                                          : t('admin_status_cancelled')}
                                      </span>
                                    </span>
                                    {ord.status === 'CANCELLED' && ord.cancelReason && (
                                      <div
                                        className="text-[10px] text-red-500 font-medium truncate max-w-[130px] mt-0.5"
                                        title={ord.cancelReason}
                                      >
                                        {ord.cancelReason}
                                      </div>
                                    )}
                                  </td>

                                  {/* Actions */}
                                  <td
                                    className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handlePrintReceipt(ord)}
                                        className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                        title="80mm Chek"
                                      >
                                        <Printer className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenTelegram(ord.phone)}
                                        className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
                                        title="Telegramda ochish"
                                      >
                                        <Send className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyOrderInfo(ord)}
                                        className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                        title="Ma'lumotlarni nusxalash"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          openConfirmDialog({
                                            title: `Buyurtma #${ord.id} ni o'chirish`,
                                            description: `${ord.user} (${ord.phone}) ga tegishli ushbu buyurtma bazadan butunlay o'chiriladi.`,
                                            confirmText: "O'chirish",
                                            onConfirm: () => {
                                              deleteOrderFromStore(ord.id);
                                              addLog({
                                                action: 'Buyurtma o\'chirildi',
                                                module: 'Orders',
                                                actor: 'Super Admin',
                                                details: `Buyurtma #${ord.id} bazadan olib tashlandi`,
                                                type: 'DANGER',
                                              });
                                            },
                                          });
                                        }}
                                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                        title="O'chirish"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-gray-400">
                                <div className="max-w-xs mx-auto space-y-2">
                                  <p className="font-bold text-gray-900 dark:text-white text-xs">
                                    Buyurtmalar topilmadi
                                  </p>
                                  <p className="text-[11px] text-gray-400">
                                    Tanlangan filtrlar yoki qidiruv so'rovi bo'yicha buyurtmalar mavjud emas.
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setStatusFilter('ALL');
                                      setOrderDateFilter('ALL');
                                      setDeliveryFilter('ALL');
                                      setPaymentFilter('ALL');
                                      setOrderSort('NEWEST');
                                      setSearchQuery('');
                                    }}
                                    className="px-3.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl text-xs font-bold active:scale-95 shadow-xs transition-all"
                                  >
                                    Filtrlarni tozalash
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3. CATALOG HUB (PRODUCTS + CATEGORIES + REVIEWS) */}
            {activeTab === 'catalog' && (() => {
              const totalProductsCount = storeProducts.length;
              const totalStockUnits = storeProducts.reduce(
                (acc, p) =>
                  acc +
                  (p.variants && p.variants.length > 0
                    ? p.variants.reduce((vAcc, v) => vAcc + (v.stock_count || 0), 0)
                    : 10),
                0
              );
              const lowStockProductsCount = storeProducts.filter((p) => {
                const stock =
                  p.variants && p.variants.length > 0
                    ? p.variants.reduce((vAcc, v) => vAcc + (v.stock_count || 0), 0)
                    : 10;
                return stock > 0 && stock <= 3;
              }).length;
              const outOfStockProductsCount = storeProducts.filter((p) => {
                const stock =
                  p.variants && p.variants.length > 0
                    ? p.variants.reduce((vAcc, v) => vAcc + (v.stock_count || 0), 0)
                    : 10;
                return stock === 0;
              }).length;

              const filteredProducts = storeProducts
                .filter((p) => {
                  if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    const nameUz = typeof p.name === 'object' ? p.name.uz?.toLowerCase() || '' : String(p.name).toLowerCase();
                    const nameRu = typeof p.name === 'object' ? p.name.ru?.toLowerCase() || '' : '';
                    const nameEn = typeof p.name === 'object' ? p.name.en?.toLowerCase() || '' : '';
                    const descUz = typeof p.description === 'object' ? p.description.uz?.toLowerCase() || '' : String(p.description || '').toLowerCase();
                    const catObj = storeCategories.find((c) => c.id === p.category_id);
                    const catName = catObj ? (typeof catObj.name === 'object' ? catObj.name.uz?.toLowerCase() || '' : String(catObj.name).toLowerCase()) : '';
                    const matches =
                      nameUz.includes(query) ||
                      nameRu.includes(query) ||
                      nameEn.includes(query) ||
                      descUz.includes(query) ||
                      catName.includes(query) ||
                      String(p.id).includes(query);
                    if (!matches) return false;
                  }

                  if (productCategoryFilter !== 'ALL' && p.category_id !== productCategoryFilter) {
                    return false;
                  }

                  const stock =
                    p.variants && p.variants.length > 0
                      ? p.variants.reduce((vAcc, v) => vAcc + (v.stock_count || 0), 0)
                      : 10;
                  if (productStockFilter === 'IN_STOCK' && stock <= 3) return false;
                  if (productStockFilter === 'LOW_STOCK' && (stock <= 0 || stock > 3)) return false;
                  if (productStockFilter === 'OUT_OF_STOCK' && stock !== 0) return false;

                  if (productBadgeFilter === 'POPULAR') {
                    if (p.is_popular !== true) return false;
                  } else if (productBadgeFilter === 'HOME') {
                    if (p.show_on_home === false) return false;
                  } else if (productBadgeFilter !== 'ALL') {
                    const b = p.badge || 'NONE';
                    if (b !== productBadgeFilter) return false;
                  }

                  return true;
                })
                .sort((a, b) => {
                  if (productSortFilter === 'NEWEST') return b.id - a.id;
                  if (productSortFilter === 'PRICE_ASC') return a.base_price - b.base_price;
                  if (productSortFilter === 'PRICE_DESC') return b.base_price - a.base_price;
                  const stockA =
                    a.variants && a.variants.length > 0
                      ? a.variants.reduce((vAcc, v) => vAcc + (v.stock_count || 0), 0)
                      : 10;
                  const stockB =
                    b.variants && b.variants.length > 0
                      ? b.variants.reduce((vAcc, v) => vAcc + (v.stock_count || 0), 0)
                      : 10;
                  if (productSortFilter === 'STOCK_ASC') return stockA - stockB;
                  if (productSortFilter === 'STOCK_DESC') return stockB - stockA;
                  return 0;
                });

              const filteredCategories = storeCategories.filter((c) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                const nameUz = typeof c.name === 'object' ? c.name.uz?.toLowerCase() || '' : String(c.name).toLowerCase();
                const nameRu = typeof c.name === 'object' ? c.name.ru?.toLowerCase() || '' : '';
                const nameEn = typeof c.name === 'object' ? c.name.en?.toLowerCase() || '' : '';
                return nameUz.includes(query) || nameRu.includes(query) || nameEn.includes(query);
              });

              const pendingReviewsList = storeReviews.filter((r) => r.status === 'PENDING');
              const approvedReviewsList = storeReviews.filter((r) => r.status === 'APPROVED');
              const rejectedReviewsList = storeReviews.filter((r) => r.status === 'REJECTED');
              const avgReviewRating = (
                storeReviews.reduce((sum, r) => sum + r.rating, 0) / (storeReviews.length || 1)
              ).toFixed(1);

              const filteredReviews = storeReviews.filter((rev) => {
                if (reviewSearchQuery.trim()) {
                  const query = reviewSearchQuery.toLowerCase();
                  const matches =
                    rev.user.toLowerCase().includes(query) ||
                    rev.productName.toLowerCase().includes(query) ||
                    rev.comment.toLowerCase().includes(query) ||
                    (rev.pros && rev.pros.toLowerCase().includes(query)) ||
                    (rev.cons && rev.cons.toLowerCase().includes(query));
                  if (!matches) return false;
                }
                if (reviewStatusFilter !== 'ALL' && rev.status !== reviewStatusFilter) {
                  return false;
                }
                if (reviewRatingFilter !== 'ALL') {
                  if (reviewRatingFilter === '5' && rev.rating !== 5) return false;
                  if (reviewRatingFilter === '4' && rev.rating !== 4) return false;
                  if (reviewRatingFilter === '3' && rev.rating !== 3) return false;
                  if (reviewRatingFilter === '2_1' && rev.rating > 2) return false;
                }
                return true;
              });

              return (
                <div className="space-y-5">
                  {/* Sub-tab Pills Header (3 Clean Hub Tabs) */}
                  <div className="flex items-center justify-between gap-2 border-b border-gray-200/80 dark:border-white/10 pb-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {[
                        { id: 'products', label: t('admin_sub_products'), icon: Package, count: storeProducts.length, alert: lowStockProductsCount > 0 ? lowStockProductsCount : undefined },
                        { id: 'categories', label: t('admin_sub_categories'), icon: Grid, count: storeCategories.length, alert: undefined },
                        { id: 'reviews', label: t('admin_sub_reviews'), icon: MessageSquare, count: undefined, alert: undefined },
                      ].map((st) => {
                        const Icon = st.icon;
                        const isSubActive = catalogSubTab === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setCatalogSubTab(st.id as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                              isSubActive
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                                : 'bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1F293D]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{st.label}</span>
                            {st.count !== undefined && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                  isSubActive
                                    ? 'bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-950'
                                    : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {st.count}
                              </span>
                            )}
                            {st.alert && !isSubActive && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Kam qolgan tovarlar bor" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Hub Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {catalogSubTab === 'products' && (
                        <>
                          <button
                            type="button"
                            onClick={handleExportCatalogToCSV}
                            className="px-3.5 py-2 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                            title={t('admin_btn_csv_export')}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t('admin_btn_csv_export')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowCsvImportModal(true)}
                            className="px-3.5 py-2 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                            title={t('admin_btn_csv_import')}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{t('admin_btn_csv_import')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleOpenAddProduct}
                            className="px-4 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>{t('admin_modal_add_product_title')}</span>
                          </button>
                        </>
                      )}
                      {catalogSubTab === 'categories' && (
                        <button
                          type="button"
                          onClick={handleOpenAddCategory}
                          className="px-4 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>{t('admin_modal_add_category_title')}</span>
                        </button>
                      )}
                      {catalogSubTab === 'reviews' && pendingReviewsList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleApproveAllPendingReviews}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                        >
                          <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                          <span>{t('admin_rev_btn_approve_all')} ({pendingReviewsList.length})</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ========================================== */}
                  {/* SUB-TAB 1: PRODUCTS (MAHSULOTLAR) */}
                  {/* ========================================== */}
                  {catalogSubTab === 'products' && (
                    <div className="space-y-4">
                      {/* 1. Products Mini-HUD KPI Cards (Compact & 1-Click Interactive Filter) */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div
                          onClick={() => {
                            setProductStockFilter('ALL');
                            setProductCategoryFilter('ALL');
                            setProductBadgeFilter('ALL');
                          }}
                          className={`p-3.5 bg-white dark:bg-[#111827] border rounded-2xl shadow-2xs cursor-pointer transition-all active:scale-[0.98] ${
                            productStockFilter === 'ALL' && productCategoryFilter === 'ALL' && productBadgeFilter === 'ALL'
                              ? 'border-gray-900 dark:border-white ring-1 ring-gray-900/10 dark:ring-white/10'
                              : 'border-gray-200/80 dark:border-white/10 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {t('admin_catalog_kpi_total')}
                            </span>
                            <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-700 dark:text-gray-300">
                              <Package className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="text-xl font-black text-gray-950 dark:text-white mt-1">
                            {totalProductsCount} <span className="text-xs font-semibold text-gray-400">{t('pcs')}</span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {t('admin_catalog_kpi_units')}
                            </span>
                            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:blue-400">
                              <Boxes className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="text-xl font-black text-gray-950 dark:text-white mt-1">
                            {totalStockUnits.toLocaleString()} <span className="text-xs font-semibold text-gray-400">{t('pcs')}</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setProductStockFilter(productStockFilter === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
                          className={`p-3.5 bg-white dark:bg-[#111827] border rounded-2xl shadow-2xs cursor-pointer transition-all active:scale-[0.98] ${
                            productStockFilter === 'LOW_STOCK'
                              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20 dark:bg-amber-950/20'
                              : 'border-gray-200/80 dark:border-white/10 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                              {t('admin_catalog_kpi_low_stock')}
                            </span>
                            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center justify-between">
                            <span>{lowStockProductsCount} <span className="text-xs font-semibold text-gray-400">{t('pcs')}</span></span>
                            {lowStockProductsCount > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                ⚠️ Kam qoldi
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          onClick={() => setProductStockFilter(productStockFilter === 'OUT_OF_STOCK' ? 'ALL' : 'OUT_OF_STOCK')}
                          className={`p-3.5 bg-white dark:bg-[#111827] border rounded-2xl shadow-2xs cursor-pointer transition-all active:scale-[0.98] ${
                            productStockFilter === 'OUT_OF_STOCK'
                              ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 dark:bg-red-950/20'
                              : 'border-gray-200/80 dark:border-white/10 hover:border-red-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">
                              {t('admin_catalog_kpi_out_of_stock')}
                            </span>
                            <div className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
                              <Ban className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="text-xl font-black text-red-600 dark:text-red-400 mt-1 flex items-center justify-between">
                            <span>{outOfStockProductsCount} <span className="text-xs font-semibold text-gray-400">{t('pcs')}</span></span>
                            {outOfStockProductsCount > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300">
                                🚫 Tugagan
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Single Category Pills Carousel (Zero Redundancy) */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                        <button
                          type="button"
                          onClick={() => setProductCategoryFilter('ALL')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 ${
                            productCategoryFilter === 'ALL'
                              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                              : 'bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#161F30]'
                          }`}
                        >
                          <span>{t('admin_cat_filter_all')}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            productCategoryFilter === 'ALL'
                              ? 'bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-950'
                              : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                          }`}>
                            {storeProducts.length}
                          </span>
                        </button>

                        {storeCategories.map((cat) => {
                          const isSelected = productCategoryFilter === cat.id;
                          const catNameStr = typeof cat.name === 'object' ? (cat.name as any)[lang] || cat.name.uz : cat.name;
                          const prodCount = storeProducts.filter((p) => p.category_id === cat.id).length;

                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setProductCategoryFilter(cat.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                                  : 'bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#161F30]'
                              }`}
                            >
                              <img src={cat.image} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                              <span>{catNameStr}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                isSelected
                                  ? 'bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-950'
                                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                              }`}>
                                {prodCount}
                              </span>
                            </button>
                          );
                        })}

                        <button
                          type="button"
                          onClick={handleOpenAddCategory}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white flex items-center gap-1 active:scale-95 transition-all"
                          title={t('admin_modal_add_category_title')}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Toifa</span>
                        </button>
                      </div>

                      {/* 3. Integrated Search & Popover Filters Toolbar */}
                      <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-3.5 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          {/* Search Input directly inside Toolbar */}
                          <div className="relative flex-1 min-w-[220px] max-w-md">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Mahsulot nomi yoki ID bo'yicha qidirish..."
                              className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white font-medium transition-all"
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Popover Filters Toolbar */}
                          <div className="flex items-center gap-2 flex-wrap custom-filter-dropdown-container">
                            {/* Stock Status Popover Dropdown */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenProductFilterDropdown(openProductFilterDropdown === 'stock' ? null : 'stock')
                                }
                                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                                  productStockFilter !== 'ALL'
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                    : 'bg-gray-50 dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F293D]'
                                }`}
                              >
                                <Boxes className="w-3.5 h-3.5 opacity-70" />
                                <span>
                                  {productStockFilter === 'ALL' && t('admin_stock_all')}
                                  {productStockFilter === 'IN_STOCK' && t('admin_stock_in_stock')}
                                  {productStockFilter === 'LOW_STOCK' && t('admin_stock_low')}
                                  {productStockFilter === 'OUT_OF_STOCK' && t('admin_stock_out_filter')}
                                </span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                                    openProductFilterDropdown === 'stock' ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>

                              {openProductFilterDropdown === 'stock' && (
                                <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 animate-in zoom-in-95 duration-100">
                                  {[
                                    { id: 'ALL', label: t('admin_stock_all') },
                                    { id: 'IN_STOCK', label: t('admin_stock_in_stock') },
                                    { id: 'LOW_STOCK', label: t('admin_stock_low') },
                                    { id: 'OUT_OF_STOCK', label: t('admin_stock_out_filter') },
                                  ].map((opt) => {
                                    const isSelected = productStockFilter === opt.id;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                          setProductStockFilter(opt.id as any);
                                          setOpenProductFilterDropdown(null);
                                        }}
                                        className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                                          isSelected
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                                        }`}
                                      >
                                        <span>{opt.label}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Badge & Showcase Popover Dropdown */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenProductFilterDropdown(openProductFilterDropdown === 'badge' ? null : 'badge')
                                }
                                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                                  productBadgeFilter !== 'ALL'
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                    : 'bg-gray-50 dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F293D]'
                                }`}
                              >
                                <Tag className="w-3.5 h-3.5 opacity-70" />
                                <span>
                                  {productBadgeFilter === 'ALL' && t('admin_badge_all')}
                                  {productBadgeFilter === 'POPULAR' && `🔥 ${t('home_popular')}`}
                                  {productBadgeFilter === 'HOME' && `🏠 ${t('admin_lbl_show_on_home_badge')}`}
                                  {productBadgeFilter === 'NEW' && t('admin_badge_new')}
                                  {productBadgeFilter === 'TOP' && t('admin_badge_top')}
                                  {productBadgeFilter === 'SALE' && t('admin_badge_sale')}
                                  {productBadgeFilter === 'NONE' && t('admin_badge_none')}
                                </span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                                    openProductFilterDropdown === 'badge' ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>

                              {openProductFilterDropdown === 'badge' && (
                                <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 animate-in zoom-in-95 duration-100">
                                  {[
                                    { id: 'ALL', label: t('admin_badge_all') },
                                    { id: 'POPULAR', label: `🔥 ${t('home_popular')}` },
                                    { id: 'HOME', label: `🏠 ${t('admin_lbl_show_on_home_badge')}` },
                                    { id: 'NEW', label: t('admin_badge_new') },
                                    { id: 'TOP', label: t('admin_badge_top') },
                                    { id: 'SALE', label: t('admin_badge_sale') },
                                    { id: 'NONE', label: t('admin_badge_none') },
                                  ].map((opt) => {
                                    const isSelected = productBadgeFilter === opt.id;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                          setProductBadgeFilter(opt.id as any);
                                          setOpenProductFilterDropdown(null);
                                        }}
                                        className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                                          isSelected
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                                        }`}
                                      >
                                        <span>{opt.label}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Sort Popover Dropdown */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenProductFilterDropdown(openProductFilterDropdown === 'sort' ? null : 'sort')
                                }
                                className="px-3 py-2 rounded-xl text-xs font-bold border bg-gray-50 dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F293D] flex items-center gap-2 transition-all"
                              >
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                                <span>
                                  {productSortFilter === 'NEWEST' && t('admin_sort_prod_newest')}
                                  {productSortFilter === 'PRICE_ASC' && t('admin_sort_prod_price_asc')}
                                  {productSortFilter === 'PRICE_DESC' && t('admin_sort_prod_price_desc')}
                                  {productSortFilter === 'STOCK_ASC' && t('admin_sort_prod_stock_asc')}
                                  {productSortFilter === 'STOCK_DESC' && t('admin_sort_prod_stock_desc')}
                                </span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                                    openProductFilterDropdown === 'sort' ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>

                              {openProductFilterDropdown === 'sort' && (
                                <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 animate-in zoom-in-95 duration-100">
                                  {[
                                    { id: 'NEWEST', label: t('admin_sort_prod_newest') },
                                    { id: 'PRICE_ASC', label: t('admin_sort_prod_price_asc') },
                                    { id: 'PRICE_DESC', label: t('admin_sort_prod_price_desc') },
                                    { id: 'STOCK_ASC', label: t('admin_sort_prod_stock_asc') },
                                    { id: 'STOCK_DESC', label: t('admin_sort_prod_stock_desc') },
                                  ].map((opt) => {
                                    const isSelected = productSortFilter === opt.id;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                          setProductSortFilter(opt.id as any);
                                          setOpenProductFilterDropdown(null);
                                        }}
                                        className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                                          isSelected
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                                        }`}
                                      >
                                        <span>{opt.label}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Floating / Integrated Bulk Actions Bar */}
                        {selectedProductIds.length > 0 && (
                          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl p-3 flex items-center justify-between gap-3 animate-in fade-in-50 duration-150 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">
                                {selectedProductIds.length} {t('admin_bulk_products_selected')}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedProductIds([])}
                                className="text-[11px] font-semibold underline opacity-80 hover:opacity-100"
                              >
                                {t('admin_orders_bulk_deselect')}
                              </button>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleBulkAddStock(5)}
                                className="px-2.5 py-1 bg-white/20 dark:bg-gray-900/10 hover:bg-white/30 rounded-lg text-xs font-bold active:scale-95 transition-all"
                              >
                                {t('admin_bulk_add_stock_5')}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBulkAddStock(10)}
                                className="px-2.5 py-1 bg-white/20 dark:bg-gray-900/10 hover:bg-white/30 rounded-lg text-xs font-bold active:scale-95 transition-all"
                              >
                                {t('admin_bulk_add_stock_10')}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleBulkSetPopular(true)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold active:scale-95 transition-all"
                                title={t('admin_bulk_add_popular')}
                              >
                                🔥 +{t('admin_lbl_is_popular_badge')}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBulkSetPopular(false)}
                                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white dark:text-gray-950 rounded-lg text-xs font-bold active:scale-95 transition-all"
                                title={t('admin_bulk_remove_popular')}
                              >
                                ✕ -{t('admin_lbl_is_popular_badge')}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleBulkSetShowOnHome(true)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold active:scale-95 transition-all"
                                title={t('admin_bulk_add_home')}
                              >
                                🏠 +{t('admin_lbl_show_on_home_badge')}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBulkSetShowOnHome(false)}
                                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white dark:text-gray-950 rounded-lg text-xs font-bold active:scale-95 transition-all"
                                title={t('admin_bulk_remove_home')}
                              >
                                ✕ -{t('admin_lbl_show_on_home_badge')}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleBulkSetBadge('TOP')}
                                className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold active:scale-95 transition-all"
                              >
                                TOP
                              </button>
                              <button
                                type="button"
                                onClick={() => handleBulkSetBadge('SALE')}
                                className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-xs font-bold active:scale-95 transition-all"
                              >
                                SALE
                              </button>

                              <button
                                type="button"
                                onClick={handleBulkDeleteProducts}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{t('admin_orders_bulk_delete')}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 4. View 1: GRID MODE (Farfetch & Apple Minimalist Cards) */}
                      {productViewMode === 'GRID' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {filteredProducts.map((p) => {
                            const isSelected = selectedProductIds.includes(p.id);
                            const categoryObj = storeCategories.find((c) => c.id === p.category_id);
                            const catName = categoryObj
                              ? typeof categoryObj.name === 'object'
                                ? (categoryObj.name as any)[lang] || categoryObj.name.uz
                                : categoryObj.name
                              : 'Kategoriya';

                            const primaryImage =
                              p.images && p.images.length > 0
                                ? p.images[0]
                                : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

                            const totalStock =
                              p.variants && p.variants.length > 0
                                ? p.variants.reduce((acc, v) => acc + (v.stock_count || 0), 0)
                                : 10;
                            const isLowStock = totalStock > 0 && totalStock <= 3;
                            const isOutStock = totalStock === 0;
                            const productNameStr =
                              typeof p.name === 'object' && p.name
                                ? (p.name as any)[lang] || (p.name as any).uz
                                : String(p.name);

                            const costPrice = p.cost_price || Math.round(p.base_price * 0.65);
                            const profit = p.base_price - costPrice;
                            const profitPercent = Math.round((profit / costPrice) * 100);

                            return (
                              <div
                                key={p.id}
                                className={`bg-white dark:bg-[#111827] border rounded-2xl p-3 sm:p-4 space-y-3 relative group transition-all duration-150 hover:shadow-md flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-gray-900 dark:border-white ring-2 ring-gray-900/10 dark:ring-white/20'
                                    : 'border-gray-200/80 dark:border-white/10 hover:border-gray-400'
                                }`}
                              >
                                <div className="space-y-3">
                                  {/* Top Row: Checkbox, Badge & Status */}
                                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                                    <img
                                      src={primaryImage}
                                      alt={productNameStr}
                                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Checkbox Overlay Top-Left */}
                                    <div className="absolute top-2 left-2 z-10">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleProductSelection(p.id)}
                                        className="w-6 h-6 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-xs flex items-center justify-center text-gray-700 dark:text-gray-200 shadow-xs active:scale-95"
                                      >
                                        {isSelected ? (
                                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        ) : (
                                          <Square className="w-4 h-4 opacity-50" />
                                        )}
                                      </button>
                                    </div>

                                    {/* Stock Badge Top-Right */}
                                    <div className="absolute top-2 right-2 z-10">
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm shadow-xs ${
                                          isOutStock
                                            ? 'bg-red-500/90 text-white'
                                            : isLowStock
                                            ? 'bg-amber-500/90 text-white'
                                            : 'bg-emerald-600/90 text-white'
                                        }`}
                                      >
                                        {isOutStock ? t('admin_card_stock_out') : `${totalStock} ${t('pcs')}`}
                                      </span>
                                    </div>

                                    {/* Interactive 1-Click Badges Bottom-Left */}
                                    <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => toggleProductPopular(p.id)}
                                        className={`p-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 ${
                                          p.is_popular
                                            ? 'bg-amber-500 text-white shadow-amber-500/30'
                                            : 'bg-black/50 text-white/70 hover:text-white backdrop-blur-xs'
                                        }`}
                                        title={p.is_popular ? "Mashhur to'plamdan olish" : "Mashhur to'plamga qo'shish"}
                                      >
                                        <Flame className="w-3.5 h-3.5 fill-current" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => toggleProductShowOnHome(p.id)}
                                        className={`p-1.5 rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 ${
                                          p.show_on_home !== false
                                            ? 'bg-blue-600 text-white shadow-blue-500/30'
                                            : 'bg-black/50 text-white/70 hover:text-white backdrop-blur-xs'
                                        }`}
                                        title={p.show_on_home !== false ? "Bosh sahifa vitrinasidan olish" : "Bosh sahifa vitrinasiga chiqarish"}
                                      >
                                        <Home className="w-3.5 h-3.5" />
                                      </button>

                                      {p.badge === 'NEW' && (
                                        <span className="px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold backdrop-blur-xs">
                                          NEW
                                        </span>
                                      )}
                                      {p.badge === 'SALE' && (
                                        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold">
                                          SALE
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Info Section */}
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                                      <span className="truncate">{catName}</span>
                                      <span>ID: #{p.id}</span>
                                    </div>

                                    <h4 className="text-xs font-bold text-gray-950 dark:text-white line-clamp-2 leading-snug min-h-[32px]">
                                      {productNameStr}
                                    </h4>

                                    {/* Price & Profit Row */}
                                    <div className="flex items-baseline justify-between pt-1">
                                      <div>
                                        <div className="text-sm font-black text-gray-950 dark:text-white">
                                          {Number(p.base_price).toLocaleString()} <span className="text-[10px] font-normal">{t('currency')}</span>
                                        </div>
                                        {p.old_price && Number(p.old_price) > Number(p.base_price) && (
                                          <div className="text-[10px] text-gray-400 line-through">
                                            {Number(p.old_price).toLocaleString()} {t('currency')}
                                          </div>
                                        )}
                                      </div>

                                      {/* Margin */}
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                                        +{profitPercent}%
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Bottom Action Buttons */}
                                <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="flex-1 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>{t('admin_card_action_edit')}</span>
                                  </button>

                                  {/* Quick Actions Popover Menu */}
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setOpenProductCardMenuId(openProductCardMenuId === p.id ? null : p.id)}
                                      className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] flex items-center justify-center text-gray-700 dark:text-gray-300 active:scale-95 transition-all"
                                      title={t('admin_card_action_more')}
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>

                                    {openProductCardMenuId === p.id && (
                                      <div className="absolute right-0 bottom-full mb-1.5 w-52 bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 animate-in zoom-in-95 duration-100">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            toggleProductPopular(p.id);
                                            setOpenProductCardMenuId(null);
                                          }}
                                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1F293D] text-gray-800 dark:text-gray-200 transition-all text-left"
                                        >
                                          <Flame className={`w-3.5 h-3.5 ${p.is_popular ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                                          <span>{p.is_popular ? "Mashhur to'plamdan olish" : "Mashhur to'plamga qo'shish"}</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            toggleProductShowOnHome(p.id);
                                            setOpenProductCardMenuId(null);
                                          }}
                                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1F293D] text-gray-800 dark:text-gray-200 transition-all text-left"
                                        >
                                          <Home className={`w-3.5 h-3.5 ${p.show_on_home !== false ? 'text-blue-500' : 'text-gray-400'}`} />
                                          <span>{p.show_on_home !== false ? "Bosh sahifa vitrinasidan olish" : "Bosh sahifa vitrinasiga chiqarish"}</span>
                                        </button>

                                        <div className="border-t border-gray-100 dark:border-white/5 my-1" />

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setOpenProductCardMenuId(null);
                                            openConfirmDialog({
                                              title: `"${productNameStr}" mahsulotini o'chirish`,
                                              description: "Ushbu mahsulot katalogdan butunlay olib tashlanadi va xaridorlarga ko'rinmaydi.",
                                              confirmText: "O'chirish",
                                              onConfirm: () => {
                                                deleteProductFromStore(p.id);
                                              },
                                            });
                                          }}
                                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-all text-left"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>{t('admin_orders_bulk_delete')}</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 5. View 2: TABLE MODE (Dense & Highly Informative Data Table) */}
                      {productViewMode === 'TABLE' && (
                        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xs">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-gray-50 dark:bg-[#161F30] text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200/80 dark:border-white/10 uppercase text-[10px] tracking-wider">
                                <tr>
                                  <th className="p-3.5 w-10 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleSelectAllProducts(filteredProducts)}
                                      className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    >
                                      {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                                      ) : (
                                        <Square className="w-4 h-4 opacity-60" />
                                      )}
                                    </button>
                                  </th>
                                  <th className="p-3.5">{t('admin_table_th_product')}</th>
                                  <th className="p-3.5">{t('admin_table_th_category')}</th>
                                  <th className="p-3.5">{t('admin_table_th_price')}</th>
                                  <th className="p-3.5">Foyda (Marja)</th>
                                  <th className="p-3.5">{t('admin_table_th_badge')}</th>
                                  <th className="p-3.5">{t('admin_table_th_stock')}</th>
                                  <th className="p-3.5 text-center">{t('admin_table_th_quick_stock')}</th>
                                  <th className="p-3.5 text-right">{t('admin_table_th_actions')}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filteredProducts.map((p) => {
                                  const isSelected = selectedProductIds.includes(p.id);
                                  const categoryObj = storeCategories.find((c) => c.id === p.category_id);
                                  const catName = categoryObj
                                    ? typeof categoryObj.name === 'object'
                                      ? (categoryObj.name as any)[lang] || categoryObj.name.uz
                                      : categoryObj.name
                                    : 'Kategoriya';

                                  const primaryImage =
                                    p.images && p.images.length > 0
                                      ? p.images[0]
                                      : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

                                  const totalStock =
                                    p.variants && p.variants.length > 0
                                      ? p.variants.reduce((acc, v) => acc + (v.stock_count || 0), 0)
                                      : 10;
                                  const isLowStock = totalStock > 0 && totalStock <= 3;
                                  const isOutStock = totalStock === 0;
                                  const productNameStr =
                                    typeof p.name === 'object' && p.name
                                      ? (p.name as any)[lang] || (p.name as any).uz
                                      : String(p.name);

                                  const costPrice = p.cost_price || Math.round(p.base_price * 0.65);
                                  const profit = p.base_price - costPrice;
                                  const profitPercent = Math.round((profit / costPrice) * 100);

                                  return (
                                    <tr
                                      key={p.id}
                                      className={`hover:bg-gray-50/70 dark:hover:bg-[#161F30]/60 transition-colors ${
                                        isSelected ? 'bg-gray-50/90 dark:bg-[#161F30]' : ''
                                      }`}
                                    >
                                      <td className="p-3.5 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleProductSelection(p.id)}
                                          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                        >
                                          {isSelected ? (
                                            <CheckSquare className="w-4 h-4 text-emerald-500" />
                                          ) : (
                                            <Square className="w-4 h-4 opacity-60" />
                                          )}
                                        </button>
                                      </td>
                                      <td className="p-3.5">
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                          <img
                                            src={primaryImage}
                                            alt=""
                                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0 bg-gray-50"
                                          />
                                          <div className="min-w-0">
                                            <span className="font-bold text-gray-950 dark:text-white truncate block">
                                              {productNameStr}
                                            </span>
                                            <span className="text-[10px] text-gray-400">ID: #{p.id}</span>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3.5">
                                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#161F30] font-semibold text-[11px] text-gray-700 dark:text-gray-300">
                                          {catName}
                                        </span>
                                      </td>

                                      {/* Price with Inline Quick Edit */}
                                      <td className="p-3.5 font-bold text-gray-950 dark:text-white whitespace-nowrap">
                                        {inlineEditingProductId === p.id && inlineEditField === 'price' ? (
                                          <div className="flex items-center gap-1">
                                            <input
                                              type="number"
                                              autoFocus
                                              value={inlineEditValue}
                                              onChange={(e) => setInlineEditValue(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleInlineSave(p.id, 'price', inlineEditValue);
                                                if (e.key === 'Escape') setInlineEditingProductId(null);
                                              }}
                                              className="w-24 px-2 py-1 bg-white dark:bg-[#111827] border border-gray-900 dark:border-white rounded-lg text-xs font-bold text-gray-950 dark:text-white"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleInlineSave(p.id, 'price', inlineEditValue)}
                                              className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                                            >
                                              <Check className="w-3 h-3" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setInlineEditingProductId(null)}
                                              className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div
                                            onClick={() => {
                                              setInlineEditingProductId(p.id);
                                              setInlineEditField('price');
                                              setInlineEditValue(String(p.base_price));
                                            }}
                                            className="cursor-pointer hover:underline group flex items-center gap-1"
                                            title={t('admin_inline_edit_tooltip')}
                                          >
                                            <div>
                                              <div>{Number(p.base_price).toLocaleString()} {t('currency')}</div>
                                              {p.cost_price && (
                                                <div className="text-[10px] font-normal text-gray-400">Tannarx: {Number(p.cost_price).toLocaleString()}</div>
                                              )}
                                            </div>
                                            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 text-gray-400" />
                                          </div>
                                        )}
                                      </td>

                                      {/* Profit Margin Column */}
                                      <td className="p-3.5 whitespace-nowrap">
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] inline-flex items-center gap-1">
                                          <span>+{profitPercent}%</span>
                                          <span className="text-[10px] font-normal opacity-80">(+{(profit / 1000).toFixed(0)}k)</span>
                                        </span>
                                      </td>

                                      {/* Badges / Showcase Column (Clean without empty ghost icons) */}
                                      <td className="p-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          {p.is_popular && (
                                            <button
                                              type="button"
                                              onClick={() => toggleProductPopular(p.id)}
                                              className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 font-bold text-[10px] active:scale-95"
                                              title="Mashhur to'plamidan chiqarish"
                                            >
                                              🔥 Mashhur
                                            </button>
                                          )}
                                          {p.show_on_home !== false && (
                                            <button
                                              type="button"
                                              onClick={() => toggleProductShowOnHome(p.id)}
                                              className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700/60 font-bold text-[10px] active:scale-95"
                                              title="Bosh sahifa vitrinasidan olish"
                                            >
                                              🏠 Vitrina
                                            </button>
                                          )}
                                          {p.badge === 'NEW' && (
                                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                                              ✨ NEW
                                            </span>
                                          )}
                                          {p.badge === 'TOP' && (
                                            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                                              TOP
                                            </span>
                                          )}
                                          {p.badge === 'SALE' && (
                                            <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold text-[10px]">
                                              🏷️ SALE
                                            </span>
                                          )}
                                          {!p.is_popular && p.show_on_home === false && (!p.badge || p.badge === 'NONE') && (
                                            <span className="text-[10px] text-gray-400 font-semibold">—</span>
                                          )}
                                        </div>
                                      </td>

                                      {/* Stock with Inline Quick Edit */}
                                      <td className="p-3.5 whitespace-nowrap">
                                        {inlineEditingProductId === p.id && inlineEditField === 'stock' ? (
                                          <div className="flex items-center gap-1">
                                            <input
                                              type="number"
                                              autoFocus
                                              value={inlineEditValue}
                                              onChange={(e) => setInlineEditValue(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleInlineSave(p.id, 'stock', inlineEditValue);
                                                if (e.key === 'Escape') setInlineEditingProductId(null);
                                              }}
                                              className="w-16 px-2 py-1 bg-white dark:bg-[#111827] border border-gray-900 dark:border-white rounded-lg text-xs font-bold text-gray-950 dark:text-white"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleInlineSave(p.id, 'stock', inlineEditValue)}
                                              className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                                            >
                                              <Check className="w-3 h-3" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setInlineEditingProductId(null)}
                                              className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div
                                            onClick={() => {
                                              setInlineEditingProductId(p.id);
                                              setInlineEditField('stock');
                                              setInlineEditValue(String(totalStock));
                                            }}
                                            className="cursor-pointer hover:underline group inline-flex items-center gap-1.5 font-bold text-xs"
                                            title={t('admin_inline_edit_tooltip')}
                                          >
                                            <span
                                              className={`inline-flex items-center gap-1.5 ${
                                                isOutStock
                                                  ? 'text-red-600 dark:text-red-400'
                                                  : isLowStock
                                                  ? 'text-amber-600 dark:text-amber-400'
                                                  : 'text-emerald-600 dark:text-emerald-400'
                                              }`}
                                            >
                                              <span
                                                className={`w-2 h-2 rounded-full ${
                                                  isOutStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`}
                                              />
                                              {totalStock} {t('pcs')}
                                            </span>
                                            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-60 text-gray-400" />
                                          </div>
                                        )}
                                      </td>

                                      <td className="p-3.5 text-center whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => handleQuickStock(p.id, 5)}
                                            className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] font-bold text-[10px] text-gray-800 dark:text-gray-200 active:scale-95"
                                          >
                                            +5
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleQuickStock(p.id, 10)}
                                            className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] font-bold text-[10px] text-gray-800 dark:text-gray-200 active:scale-95"
                                          >
                                            +10
                                          </button>
                                        </div>
                                      </td>
                                      <td className="p-3.5 text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handleOpenEditProduct(p)}
                                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 text-gray-700 dark:text-gray-300 active:scale-95 transition-all"
                                            title={t('admin_cat_edit_btn')}
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleDuplicateProduct(p.id)}
                                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800/40 active:scale-95 transition-all"
                                            title={t('admin_btn_clone_product')}
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              const pName = typeof p.name === 'object' ? (p.name as any)[lang] : p.name;
                                              openConfirmDialog({
                                                title: `"${pName}" mahsulotini o'chirish`,
                                                description: "Ushbu mahsulot katalogdan butunlay olib tashlanadi.",
                                                confirmText: "O'chirish",
                                                onConfirm: () => {
                                                  deleteProductFromStore(p.id);
                                                },
                                              });
                                            }}
                                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 active:scale-95 transition-all"
                                            title={t('admin_orders_bulk_delete')}
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Empty Products Message */}
                      {filteredProducts.length === 0 && (
                        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-10 text-center space-y-3">
                          <Package className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
                          <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                            {t('catalog_empty')}
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setProductCategoryFilter('ALL');
                              setProductStockFilter('ALL');
                              setProductBadgeFilter('ALL');
                            }}
                            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs active:scale-95"
                          >
                            {t('clear')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================== */}
                  {/* SUB-TAB 2: CATEGORIES (KATEGORIYALAR) */}
                  {/* ========================================== */}
                  {catalogSubTab === 'categories' && (
                    <div className="space-y-4">
                      {/* Categories Stats Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 shadow-2xs">
                          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('admin_cat_kpi_total')}
                          </span>
                          <div className="text-2xl font-black text-gray-950 dark:text-white mt-1">
                            {storeCategories.length}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 shadow-2xs">
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            {t('admin_cat_kpi_active')}
                          </span>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {storeCategories.filter((c) => c.isActive).length}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 shadow-2xs">
                          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            {t('admin_cat_kpi_inactive')}
                          </span>
                          <div className="text-2xl font-black text-gray-400 mt-1">
                            {storeCategories.filter((c) => !c.isActive).length}
                          </div>
                        </div>
                      </div>

                      {/* Categories Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {filteredCategories.map((cat) => {
                          const catNameStr =
                            typeof cat.name === 'object' ? (cat.name as any)[lang] || cat.name.uz : String(cat.name || '');
                          const itemsCount = storeProducts.filter((p) => p.category_id === cat.id).length;

                          return (
                            <div
                              key={cat.id}
                              className={`bg-white dark:bg-[#111827] border rounded-2xl p-4 flex items-center justify-between gap-3 transition-all shadow-2xs ${
                                cat.isActive
                                  ? 'border-gray-200/80 dark:border-white/10'
                                  : 'border-gray-200/40 dark:border-white/5 opacity-60 bg-gray-50/50'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <img
                                  src={cat.image}
                                  alt={catNameStr}
                                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-white/10 shrink-0 bg-gray-50"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-xs font-bold text-gray-950 dark:text-white truncate">
                                      {catNameStr}
                                    </h4>
                                    {cat.parentId ? (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                        ↳ {t('admin_cat_sub_badge')}
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                        ★ {t('admin_cat_main_badge')}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                                    {itemsCount} {t('admin_cat_items_count')}
                                  </p>
                                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                    <span
                                      className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                        cat.isActive
                                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                      }`}
                                    >
                                      {cat.isActive ? t('admin_cat_status_active') : t('admin_cat_status_inactive')}
                                    </span>
                                    {cat.showOnHome !== false && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                        🏠 {t('admin_cat_show_on_home')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {/* Reorder Buttons */}
                                <div className="flex flex-col gap-0.5 mr-1">
                                  <button
                                    type="button"
                                    onClick={() => handleCategoryReorder(cat.id, 'up')}
                                    className="p-1 rounded-md bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 text-gray-600 dark:text-gray-400 active:scale-95 transition-all"
                                    title={t('admin_cat_reorder_up')}
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCategoryReorder(cat.id, 'down')}
                                    className="p-1 rounded-md bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 text-gray-600 dark:text-gray-400 active:scale-95 transition-all"
                                    title={t('admin_cat_reorder_down')}
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* 1-Click Home Carousel Toggle */}
                                <button
                                  type="button"
                                  onClick={() => toggleCategoryShowOnHome(cat.id)}
                                  title={cat.showOnHome !== false ? "Bosh sahifa karuselidan yashirish" : "Bosh sahifa karuselida ko'rsatish"}
                                  className={`p-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                                    cat.showOnHome !== false
                                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 shadow-2xs'
                                      : 'bg-gray-100 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-400 opacity-60'
                                  }`}
                                >
                                  <Home className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleCategoryActive(cat.id)}
                                  title={cat.isActive ? 'Nofaol qilish' : 'Faollashtirish'}
                                  className={`p-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                                    cat.isActive
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-gray-100 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-500'
                                  }`}
                                >
                                  {cat.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCategory(cat)}
                                  className="p-2 rounded-xl bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 active:scale-95 transition-all"
                                  title={t('admin_cat_edit_btn')}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const cName = typeof cat.name === 'object' ? (cat.name as any)[lang] : cat.name;
                                    openConfirmDialog({
                                      title: `"${cName}" kategoriyasini o'chirish`,
                                      description: "Ushbu toifa butunlay o'chiriladi. Ushbu toifaga tegishli mahsulotlar o'chirilmaydi, ammo toifasiz qoladi.",
                                      confirmText: "O'chirish",
                                      onConfirm: () => {
                                        removeCategory(cat.id);
                                      },
                                    });
                                  }}
                                  className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-100 active:scale-95 transition-all"
                                  title={t('admin_orders_bulk_delete')}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ========================================== */}
                  {/* SUB-TAB 3: REVIEWS (SHARHLAR MODERATSIYASI) */}
                  {/* ========================================== */}
                  {catalogSubTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Reviews KPI Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 shadow-2xs">
                          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('admin_rev_kpi_total')}
                          </span>
                          <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white mt-1">
                            {storeReviews.length}
                          </div>
                        </div>

                        <div
                          onClick={() => setReviewStatusFilter(reviewStatusFilter === 'PENDING' ? 'ALL' : 'PENDING')}
                          className={`bg-white dark:bg-[#111827] border rounded-2xl p-4 shadow-2xs cursor-pointer transition-all ${
                            reviewStatusFilter === 'PENDING'
                              ? 'border-amber-500 ring-2 ring-amber-500/20'
                              : 'border-gray-200/80 dark:border-white/10 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                              {t('admin_rev_kpi_pending')}
                            </span>
                            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                            {pendingReviewsList.length}
                          </div>
                        </div>

                        <div
                          onClick={() => setReviewStatusFilter(reviewStatusFilter === 'APPROVED' ? 'ALL' : 'APPROVED')}
                          className={`bg-white dark:bg-[#111827] border rounded-2xl p-4 shadow-2xs cursor-pointer transition-all ${
                            reviewStatusFilter === 'APPROVED'
                              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                              : 'border-gray-200/80 dark:border-white/10 hover:border-emerald-400'
                          }`}
                        >
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            {t('admin_rev_kpi_approved')}
                          </span>
                          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {approvedReviewsList.length}
                          </div>
                        </div>

                        <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 shadow-2xs">
                          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {t('admin_rev_kpi_avg_rating')}
                          </span>
                          <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1 flex items-center gap-1.5">
                            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                            <span>{avgReviewRating}</span>
                            <span className="text-xs font-semibold text-gray-400">/ 5.0</span>
                          </div>
                        </div>
                      </div>

                      {/* Reviews Popover Filters Toolbar & Inline Search */}
                      <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-3 flex-wrap custom-filter-dropdown-container">
                        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[260px]">
                          {/* Dedicated Reviews Search Bar */}
                          <div className="relative flex-1 min-w-[180px] max-w-xs">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={reviewSearchQuery}
                              onChange={(e) => setReviewSearchQuery(e.target.value)}
                              placeholder="Sharh, mijoz yoki tovar qidirish..."
                              className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-xl pl-8 pr-7 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                            />
                            {reviewSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setReviewSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Review Status Popover */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenReviewFilterDropdown(openReviewFilterDropdown === 'status' ? null : 'status')
                              }
                              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                                reviewStatusFilter !== 'ALL'
                                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white'
                                  : 'bg-gray-50 dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
                              <span>
                                {reviewStatusFilter === 'ALL' && t('admin_rev_status_all')}
                                {reviewStatusFilter === 'PENDING' && t('admin_rev_status_pending')}
                                {reviewStatusFilter === 'APPROVED' && t('admin_rev_status_approved')}
                                {reviewStatusFilter === 'REJECTED' && t('admin_rev_status_rejected')}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                                  openReviewFilterDropdown === 'status' ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {openReviewFilterDropdown === 'status' && (
                              <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 animate-in zoom-in-95 duration-100">
                                {[
                                  { id: 'ALL', label: t('admin_rev_status_all') },
                                  { id: 'PENDING', label: t('admin_rev_status_pending') },
                                  { id: 'APPROVED', label: t('admin_rev_status_approved') },
                                  { id: 'REJECTED', label: t('admin_rev_status_rejected') },
                                ].map((opt) => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setReviewStatusFilter(opt.id as any);
                                      setOpenReviewFilterDropdown(null);
                                    }}
                                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                                      reviewStatusFilter === opt.id
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                                    }`}
                                  >
                                    <span>{opt.label}</span>
                                    {reviewStatusFilter === opt.id && <Check className="w-3.5 h-3.5" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Review Rating Popover */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenReviewFilterDropdown(openReviewFilterDropdown === 'rating' ? null : 'rating')
                              }
                              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                                reviewRatingFilter !== 'ALL'
                                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white'
                                  : 'bg-gray-50 dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5 opacity-70" />
                              <span>
                                {reviewRatingFilter === 'ALL' && t('admin_rev_rating_all')}
                                {reviewRatingFilter === '5' && t('admin_rev_rating_5')}
                                {reviewRatingFilter === '4' && t('admin_rev_rating_4')}
                                {reviewRatingFilter === '3' && t('admin_rev_rating_3')}
                                {reviewRatingFilter === '2_1' && t('admin_rev_rating_2_1')}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                                  openReviewFilterDropdown === 'rating' ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {openReviewFilterDropdown === 'rating' && (
                              <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 animate-in zoom-in-95 duration-100">
                                {[
                                  { id: 'ALL', label: t('admin_rev_rating_all') },
                                  { id: '5', label: t('admin_rev_rating_5') },
                                  { id: '4', label: t('admin_rev_rating_4') },
                                  { id: '3', label: t('admin_rev_rating_3') },
                                  { id: '2_1', label: t('admin_rev_rating_2_1') },
                                ].map((opt) => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                      setReviewRatingFilter(opt.id as any);
                                      setOpenReviewFilterDropdown(null);
                                    }}
                                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                                      reviewRatingFilter === opt.id
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                                    }`}
                                  >
                                    <span>{opt.label}</span>
                                    {reviewRatingFilter === opt.id && <Check className="w-3.5 h-3.5" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats Counter */}
                        <span className="text-xs text-gray-500 font-semibold">
                          {filteredReviews.length} / {storeReviews.length} {t('pcs')}
                        </span>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-3">
                        {filteredReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-all"
                          >
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-gray-950 dark:text-white">{rev.user}</span>
                                <div className="flex items-center gap-0.5 text-amber-500">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200 dark:text-gray-700'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    rev.status === 'APPROVED'
                                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40'
                                      : rev.status === 'REJECTED'
                                      ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/80 dark:border-red-800/40'
                                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/40'
                                  }`}
                                >
                                  {rev.status}
                                </span>
                              </div>

                              <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">"{rev.comment}"</p>

                              {/* Customer Attached Photo Reviews Gallery */}
                              {rev.images && rev.images.length > 0 && (
                                <div className="space-y-1 pt-1">
                                  <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3 text-indigo-500" />
                                    <span>{t('admin_rev_photos_attached')} ({rev.images.length})</span>
                                  </span>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {rev.images.map((img, i) => (
                                      <div
                                        key={i}
                                        onClick={() => setSelectedReviewImagePreview(img)}
                                        className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 cursor-pointer group hover:scale-105 transition-transform"
                                      >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                          <Eye className="w-3.5 h-3.5" />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {rev.pros && (
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                                  <span className="font-bold">{t('admin_rev_pros_label')}</span> 👍 {rev.pros}
                                </p>
                              )}
                              {rev.cons && (
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  <span className="font-bold">{t('admin_rev_cons_label')}</span> 👎 {rev.cons}
                                </p>
                              )}

                              {/* Official Store Admin Reply Banner */}
                              {rev.adminReply && (
                                <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 text-xs space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-indigo-900 dark:text-indigo-300">
                                    <span className="flex items-center gap-1">
                                      <span>👑</span>
                                      <span>{t('admin_rev_store_reply_label')} ({rev.adminReply.author})</span>
                                    </span>
                                    <span className="text-gray-400 font-normal">{rev.adminReply.date}</span>
                                  </div>
                                  <p className="text-indigo-950 dark:text-indigo-200 text-xs font-medium pl-4 border-l-2 border-indigo-400">
                                    {rev.adminReply.text}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-0.5">
                                <span className="font-semibold text-gray-600 dark:text-gray-300">{rev.productName}</span>
                                <span>•</span>
                                <span>{rev.date}</span>
                              </div>
                            </div>

                            {/* Moderation Actions */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center flex-wrap">
                              {/* Reply Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenReviewReply(rev.id)}
                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800/40 rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                                title={t('admin_rev_btn_reply')}
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{rev.adminReply ? t('admin_rev_btn_edit_reply') : t('admin_rev_btn_reply')}</span>
                              </button>

                              {rev.status === 'PENDING' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleReviewAction(rev.id, 'APPROVED')}
                                    className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 active:scale-95 transition-all"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{t('admin_btn_approve')}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReviewAction(rev.id, 'REJECTED')}
                                    className="px-3.5 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-xl text-xs font-bold hover:bg-red-100 flex items-center gap-1.5 active:scale-95 transition-all"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    <span>{t('admin_btn_reject')}</span>
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleReviewAction(rev.id, rev.status === 'APPROVED' ? 'REJECTED' : 'APPROVED')
                                  }
                                  className="px-3 py-1.5 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-[#1F293D] active:scale-95 transition-all"
                                >
                                  {rev.status === 'APPROVED' ? t('admin_btn_reject') : t('admin_btn_approve')}
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  openConfirmDialog({
                                    title: `${rev.user} ning sharhini o'chirish`,
                                    description: `"${rev.productName}" tovariga qoldirilgan ushbu sharh butunlay o'chiriladi.`,
                                    confirmText: "O'chirish",
                                    onConfirm: () => {
                                      deleteReviewFromStore(rev.id);
                                    },
                                  });
                                }}
                                className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 transition-all active:scale-95"
                                title="O'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {filteredReviews.length === 0 && (
                          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl p-8 text-center space-y-2">
                            <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                              {t('admin_rev_empty_filter')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 4. CUSTOMERS & CRM HUB (NEW!) */}
            {activeTab === 'customers' && (
              <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs space-y-4">
                <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_crm_title')}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('admin_crm_subtitle')}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {['ALL', 'VIP', 'ACTIVE', 'BLOCKED'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setCustomerFilter(f)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                          customerFilter === f
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-2xs'
                            : 'bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {f === 'ALL'
                          ? 'Barchasi'
                          : f === 'VIP'
                          ? '⭐ VIP'
                          : f === 'ACTIVE'
                          ? 'Faollar'
                          : '🚫 Bloklangan'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300 min-w-[650px]">
                    <thead className="bg-gray-50/80 dark:bg-[#161F30] text-gray-500 dark:text-gray-400 font-extrabold border-b border-gray-200/80 dark:border-white/10 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4 sm:px-5">{t('admin_crm_th_client')}</th>
                        <th className="py-3.5 px-4 sm:px-5">{t('admin_crm_th_orders')}</th>
                        <th className="py-3.5 px-4 sm:px-5">{t('admin_crm_th_spent')}</th>
                        <th className="py-3.5 px-4 sm:px-5">{t('admin_crm_th_last_active')}</th>
                        <th className="py-3.5 px-4 sm:px-5">{t('admin_crm_th_status')}</th>
                        <th className="py-3.5 px-4 sm:px-5 text-right">{t('admin_crm_th_action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-semibold">
                      {customerList
                        .filter((c) => (customerFilter === 'ALL' ? true : c.status === customerFilter))
                        .filter((c) =>
                          searchQuery
                            ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              c.phone.includes(searchQuery)
                            : true
                        )
                        .map((cust) => (
                          <tr key={cust.id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 sm:py-4 px-4 sm:px-5">
                              <div className="flex items-center gap-3">
                                {cust.avatar ? (
                                  <img src={cust.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-white/10" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#161F30] flex items-center justify-center font-bold text-xs">
                                    {cust.name.slice(0, 1)}
                                  </div>
                                )}
                                <div>
                                  <div className="text-gray-950 dark:text-white font-bold flex items-center gap-1.5">
                                    <span>{cust.name}</span>
                                    {cust.status === 'VIP' && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                                  </div>
                                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">@{cust.username} • {cust.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 sm:py-4 px-4 sm:px-5 font-bold text-gray-950 dark:text-white">
                              {cust.ordersCount} ta
                            </td>
                            <td className="py-3.5 sm:py-4 px-4 sm:px-5 font-bold text-emerald-600 dark:text-emerald-400">
                              {cust.totalSpent.toLocaleString()} {t('currency')}
                            </td>
                            <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-gray-500 dark:text-gray-400">
                              {cust.lastActive}
                            </td>
                            <td className="py-3.5 sm:py-4 px-4 sm:px-5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  cust.status === 'VIP'
                                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200'
                                    : cust.status === 'ACTIVE'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200'
                                    : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200'
                                }`}
                              >
                                {cust.status === 'VIP'
                                  ? t('admin_crm_status_vip')
                                  : cust.status === 'ACTIVE'
                                  ? t('admin_crm_status_active')
                                  : t('admin_crm_status_blocked')}
                              </span>
                            </td>
                            <td className="py-3.5 sm:py-4 px-4 sm:px-5 text-right space-x-1.5 whitespace-nowrap">
                              <a
                                href={`https://t.me/${cust.username}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-lg text-xs font-bold inline-flex items-center gap-1 active:scale-95 transition-all"
                              >
                                <SendHorizontal className="w-3 h-3" />
                                <span>{t('admin_crm_btn_chat')}</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  updateCustomerStatus(cust.id, cust.status === 'VIP' ? 'ACTIVE' : 'VIP');
                                  addLog({
                                    action: cust.status === 'VIP' ? 'VIP maqomi bekor qilindi' : 'VIP maqomi berildi',
                                    module: 'CRM',
                                    actor: 'Super Admin',
                                    details: `${cust.name} uchun VIP holati o'zgardi`,
                                    type: 'INFO',
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 text-gray-700 dark:text-gray-300 transition-all inline-flex items-center"
                                title={cust.status === 'VIP' ? t('admin_crm_btn_unvip') : t('admin_crm_btn_vip')}
                              >
                                <Crown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateCustomerStatus(cust.id, cust.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED');
                                  addLog({
                                    action: cust.status === 'BLOCKED' ? 'Mijoz blokdan chiqarildi' : 'Mijoz bloklandi',
                                    module: 'CRM',
                                    actor: 'Super Admin',
                                    details: `${cust.name} blok holati o'zgartirildi`,
                                    type: cust.status === 'BLOCKED' ? 'SUCCESS' : 'DANGER',
                                  });
                                }}
                                className={`p-1.5 rounded-lg border transition-all inline-flex items-center ${
                                  cust.status === 'BLOCKED'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    : 'bg-red-50 text-red-600 border-red-200'
                                }`}
                                title={cust.status === 'BLOCKED' ? t('admin_crm_btn_unblock') : t('admin_crm_btn_block')}
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. MARKETING HUB (BANNERS + PROMOCODES + PUSH NOTIFICATIONS) */}
            {activeTab === 'marketing' && (
              <div className="space-y-5">
                {/* Sub-tab Pills */}
                <div className="flex items-center gap-2 border-b border-gray-200/80 dark:border-white/10 pb-3">
                  {[
                    { id: 'banners', label: t('admin_sub_banners'), icon: ImageIcon, count: adminBanners.length },
                    { id: 'promocodes', label: t('admin_sub_promocodes'), icon: Tag, count: promocodesList.length },
                    { id: 'notifications', label: t('admin_sub_notifications'), icon: Bell },
                  ].map((st) => {
                    const Icon = st.icon;
                    const isSubActive = marketingSubTab === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setMarketingSubTab(st.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                          isSubActive
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                            : 'bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1F293D]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{st.label}</span>
                        {st.count !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              isSubActive
                                ? 'bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-950'
                                : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {st.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-tab 1: Banners */}
                {marketingSubTab === 'banners' && (
                  <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs space-y-5 p-4 sm:p-6">
                    <div className="border-b border-gray-100 dark:border-white/10 pb-4">
                      <h2 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_banners_title')}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('admin_banners_subtitle')}</p>
                    </div>

                    <form onSubmit={handleAddBannerSubmit} className="space-y-4 max-w-xl bg-gray-50/70 dark:bg-[#161F30] p-4 sm:p-5 border border-gray-200/80 dark:border-white/10 rounded-2xl">
                      <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">{t('admin_btn_add_banner')}</h3>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                          {t('admin_lbl_file_upload')} *
                        </label>
                        {newBannerImage ? (
                          <div className="relative w-full h-36 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-white/20 bg-white dark:bg-[#111827] p-1 flex items-center justify-center group">
                            <img src={newBannerImage} alt="Banner preview" className="w-full h-full object-cover rounded-xl" />
                            <button
                              type="button"
                              onClick={() => setNewBannerImage('')}
                              className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl gap-1 text-[11px] font-bold"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                              <span>{t('admin_upload_remove')}</span>
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white rounded-2xl cursor-pointer bg-white dark:bg-[#111827] hover:bg-gray-50/50 transition-all text-center">
                            <Upload className="w-7 h-7 text-gray-400 dark:text-gray-500 mb-2" />
                            <span className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">
                              {t('admin_upload_click_drag')}
                            </span>
                            <span className="text-[10px] text-gray-400">16:9 HD Slayder formati (PNG, JPG, WEBP)</span>
                            <input
                              type="file"
                              accept="image/*"
                              required
                              onChange={(e) => handleDeviceFileUpload(e, setNewBannerImage)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">{t('admin_lbl_banner_title')} *</label>
                        <input
                          type="text"
                          required
                          placeholder="Masalan: Yangi Mavsum Kolleksiyasi"
                          value={newBannerTitle}
                          onChange={(e) => setNewBannerTitle(e.target.value)}
                          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">{t('admin_lbl_banner_link')}</label>
                        <input
                          type="text"
                          required
                          placeholder="/catalog yoki /search"
                          value={newBannerLink}
                          onChange={(e) => setNewBannerLink(e.target.value)}
                          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>{t('save')}</span>
                      </button>
                    </form>

                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                        {t('admin_tab_banners')} ({adminBanners.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {adminBanners.map((bn) => (
                          <div
                            key={bn.id}
                            className={`relative rounded-2xl border overflow-hidden p-3.5 flex flex-col justify-between space-y-3 transition-all ${
                              bn.isActive
                                ? 'bg-white dark:bg-[#111827] border-gray-200/80 dark:border-white/10 text-gray-950 dark:text-white shadow-2xs'
                                : 'bg-gray-50 dark:bg-[#161F30] border-gray-200/40 dark:border-white/5 text-gray-400 opacity-60'
                            }`}
                          >
                            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10">
                              <img src={bn.image} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-2 left-3 right-3">
                                <h4 className="text-xs font-bold text-white truncate">
                                  {typeof bn.title === 'object' ? (bn.title as any)[lang] || (bn.title as any).uz : String(bn.title || '')}
                                </h4>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 truncate">Link: {bn.link}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleBannerActive(bn.id)}
                                  title={bn.isActive ? 'Nofaol qilish' : 'Faollashtirish'}
                                  className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                                    bn.isActive
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-gray-100 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-500'
                                  }`}
                                >
                                  {bn.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeBanner(bn.id)}
                                  title="O'chirish"
                                  className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-100 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab 2: Promocodes */}
                {marketingSubTab === 'promocodes' && (
                  <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs space-y-4">
                    <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_promocodes_title')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('admin_promocodes_subtitle')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddPromoModal(true)}
                        className="px-3.5 sm:px-4 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>{t('admin_btn_add_promo')}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5">
                      {promocodesList.map((promo) => (
                        <div
                          key={promo.id}
                          className="bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-extrabold text-gray-950 dark:text-white px-2.5 py-1 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg">
                              {promo.code}
                            </span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                              -{promo.discount}%
                            </span>
                          </div>

                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            <div>Min. buyurtma: {promo.minOrder.toLocaleString()} UZS</div>
                            <div>
                              Ishlatildi: {promo.usedCount} / {promo.maxUsage}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-tab 3: Broadcast Notifications */}
                {marketingSubTab === 'notifications' && (
                  <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs space-y-5 p-4 sm:p-6">
                    <div className="border-b border-gray-100 dark:border-white/10 pb-4">
                      <h2 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_notifications_title')}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('admin_notifications_subtitle')}</p>
                    </div>

                    {broadcastSuccessAlert && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('admin_alert_notif_sent')}</span>
                      </div>
                    )}

                    <form onSubmit={handleBroadcastSubmit} className="space-y-4 max-w-2xl">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                          {t('admin_lbl_notif_type')}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            { id: 'PROMO', label: '🔥 ' + t('notif_type_promo') },
                            { id: 'ORDER', label: '📦 ' + t('notif_type_order') },
                            { id: 'SYSTEM', label: '⚡ ' + t('notif_type_system') },
                          ].map((tp) => (
                            <button
                              key={tp.id}
                              type="button"
                              onClick={() => setBroadcastType(tp.id as any)}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                                broadcastType === tp.id
                                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                  : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {tp.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                          {t('admin_lbl_notif_title')} *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Masalan: Yangi chegirmalar boshlandi!"
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                          {t('admin_lbl_notif_message')} *
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Batafsil xabar matni..."
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                          {t('admin_lbl_file_upload')}
                        </label>
                        {broadcastImage ? (
                          <div className="relative w-36 h-24 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 group">
                            <img src={broadcastImage} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setBroadcastImage('')}
                              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 text-[10px] font-bold"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                              <span>{t('admin_upload_remove')}</span>
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-3 p-3.5 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white rounded-xl cursor-pointer bg-white dark:bg-[#111827] transition-all">
                            <Camera className="w-5 h-5 text-gray-400" />
                            <div>
                              <span className="text-xs font-bold text-gray-900 dark:text-white block">
                                {t('admin_upload_click_drag')}
                              </span>
                              <span className="text-[10px] text-gray-400">{t('admin_upload_formats')}</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleDeviceFileUpload(e, setBroadcastImage)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all"
                      >
                        <Send className="w-4 h-4" />
                        <span>{t('admin_btn_send_broadcast')}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 6. SETTINGS & SYSTEM HUB (STORE + STAFF + AUDIT) */}
            {activeTab === 'settings' && (
              <div className="space-y-5">
                {/* Sub-tab Pills */}
                <div className="flex items-center gap-2 border-b border-gray-200/80 dark:border-white/10 pb-3">
                  {[
                    { id: 'store', label: t('admin_sub_store_settings'), icon: Store },
                    { id: 'staff', label: t('admin_sub_staff'), icon: Users, count: staffList.length },
                    { id: 'audit', label: t('admin_sub_audit'), icon: ShieldCheck, count: auditLogs.length },
                  ].map((st) => {
                    const Icon = st.icon;
                    const isSubActive = settingsSubTab === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSettingsSubTab(st.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                          isSubActive
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                            : 'bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1F293D]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{st.label}</span>
                        {st.count !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              isSubActive
                                ? 'bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-950'
                                : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {st.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-tab 1: Store & Gateway Settings */}
                {settingsSubTab === 'store' && (
                  <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs space-y-6 p-4 sm:p-6">
                    <div className="border-b border-gray-100 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_settings_title')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('admin_settings_subtitle')}</p>
                      </div>
                      {settingsSavedAlert && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40 animate-in fade-in">
                          ✓ {t('admin_alert_saved')}
                        </span>
                      )}
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                      {/* 0. Interface & Appearance (Language & Theme) */}
                      <div className="space-y-4 p-4 sm:p-5 bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                            <Sliders className="w-4 h-4 text-gray-900 dark:text-white" />
                            <span>{t('admin_settings_appearance_title')}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                            {t('admin_settings_appearance_desc')}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          {/* Language Switcher */}
                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                              {t('profile_language')}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
                                { code: 'ru', label: 'Русский', flag: '🇷🇺' },
                                { code: 'en', label: 'English', flag: '🇬🇧' },
                              ].map((item) => (
                                <button
                                  key={item.code}
                                  type="button"
                                  onClick={() => setLang(item.code as any)}
                                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                                    lang === item.code
                                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                      : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
                                  }`}
                                >
                                  <span className="text-base">{item.flag}</span>
                                  <span className="text-[11px]">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Theme Switcher */}
                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                              {t('profile_theme')}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setTheme('light')}
                                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                  theme === 'light'
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                                    : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
                                }`}
                              >
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span>{t('admin_settings_theme_light')}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setTheme('dark')}
                                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                                  theme === 'dark'
                                    ? 'bg-white text-gray-950 border-white shadow-xs'
                                    : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
                                }`}
                              >
                                <Moon className="w-4 h-4 text-indigo-400" />
                                <span>{t('admin_settings_theme_dark')}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 1. General Info */}
                      <div className="space-y-4 p-4 sm:p-5 bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                          <Store className="w-4 h-4 text-gray-900 dark:text-white" />
                          <span>{t('admin_lbl_store_name')}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                              {t('admin_lbl_store_name')}
                            </label>
                            <input
                              type="text"
                              value={settingsForm.storeName}
                              onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                              className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                              {t('admin_lbl_support_phone')}
                            </label>
                            <input
                              type="text"
                              value={settingsForm.supportPhone}
                              onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                              className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                              {t('admin_lbl_tg_bot')}
                            </label>
                            <input
                              type="text"
                              value={settingsForm.telegramSupport}
                              onChange={(e) => setSettingsForm({ ...settingsForm, telegramSupport: e.target.value })}
                              className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                              {t('admin_lbl_work_hours')}
                            </label>
                            <input
                              type="text"
                              value={settingsForm.workingHours}
                              onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                              className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Delivery Rates */}
                      <div className="space-y-4 p-4 sm:p-5 bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                          <Truck className="w-4 h-4 text-gray-900 dark:text-white" />
                          <span>{t('admin_lbl_delivery_fee')}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                              {t('admin_lbl_delivery_fee')} ({t('currency')})
                            </label>
                            <input
                              type="number"
                              value={settingsForm.deliveryFee}
                              onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) || 0 })}
                              className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                              {t('admin_lbl_free_delivery_min')} ({t('currency')})
                            </label>
                            <input
                              type="number"
                              value={settingsForm.freeDeliveryThreshold}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) || 0 })
                              }
                              className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Payment Toggles */}
                      <div className="space-y-4 p-4 sm:p-5 bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                          <CreditCard className="w-4 h-4 text-gray-900 dark:text-white" />
                          <span>{t('admin_lbl_payment_methods')}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            { key: 'enablePayme', brand: 'Payme', badgeName: 'payme', badge: 'bg-[#00CCCC] text-white' },
                            { key: 'enableClick', brand: 'Click', badgeName: 'click', badge: 'bg-[#0073FF] text-white' },
                            { key: 'enableCash', brand: t('payment_cash_name'), badgeName: t('payment_cash_badge'), badge: 'bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200' },
                          ].map((pm) => {
                            const isEnabled = settingsForm[pm.key as keyof typeof settingsForm] as boolean;
                            return (
                              <button
                                key={pm.key}
                                type="button"
                                onClick={() => setSettingsForm({ ...settingsForm, [pm.key]: !isEnabled })}
                                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                                  isEnabled
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-white/10 text-gray-400'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black lowercase ${pm.badge}`}>
                                    {pm.badgeName}
                                  </span>
                                  <span>{pm.brand}</span>
                                </div>
                                <span>{isEnabled ? '✓ Faol' : 'O\'chirilgan'}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. Gemini AI */}
                      <div className="space-y-4 p-4 sm:p-5 bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>{t('admin_lbl_gemini_api_key')}</span>
                        </div>

                        <div>
                          <input
                            type="password"
                            placeholder="AIzaSy..."
                            value={settingsForm.geminiApiKey}
                            onChange={(e) => setSettingsForm({ ...settingsForm, geminiApiKey: e.target.value })}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white font-mono"
                          />
                        </div>
                      </div>

                      {/* 5. Sharhlar Siyosati & Maksimal Ko'rsatish Cheklovi */}
                      <div className="space-y-4 p-4 sm:p-5 bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                          <MessageSquare className="w-4 h-4 text-gray-900 dark:text-white" />
                          <span>Mahsulotdagi Maksimal Sharhlar Soni (FIFO)</span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          Bitta mahsulot sahifasida xaridorlarga ko'rsatiladigan eng yangi tasdiqlangan sharhlar miqdori. Yangi sharh tasdiqlanganda eng eskisi o'rnini bo'shatadi.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[5, 10, 20, 50].map((num) => {
                            const isSelected = (settingsForm.maxReviewsPerProduct || 10) === num;
                            return (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setSettingsForm({ ...settingsForm, maxReviewsPerProduct: num })}
                                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                                  isSelected
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                                    : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20'
                                }`}
                              >
                                <span>{num} ta sharh</span>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>{t('admin_btn_save_settings')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            openConfirmDialog({
                              title: "Sozlamalarni standart holatga qaytarish",
                              description: "Barcha do'kon sozlamalari dastlabki standart holatga qaytariladi.",
                              confirmText: "Qaytarish",
                              onConfirm: () => {
                                settings.resetSettings();
                                setSettingsForm({
                                  storeName: 'PREMIUM STORE',
                                  supportPhone: '+998 (90) 123-45-67',
                                  telegramSupport: 'tme_support_bot',
                                  workingHours: '09:00 - 22:00',
                                  deliveryFee: 25000,
                                  freeDeliveryThreshold: 300000,
                                  enablePayme: true,
                                  enableClick: true,
                                  enableCash: true,
                                  geminiApiKey: '',
                                  geminiModel: 'gemini-1.5-flash',
                                  maxReviewsPerProduct: 10,
                                });
                              },
                            });
                          }}
                          className="px-4 py-2.5 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] text-gray-700 dark:text-gray-300 font-semibold rounded-lg text-xs active:scale-95 transition-all"
                        >
                          {t('admin_btn_reset_defaults')}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Sub-tab 2: Staff Management */}
                {settingsSubTab === 'staff' && (
                  <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs space-y-5 p-4 sm:p-6">
                    <div className="border-b border-gray-100 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_staff_title')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('admin_staff_subtitle')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddStaffModal(true)}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>{t('admin_btn_add_staff')}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {staffList.map((member) => (
                        <div
                          key={member.id}
                          className="bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={member.avatar}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-gray-950 dark:text-white">{member.name}</h4>
                                <span className="text-[10px] text-gray-400">{member.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-white/10 text-xs">
                            <span
                              className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                                member.role === 'SUPER_ADMIN'
                                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                                  : member.role === 'MANAGER'
                                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {member.role === 'SUPER_ADMIN'
                                ? t('admin_role_super_admin')
                                : member.role === 'MANAGER'
                                ? t('admin_role_manager')
                                : t('admin_role_courier')}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => toggleStaffActive(member.id)}
                                className={`p-1.5 rounded-lg border ${
                                  member.isActive
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {member.isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  openConfirmDialog({
                                    title: `Xodim "${member.name}" ni o'chirish`,
                                    description: "Ushbu xodim tizimdan butunlay olib tashlanadi va kirish huquqlari bekor qilinadi.",
                                    confirmText: "O'chirish",
                                    onConfirm: () => removeStaff(member.id),
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 hover:bg-red-100 active:scale-95 transition-all"
                                title="O'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-tab 3: Security & Audit Logs */}
                {settingsSubTab === 'audit' && (
                  <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs space-y-4">
                    <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_audit_title')}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('admin_audit_subtitle')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          openConfirmDialog({
                            title: "Audit jurnalini tozalash",
                            description: "Barcha xavfsizlik va amal jurnallari tarixi butunlay tozalanadi.",
                            confirmText: "Tozalash",
                            onConfirm: () => clearLogs(),
                          });
                        }}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold active:scale-95"
                      >
                        {t('admin_btn_clear_audit')}
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-white/5 p-4 sm:p-5 space-y-2.5">
                      {auditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 bg-gray-50/70 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                log.type === 'SUCCESS'
                                  ? 'bg-emerald-500'
                                  : log.type === 'WARNING'
                                  ? 'bg-amber-500'
                                  : log.type === 'DANGER'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                            <div>
                              <div className="font-bold text-gray-950 dark:text-white">{log.action}</div>
                              <div className="text-[11px] text-gray-500 dark:text-gray-400">{log.details}</div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono text-gray-400">{log.timestamp}</span>
                            <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300">{log.actor}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (4 COMPACT HUBS) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t border-gray-200/80 dark:border-white/10 h-16 flex items-center justify-around px-2 shadow-lg">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 active:scale-95 transition-all ${
            activeTab === 'dashboard'
              ? 'text-gray-950 dark:text-white font-bold'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <BarChart3 className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-1">{t('admin_tab_dashboard')}</span>
        </button>

        {/* Tab 2: Orders */}
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 active:scale-95 transition-all relative ${
            activeTab === 'orders'
              ? 'text-gray-950 dark:text-white font-bold'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {pendingOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute -top-0.5 -right-0.5" />
            )}
          </div>
          <span className="text-[10px] mt-1">{t('admin_tab_orders')}</span>
        </button>

        {/* Tab 3: Catalog */}
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 active:scale-95 transition-all ${
            activeTab === 'catalog'
              ? 'text-gray-950 dark:text-white font-bold'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <Package className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-1">{t('admin_tab_catalog_hub')}</span>
        </button>

        {/* Tab 4: More/Menu */}
        <button
          type="button"
          onClick={() => setMobileMoreSheetOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 active:scale-95 transition-all ${
            mobileMoreSheetOpen
              ? 'text-gray-950 dark:text-white font-bold'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-1">{t('admin_mob_more')}</span>
        </button>
      </div>

      {/* 4. MOBILE SLIDE-OVER DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in">
          <div className="w-72 bg-white dark:bg-[#111827] h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center font-bold text-xs">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-gray-950 dark:text-white uppercase truncate max-w-[150px]">
                      {settings.storeName}
                    </h2>
                    <span className="text-[10px] text-gray-400">Admin Console</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  BO'LIMLAR
                </div>
                {primaryHubs.map((hub) => {
                  const Icon = hub.icon;
                  const isActive = activeTab === hub.id;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(hub.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        isActive
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                      <span>{hub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-white/10">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 dark:bg-[#161F30] text-gray-800 dark:text-gray-200 rounded-xl text-xs font-semibold"
              >
                <span>{t('admin_view_store')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 5. MOBILE BOTTOM SHEET FOR "MORE" MENU */}
      {mobileMoreSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] border-t border-gray-200/80 dark:border-white/10 rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
              <h3 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider">
                {t('admin_mob_more')}
              </h3>
              <button
                type="button"
                onClick={() => setMobileMoreSheetOpen(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'customers', label: t('admin_tab_customers_crm'), icon: Users, count: customerList.length },
                { id: 'marketing', label: t('admin_tab_marketing_hub'), icon: Flame },
                { id: 'settings', label: t('admin_tab_settings_hub'), icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMoreSheetOpen(false);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                      isActive
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white shadow-xs'
                        : 'bg-gray-50 dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold truncate">{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500 text-white">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. UNIVERSAL 3-TAB PRODUCT CREATE / EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-3xl p-4 sm:p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-900 dark:text-white">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                    {editingProductId ? t('admin_modal_edit_product_title') : t('admin_modal_add_product_title')}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {editingProductId ? `ID: #${editingProductId}` : "Yangi mahsulot parametrlarini to'ldiring"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented 3-Tab Navigation Bar */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-[#161F30] rounded-xl border border-gray-200/80 dark:border-white/10">
              {[
                { id: 'general', label: t('admin_modal_tab_general') },
                { id: 'variants', label: t('admin_modal_tab_variants') },
                { id: 'marketing', label: t('admin_modal_tab_marketing') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProductModalActiveTab(tab.id as any)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                    productModalActiveTab === tab.id
                      ? 'bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-2xs'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-5 text-xs">
              {/* ========================================== */}
              {/* TAB 1: GENERAL INFO (ASOSIY MA'LUMOTLAR) */}
              {/* ========================================== */}
              {productModalActiveTab === 'general' && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  {/* Multi-Image Gallery */}
                  <div className="space-y-2">
                    <label className="font-bold text-gray-900 dark:text-white block">
                      {t('admin_modal_gallery_label')} *
                    </label>

                    {/* Images Strip */}
                    {productFormImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 mb-2">
                        {productFormImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-800 group"
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white z-10">
                                {t('admin_gallery_primary')}
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryProductImage(idx)}
                                  className="p-1 rounded bg-white text-gray-900 text-[10px] font-bold shadow-xs hover:bg-gray-100 active:scale-95"
                                >
                                  {t('admin_gallery_make_primary')}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveProductImage(idx)}
                                className="p-1 rounded bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 active:scale-95"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Box */}
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-4 cursor-pointer hover:border-gray-900 dark:hover:border-white transition-all bg-gray-50/50 dark:bg-white/5 group">
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mb-1" />
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {t('admin_modal_upload_prompt')}
                      </span>
                      <span className="text-[11px] text-gray-400">PNG, JPG, WEBP (maks. 5MB)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleProductMultiImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Multilingual Title & Description Block */}
                  <div className="p-3.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-gray-200/60 dark:border-white/5 pb-2.5">
                      {/* Language Switcher Tabs */}
                      <div className="flex items-center gap-1 bg-white dark:bg-[#111827] p-1 rounded-xl border border-gray-200 dark:border-white/10">
                        {(['uz', 'ru', 'en'] as const).map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setProductModalLangTab(l)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                              productModalLangTab === l
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-2xs'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            {l === 'uz' ? '🇺🇿 UZ' : l === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
                          </button>
                        ))}
                      </div>

                      {/* Gemini AI Auto-Translate Button */}
                      <button
                        type="button"
                        onClick={handleAiTranslateProduct}
                        disabled={isTranslatingProduct}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs disabled:opacity-50"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isTranslatingProduct ? 'animate-spin' : ''}`} />
                        <span>
                          {isTranslatingProduct ? t('admin_btn_ai_translating') : t('admin_btn_ai_translate')}
                        </span>
                      </button>
                    </div>

                    {/* Active Language Name & Description Fields */}
                    {productModalLangTab === 'uz' && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                            <span>{t('admin_modal_name_uz')} *</span>
                            <span className="text-[10px] text-gray-400 font-normal">(Asosiy til)</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Masalan: Erkaklar charm kurtkasi..."
                            value={productFormNameUz}
                            onChange={(e) => setProductFormNameUz(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white block">
                            {t('admin_modal_desc_uz')}
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Mahsulot haqida batafsil ma'lumot..."
                            value={productFormDescUz}
                            onChange={(e) => setProductFormDescUz(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white block">
                            {t('admin_advantages_title')} (O'zbekcha)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="100% original va sifatli mato&#10;Zamonaviy va ergonomik dizayn&#10;Uzoq muddatli xizmat kafolati"
                            value={productFormAdvantagesUz}
                            onChange={(e) => setProductFormAdvantagesUz(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {productModalLangTab === 'ru' && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white block">
                            {t('admin_modal_name_ru')}
                          </label>
                          <input
                            type="text"
                            placeholder="Мужская кожаная куртка..."
                            value={productFormNameRu}
                            onChange={(e) => setProductFormNameRu(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white block">
                            {t('admin_modal_desc_ru')}
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Подробное описание товара..."
                            value={productFormDescRu}
                            onChange={(e) => setProductFormDescRu(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white block">
                            {t('admin_advantages_title')} (Русский)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="100% оригинальный продукт&#10;Современный эргономичный дизайн&#10;Долговечность и гарантия"
                            value={productFormAdvantagesRu}
                            onChange={(e) => setProductFormAdvantagesRu(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {productModalLangTab === 'en' && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white block">
                            {t('admin_modal_name_en')}
                          </label>
                          <input
                            type="text"
                            placeholder="Men's Genuine Leather Jacket..."
                            value={productFormNameEn}
                            onChange={(e) => setProductFormNameEn(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white block">
                            {t('admin_modal_desc_en')}
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Detailed product specifications and highlights..."
                            value={productFormDescEn}
                            onChange={(e) => setProductFormDescEn(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-gray-900 dark:text-white block">
                            {t('admin_advantages_title')} (English)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="100% genuine certified product&#10;Modern ergonomic styling&#10;Long-lasting quality guarantee"
                            value={productFormAdvantagesEn}
                            onChange={(e) => setProductFormAdvantagesEn(e.target.value)}
                            className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Specifications & Parameters Matrix (Mijoz Sahifasi Xususiyatlari bilan 100% sinxron) */}
                  <div className="p-3.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-3">
                    <label className="font-bold text-gray-950 dark:text-white block text-xs">
                      {t('admin_specs_title')} (Mijoz Xususiyatlar jadvali)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-[11px] text-gray-500 block">
                          {t('admin_specs_brand')}
                        </label>
                        <input
                          type="text"
                          placeholder="Premium Boutique Edition"
                          value={productFormBrand}
                          onChange={(e) => setProductFormBrand(e.target.value)}
                          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-[11px] text-gray-500 block">
                          Model kodi (SKU)
                        </label>
                        <input
                          type="text"
                          placeholder="SKU-102938"
                          value={productFormModelCode}
                          onChange={(e) => setProductFormModelCode(e.target.value)}
                          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-[11px] text-gray-500 block">
                          {t('admin_specs_warranty')}
                        </label>
                        <input
                          type="text"
                          placeholder="12 oy rasmiy kafolat"
                          value={productFormWarranty}
                          onChange={(e) => setProductFormWarranty(e.target.value)}
                          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-[11px] text-gray-500 block">
                          {t('admin_specs_delivery')}
                        </label>
                        <input
                          type="text"
                          placeholder="Butun O'zbekiston bo'ylab"
                          value={productFormDelivery}
                          onChange={(e) => setProductFormDelivery(e.target.value)}
                          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-[11px] text-gray-500 block">
                          {t('admin_specs_package')}
                        </label>
                        <input
                          type="text"
                          placeholder="Muhrlangan original quti"
                          value={productFormPackage}
                          onChange={(e) => setProductFormPackage(e.target.value)}
                          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Pricing Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Category Popover Selector */}
                    <div className="space-y-1 relative custom-filter-dropdown-container">
                      <label className="font-bold text-gray-900 dark:text-white block">
                        {t('admin_modal_category')} *
                      </label>
                      <button
                        type="button"
                        onClick={() => setOpenProductFormCategoryDropdown(!openProductFormCategoryDropdown)}
                        className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white font-semibold flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {(() => {
                            const c = storeCategories.find((cat) => cat.id === productFormCategoryId);
                            return c ? (
                              <>
                                <img src={c.image} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                                <span className="truncate">
                                  {typeof c.name === 'object' ? (c.name as any)[lang] || c.name.uz : c.name}
                                </span>
                              </>
                            ) : (
                              <span>{t('admin_filter_category')}</span>
                            );
                          })()}
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      {openProductFormCategoryDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 max-h-48 overflow-y-auto">
                          {storeCategories.map((c) => {
                            const isSelected = productFormCategoryId === c.id;
                            const catLabel = typeof c.name === 'object' ? (c.name as any)[lang] || c.name.uz : c.name;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setProductFormCategoryId(c.id);
                                  setOpenProductFormCategoryDropdown(false);
                                }}
                                className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <img src={c.image} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                                  <span>{catLabel}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Base Price */}
                    <div className="space-y-1">
                      <label className="font-bold text-gray-900 dark:text-white block">
                        {t('admin_modal_base_price')} (UZS) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="180000"
                        value={productFormBasePrice}
                        onChange={(e) => setProductFormBasePrice(e.target.value)}
                        className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                      />
                    </div>

                    {/* Cost Price */}
                    <div className="space-y-1">
                      <label className="font-bold text-gray-900 dark:text-white block">
                        {t('admin_modal_cost_price')} (UZS)
                      </label>
                      <input
                        type="number"
                        placeholder="110000"
                        value={productFormCostPrice}
                        onChange={(e) => setProductFormCostPrice(e.target.value)}
                        className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                      />
                    </div>

                    {/* Old Price */}
                    <div className="space-y-1">
                      <label className="font-bold text-gray-900 dark:text-white block">
                        {t('admin_modal_old_price')} (UZS)
                      </label>
                      <input
                        type="number"
                        placeholder="220000"
                        value={productFormOldPrice}
                        onChange={(e) => setProductFormOldPrice(e.target.value)}
                        className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                      />
                    </div>
                  </div>

                  {/* Net Profit Margin Live Indicator */}
                  {Number(productFormBasePrice) > 0 && Number(productFormCostPrice) > 0 && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                      <span className="font-medium">
                        Sof foyda (marja): +{(Number(productFormBasePrice) - Number(productFormCostPrice)).toLocaleString()} UZS
                      </span>
                      <span className="font-black">
                        +{Math.round(((Number(productFormBasePrice) - Number(productFormCostPrice)) / Number(productFormCostPrice)) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB 2: VARIANTS & STOCK (VARIANTLAR & OMBOR) */}
              {/* ========================================== */}
              {productModalActiveTab === 'variants' && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  {/* Product Type Switcher: Simple vs Multi-Variant */}
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 dark:bg-[#161F30] rounded-2xl border border-gray-200/80 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setProductHasVariants(false)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        !productHasVariants
                          ? 'bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-2xs'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      <span>{t('admin_modal_type_simple')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProductHasVariants(true)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        productHasVariants
                          ? 'bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-2xs'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Boxes className="w-4 h-4" />
                      <span>{t('admin_modal_type_variants')}</span>
                    </button>
                  </div>

                  {/* Mode 1: Simple Product Stock Input */}
                  {!productHasVariants && (
                    <div className="p-4 bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-3">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-900 dark:text-white block">
                          {t('admin_modal_single_stock')} *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={productSingleStock}
                          onChange={(e) => setProductSingleStock(e.target.value)}
                          placeholder="10"
                          className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white text-base"
                        />
                        <span className="text-[11px] text-gray-500">
                          {t('admin_modal_single_stock_desc')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Multi-Variant Dynamic SKU Table */}
                  {productHasVariants && (
                    <div className="p-4 bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-950 dark:text-white block">
                            {t('admin_modal_variants_title')}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            O'lcham, rang, narx va qoldiq bo'yicha variantlar
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddVariantRow}
                          className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95 transition-all shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('admin_modal_btn_add_variant')}</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200 dark:border-white/10 pb-1">
                            <tr>
                              <th className="pb-2">{t('admin_variant_th_size')}</th>
                              <th className="pb-2">{t('admin_variant_th_color')}</th>
                              <th className="pb-2">{t('admin_variant_th_price')}</th>
                              <th className="pb-2">{t('admin_variant_th_stock')}</th>
                              <th className="pb-2 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200/60 dark:divide-white/5">
                            {productFormVariants.map((v, idx) => (
                              <tr key={v.id}>
                                <td className="py-2 pr-2">
                                  <input
                                    type="text"
                                    placeholder="M, L, XL..."
                                    value={v.size}
                                    onChange={(e) => handleUpdateVariantRow(idx, 'size', e.target.value)}
                                    className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-semibold"
                                  />
                                </td>
                                <td className="py-2 pr-2">
                                  <input
                                    type="text"
                                    placeholder="Qora, Oq..."
                                    value={v.color}
                                    onChange={(e) => handleUpdateVariantRow(idx, 'color', e.target.value)}
                                    className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-semibold"
                                  />
                                </td>
                                <td className="py-2 pr-2">
                                  <input
                                    type="number"
                                    placeholder="Narx"
                                    value={v.price}
                                    onChange={(e) => handleUpdateVariantRow(idx, 'price', e.target.value)}
                                    className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-bold"
                                  />
                                </td>
                                <td className="py-2 pr-2">
                                  <input
                                    type="number"
                                    placeholder="Soni"
                                    value={v.stock_count}
                                    onChange={(e) => handleUpdateVariantRow(idx, 'stock_count', e.target.value)}
                                    className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-bold"
                                  />
                                </td>
                                <td className="py-2 text-right">
                                  {productFormVariants.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVariantRow(idx)}
                                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 active:scale-95"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================== */}
              {/* TAB 3: MARKETING & SHOWCASE (MARKETING & VITRINA) */}
              {/* ========================================== */}
              {productModalActiveTab === 'marketing' && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  {/* Badge Picker */}
                  <div className="space-y-1 relative custom-filter-dropdown-container">
                    <label className="font-bold text-gray-900 dark:text-white block">
                      {t('admin_modal_badge')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setOpenProductFormBadgeDropdown(!openProductFormBadgeDropdown)}
                      className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white font-semibold flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        {productFormBadge === 'NEW' && '✨ ' + t('badge_new')}
                        {productFormBadge === 'TOP' && '🔥 ' + t('badge_top')}
                        {productFormBadge === 'SALE' && '🏷️ ' + t('badge_sale')}
                        {productFormBadge === 'NONE' && t('admin_badge_none')}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>

                    {openProductFormBadgeDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1">
                        {[
                          { id: 'NONE', label: t('admin_badge_none') },
                          { id: 'NEW', label: '✨ ' + t('badge_new') },
                          { id: 'TOP', label: '🔥 ' + t('badge_top') },
                          { id: 'SALE', label: '🏷️ ' + t('badge_sale') },
                        ].map((b) => {
                          const isSelected = productFormBadge === b.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                setProductFormBadge(b.id as any);
                                setOpenProductFormBadgeDropdown(false);
                              }}
                              className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${
                                isSelected
                                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                              }`}
                            >
                              <span>{b.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Showcase & Popular Merchandising Cards */}
                  <div className="p-4 bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-3">
                    <label className="font-bold text-gray-950 dark:text-white flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('admin_modal_showcase_section')}</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Is Popular Checkbox Card */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          productFormIsPopular
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60'
                            : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-white/10'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={productFormIsPopular}
                          onChange={(e) => setProductFormIsPopular(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-500"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-gray-950 dark:text-white flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {t('admin_modal_popular_toggle')}
                          </span>
                          <span className="text-[10px] text-gray-500 block">
                            {t('admin_modal_popular_toggle_desc')}
                          </span>
                        </div>
                      </label>

                      {/* Show on Home Checkbox Card */}
                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          productFormShowOnHome
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700/60'
                            : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-white/10'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={productFormShowOnHome}
                          onChange={(e) => setProductFormShowOnHome(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-gray-950 dark:text-white flex items-center gap-1">
                            <Home className="w-3.5 h-3.5 text-blue-500" />
                            {t('admin_modal_home_toggle')}
                          </span>
                          <span className="text-[10px] text-gray-500 block">
                            {t('admin_modal_home_toggle_desc')}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Tags with AI Generation */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-gray-900 dark:text-white block">
                        {t('admin_modal_tags')}
                      </label>
                      <button
                        type="button"
                        onClick={handleAiGenerateTags}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{t('admin_btn_ai_tags')}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="kurtka, qishki kiyim, charm kurtka, erkaklar uchun..."
                      value={productFormTags}
                      onChange={(e) => setProductFormTags(e.target.value)}
                      className="w-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    />
                    <span className="text-[10px] text-gray-400 block">{t('admin_modal_tags_help')}</span>
                  </div>
                </div>
              )}

              {/* Modal Footer with Tab Navigation */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-xl font-bold active:scale-95 transition-all"
                >
                  {t('cancel')}
                </button>

                <div className="flex items-center gap-2">
                  {productModalActiveTab !== 'general' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (productModalActiveTab === 'marketing') setProductModalActiveTab('variants');
                        else if (productModalActiveTab === 'variants') setProductModalActiveTab('general');
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs active:scale-95 transition-all"
                    >
                      ◀ Orqaga
                    </button>
                  )}

                  {productModalActiveTab !== 'marketing' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (productModalActiveTab === 'general') setProductModalActiveTab('variants');
                        else if (productModalActiveTab === 'variants') setProductModalActiveTab('marketing');
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl text-xs active:scale-95 transition-all"
                    >
                      Keyingisi ▶
                    </button>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl shadow-xs active:scale-95 transition-all"
                  >
                    {editingProductId ? t('admin_modal_btn_update') : t('save')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE / EDIT MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-gray-900 dark:text-white" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {editingCategoryId ? t('admin_modal_edit_category_title') : t('admin_modal_add_category_title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCategoryFormSubmit} className="space-y-4 text-xs">
              {/* Category Image */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                  {t('admin_lbl_file_upload')} *
                </label>
                {categoryFormImage ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-white/20 p-1 mx-auto group">
                    <img src={categoryFormImage} alt="" className="w-full h-full object-cover rounded-full" />
                    <button
                      type="button"
                      onClick={() => setCategoryFormImage('')}
                      className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full gap-1 text-[10px] font-bold"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span>{t('admin_upload_remove')}</span>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white rounded-2xl cursor-pointer bg-gray-50/50 dark:bg-[#161F30] hover:bg-gray-100/50 transition-all text-center">
                    <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-1.5" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {t('admin_upload_click_drag')}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{t('admin_upload_formats')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => handleDeviceFileUpload(e, setCategoryFormImage)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Parent Category (Asosiy toifa) Popover */}
              <div className="relative custom-filter-dropdown-container">
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_cat_parent_label')}
                </label>
                <button
                  type="button"
                  onClick={() => setOpenCategoryFormParentDropdown(!openCategoryFormParentDropdown)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white font-bold flex items-center justify-between transition-all"
                >
                  <span>
                    {categoryFormParentId === null
                      ? t('admin_cat_parent_none')
                      : (() => {
                          const p = storeCategories.find((c) => c.id === categoryFormParentId);
                          return p ? (typeof p.name === 'object' ? (p.name as any)[lang] || p.name.uz : p.name) : t('admin_cat_parent_none');
                        })()}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openCategoryFormParentDropdown ? 'rotate-180' : ''}`} />
                </button>

                {openCategoryFormParentDropdown && (
                  <div className="absolute left-0 mt-1.5 w-full bg-white dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 max-h-48 overflow-y-auto animate-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFormParentId(null);
                        setOpenCategoryFormParentDropdown(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                        categoryFormParentId === null
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                      }`}
                    >
                      <span>{t('admin_cat_parent_none')}</span>
                      {categoryFormParentId === null && <Check className="w-3.5 h-3.5" />}
                    </button>

                    {storeCategories
                      .filter((c) => !editingCategoryId || c.id !== editingCategoryId)
                      .map((c) => {
                        const isSelected = categoryFormParentId === c.id;
                        const label = typeof c.name === 'object' ? (c.name as any)[lang] || c.name.uz : c.name;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setCategoryFormParentId(c.id);
                              setOpenCategoryFormParentDropdown(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <img src={c.image} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                              <span className="truncate">{label}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Category 3-Language Names */}
              <div className="space-y-2.5">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    {t('admin_lbl_cat_name')} (UZ) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Kiyim-kechak"
                    value={categoryFormNameUz}
                    onChange={(e) => setCategoryFormNameUz(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                      {t('admin_lbl_cat_name')} (RU)
                    </label>
                    <input
                      type="text"
                      placeholder="Одежда"
                      value={categoryFormNameRu}
                      onChange={(e) => setCategoryFormNameRu(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">
                      {t('admin_lbl_cat_name')} (EN)
                    </label>
                    <input
                      type="text"
                      placeholder="Clothing"
                      value={categoryFormNameEn}
                      onChange={(e) => setCategoryFormNameEn(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Show on Home Carousel Option */}
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  categoryFormShowOnHome
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700/60'
                    : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10'
                }`}
              >
                <input
                  type="checkbox"
                  checked={categoryFormShowOnHome}
                  onChange={(e) => setCategoryFormShowOnHome(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-gray-950 dark:text-white flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-blue-500" />
                    {t('admin_modal_cat_home_toggle')}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    {t('admin_modal_cat_home_desc')}
                  </span>
                </div>
              </label>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-xl font-bold active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl shadow-xs active:scale-95 transition-all"
                >
                  {editingCategoryId ? t('admin_modal_btn_update') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL (SPRINT 12) */}
      {showCsvImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {t('admin_modal_csv_import_title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCsvImportModal(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold block">{t('admin_csv_template_info')}</span>
                  <span className="text-[11px] opacity-80">{t('admin_csv_template_desc')}</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadCsvTemplate}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition-all shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('admin_btn_download_template')}</span>
                </button>
              </div>

              {/* Upload File Box */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_csv_file_upload_label')} (.csv)
                </label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-white/20 hover:border-gray-900 dark:hover:border-white rounded-xl cursor-pointer bg-gray-50/50 dark:bg-[#161F30] hover:bg-gray-100/50 transition-all text-center">
                  <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {csvImportFile ? csvImportFile.name : t('admin_csv_select_file')}
                  </span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCsvFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or Paste Raw CSV Data */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_csv_paste_label')}
                </label>
                <textarea
                  rows={5}
                  placeholder={`name_uz;name_ru;name_en;base_price;cost_price;category_id;stock_count;badge;images\nCharm kurtka;Кожаная куртка;Leather Jacket;250000;150000;1;25;TOP;https://...`}
                  value={csvImportText}
                  onChange={(e) => setCsvImportText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl p-2.5 font-mono text-[11px] text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCsvImportModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-xl font-bold active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleImportCsvSubmit}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs active:scale-95 transition-all"
                >
                  {t('admin_btn_import_now')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL STORE REVIEW REPLY MODAL (SPRINT 12) */}
      {showReviewReplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {t('admin_modal_reply_title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewReplyModal(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_lbl_reply_author')}
                </label>
                <input
                  type="text"
                  value={reviewReplyAuthor}
                  onChange={(e) => setReviewReplyAuthor(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_lbl_reply_text')} *
                </label>
                <textarea
                  rows={4}
                  placeholder="Xaridingiz va samimiy fikringiz uchun katta rahmat! Do'konimiz sizga xizmat qilishdan doim mamnun..."
                  value={reviewReplyText}
                  onChange={(e) => setReviewReplyText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowReviewReplyModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-xl font-bold active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveReviewReply}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs active:scale-95 transition-all"
                >
                  {t('admin_btn_publish_reply')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW IMAGE PREVIEW LIGHTBOX */}
      {selectedReviewImagePreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedReviewImagePreview(null)}
        >
          <div className="relative max-w-2xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
            <img
              src={selectedReviewImagePreview}
              alt="Mijoz sharh fotosi"
              className="w-full h-full object-contain max-h-[85vh] mx-auto"
            />
            <button
              type="button"
              onClick={() => setSelectedReviewImagePreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. ADD PROMO MODAL */}
      {showAddPromoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-sm p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_btn_add_promo')}</h3>
              <button
                type="button"
                onClick={() => setShowAddPromoModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPromoSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_lbl_promo_code')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="YANGIYIL2026"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-mono uppercase focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_lbl_promo_discount')}
                </label>
                <input
                  type="number"
                  required
                  value={newPromoDiscount}
                  onChange={(e) => setNewPromoDiscount(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddPromoModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-lg font-semibold active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-lg shadow-xs active:scale-95 transition-all"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. ADD STAFF MODAL */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-sm p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('admin_btn_add_staff')}</h3>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Xodim Ismi</label>
                <input
                  type="text"
                  required
                  placeholder="Sardor Aliyev"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Telefon Raqami</label>
                <input
                  type="text"
                  required
                  placeholder="+998 90 000-00-00"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Xodim Roli</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                >
                  <option value="MANAGER">{t('admin_role_manager')}</option>
                  <option value="COURIER">{t('admin_role_courier')}</option>
                  <option value="SUPER_ADMIN">{t('admin_role_super_admin')}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-lg font-semibold active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-lg shadow-xs active:scale-95 transition-all"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. CANCEL ORDER REASON MODAL */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-sm p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {t('admin_cancel_reason_title')}
                </h3>
                <span className="text-[11px] text-gray-400 font-mono">#{cancelModalOrder.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCancelOrderSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-2">
                {[
                  { id: 'client', label: t('admin_cancel_reason_client') },
                  { id: 'stock', label: t('admin_cancel_reason_out_of_stock') },
                  { id: 'address', label: t('admin_cancel_reason_wrong_address') },
                  { id: 'other', label: t('admin_cancel_reason_other') },
                ].map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      cancelReasonSelected === r.label
                        ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30] font-bold text-gray-950 dark:text-white'
                        : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      checked={cancelReasonSelected === r.label}
                      onChange={() => setCancelReasonSelected(r.label)}
                      className="accent-gray-900 dark:accent-white"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>

              {cancelReasonSelected === t('admin_cancel_reason_other') && (
                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Sababni batafsil yozing..."
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-lg font-semibold active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xs active:scale-95 transition-all"
                >
                  {t('admin_status_cancelled')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. ASSIGN COURIER MODAL */}
      {courierAssignModalOrder && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-sm p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {t('admin_assign_courier')}
                </h3>
                <span className="text-[11px] text-gray-400 font-mono">#{courierAssignModalOrder.id} • {courierAssignModalOrder.user}</span>
              </div>
              <button
                type="button"
                onClick={() => setCourierAssignModalOrder(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignCourierSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                  {t('admin_select_courier')}
                </label>
                {availableCouriers.length > 0 ? (
                  <select
                    required
                    value={selectedCourierName}
                    onChange={(e) => setSelectedCourierName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                  >
                    <option value="">{t('admin_select_courier')}</option>
                    {availableCouriers.map((c) => (
                      <option key={c.id} value={c.name}>
                        🚚 {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
                    Hozirda faol kuryerlar mavjud emas. Sozlamalar &gt; Xodimlar bo'limidan Kuryer roli bilan xodim qo'shing.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCourierAssignModalOrder(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-lg font-semibold active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={availableCouriers.length === 0}
                  className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-lg shadow-xs active:scale-95 transition-all disabled:opacity-50"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. CUSTOM DATE RANGE PICKER MODAL */}
      {showCustomDateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-sm p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {t('admin_custom_date_title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomDateModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAnalyticsPeriod('CUSTOM');
                setShowCustomDateModal(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_custom_date_start')}
                </label>
                <input
                  type="date"
                  required
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  {t('admin_custom_date_end')}
                </label>
                <input
                  type="date"
                  required
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('2026-07-20');
                    setCustomEndDate('2026-08-20');
                  }}
                  className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-400 text-[11px] font-semibold hover:bg-gray-200 dark:hover:bg-[#1F293D]"
                >
                  Oxirgi 30 kun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate('2026-05-20');
                    setCustomEndDate('2026-08-20');
                  }}
                  className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-400 text-[11px] font-semibold hover:bg-gray-200 dark:hover:bg-[#1F293D]"
                >
                  Oxirgi 3 oy
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCustomDateModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 rounded-lg font-semibold active:scale-95"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-lg shadow-xs active:scale-95 transition-all"
                >
                  {t('admin_apply')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. INTERACTIVE ORDER DETAILS MODAL / DRAWER */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-2xl my-6 shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-mono text-gray-950 dark:text-white">
                      {viewingOrder.id}
                    </h3>
                    <span className="text-xs text-gray-400 font-sans">
                      {viewingOrder.date}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Mijoz: <strong className="text-gray-900 dark:text-white">{viewingOrder.user}</strong> ({viewingOrder.phone})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handlePrintReceipt(viewingOrder)}
                  className="px-2.5 py-1.5 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] text-gray-900 dark:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                  title="80mm Chek"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chek</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenTelegram(viewingOrder.phone)}
                  className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 rounded-lg text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                  title="Telegramda ochish"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Telegram</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyOrderInfo(viewingOrder)}
                  className="px-2.5 py-1.5 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] text-gray-900 dark:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                  title="Nusxa olish"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Nusxa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {/* 1. INSTANT 1-CLICK STATUS SWITCHER PILLS (Strictly 4 Statuses) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Buyurtma holatini o'zgartirish:
                </span>
                <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#161F30] rounded-xl">
                  {[
                    { id: 'NEW', label: t('admin_status_new') },
                    { id: 'DELIVERING', label: t('admin_status_delivering') },
                    { id: 'COMPLETED', label: t('admin_status_completed') },
                    { id: 'CANCELLED', label: t('admin_status_cancelled') },
                  ].map((st) => {
                    const isCurrent = viewingOrder.status === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          if (st.id === 'CANCELLED') {
                            setCancelModalOrder(viewingOrder);
                          } else {
                            updateOrderStatusInStore(viewingOrder.id, st.id as any);
                            setViewingOrder({ ...viewingOrder, status: st.id as any, cancelReason: undefined });
                          }
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                          isCurrent
                            ? st.id === 'CANCELLED'
                              ? 'bg-red-600 text-white font-bold shadow-xs'
                              : 'bg-gray-950 dark:bg-white text-white dark:text-gray-950 font-bold shadow-xs'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {viewingOrder.status === 'CANCELLED' && viewingOrder.cancelReason && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 rounded-xl text-red-700 dark:text-red-300">
                  <span className="font-bold">Bekor qilish sababi:</span> {viewingOrder.cancelReason}
                </div>
              )}

              {/* 2. CUSTOMER, DELIVERY & PAYMENT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Customer Card */}
                <div className="p-3.5 bg-gray-50 dark:bg-[#161F30] rounded-xl space-y-2 border border-gray-200/60 dark:border-white/5">
                  <div className="font-bold text-gray-950 dark:text-white flex items-center justify-between">
                    <span>Mijoz & Manzil</span>
                    <span className="text-[11px] font-normal text-gray-400">
                      {viewingOrder.deliveryMethod === 'pickup' ? '🏢 Olib ketish' : '🚚 Kuryer'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-900 dark:text-white font-semibold">{viewingOrder.user}</div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${viewingOrder.phone}`} className="text-gray-600 dark:text-gray-300 hover:underline">
                        {viewingOrder.phone}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(viewingOrder.phone)}
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        title="Nusxalash"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-[11px] pt-1 border-t border-gray-200/50 dark:border-white/5">
                      📍 {viewingOrder.location || 'Do\'kondan olib ketiladi'}
                    </div>
                    {viewingOrder.customerComment && (
                      <div className="text-gray-500 dark:text-gray-400 text-[11px] italic">
                        Izoh: "{viewingOrder.customerComment}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Logistics & Payment Card */}
                <div className="p-3.5 bg-gray-50 dark:bg-[#161F30] rounded-xl space-y-2.5 border border-gray-200/60 dark:border-white/5">
                  <div className="font-bold text-gray-950 dark:text-white flex items-center justify-between">
                    <span>Kuryer & To'lov</span>
                    <span className="text-[11px] font-normal text-gray-400 uppercase font-mono">
                      {viewingOrder.paymentType || 'CASH'}
                    </span>
                  </div>

                  {/* Courier Row */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="min-w-0">
                      <div className="text-[11px] text-gray-400">Biriktirilgan kuryer:</div>
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {viewingOrder.courierName ? `🚚 ${viewingOrder.courierName}` : 'Tayinlanmagan'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCourierAssignModalOrder(viewingOrder);
                        setSelectedCourierName(viewingOrder.courierName || '');
                      }}
                      className="px-2.5 py-1 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95"
                    >
                      {viewingOrder.courierName ? 'O\'zgartirish' : '+ Tayinlash'}
                    </button>
                  </div>

                  {/* Payment Status Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-white/5">
                    <span className="text-gray-500 dark:text-gray-400 text-[11px]">To'lov holati:</span>
                    <select
                      value={viewingOrder.paymentStatus || 'PENDING'}
                      onChange={(e) => {
                        handleUpdatePaymentStatus(viewingOrder.id, e.target.value as any);
                        setViewingOrder({ ...viewingOrder, paymentStatus: e.target.value as any });
                      }}
                      className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-lg px-2 py-0.5 text-xs font-semibold outline-none cursor-pointer"
                    >
                      <option value="PAID">To'langan</option>
                      <option value="PENDING">Kutilmoqda</option>
                      <option value="REFUNDED">Qaytarilgan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. ORDERED PRODUCTS LIST */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Buyurtma qilingan tovarlar ({viewingOrder.items?.length || viewingOrder.itemsCount || 1} ta):
                </span>

                <div className="border border-gray-200/80 dark:border-white/10 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-white/5 bg-gray-50/50 dark:bg-[#161F30]/50">
                  {viewingOrder.items && viewingOrder.items.length > 0 ? (
                    viewingOrder.items.map((it, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={it.image}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200/60 dark:border-white/10"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-950 dark:text-white truncate">{it.name}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {it.quantity} dona x {it.price.toLocaleString()} UZS
                              {it.variant && ` • ${it.variant}`}
                            </div>
                          </div>
                        </div>

                        <div className="font-extrabold text-gray-950 dark:text-white shrink-0">
                          {(it.price * it.quantity).toLocaleString()} UZS
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-400">
                      Tovarlar tafsiloti mavjud emas
                    </div>
                  )}
                </div>
              </div>

              {/* 4. FINANCIAL SUMMARY */}
              <div className="p-3.5 bg-gray-50 dark:bg-[#161F30] rounded-xl space-y-1.5 border border-gray-200/60 dark:border-white/5">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Oraliq summa:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {(viewingOrder.subtotal || viewingOrder.total).toLocaleString()} {t('currency')}
                  </span>
                </div>
                {viewingOrder.discountPrice && viewingOrder.discountPrice > 0 ? (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Chegirma:</span>
                    <span className="font-semibold">-{viewingOrder.discountPrice.toLocaleString()} {t('currency')}</span>
                  </div>
                ) : null}
                {viewingOrder.deliveryPrice && viewingOrder.deliveryPrice > 0 ? (
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Yetkazish xizmati:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      +{viewingOrder.deliveryPrice.toLocaleString()} {t('currency')}
                    </span>
                  </div>
                ) : null}
                <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-sm font-bold text-gray-950 dark:text-white">
                  <span>Jami to'lov:</span>
                  <span className="text-base font-black">
                    {viewingOrder.total.toLocaleString()} {t('currency')}
                  </span>
                </div>
              </div>

              {/* 5. ACTIVITY LOGS */}
              {viewingOrder.activityLogs && viewingOrder.activityLogs.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-white/5">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Harakatlar tarixi:
                  </span>
                  <div className="space-y-1.5">
                    {viewingOrder.activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2 text-xs">
                        <span className="text-gray-400">•</span>
                        <div className="flex-1 text-gray-700 dark:text-gray-300">
                          {log.text}{' '}
                          <span className="text-[10px] text-gray-400">
                            ({new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-end shrink-0 bg-gray-50/40 dark:bg-white/[0.01]">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-950 dark:bg-white text-white dark:text-gray-950 rounded-xl font-bold text-xs active:scale-95 transition-all shadow-xs"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Alert */}
      {reorderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>Buyurtma ma'lumotlari nusxalandi!</span>
        </div>
      )}

      {/* 13. MANUAL ORDER CREATION MODAL */}
      {showManualOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl w-full max-w-2xl my-6 shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-3 bg-gray-50/50 dark:bg-[#161F30]/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center font-bold text-xs shadow-xs">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                    {t('admin_modal_create_order_title')}
                  </h3>
                  <p className="text-[11px] text-gray-400">Telefon yoki do'kondan qabul qilingan buyurtmani kiritish</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManualOrderModal(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#161F30] flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const nameError = (manualCustomerName.length > 0 && manualCustomerName.trim().length < 2)
                ? "Iltimos, ism va familiyani to'liq kiriting (kamida 2 ta harf)"
                : (manualFormSubmitted && manualCustomerName.trim().length === 0)
                ? "Mijoz ismi kiritilishi shart"
                : "";

              const phoneDigits = manualCustomerPhone.replace(/\D/g, '');
              const phoneError = (manualCustomerPhone.length > 0 && (phoneDigits.length !== 12 || !phoneDigits.startsWith('998')))
                ? `Telefon raqami to'liq emas (masalan: +998 (90) 123-45-67)`
                : (manualFormSubmitted && manualCustomerPhone.length === 0)
                ? "Telefon raqami kiritilishi shart"
                : "";

              const addressError = (manualDeliveryMethod === 'courier' && manualAddress.length > 0 && manualAddress.trim().length < 4)
                ? "Yetkazib berish manzilini to'liq kiriting (kamida 4 ta belgi)"
                : (manualDeliveryMethod === 'courier' && manualFormSubmitted && manualAddress.trim().length === 0)
                ? "Yetkazib berish manzili kiritilishi shart"
                : "";

              const itemsError = (manualFormSubmitted && manualItems.length === 0)
                ? "Buyurtmaga kamida 1 ta mahsulot qo'shishingiz shart"
                : "";

              return (
                <form onSubmit={handleManualOrderSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
                  {/* 1. Customer Info */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                      1. Mijoz ma'lumotlari
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                          {t('admin_lbl_client_name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ism Familiya"
                          value={manualCustomerName}
                          onChange={(e) => setManualCustomerName(sanitizePersonName(e.target.value))}
                          className={`w-full bg-gray-50 dark:bg-[#161F30] border ${
                            nameError
                              ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                              : 'border-gray-200 dark:border-white/10 focus:border-gray-900 dark:focus:border-white'
                          } rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none transition-colors`}
                        />
                        {nameError && (
                          <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1 animate-in fade-in-50">
                            <span>⚠</span> {nameError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                          {t('admin_lbl_client_phone')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+998 (90) 123-45-67"
                          value={manualCustomerPhone}
                          onChange={(e) => setManualCustomerPhone(formatUzbekPhone(e.target.value))}
                          className={`w-full bg-gray-50 dark:bg-[#161F30] border ${
                            phoneError
                              ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                              : 'border-gray-200 dark:border-white/10 focus:border-gray-900 dark:focus:border-white'
                          } rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none transition-colors`}
                        />
                        {phoneError && (
                          <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1 animate-in fade-in-50">
                            <span>⚠</span> {phoneError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Delivery Method */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                      2. Yetkazib berish usuli
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setManualDeliveryMethod('courier')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all active:scale-95 ${
                          manualDeliveryMethod === 'courier'
                            ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30] font-bold text-gray-950 dark:text-white shadow-2xs'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50/60'
                        }`}
                      >
                        <Truck className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        <div>
                          <div className="text-xs font-bold">Kuryer orqali</div>
                          <div className="text-[10px] text-gray-400 font-normal">Manzilga yetkazib berish</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setManualDeliveryMethod('pickup')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all active:scale-95 ${
                          manualDeliveryMethod === 'pickup'
                            ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30] font-bold text-gray-950 dark:text-white shadow-2xs'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50/60'
                        }`}
                      >
                        <Store className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold">Olib ketish (PVZ)</div>
                          <div className="text-[10px] text-gray-400 font-normal">Markaziy filialdan</div>
                        </div>
                      </button>
                    </div>

                    {manualDeliveryMethod === 'courier' ? (
                      <div>
                        <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                          {t('admin_lbl_delivery_address')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Yetkazib berish manzili (ko'cha, uy, xonadon)..."
                          value={manualAddress}
                          onChange={(e) => setManualAddress(e.target.value)}
                          className={`w-full bg-gray-50 dark:bg-[#161F30] border ${
                            addressError
                              ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                              : 'border-gray-200 dark:border-white/10 focus:border-gray-900 dark:focus:border-white'
                          } rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none transition-colors`}
                        />
                        {addressError && (
                          <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1 animate-in fade-in-50">
                            <span>⚠</span> {addressError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
                        <MapPin className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>Topshirish manzili: <strong>Markaziy Filial (Do'kondan olib ketish)</strong> • Yetkazish bepul</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Product Picker & Builder */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                        3. Mahsulot tanlash
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Savatda: <strong className="text-gray-900 dark:text-white">{manualItems.length} ta</strong> tovar
                      </span>
                    </div>

                    <div className={`p-3.5 bg-gray-50 dark:bg-[#161F30] border ${
                      itemsError ? 'border-red-500/80 dark:border-red-500/80 ring-1 ring-red-500/50' : 'border-gray-200/80 dark:border-white/10'
                    } rounded-2xl space-y-3 transition-colors`}>
                      {/* If A Product is currently selected for customization */}
                      {manualSelectedProductId ? (
                        (() => {
                          const selectedProd = storeProducts.find((p) => p.id === Number(manualSelectedProductId));
                          if (!selectedProd) return null;
                          const nameStr = typeof selectedProd.name === 'object' ? selectedProd.name[lang] || selectedProd.name.uz : selectedProd.name;
                          const priceNum = Number(selectedProd.base_price) || 100000;
                          const img = selectedProd.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
                          const selectedVariantObj = selectedProd.variants?.find((v) => {
                            const vLabel = [v.size, v.color].filter(Boolean).join(' / ') || 'Standart';
                            return vLabel === manualSelectedVariant || v.size === manualSelectedVariant;
                          }) || selectedProd.variants?.[0];
                          const maxAvailableStock = selectedVariantObj?.stock_count ?? 10;

                          return (
                            <div className="p-3 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-xl space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img src={img} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200/60 dark:border-white/10" />
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs text-gray-950 dark:text-white truncate">{nameStr}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs font-black text-gray-900 dark:text-white">
                                        {priceNum.toLocaleString()} UZS
                                      </span>
                                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                                        maxAvailableStock > 0
                                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                          : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                                      }`}>
                                        {maxAvailableStock > 0 ? `Omborda: ${maxAvailableStock} ta` : 'Qolmagan'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setManualSelectedProductId('');
                                    setManualSelectedVariant('');
                                    setManualItemQuantity(1);
                                  }}
                                  className="px-2 py-1 text-[11px] font-semibold text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                >
                                  ✕ Boshqa tanlash
                                </button>
                              </div>

                              {/* Variants if any */}
                              {selectedProd.variants && selectedProd.variants.length > 0 && (
                                <div className="space-y-1.5 pt-1 border-t border-gray-100 dark:border-white/5">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">O'lcham / Variant:</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {selectedProd.variants.map((v) => {
                                      const vLabel = [v.size, v.color].filter(Boolean).join(' / ') || 'Standart';
                                      const isSelected = manualSelectedVariant === vLabel;
                                      return (
                                        <button
                                          key={v.id}
                                          type="button"
                                          onClick={() => setManualSelectedVariant(vLabel)}
                                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all active:scale-95 flex items-center gap-1 ${
                                            isSelected
                                              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white shadow-2xs'
                                              : 'bg-gray-50 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-400'
                                          }`}
                                        >
                                          <span>{vLabel}</span>
                                          <span className="text-[10px] opacity-60">({v.stock_count ?? 0})</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Quantity Stepper & Add Button */}
                              <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#161F30] p-1 rounded-xl border border-gray-200/60 dark:border-white/10">
                                  <button
                                    type="button"
                                    onClick={() => setManualItemQuantity(Math.max(1, manualItemQuantity - 1))}
                                    className="w-7 h-7 rounded-lg bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-200 flex items-center justify-center font-bold text-xs shadow-2xs active:scale-95 transition-all"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center font-bold text-xs text-gray-950 dark:text-white">
                                    {manualItemQuantity}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={manualItemQuantity >= maxAvailableStock}
                                    onClick={() => setManualItemQuantity(Math.min(maxAvailableStock, manualItemQuantity + 1))}
                                    className="w-7 h-7 rounded-lg bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-200 flex items-center justify-center font-bold text-xs shadow-2xs active:scale-95 transition-all disabled:opacity-30"
                                    title={manualItemQuantity >= maxAvailableStock ? 'Ombordagi qoldiqdan ko\'p qo\'shib bo\'lmaydi' : ''}
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  disabled={maxAvailableStock <= 0}
                                  onClick={handleAddManualItem}
                                  className="px-5 py-2.5 bg-gray-950 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold rounded-xl active:scale-95 transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-40"
                                >
                                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>{maxAvailableStock <= 0 ? 'Qolmagan' : 'Qo\'shish'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        /* Search & Product Selection Grid */
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              placeholder="Mahsulot nomi bo'yicha qidirish..."
                              value={manualProductSearch}
                              onChange={(e) => setManualProductSearch(e.target.value)}
                              className="w-full bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 dark:text-white font-medium focus:outline-none focus:border-gray-900 dark:focus:border-white shadow-2xs"
                            />
                          </div>

                          <div className="max-h-44 overflow-y-auto space-y-1 pr-0.5 no-scrollbar">
                            {storeProducts
                              .filter((p) => {
                                if (!manualProductSearch.trim()) return true;
                                const nameStr = typeof p.name === 'object' ? p.name[lang] || p.name.uz : p.name;
                                return nameStr.toLowerCase().includes(manualProductSearch.toLowerCase());
                              })
                              .map((p) => {
                                const nameStr = typeof p.name === 'object' ? p.name[lang] || p.name.uz : p.name;
                                const price = Number(p.base_price) || 100000;
                                const img = p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200';
                                const firstVariantLabel = p.variants?.[0] ? ([p.variants[0].size, p.variants[0].color].filter(Boolean).join(' / ') || 'Standart') : '';
                                const inCartQty = manualItems.filter((it) => it.id === p.id).reduce((s, it) => s + it.quantity, 0);
                                const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock_count || 0), 0) ?? 10;

                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                      setManualSelectedProductId(String(p.id));
                                      setManualSelectedVariant(firstVariantLabel);
                                      setManualItemQuantity(1);
                                    }}
                                    className="w-full p-2 bg-white dark:bg-[#111827] hover:bg-gray-100/70 dark:hover:bg-white/5 border border-gray-200/60 dark:border-white/5 rounded-xl flex items-center justify-between gap-2 text-left transition-all active:scale-[0.99] group"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <img src={img} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200/40 dark:border-white/10" />
                                      <div className="min-w-0">
                                        <div className="text-xs font-bold text-gray-950 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                          {nameStr}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1.5 mt-0.5">
                                          {inCartQty > 0 ? (
                                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                              Savatda: {inCartQty} ta
                                            </span>
                                          ) : (
                                            <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                                              totalStock > 0 ? 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400' : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                                            }`}>
                                              {totalStock > 0 ? `Omborda: ${totalStock} ta` : 'Qolmagan'}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="text-xs font-extrabold text-gray-950 dark:text-white block">
                                        {price.toLocaleString()} UZS
                                      </span>
                                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">
                                        Tanlash ➔
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Added Items List Table */}
                      {manualItems.length > 0 && (
                        <div className="pt-2 border-t border-gray-200/60 dark:border-white/10 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Buyurtmaga qo'shilganlar:
                            </span>
                            {manualItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setManualItems([])}
                                className="text-[10px] text-red-500 hover:underline font-semibold"
                              >
                                Barchasini tozalash
                              </button>
                            )}
                          </div>
                          <div className="border border-gray-200/80 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#111827] divide-y divide-gray-100 dark:divide-white/5">
                            {manualItems.map((item, idx) => (
                              <div key={idx} className="p-2.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img src={item.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200/40 dark:border-white/10" />
                                  <div className="min-w-0">
                                    <div className="font-bold text-gray-950 dark:text-white truncate text-xs">{item.name}</div>
                                    <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1.5">
                                      {item.variant && (
                                        <span className="px-1.5 py-0.2 rounded bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-[9px]">
                                          {item.variant}
                                        </span>
                                      )}
                                      <span>{item.price.toLocaleString()} UZS</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2.5 shrink-0">
                                  {/* Quantity Stepper */}
                                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#161F30] p-0.5 rounded-lg border border-gray-200/60 dark:border-white/10">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateManualItemQty(idx, -1)}
                                      className="w-5 h-5 rounded bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-200 flex items-center justify-center font-bold text-xs active:scale-95"
                                    >
                                      -
                                    </button>
                                    <span className="w-5 text-center font-bold text-xs text-gray-950 dark:text-white">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateManualItemQty(idx, 1)}
                                      className="w-5 h-5 rounded bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-200 flex items-center justify-center font-bold text-xs active:scale-95"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <span className="font-extrabold text-gray-950 dark:text-white text-xs w-20 text-right">
                                    {(item.price * item.quantity).toLocaleString()} UZS
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveManualItem(idx)}
                                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 transition-colors"
                                    title="O'chirish"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {itemsError && (
                        <p className="text-[11px] text-red-500 font-bold mt-2 flex items-center gap-1 animate-in fade-in-50">
                          <span>⚠</span> {itemsError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 4. Payment Method Selection (Clean Branded Cards - No duplicate icons) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                      4. To'lov usuli
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setManualPaymentType('CASH')}
                        className={`p-3 rounded-xl border text-left transition-all active:scale-95 ${
                          manualPaymentType === 'CASH'
                            ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30] font-bold text-gray-950 dark:text-white shadow-2xs'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50/60'
                        }`}
                      >
                        <div className="text-xs font-bold text-gray-950 dark:text-white">Naqd pul</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Yetkazilganda to'lash</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setManualPaymentType('PAYME')}
                        className={`p-3 rounded-xl border text-left transition-all active:scale-95 ${
                          manualPaymentType === 'PAYME'
                            ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30] font-bold text-gray-950 dark:text-white shadow-2xs'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50/60'
                        }`}
                      >
                        <div className="text-xs font-black text-[#00CCCC]">PAYME</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Oldindan to'langan</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setManualPaymentType('CLICK')}
                        className={`p-3 rounded-xl border text-left transition-all active:scale-95 ${
                          manualPaymentType === 'CLICK'
                            ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30] font-bold text-gray-950 dark:text-white shadow-2xs'
                            : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50/60'
                        }`}
                      >
                        <div className="text-xs font-black text-[#0073FF]">CLICK</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Oldindan to'langan</div>
                      </button>
                    </div>
                  </div>

                  {/* 5. Customer Note / Comments */}
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      {t('admin_lbl_customer_note')}
                    </label>
                    <input
                      type="text"
                      placeholder="Mijoz izohi yoki alohida talablar..."
                      value={manualCustomerComment}
                      onChange={(e) => setManualCustomerComment(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                    />
                  </div>

                  {/* 6. Financial Calculation & Summary Bar */}
                  {(() => {
                    const itemsSubtotal = manualItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
                    const delFee = manualDeliveryMethod === 'courier' ? (itemsSubtotal > 300000 ? 0 : 25000) : 0;
                    const total = itemsSubtotal + delFee;

                    return (
                      <div className="p-3.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                          <span>Mahsulotlar summasi ({manualItems.reduce((s, it) => s + it.quantity, 0)} dona):</span>
                          <span className="font-bold text-gray-900 dark:text-white">{itemsSubtotal.toLocaleString()} UZS</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                          <span>Yetkazib berish:</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {delFee === 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400">Bepul</span>
                            ) : (
                              `+${delFee.toLocaleString()} UZS`
                            )}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200/80 dark:border-white/10 flex items-center justify-between">
                          <span className="font-bold text-gray-950 dark:text-white text-xs">JAMI TO'LOV:</span>
                          <span className="text-base font-black text-gray-950 dark:text-white">
                            {total.toLocaleString()} {t('currency')}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setShowManualOrderModal(false)}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] text-gray-700 dark:text-gray-300 rounded-xl font-semibold active:scale-95 transition-all"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gray-950 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold rounded-xl shadow-xs active:scale-95 transition-all"
                    >
                      Buyurtmani Saqlash
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* MANUAL ORDER CREATED ALERT TOAST */}
      {manualOrderSuccessAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5" />
          <span>{t('admin_order_created_success')}</span>
        </div>
      )}

      {/* CATALOG QUICK STOCK TOAST */}
      {quickStockToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-950 dark:bg-white text-white dark:text-gray-950 border border-gray-800 dark:border-gray-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-5">
          <Boxes className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span>{quickStockToast}</span>
        </div>
      )}

      {/* CATALOG REVIEW ACTION TOAST */}
      {reviewActionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-950 dark:bg-white text-white dark:text-gray-950 border border-gray-800 dark:border-gray-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-5">
          <CheckCheck className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span>{reviewActionToast}</span>
        </div>
      )}

      {/* PRODUCT SAVED TOAST */}
      {productSavedAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5" />
          <span>{t('admin_toast_product_saved')}</span>
        </div>
      )}

      {/* CATEGORY SAVED TOAST */}
      {categorySavedAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5" />
          <span>{t('admin_toast_category_saved')}</span>
        </div>
      )}

      {/* CSV EXPORT SUCCESS TOAST */}
      {csvExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-950 dark:bg-white text-white dark:text-gray-950 border border-gray-800 dark:border-gray-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-5">
          <Download className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span>{csvExportToast}</span>
        </div>
      )}

      {/* CSV IMPORT SUCCESS TOAST */}
      {csvImportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-5">
          <CheckCheck className="w-5 h-5" />
          <span>{csvImportToast}</span>
        </div>
      )}

      {/* PRODUCT CLONED TOAST */}
      {productClonedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-5">
          <Copy className="w-5 h-5" />
          <span>{productClonedToast}</span>
        </div>
      )}

      {/* 🛡️ UNIVERSAL CUSTOM CONFIRMATION MODAL (Farfetch / Apple Minimalist Standard) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-sm rounded-2xl p-5 sm:p-6 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl text-center">
            {/* Modal Icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
                confirmDialog.variant === 'danger'
                  ? 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400'
                  : 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400'
              }`}
            >
              {confirmDialog.variant === 'danger' ? (
                <Trash2 className="w-6 h-6 stroke-[2]" />
              ) : (
                <AlertCircle className="w-6 h-6 stroke-[2]" />
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-950 dark:text-white">
                {confirmDialog.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
                {confirmDialog.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                }}
                className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all ${
                  confirmDialog.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {confirmDialog.confirmText || "O'chirish"}
              </button>

              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="w-full py-2 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-xl active:scale-95 transition-all"
              >
                {confirmDialog.cancelText || "Bekor qilish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

