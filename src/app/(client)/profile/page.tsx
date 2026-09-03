'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTelegram } from '@/components/telegram/TelegramProvider';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useOrderStore } from '@/store/useOrderStore';
import {
  Package,
  Wallet,
  MapPin,
  Globe,
  Sun,
  Moon,
  HelpCircle,
  Bell,
  HeadphonesIcon,
  ChevronRight,
  Check,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';
import { TelegramLoginModal } from '@/components/auth/TelegramLoginModal';

export default function ProfilePage() {
  const { user, isTelegramWebApp } = useTelegram();
  const { lang, setLanguage } = useLanguageStore();
  const { theme, setTheme, isDark } = useThemeStore();
  const { orders } = useOrderStore();

  const [activeModal, setActiveModal] = useState<
    'orders' | 'cashback' | 'address' | 'language' | 'theme' | 'faq' | 'support' | null
  >(null);

  // Notifications State
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showNotifDialog, setShowNotifDialog] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState([
    { id: '1', title: 'Uy', address: 'Toshkent sh., Yunusobod, 4-daha, 12-uy' },
  ]);
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNotif = localStorage.getItem('notifications_enabled');
      if (savedNotif !== null) setNotifEnabled(savedNotif === 'true');
    }
  }, []);

  const handleNotifToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (notifEnabled) {
      setShowNotifDialog(true);
    } else {
      setNotifEnabled(true);
      if (typeof window !== 'undefined') localStorage.setItem('notifications_enabled', 'true');
    }
  };

  const confirmDisableNotif = () => {
    setNotifEnabled(false);
    if (typeof window !== 'undefined') localStorage.setItem('notifications_enabled', 'false');
    setShowNotifDialog(false);
  };

  const menuGroups = [
    {
      group: 'main',
      items: [
        { id: 'orders', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', label: { uz: 'Mening buyurtmalarim', ru: 'Мои заказы', en: 'My Orders' } },
        { id: 'cashback', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: { uz: 'Keshbek va Promokodlar', ru: 'Кэшбэк и Промокоды', en: 'Cashback & Promo Codes' } },
        { id: 'address', icon: MapPin, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', label: { uz: 'Saqlangan manzillar', ru: 'Сохраненные адреса', en: 'Saved Addresses' } },
      ]
    },
    {
      group: 'settings',
      items: [
        { id: 'language', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', label: { uz: 'Tilni o\'zgartirish', ru: 'Изменить язык', en: 'Change Language' } },
        { id: 'theme', icon: isDark ? Moon : Sun, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', label: { uz: 'Mavzu rejimi', ru: 'Тема', en: 'Theme Mode' } },
      ]
    },
    {
      group: 'support',
      items: [
        { id: 'faq', icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', label: { uz: 'Ko\'p So\'raladigan Savollar', ru: 'Часто задаваемые вопросы', en: 'FAQ' } },
        { id: 'support', icon: HeadphonesIcon, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10', label: { uz: '24/7 Yordam (Operator)', ru: '24/7 Поддержка (Оператор)', en: '24/7 Support (Operator)' } },
      ]
    }
  ];

  if (!user && !isTelegramWebApp) {
    return (
      <div className="py-24">
        <TelegramLoginModal isOpen={true} onClose={() => {}} />
      </div>
    );
  }

  const renderDrawer = () => {
    if (!activeModal) return null;

    return (
      <div className="fixed inset-0 z-[100] flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
        <div className="relative w-full h-[85vh] bg-white dark:bg-[#111827] rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-200">
          
          {/* Handle */}
          <div className="w-full flex justify-center pt-3 pb-2 shrink-0" onClick={() => setActiveModal(null)}>
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100 dark:border-white/5 shrink-0">
            <h3 className="text-lg font-black text-gray-950 dark:text-white capitalize">
              {activeModal === 'orders' ? (lang === 'uz' ? 'Buyurtmalarim' : 'Мои заказы') :
               activeModal === 'cashback' ? (lang === 'uz' ? 'Keshbek' : 'Кэшбэк') :
               activeModal === 'address' ? (lang === 'uz' ? 'Manzillar' : 'Адреса') :
               activeModal === 'language' ? (lang === 'uz' ? 'Til tanlash' : 'Выбор языка') :
               activeModal === 'theme' ? (lang === 'uz' ? 'Mavzu' : 'Тема') :
               activeModal === 'faq' ? 'FAQ' :
               activeModal === 'support' ? (lang === 'uz' ? 'Yordam' : 'Поддержка') : ''}
            </h3>
            <button onClick={() => setActiveModal(null)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#161F30] text-gray-950 dark:text-white rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            
            {/* ORDERS */}
            {activeModal === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-bold">{lang === 'uz' ? 'Sizda buyurtmalar yo\'q' : 'У вас нет заказов'}</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-black text-gray-900 dark:text-white">{order.id}</div>
                        <div className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                          order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        <div>{order.date}</div>
                        <div>{order.itemsCount} tovar - {order.total.toLocaleString()} UZS</div>
                      </div>
                      <div className="pt-2 border-t border-gray-200 dark:border-white/10">
                        <button className="w-full h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold text-xs rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-all">
                          {lang === 'uz' ? 'Elektron chekni ko\'rish' : 'Электронный чек'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CASHBACK */}
            {activeModal === 'cashback' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-900/50 dark:to-teal-900/50 dark:border dark:border-emerald-800/50 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                  <div className="relative z-10 space-y-1">
                    <div className="text-xs font-bold text-emerald-100">{lang === 'uz' ? 'Joriy balans' : 'Текущий баланс'}</div>
                    <div className="text-3xl font-black tracking-tight">45,000 UZS</div>
                  </div>
                  <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                </div>
                <div className="bg-gray-50 dark:bg-[#161F30] p-4 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{lang === 'uz' ? 'Promokod kiritish' : 'Ввести промокод'}</h4>
                  <div className="flex gap-2">
                    <input type="text" placeholder="PROMO2026" className="flex-1 h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] outline-none font-bold uppercase text-gray-900 dark:text-white" />
                    <button className="h-12 px-5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl font-bold text-xs">
                      {lang === 'uz' ? 'Qo\'llash' : 'Применить'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESS */}
            {activeModal === 'address' && (
              <div className="space-y-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#161F30] rounded-2xl border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{addr.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{addr.address}</div>
                      </div>
                    </div>
                    <button className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {!showAddAddress ? (
                  <button onClick={() => setShowAddAddress(true)} className="w-full h-12 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    <Plus className="w-4 h-4" />
                    {lang === 'uz' ? 'Yangi manzil qo\'shish' : 'Добавить новый адрес'}
                  </button>
                ) : (
                  <div className="bg-gray-50 dark:bg-[#161F30] p-4 rounded-2xl space-y-3">
                    <input autoFocus value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder={lang === 'uz' ? 'Manzilni kiriting...' : 'Введите адрес...'} className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] outline-none text-sm font-medium" />
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddAddress(false)} className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-xs font-bold">{lang === 'uz' ? 'Bekor qilish' : 'Отмена'}</button>
                      <button onClick={() => { setAddresses([...addresses, { id: Date.now().toString(), title: 'Yangi manzil', address: newAddress }]); setShowAddAddress(false); setNewAddress(''); }} className="flex-1 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl text-xs font-bold">{lang === 'uz' ? 'Saqlash' : 'Сохранить'}</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LANGUAGE */}
            {activeModal === 'language' && (
              <div className="space-y-2">
                {[
                  { code: 'uz', name: 'O\'zbekcha' },
                  { code: 'ru', name: 'Русский' },
                  { code: 'en', name: 'English' }
                ].map(l => (
                  <button key={l.code} onClick={() => { setLanguage(l.code as any); setActiveModal(null); }} className={`w-full h-14 px-4 flex items-center justify-between rounded-2xl border-2 transition-all ${lang === l.code ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30]' : 'border-transparent bg-gray-50 dark:bg-[#161F30] hover:border-gray-200 dark:hover:border-white/10'}`}>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{l.name}</span>
                    {lang === l.code && <div className="w-5 h-5 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white dark:text-gray-950 stroke-[3]" /></div>}
                  </button>
                ))}
              </div>
            )}

            {/* THEME */}
            {activeModal === 'theme' && (
              <div className="space-y-2">
                {[
                  { id: 'light', name: { uz: 'Yorug\' rejim', ru: 'Светлая', en: 'Light' }, icon: Sun },
                  { id: 'dark', name: { uz: 'Qorong\'u rejim', ru: 'Темная', en: 'Dark' }, icon: Moon }
                ].map(t => (
                  <button key={t.id} onClick={() => { setTheme(t.id as any); setActiveModal(null); }} className={`w-full h-14 px-4 flex items-center justify-between rounded-2xl border-2 transition-all ${theme === t.id ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30]' : 'border-transparent bg-gray-50 dark:bg-[#161F30] hover:border-gray-200 dark:hover:border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <t.icon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{(t.name as any)[lang]}</span>
                    </div>
                    {theme === t.id && <div className="w-5 h-5 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white dark:text-gray-950 stroke-[3]" /></div>}
                  </button>
                ))}
              </div>
            )}

            {/* FAQ */}
            {activeModal === 'faq' && (
              <div className="space-y-3">
                {[
                  { q: 'Buyurtmani qanday bekor qilish mumkin?', a: 'Buyurtmani bekor qilish uchun Buyurtmalarim bo\'limiga o\'tib, bekor qilish tugmasini bosing.' },
                  { q: 'Keshbek qachon tushadi?', a: 'Keshbek buyurtma holati "Tugallangan" (COMPLETED) bo\'lgandan so\'ng avtomatik hisobingizga tushadi.' },
                  { q: 'Yetkazib berish qancha vaqt oladi?', a: 'Odatda Toshkent shahri ichida 24 soat, viloyatlarga 1-3 kun ichida yetkaziladi.' }
                ].map((faq, i) => (
                  <details key={i} className="group bg-gray-50 dark:bg-[#161F30] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden cursor-pointer">
                    <summary className="flex items-center justify-between p-4 font-bold text-sm text-gray-900 dark:text-white list-none">
                      {faq.q}
                      <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-3">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            )}

            {/* SUPPORT */}
            {activeModal === 'support' && (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HeadphonesIcon className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-white">24/7 Operator</h4>
                  <p className="text-xs text-gray-500 mt-1">Sizga yordam berishdan xursandmiz</p>
                </div>
                <a href="https://t.me/example" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-sm transition-all shadow-md">
                  <ExternalLink className="w-4 h-4" /> Telegram orqali yozish
                </a>
                <a href="tel:+998901234567" className="flex items-center justify-center gap-2 h-14 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl font-bold text-sm transition-all">
                  +998 (90) 123-45-67
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] pb-24">
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
        
        {/* 1. PERSONAL CARD */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-emerald-500 to-teal-400 shrink-0">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#111827] p-0.5">
                {user?.photo_url ? (
                  <img src={user.photo_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xl font-black text-emerald-600">
                    {(user?.first_name || 'U').charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-[#111827]">
              <BadgeCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-xs font-bold text-gray-400 mt-0.5">
              {user?.username ? `@${user.username}` : (user as any)?.phone || 'Tasdiqlangan xaridor'}
            </p>
          </div>
        </div>

        {/* 2. MENU GROUPS */}
        <div className="space-y-4">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
              {group.items.map((item, iIdx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModal(item.id as any)}
                  className={`w-full px-5 py-4 flex items-center justify-between transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${iIdx !== group.items.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{(item.label as any)[lang]}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                </button>
              ))}
            </div>
          ))}
          
          {/* NOTIFICATIONS (Standalone Checkbox item) */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
            <button
              onClick={handleNotifToggle}
              className="w-full px-5 py-4 flex items-center justify-between transition-all hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50 dark:bg-orange-500/10 text-orange-500">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {lang === 'uz' ? 'Bildirishnomalar' : 'Уведомления'}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">Telegram bot orqali</div>
                </div>
              </div>
              
              {/* Checkbox Design standard */}
              <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                notifEnabled 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950' 
                  : 'bg-gray-200 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700'
              }`}>
                {notifEnabled && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* RENDER ACTIVE DRAWER */}
      {renderDrawer()}

      {/* NOTIFICATIONS DISABLE CONFIRMATION DIALOG */}
      {showNotifDialog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNotifDialog(false)} />
          <div className="relative w-full max-w-xs bg-white dark:bg-[#111827] rounded-3xl p-6 text-center space-y-5 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-950 dark:text-white">Haqiqatan ham o'chirmoqchimisiz?</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Diqqat! Bildirishnomalarni o'chirsangiz, buyurtma holatlari, yangi chegirmalar va keshbeklar haqidagi ma'lumotlar sizga yetib bormaydi.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={() => setShowNotifDialog(false)} className="h-12 bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white rounded-xl font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                Yo'q, qolsin
              </button>
              <button onClick={confirmDisableNotif} className="h-12 bg-red-500 text-white rounded-xl font-bold text-xs hover:bg-red-600 transition-all shadow-md">
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
