'use client';

import React, { useState } from 'react';
import {
  Tag,
  ImageIcon,
  Send,
  Plus,
  Trash2,
  Check,
  Percent,
  Clock,
  Sparkles,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useBannerStore, BannerItem } from '@/store/useBannerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useStaffStore } from '@/store/useStaffStore';

interface MarketingHubProps {
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  openConfirmDialog?: (title: string, msg: string, onConfirm: () => void) => void;
}

export function MarketingHub({ triggerHaptic, openConfirmDialog }: MarketingHubProps) {
  const { lang, t } = useLanguageStore();
  const { hasPermission } = useStaffStore();
  const { banners, addBanner, removeBanner, toggleBannerActive } = useBannerStore();

  const [activeTab, setActiveTab] = useState<'banners' | 'promocodes' | 'broadcast'>('banners');

  // Promocodes local state
  const [promos, setPromos] = useState([
    { id: 1, code: 'SPRING2026', discount: 15, minOrder: 100000, usedCount: 24, maxUsage: 100, isActive: true },
    { id: 2, code: 'WELCOME10', discount: 10, minOrder: 50000, usedCount: 156, maxUsage: 500, isActive: true },
    { id: 3, code: 'TMA2026', discount: 20, minOrder: 200000, usedCount: 89, maxUsage: 200, isActive: false },
  ]);

  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('10');
  const [newPromoMin, setNewPromoMin] = useState('100000');

  // Banner form state
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('/catalog');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLink, setBroadcastLink] = useState('https://t.me/your_bot_link');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastSuccessResult, setBroadcastSuccessResult] = useState<string | null>(null);

  const canManageMarketing = hasPermission('MANAGE_MARKETING');

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    triggerHaptic('medium');

    const created = {
      id: Date.now(),
      code: newPromoCode.trim().toUpperCase(),
      discount: parseInt(newPromoDiscount, 10) || 10,
      minOrder: parseInt(newPromoMin, 10) || 100000,
      usedCount: 0,
      maxUsage: 100,
      isActive: true,
    };

    setPromos([created, ...promos]);
    setNewPromoCode('');
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerImage.trim()) return;
    triggerHaptic('medium');

    addBanner({
      title: { uz: newBannerTitle, ru: newBannerTitle, en: newBannerTitle },
      subtitle: { uz: newBannerSubtitle, ru: newBannerSubtitle, en: newBannerSubtitle },
      image: newBannerImage.trim(),
      link: newBannerLink.trim() || '/catalog',
      isActive: true,
    });

    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImage('');
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    triggerHaptic('heavy');

    setBroadcastSending(true);
    setBroadcastSuccessResult(null);

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle.trim(),
          message: broadcastMessage.trim(),
          actionLink: broadcastLink.trim() || undefined,
          actionText: 'Katalogga o\'tish',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBroadcastSuccessResult(
          lang === 'uz'
            ? `Xabarnoma ${data.data.sent_count} ta foydalanuvchiga muvaffaqiyatli yetkazildi!`
            : `Уведомление успешно доставлено ${data.data.sent_count} пользователям!`
        );
        setBroadcastTitle('');
        setBroadcastMessage('');
      } else {
        setBroadcastSuccessResult('Xatolik: ' + data.error);
      }
    } catch (err: any) {
      setBroadcastSuccessResult('Xabarnoma yuborishda xatolik: ' + err.message);
    } finally {
      setBroadcastSending(false);
    }
  };

  const getBannerText = (val: any) => {
    if (typeof val === 'object' && val) return val[lang] || val.uz || '';
    return String(val || '');
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('banners');
            triggerHaptic('light');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'banners'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
              : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{lang === 'uz' ? 'Bosh sahifa bannerlari' : 'Баннеры'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('promocodes');
            triggerHaptic('light');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'promocodes'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
              : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>{lang === 'uz' ? 'Promokodlar' : 'Промокоды'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('broadcast');
            triggerHaptic('light');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'broadcast'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
              : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{lang === 'uz' ? 'Telegram Ommaviy Xabarnoma' : 'Рассылка'}</span>
        </button>
      </div>

      {/* 1. BANNERS MANAGEMENT */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Banner Form */}
          {canManageMarketing && (
            <div className="lg:col-span-5 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'uz' ? 'Yangi banner qo\'shish' : 'Добавить баннер'}</span>
              </h3>

              <form onSubmit={handleAddBanner} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Sarlavha (Title)
                  </label>
                  <input
                    type="text"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="Bahorgi yangi to'plam 2026"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Quyi sarlavha (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="Barcha mahsulotlarga -20% gacha chegirmalar"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Rasm URL manzili
                  </label>
                  <input
                    type="url"
                    value={newBannerImage}
                    onChange={(e) => setNewBannerImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Havola (Link)
                  </label>
                  <input
                    type="text"
                    value={newBannerLink}
                    onChange={(e) => setNewBannerLink(e.target.value)}
                    placeholder="/catalog"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newBannerTitle.trim() || !newBannerImage.trim()}
                  className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs hover:bg-black dark:hover:bg-gray-100 disabled:opacity-50 active:scale-95 transition-all shadow-xs"
                >
                  {lang === 'uz' ? 'Bannerni saqlash' : 'Сохранить'}
                </button>
              </form>
            </div>
          )}

          {/* Banners List */}
          <div className={canManageMarketing ? 'lg:col-span-7 space-y-3' : 'lg:col-span-12 space-y-3'}>
            <div className="text-xs font-bold text-gray-950 dark:text-white">
              {lang === 'uz' ? `Mavjud bannerlar (${banners.length})` : `Баннеры (${banners.length})`}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs group"
                >
                  <div className="h-32 w-full relative bg-gray-100 dark:bg-[#161F30]">
                    <img src={b.image} alt={getBannerText(b.title)} className="w-full h-full object-cover" />
                  </div>

                  <div className="p-3 space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-gray-950 dark:text-white line-clamp-1">
                        {getBannerText(b.title)}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{getBannerText(b.subtitle)}</p>
                    </div>

                    {canManageMarketing && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-white/10">
                        <button
                          type="button"
                          onClick={() => toggleBannerActive(b.id)}
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            b.isActive ? 'text-emerald-600' : 'text-gray-400'
                          }`}
                        >
                          {b.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">{b.isActive ? 'Faol' : 'O\'chiq'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeBanner(b.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PROMOCODES MANAGEMENT */}
      {activeTab === 'promocodes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Promo Form */}
          {canManageMarketing && (
            <div className="lg:col-span-5 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-950 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-500" />
                <span>{lang === 'uz' ? 'Yangi promokod yaratish' : 'Создать промокод'}</span>
              </h3>

              <form onSubmit={handleAddPromo} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                    Promokod nomi (Kodi)
                  </label>
                  <input
                    type="text"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    placeholder="PROMO2026"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-gray-900 dark:text-white outline-none uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      Chegirma foizi (%)
                    </label>
                    <input
                      type="number"
                      value={newPromoDiscount}
                      onChange={(e) => setNewPromoDiscount(e.target.value)}
                      placeholder="15"
                      min="1"
                      max="90"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      Minimal buyurtma (UZS)
                    </label>
                    <input
                      type="number"
                      value={newPromoMin}
                      onChange={(e) => setNewPromoMin(e.target.value)}
                      placeholder="100000"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newPromoCode.trim()}
                  className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs hover:bg-black dark:hover:bg-gray-100 disabled:opacity-50 active:scale-95 transition-all shadow-xs"
                >
                  {lang === 'uz' ? 'Promokodni saqlash' : 'Сохранить промокод'}
                </button>
              </form>
            </div>
          )}

          {/* Promocodes Table */}
          <div className={canManageMarketing ? 'lg:col-span-7 space-y-3' : 'lg:col-span-12 space-y-3'}>
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#161F30] border-b border-gray-200/80 dark:border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Kodi</th>
                    <th className="py-3 px-4">Chegirma</th>
                    <th className="py-3 px-4">Min. Summa</th>
                    <th className="py-3 px-4">Ishlatildi</th>
                    <th className="py-3 px-4 text-right">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {promos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-[#161F30]/50">
                      <td className="py-3 px-4 font-mono font-bold text-gray-950 dark:text-white">
                        {p.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        {p.discount}%
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">
                        {p.minOrder.toLocaleString()} UZS
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {p.usedCount} / {p.maxUsage}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            p.isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800/40'
                              : 'bg-gray-100 dark:bg-[#161F30] text-gray-400'
                          }`}
                        >
                          {p.isActive ? 'Faol' : 'Nofaol'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. BROADCAST TELEGRAM NOTIFICATIONS */}
      {activeTab === 'broadcast' && (
        <div className="max-w-2xl bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-500" />
              <span>{lang === 'uz' ? 'Barcha mijozlarga ommaviy xabarnoma yuborish' : 'Массовая рассылка'}</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'uz'
                ? 'Ushbu xabarnoma do\'koningizning barcha faol Telegram xaridorlariga bot orqali parallel jo\'natiladi.'
                : 'Сообщение будет отправлено всем активным пользователям Telegram бота.'}
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">
                {lang === 'uz' ? 'Xabarnoma Sarlavhasi' : 'Заголовок'}
              </label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="🔥 Faqat bugun: Barcha krossovkalarga 20% chegirma!"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">
                {lang === 'uz' ? 'Xabarnoma Matni' : 'Текст сообщения'}
              </label>
              <textarea
                rows={4}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Hurmatli mijoz, yangi kolleksiya do'konimizga yetib keldi. Shoshiling, tovarlar soni cheklangan!"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">
                {lang === 'uz' ? 'Harakat tugmasi havolasi (Link)' : 'Ссылка для кнопки'}
              </label>
              <input
                type="text"
                value={broadcastLink}
                onChange={(e) => setBroadcastLink(e.target.value)}
                placeholder="https://t.me/your_bot_name/app"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
              />
            </div>

            {broadcastSuccessResult && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
                {broadcastSuccessResult}
              </div>
            )}

            <button
              type="submit"
              disabled={broadcastSending || !broadcastTitle.trim() || !broadcastMessage.trim()}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-gray-100 disabled:opacity-50 active:scale-95 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>
                {broadcastSending
                  ? 'Xabarnoma yuborilmoqda...'
                  : lang === 'uz'
                  ? 'Barcha mijozlarga jo\'natish'
                  : 'Отправить рассылку'}
              </span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
