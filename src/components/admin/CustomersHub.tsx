'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Crown,
  Phone,
  Calendar,
  DollarSign,
  Package,
  Star,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';
import { useCustomerStore, CustomerRecord } from '@/store/useCustomerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useStaffStore } from '@/store/useStaffStore';

interface CustomersHubProps {
  searchQuery: string;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

export function CustomersHub({ searchQuery, triggerHaptic }: CustomersHubProps) {
  const { lang } = useLanguageStore();
  const { hasPermission } = useStaffStore();
  const { customers, updateCustomerStatus, updateCustomerNotes } = useCustomerStore();

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [customerFilter, setCustomerFilter] = useState<'ALL' | 'VIP' | 'ACTIVE' | 'BLOCKED'>('ALL');
  const [editingNotes, setEditingNotes] = useState('');

  const canManageCustomers = hasPermission('MANAGE_CUSTOMERS');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.username.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = customerFilter === 'ALL' || c.status === customerFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, customerFilter]);

  const totalSpentAll = useMemo(() => {
    return customers.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);
  }, [customers]);

  const vipCount = customers.filter((c) => c.status === 'VIP').length;

  return (
    <div className="space-y-6">
      {/* 1. Mini HUD Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>{lang === 'uz' ? 'Jami Mijozlar' : 'Всего клиентов'}</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-gray-950 dark:text-white mt-1">
            {customers.length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>VIP Mijozlar</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {vipCount}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 shadow-xs col-span-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>{lang === 'uz' ? 'Mijozlar Sarflagan Jami Summa' : 'Всего покупок'}</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {totalSpentAll.toLocaleString()} UZS
          </div>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'VIP', 'ACTIVE', 'BLOCKED'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => {
              setCustomerFilter(filter);
              triggerHaptic('light');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              customerFilter === filter
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300'
            }`}
          >
            {filter === 'ALL'
              ? lang === 'uz' ? 'Barchasi' : 'Все'
              : filter}
          </button>
        ))}
      </div>

      {/* 3. Customers Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#161F30] border-b border-gray-200/80 dark:border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Mijoz</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Buyurtmalar</th>
                <th className="py-3 px-4">Jami Sarflagan</th>
                <th className="py-3 px-4">Oxirgi Faollik</th>
                <th className="py-3 px-4 text-right">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Users className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-gray-400">
                      {lang === 'uz' ? 'Hozircha mijozlar mavjud emas' : 'Клиентов пока нет'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setEditingNotes(c.notes || '');
                      triggerHaptic('light');
                    }}
                    className="hover:bg-gray-50/50 dark:hover:bg-[#161F30]/50 cursor-pointer transition-colors"
                  >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 flex items-center justify-center font-bold text-gray-900 dark:text-white shrink-0 overflow-hidden">
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          c.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.status === 'VIP' && (
                            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400">@{c.username || 'username'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-gray-700 dark:text-gray-300">
                    {c.phone}
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-950 dark:text-white">
                    {c.ordersCount} ta
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    {c.totalSpent.toLocaleString()} UZS
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-[11px]">
                    {c.lastActive}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        c.status === 'VIP'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200 dark:border-amber-800/40'
                          : c.status === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-red-50 dark:bg-red-950/50 text-red-600 border border-red-200 dark:border-red-800/40'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#161F30] flex items-center justify-center font-bold text-base text-gray-900 dark:text-white">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                    {selectedCustomer.name}
                    {selectedCustomer.status === 'VIP' && (
                      <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                    )}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-mono">{selectedCustomer.phone}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-[#161F30] p-3 rounded-xl">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Buyurtmalar</div>
                <div className="text-sm font-bold text-gray-950 dark:text-white mt-0.5">
                  {selectedCustomer.ordersCount} ta
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-[#161F30] p-3 rounded-xl">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Jami Xarid</div>
                <div className="text-sm font-bold text-emerald-600 mt-0.5">
                  {selectedCustomer.totalSpent.toLocaleString()} UZS
                </div>
              </div>
            </div>

            {/* Change Status */}
            {canManageCustomers && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-900 dark:text-white block">
                  Mijoz statusini o'zgartirish
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ACTIVE', 'VIP', 'BLOCKED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updateCustomerStatus(selectedCustomer.id, st);
                        setSelectedCustomer({ ...selectedCustomer, status: st });
                        triggerHaptic('medium');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedCustomer.status === st
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white'
                          : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 dark:text-white block">
                Mijoz haqida maxfiy izoh (CRM Notes)
              </label>
              <textarea
                rows={3}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Mijoz haqida eslatmalar..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
              />
              {canManageCustomers && (
                <button
                  type="button"
                  onClick={() => {
                    updateCustomerNotes(selectedCustomer.id, editingNotes);
                    triggerHaptic('light');
                    setSelectedCustomer(null);
                  }}
                  className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs"
                >
                  Izohni saqlash
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
