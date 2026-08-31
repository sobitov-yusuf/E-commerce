'use client';

import React, { useState } from 'react';
import {
  Settings,
  Users,
  History,
  ShieldCheck,
  Truck,
  DollarSign,
  Percent,
  Plus,
  Trash2,
  Clock,
  UserPlus,
  ShieldAlert,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStaffStore, StaffRole } from '@/store/useStaffStore';
import { useAuditStore } from '@/store/useAuditStore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface SettingsHubProps {
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  openConfirmDialog?: (title: string, msg: string, onConfirm: () => void) => void;
}

export function SettingsHub({ triggerHaptic, openConfirmDialog }: SettingsHubProps) {
  const { lang } = useLanguageStore();
  const { hasPermission } = useStaffStore();
  const settingsStore = useSettingsStore();
  const { staff, addStaff, removeStaff, updateStaffRole } = useStaffStore();
  const { logs } = useAuditStore();

  const [activeTab, setActiveTab] = useState<'store' | 'staff' | 'audit'>('store');

  // Store form state
  const [storeName, setStoreName] = useState(settingsStore.storeName || 'LUXE BOUTIQUE');
  const [deliveryFee, setDeliveryFee] = useState(String(settingsStore.deliveryFee || 20000));
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(String(settingsStore.freeDeliveryThreshold || 300000));
  const [maxReviews, setMaxReviews] = useState(String(settingsStore.maxReviewsPerProduct || 10));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New staff form state
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('OPERATOR');

  const canManageSettings = hasPermission('MANAGE_SETTINGS');
  const canManageStaff = hasPermission('MANAGE_STAFF');
  const canViewAudit = hasPermission('VIEW_AUDIT_LOGS');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');

    settingsStore.updateSettings({
      storeName,
      deliveryFee: parseInt(deliveryFee, 10) || 20000,
      freeDeliveryThreshold: parseInt(freeDeliveryThreshold, 10) || 300000,
      maxReviewsPerProduct: parseInt(maxReviews, 10) || 10,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffPhone.trim()) return;
    triggerHaptic('medium');

    addStaff({
      name: newStaffName.trim(),
      phone: newStaffPhone.trim(),
      role: newStaffRole,
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    });

    setNewStaffName('');
    setNewStaffPhone('');
    setShowAddStaffModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('store');
            triggerHaptic('light');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'store'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
              : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{lang === 'uz' ? 'Do\'kon Parametrlari' : 'Параметры магазина'}</span>
        </button>

        {canManageStaff && (
          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              triggerHaptic('light');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'staff'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{lang === 'uz' ? 'Xodimlar va Rollar (RBAC)' : 'Сотрудники и роли'}</span>
          </button>
        )}

        {canViewAudit && (
          <button
            type="button"
            onClick={() => {
              setActiveTab('audit');
              triggerHaptic('light');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{lang === 'uz' ? 'Audit Jurnali' : 'Аудит действий'}</span>
          </button>
        )}
      </div>

      {/* 1. STORE SETTINGS FORM */}
      {activeTab === 'store' && (
        <div className="max-w-2xl bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-gray-950 dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-900 dark:text-white" />
            <span>Asosiy Do'kon Sozlamalari</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">
                Do'kon Nomi (Brand Name)
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                disabled={!canManageSettings}
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none disabled:opacity-60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">
                  Standart yetkazish narxi (UZS)
                </label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  disabled={!canManageSettings}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">
                  Bepul yetkazish chegarasi (UZS)
                </label>
                <input
                  type="number"
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  disabled={!canManageSettings}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-900 dark:text-white block mb-1">
                FIFO Sharhlar limiti (Tovar boshiga)
              </label>
              <select
                value={maxReviews}
                onChange={(e) => setMaxReviews(e.target.value)}
                disabled={!canManageSettings}
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none disabled:opacity-60"
              >
                <option value="5">5 ta sharh</option>
                <option value="10">10 ta sharh</option>
                <option value="20">20 ta sharh</option>
                <option value="50">50 ta sharh</option>
              </select>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Do'kon sozlamalari muvaffaqiyatli saqlandi!</span>
              </div>
            )}

            {canManageSettings && (
              <button
                type="submit"
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-gray-100 active:scale-95 transition-all shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Sozlamalarni saqlash</span>
              </button>
            )}
          </form>
        </div>
      )}

      {/* 2. STAFF & RBAC MANAGEMENT */}
      {activeTab === 'staff' && canManageStaff && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-950 dark:text-white">
              Xodimlar va Huquqlar ({staff.length})
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAddStaffModal(true);
                triggerHaptic('light');
              }}
              className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-black dark:hover:bg-gray-100 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Yangi xodim qo'shish</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#161F30] border-b border-gray-200/80 dark:border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Xodim</th>
                  <th className="py-3 px-4">Telefon</th>
                  <th className="py-3 px-4">Roli</th>
                  <th className="py-3 px-4">Oxirgi Faollik</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                {staff.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-[#161F30]/50">
                    <td className="py-3 px-4 font-bold text-gray-950 dark:text-white">
                      {m.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-300">
                      {m.phone}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={m.role}
                        onChange={(e) => updateStaffRole(m.id, e.target.value as StaffRole)}
                        className="px-2 py-1 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold text-gray-900 dark:text-white outline-none"
                      >
                        <option value="SUPER_ADMIN">SUPER ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="OPERATOR">OPERATOR</option>
                        <option value="COURIER">COURIER</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-[11px]">
                      {m.lastActive}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {m.role !== 'SUPER_ADMIN' && (
                        <button
                          type="button"
                          onClick={() => removeStaff(m.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
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

          {/* Add Staff Modal */}
          {showAddStaffModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 max-w-sm w-full border border-gray-200 dark:border-white/10 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                  <h4 className="text-sm font-bold text-gray-950 dark:text-white">Yangi xodim biriktirish</h4>
                  <button onClick={() => setShowAddStaffModal(false)}>✕</button>
                </div>

                <form onSubmit={handleAddStaff} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      Ism Familiya
                    </label>
                    <input
                      type="text"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      placeholder="Azizbek Rahmonov"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      Telefon raqami
                    </label>
                    <input
                      type="tel"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                      Lavozim va Roli
                    </label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                    >
                      <option value="OPERATOR">OPERATOR (Buyurtmalar & Mijozlar)</option>
                      <option value="MANAGER">MANAGER (Katalog & Marketing)</option>
                      <option value="COURIER">COURIER (Yetkazib beruvchi)</option>
                      <option value="SUPER_ADMIN">SUPER ADMIN (Barcha huquqlar)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs mt-2"
                  >
                    Xodimni saqlash
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. AUDIT TRAIL LOGS */}
      {activeTab === 'audit' && canViewAudit && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-950 dark:text-white">
            Tizim Harakatlari Jurnali ({logs.length})
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#161F30] border-b border-gray-200/80 dark:border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Vaqt</th>
                    <th className="py-3 px-4">Xodim</th>
                    <th className="py-3 px-4">Amal</th>
                    <th className="py-3 px-4">Tafsilot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-[#161F30]/50">
                      <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-950 dark:text-white">
                        {log.actor}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#161F30] text-gray-800 dark:text-gray-200 font-mono font-bold text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
