'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTelegram } from '@/components/telegram/TelegramProvider';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useOrderStore } from '@/store/useOrderStore';
import {
  Globe,
  ShieldCheck,
  Moon,
  Sun,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  Wallet,
  Tag,
  MapPin,
  HelpCircle,
  ChevronRight,
  Phone,
  MessageCircle,
  Copy,
  Check,
  X,
  Plus,
  Bell,
  BellOff,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  LogIn,
  PackageSearch,
} from 'lucide-react';
import { TelegramLoginModal } from '@/components/auth/TelegramLoginModal';

interface OrderItem {
  id: string;
  date: string;
  total: number;
  status: 'DELIVERING' | 'COMPLETED';
  statusText: string;
  deliveryType: string;
  address: string;
  paymentMethod: string;
  products: {
    name: string;
    image: string;
    qty: number;
    price: number;
  }[];
}

export default function ProfilePage() {
  const { user: tgUser } = useTelegram();
  const { productIds } = useWishlistStore();
  const { lang, setLang, t } = useLanguageStore();
  const { theme: themeMode, setTheme: setThemeMode } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotifConfirmModal, setShowNotifConfirmModal] = useState(false);

  // Active Modals State ('orders' | 'wallet' | 'addresses' | 'language' | 'theme' | 'faq' | null)
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Order Details Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderItem | null>(null);
  const [activeOrderTab, setActiveOrderTab] = useState<'all' | 'delivering' | 'completed'>('all');

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Addresses State (Starts Empty 0)
  const [addresses, setAddresses] = useState<string[]>([]);
  const [showAddAddressInput, setShowAddAddressInput] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState('');

  // Promo Copied State
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showWebAuthModal, setShowWebAuthModal] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('app_lang') as 'uz' | 'ru' | 'en';
      if (savedLang) {
        useLanguageStore.getState().setLang(savedLang);
      }

      const savedNotif = localStorage.getItem('telegram_notifications');
      if (savedNotif !== null) {
        setNotificationsEnabled(savedNotif === 'true');
      } else {
        setNotificationsEnabled(true);
        localStorage.setItem('telegram_notifications', 'true');
      }
    } catch (e) {}
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  const changeLang = (newLang: 'uz' | 'ru' | 'en') => {
    triggerHaptic('light');
    setLang(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('app_lang', newLang);
        window.dispatchEvent(new Event('languageChange'));
      } catch (e) {}
    }
  };

  const handleCopyPromo = (code: string) => {
    triggerHaptic('medium');
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return;
    triggerHaptic('medium');
    setAddresses([...addresses, newAddressInput.trim()]);
    setNewAddressInput('');
    setShowAddAddressInput(false);
  };

  const displayName = tgUser
    ? `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim() || 'Foydalanuvchi'
    : 'Foydalanuvchi';

  const username = tgUser?.username
    ? `@${tgUser.username}`
    : tgUser?.phone || 'Mijoz';

  const storeOrders = useOrderStore((state) => state.orders);

  // Dynamic Orders Data mapped from useOrderStore
  const orders: OrderItem[] = storeOrders.map((o) => {
    let statusText = 'Yetkazilmoqda';
    if (o.status === 'COMPLETED') statusText = 'Yetkazib berildi';
    else if (o.status === 'CANCELLED') statusText = 'Bekor qilindi';
    else if (o.status === 'NEW') statusText = 'Yangi buyurtma';

    return {
      id: o.id,
      date: o.date,
      total: o.total,
      status: (o.status === 'DELIVERING' || o.status === 'NEW') ? 'DELIVERING' : 'COMPLETED',
      statusText,
      deliveryType: o.deliveryMethod === 'courier' ? 'Kuryer orqali' : 'Topshirish punkti (PVZ)',
      address: o.location || 'Yetkazib berish manzili',
      paymentMethod: o.paymentType || 'Payme / Click',
      products: o.items && o.items.length > 0 ? o.items.map((i) => ({
        name: i.name,
        image: i.image,
        qty: i.quantity,
        price: i.price,
      })) : [
        {
          name: 'Buyurtma tovarlari',
          image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300',
          qty: o.itemsCount || 1,
          price: o.total,
        },
      ],
    };
  });

  const filteredOrders = orders.filter((order) => {
    if (activeOrderTab === 'delivering') return order.status === 'DELIVERING';
    if (activeOrderTab === 'completed') return order.status === 'COMPLETED';
    return true;
  });

  const deliveringOrdersCount = orders.filter((o) => o.status === 'DELIVERING').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'COMPLETED').length;

  const faqs = [
    {
      q: {
        uz: "Yetkazib berish qancha vaqt oladi va narxi qancha?",
        ru: "Сколько времени занимает доставка и сколько она стоит?",
        en: "How long does delivery take and how much does it cost?",
      },
      a: {
        uz: "Toshkent shahri bo'ylab buyurtmalar 2-3 soat ichida yetkaziladi. 300,000 UZS dan ortiq buyurtmalar uchun yetkazib berish bepul! Viloyatlarga esa 1-2 ish kunida yetkaziladi.",
        ru: "По Ташкенту заказы доставляются за 2-3 часа. Для заказов от 300 000 UZS доставка бесплатная! По областям — 1-2 рабочих дня.",
        en: "Orders within Tashkent are delivered in 2-3 hours. Delivery is free for orders over 300,000 UZS! Regions take 1-2 business days.",
      },
    },
    {
      q: {
        uz: "To'lovni qanday amalga oshirsam bo'ladi?",
        ru: "Как я могу оплатить заказ?",
        en: "How can I pay for my order?",
      },
      a: {
        uz: "To'lovni mahsulotni qabul qilib olgach naqd pulda, yoki buyurtma berish jarayonida Payme, Click va Uzum Bank orqali to'lashingiz mumkin.",
        ru: "Вы можете оплатить наличными при получении товара или онлайн через Payme, Click и Uzum Bank.",
        en: "You can pay with cash upon delivery, or online via Payme, Click and Uzum Bank.",
      },
    },
    {
      q: {
        uz: "Mahsulot to'g'ri kelmasa qaytarish mumkinmi?",
        ru: "Можно ли вернуть товар, если он не подошел?",
        en: "Can I return the item if it does not fit?",
      },
      a: {
        uz: "Albatta! Mahsulot o'rami va tovar ko'rinishi saqlangan holda 10 kun ichida bepul qaytarish yoki o'lchamini almashtirish imkoniyati mavjud.",
        ru: "Конечно! Вы можете бесплатно вернуть или обменять товар в течение 10 дней при сохранении товарного вида и упаковки.",
        en: "Of course! You can return or exchange the product within 10 days for free, keeping the original packaging.",
      },
    },
    {
      q: {
        uz: "Keshbek va promokodlarni qanday ishlataman?",
        ru: "Как использовать кэшбэк и промокоды?",
        en: "How do I use cashback and promo codes?",
      },
      a: {
        uz: "Har bir xaridingizdan keshbek to'planadi. Savat bo'limida navbatdagi xaridlaringiz uchun to'liq chegirma sifatida qo'llashingiz mumkin.",
        ru: "С каждой покупки начисляется кэшбэк. Вы можете применить его как скидку в корзине при следующих покупках.",
        en: "You earn cashback on purchases. You can apply it as a full discount in your cart on future orders.",
      },
    },
  ];

  return (
    <div className="space-y-3.5 pb-16 animate-in fade-in max-w-lg mx-auto">
      {/* 1. COMPACT USER PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-4.5 border border-gray-200/80 dark:border-white/10 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-3.5">
          {/* Circular Clean Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white text-xl font-bold flex items-center justify-center shadow-xs border-2 border-white dark:border-[#111827] ring-2 ring-gray-100 dark:ring-white/10 select-none">
              {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            {/* Verified Small Corner Badge */}
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-[#111827] shadow-2xs">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-950 dark:text-white truncate leading-tight">
              {displayName}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-400 font-normal mt-0.5">{username}</p>
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200/80 dark:border-emerald-800/40">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{t('profile_verified_buyer')}</span>
            </div>
          </div>
        </div>

        {/* 3 Quick Indicator Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-white/10 text-center">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveModal('orders');
            }}
            className="p-2 rounded-xl bg-gray-50/90 dark:bg-[#161F30] hover:bg-gray-100/90 dark:hover:bg-[#1F293D] active:scale-95 transition-all"
          >
            <span className="text-[10px] text-gray-400 dark:text-gray-400 font-medium block">{t('profile_orders')}</span>
            <span className="text-xs font-bold text-gray-950 dark:text-white">{orders.length} {t('pcs')}</span>
          </button>

          <Link
            href="/wishlist"
            onClick={() => triggerHaptic('light')}
            className="p-2 rounded-xl bg-gray-50/90 dark:bg-[#161F30] hover:bg-gray-100/90 dark:hover:bg-[#1F293D] active:scale-95 transition-all"
          >
            <span className="text-[10px] text-gray-400 dark:text-gray-400 font-medium block">{t('profile_wishlist')}</span>
            <span className="text-xs font-bold text-gray-950 dark:text-white">{productIds.length} {t('pcs')}</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveModal('wallet');
            }}
            className="p-2 rounded-xl bg-gray-50/90 dark:bg-[#161F30] hover:bg-gray-100/90 dark:hover:bg-[#1F293D] active:scale-95 transition-all"
          >
            <span className="text-[10px] text-gray-400 dark:text-gray-400 font-medium block">{t('profile_cashback')}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">0 {t('currency')}</span>
          </button>
        </div>
      </div>

      {/* 2. MENU GROUP 1: PURCHASES & WALLET */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-2xs divide-y divide-gray-100 dark:divide-white/10 overflow-hidden">
        {/* Orders Row */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('orders');
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161F30] active:bg-gray-100 dark:active:bg-[#1F293D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-900 dark:text-white">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{t('profile_my_orders')}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400">{t('profile_orders_desc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#161F30] px-2 py-0.5 rounded-md">
              {orders.length} {t('pcs')}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Wallet & Promocodes Row */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('wallet');
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161F30] active:bg-gray-100 dark:active:bg-[#1F293D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{t('profile_wallet')}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400">{t('profile_wallet_desc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
              0 {t('currency')}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Saved Addresses Row */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('addresses');
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161F30] active:bg-gray-100 dark:active:bg-[#1F293D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{t('profile_addresses')}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400">{t('profile_addresses_desc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {addresses.length} {t('pcs')}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* 3. MENU GROUP 2: SETTINGS & PREFERENCES */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-2xs divide-y divide-gray-100 dark:divide-white/10 overflow-hidden">
        {/* Language Row */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('language');
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161F30] active:bg-gray-100 dark:active:bg-[#1F293D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1F293D] text-gray-900 dark:text-white flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{t('profile_language')}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400">{t('profile_language_desc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-xs font-bold uppercase text-gray-900 dark:text-white bg-gray-100 dark:bg-[#161F30] px-2 py-0.5 rounded-md">
              {lang}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Theme Mode Row */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('theme');
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161F30] active:bg-gray-100 dark:active:bg-[#1F293D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              {themeMode === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{t('profile_theme')}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400">{t('profile_theme_desc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {themeMode === 'light' ? t('profile_modal_theme_light') : t('profile_modal_theme_dark')}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Notifications Direct Switch Row */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{t('profile_notifications')}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400">{t('profile_notifications_desc')}</div>
            </div>
          </div>

          <button
            type="button"
            role="checkbox"
            aria-checked={notificationsEnabled}
            onClick={() => {
              if (notificationsEnabled) {
                triggerHaptic('medium');
                setShowNotifConfirmModal(true);
              } else {
                triggerHaptic('light');
                setNotificationsEnabled(true);
                try {
                  localStorage.setItem('telegram_notifications', 'true');
                } catch (e) {}
              }
            }}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 active:scale-90 border ${
              notificationsEnabled
                ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] border-gray-300 dark:border-white/20 text-transparent'
            }`}
          >
            {notificationsEnabled && <Check className="w-3.5 h-3.5 stroke-[3] text-white dark:text-gray-950" />}
          </button>
        </div>
      </div>

      {/* 4. MENU GROUP 3: SUPPORT & LEGAL */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-2xs divide-y divide-gray-100 dark:divide-white/10 overflow-hidden">
        {/* FAQ Row */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveModal('faq');
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161F30] active:bg-gray-100 dark:active:bg-[#1F293D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1F293D] text-gray-900 dark:text-white flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{t('profile_faq')}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400">{t('profile_faq_desc')}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* 24/7 Operator Chat Link */}
        <a
          href="https://t.me/menejer_aloqa"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerHaptic('medium')}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161F30] active:bg-gray-100 dark:active:bg-[#1F293D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white dark:text-gray-950" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{t('profile_support')}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t('profile_support_badge')}</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>

        {/* Telegram Web Login Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            setShowWebAuthModal(true);
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#161F30] active:bg-gray-100 dark:active:bg-[#1F293D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-950 dark:text-white">
                {lang === 'uz' ? 'Telegram orqali qayta kirish' : lang === 'ru' ? 'Войти через Telegram' : 'Sign in with Telegram'}
              </div>
              <div className="text-[10px] text-gray-400">
                {lang === 'uz' ? 'Akkauntni almashtirish yoki ulash' : lang === 'ru' ? 'Сменить аккаунт или подключить' : 'Switch or link account'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <TelegramLoginModal
        isOpen={showWebAuthModal}
        onClose={() => setShowWebAuthModal(false)}
        onSuccess={() => setShowWebAuthModal(false)}
      />

      {/* ========================================================= */}
      {/* SEPARATE STANDALONE MODAL WINDOWS (ALOHIDA OYNALAR) */}
      {/* ========================================================= */}

      {/* MODAL 1: ORDERS HISTORY & STATUS */}
      {activeModal === 'orders' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-900 dark:text-white" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('profile_modal_orders_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none pb-1">
              {[
                { id: 'all', label: `${t('profile_modal_orders_all')} (${orders.length})` },
                { id: 'delivering', label: `${t('profile_modal_orders_delivering')} (${deliveringOrdersCount})` },
                { id: 'completed', label: `${t('profile_modal_orders_completed')} (${completedOrdersCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveOrderTab(tab.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap active:scale-95 transition-transform ${
                    activeOrderTab === tab.id
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-2xs font-bold'
                      : 'bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1F293D]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders list */}
            <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-0.5">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => {
                      triggerHaptic('medium');
                      setSelectedOrderDetails(order);
                    }}
                    className="p-3 rounded-xl border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-[#161F30] hover:bg-gray-100/70 dark:hover:bg-[#1F293D] active:scale-[0.99] transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-950 dark:text-white">{order.id}</span>
                        <span className="text-[10px] text-gray-400">{order.date}</span>
                      </div>

                      {order.status === 'DELIVERING' ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 text-[10px] font-semibold flex items-center gap-1">
                          <Truck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>{order.statusText}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40 text-[10px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{order.statusText}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <img src={order.products[0].image} alt="" className="w-8 h-8 rounded-md object-cover bg-white dark:bg-gray-800" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate max-w-[140px]">
                          {order.products[0].name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-950 dark:text-white">{order.total.toLocaleString()} {t('currency')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-2">
                  <PackageSearch className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                  <div className="text-xs font-semibold text-gray-400">
                    {lang === 'uz' ? 'Hozircha buyurtmalar mavjud emas' : 'Заказов пока нет'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CASHBACK & PROMOCODES */}
      {activeModal === 'wallet' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-4 h-4" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('profile_modal_wallet_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Balance Card */}
            <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/50 space-y-1">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{t('profile_modal_wallet_balance')}</span>
              <div className="text-2xl font-black text-gray-950 dark:text-white">
                0 <span className="text-sm font-normal text-gray-600 dark:text-gray-400">{t('currency')}</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-normal leading-relaxed pt-1">
                {t('profile_modal_wallet_info')}
              </p>
            </div>

            {/* Promo Codes */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-gray-950 dark:text-white block">{t('profile_modal_wallet_coupons')}</label>
              <div className="p-3 text-center rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 text-xs text-gray-400">
                {lang === 'uz' ? 'Hozircha faol promokodlar mavjud emas' : 'Активных промокодов пока нет'}
              </div>
            </div>

            <Link
              href="/catalog"
              onClick={() => {
                triggerHaptic('light');
                setActiveModal(null);
              }}
              className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform duration-100"
            >
              <span>{t('go_to_catalog')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* MODAL 3: SAVED ADDRESSES */}
      {activeModal === 'addresses' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <MapPin className="w-4 h-4" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('profile_modal_address_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setShowAddAddressInput(false);
                }}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {addresses.length > 0 ? (
                addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 text-xs"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{addr}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-md shrink-0">
                      {t('profile_address_main')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 text-xs text-gray-400">
                  {lang === 'uz' ? 'Saqlangan manzillar mavjud emas' : 'Нет сохраненных адресов'}
                </div>
              )}
            </div>

            {showAddAddressInput ? (
              <form onSubmit={handleAddAddress} className="space-y-2 pt-1">
                <input
                  type="text"
                  autoFocus
                  required
                  value={newAddressInput}
                  onChange={(e) => setNewAddressInput(e.target.value)}
                  placeholder={t('profile_address_placeholder')}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddressInput(false)}
                    className="flex-1 py-2 bg-gray-100 dark:bg-[#1F293D] text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-xs active:scale-95"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg font-semibold text-xs shadow-xs active:scale-95"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddAddressInput(true)}
                className="w-full py-2.5 bg-gray-100 dark:bg-[#1F293D] hover:bg-gray-200 dark:hover:bg-[#27354E] text-gray-900 dark:text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('profile_address_add_btn')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: LANGUAGE SELECTION */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-900 dark:text-white" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('profile_modal_lang_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'uz', label: "O'zbek tili", flag: '🇺🇿' },
                { id: 'ru', label: 'Русский язык', flag: '🇷🇺' },
                { id: 'en', label: 'English', flag: '🇬🇧' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    changeLang(item.id as any);
                    setActiveModal(null);
                  }}
                  className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all active:scale-95 ${
                    lang === item.id
                      ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 shadow-xs font-bold'
                      : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1F293D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <span>{item.label}</span>
                  </div>
                  {lang === item.id && <Check className="w-4 h-4 stroke-[2.5]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: THEME SELECTION */}
      {activeModal === 'theme' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('profile_modal_theme_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setThemeMode('light');
                  setActiveModal(null);
                }}
                className={`p-4 rounded-xl border text-center space-y-2 transition-all active:scale-95 ${
                  themeMode === 'light'
                    ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 shadow-xs font-bold'
                    : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1F293D]'
                }`}
              >
                <Sun className="w-6 h-6 mx-auto text-amber-500" />
                <div className="text-xs font-bold">{t('profile_modal_theme_light')}</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setThemeMode('dark');
                  setActiveModal(null);
                }}
                className={`p-4 rounded-xl border text-center space-y-2 transition-all active:scale-95 ${
                  themeMode === 'dark'
                    ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 shadow-xs font-bold'
                    : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1F293D]'
                }`}
              >
                <Moon className="w-6 h-6 mx-auto text-purple-400" />
                <div className="text-xs font-bold">{t('profile_modal_theme_dark')}</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: FAQ MODAL */}
      {activeModal === 'faq' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-900 dark:text-white" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('profile_modal_faq_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/10 overflow-y-auto no-scrollbar flex-1 pr-0.5">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="py-3">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setOpenFaqIndex(isOpen ? null : index);
                      }}
                      className="w-full flex items-center justify-between gap-3 text-left font-semibold text-xs text-gray-900 dark:text-white hover:text-black dark:hover:text-gray-200 active:scale-[0.99]"
                    >
                      <span>{faq.q[lang] || faq.q.uz}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-gray-950 dark:text-white' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-normal leading-relaxed animate-in fade-in duration-200">
                        {faq.a[lang] || faq.a.uz}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <a
              href="https://t.me/menejer_aloqa"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('medium')}
              className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('profile_modal_faq_ask_btn')}</span>
            </a>
          </div>
        </div>
      )}

      {/* MODAL 7: ORDER DETAILS CHEQUE MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('profile_order_details_title')} {selectedOrderDetails.id}</h3>
                <span className="text-[11px] text-gray-400">{selectedOrderDetails.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Info */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('profile_order_status_label')}</span>
              <span className="text-xs font-bold text-gray-950 dark:text-white">{selectedOrderDetails.statusText}</span>
            </div>

            {/* Products List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-950 dark:text-white block">Buyurtma tarkibi:</label>
              {selectedOrderDetails.products.map((prod, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/60 dark:border-white/10">
                  <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-white dark:bg-gray-800" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">{prod.name}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">{prod.qty} {t('pcs')} × {prod.price.toLocaleString()} {t('currency')}</div>
                  </div>
                  <div className="text-xs font-bold text-gray-950 dark:text-white">{(prod.qty * prod.price).toLocaleString()} {t('currency')}</div>
                </div>
              ))}
            </div>

            {/* Delivery & Payment details */}
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-white/10 pt-3">
              <div className="flex justify-between">
                <span>{t('profile_order_method_label')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedOrderDetails.deliveryType}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('profile_order_address_label')}</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[200px]">{selectedOrderDetails.address}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('profile_order_payment_label')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedOrderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-white/10 text-sm font-bold text-gray-950 dark:text-white">
                <span>{t('cart_total')}</span>
                <span>{selectedOrderDetails.total.toLocaleString()} {t('currency')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg font-semibold text-xs active:scale-95"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 8: NOTIFICATION TURN-OFF CONFIRMATION MODAL */}
      {showNotifConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <BellOff className="w-4 h-4" />
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">{t('profile_notif_modal_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifConfirmModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
              {t('profile_notif_modal_desc')}
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setShowNotifConfirmModal(false);
                }}
                className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg font-semibold text-xs active:scale-95 transition-transform duration-100"
              >
                {t('profile_notif_modal_keep')}
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  setNotificationsEnabled(false);
                  try {
                    localStorage.setItem('telegram_notifications', 'false');
                  } catch (e) {}
                  setShowNotifConfirmModal(false);
                }}
                className="w-full py-2.5 bg-gray-100 dark:bg-[#1F293D] hover:bg-gray-200 dark:hover:bg-[#27354E] text-red-600 dark:text-red-400 rounded-lg font-semibold text-xs active:scale-95 transition-transform duration-100"
              >
                {t('profile_notif_modal_turn_off')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
