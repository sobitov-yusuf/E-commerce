'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  Printer,
  FileSpreadsheet,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  User,
  Phone,
  MapPin,
  DollarSign,
  CreditCard,
  Banknote,
  Send,
  MoreHorizontal,
  ArrowUpDown,
  History,
  Check,
} from 'lucide-react';
import { useOrderStore, OrderItemRecord } from '@/store/useOrderStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useStaffStore } from '@/store/useStaffStore';

interface OrdersHubProps {
  searchQuery: string;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  openConfirmDialog?: (title: string, msg: string, onConfirm: () => void) => void;
}

export function OrdersHub({ searchQuery, triggerHaptic, openConfirmDialog }: OrdersHubProps) {
  const { lang, t } = useLanguageStore();
  const { hasPermission, staff } = useStaffStore();
  const { orders, updateOrderStatus, assignCourier, fetchOrders } = useOrderStore();

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderItemRecord['status']>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderItemRecord | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const canManageOrders = hasPermission('MANAGE_ORDERS');

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const query = searchQuery.toLowerCase();
      const location = o.location || '';
      const matchesSearch =
        o.id.toLowerCase().includes(query) ||
        o.user.toLowerCase().includes(query) ||
        o.phone.includes(query) ||
        location.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // MS Excel UTF-8 BOM CSV Export
  const handleExportCSV = () => {
    triggerHaptic('medium');
    const headers = ['Buyurtma ID', 'Mijoz', 'Telefon', 'Jami Summa (UZS)', 'Holat', 'To\'lov Usuli', 'Yetkazish', 'Manzil', 'Sana'];
    const rows = filteredOrders.map((o) => [
      `"${o.id}"`,
      `"${o.user}"`,
      `"${o.phone}"`,
      `"${o.total}"`,
      `"${o.status}"`,
      `"${o.paymentType || 'CASH'}"`,
      `"${o.deliveryMethod || 'courier'}"`,
      `"${o.location || ''}"`,
      `"${o.date || 'Bugun'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `buyurtmalar_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderItemRecord['status']) => {
    triggerHaptic('medium');
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    // Call Backend API to sync and notify Telegram bot
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: parseInt(orderId.replace(/\D/g, ''), 10) || 1,
          status: newStatus,
        }),
      });
    } catch (e) {
      console.warn('Backend order patch sync warning:', e);
    }
  };

  const couriers = staff.filter((s) => s.role === 'COURIER');

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar & CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['ALL', 'NEW', 'DELIVERING', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                triggerHaptic('light');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                  : 'bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300'
              }`}
            >
              {st === 'ALL'
                ? lang === 'uz' ? 'Barcha buyurtmalar' : 'Все заказы'
                : st}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#161F30] border border-gray-200 dark:border-white/10 hover:bg-gray-50 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'uz' ? 'Excel (CSV) Eksport' : 'Экспорт в Excel'}</span>
          </button>
        </div>
      </div>

      {/* 2. Orders Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#161F30] border-b border-gray-200/80 dark:border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Buyurtma</th>
                <th className="py-3 px-4">Mijoz</th>
                <th className="py-3 px-4">Tovarlar</th>
                <th className="py-3 px-4">Jami Summa</th>
                <th className="py-3 px-4">To'lov</th>
                <th className="py-3 px-4">Holat</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {filteredOrders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => {
                    setSelectedOrder(o);
                    triggerHaptic('light');
                  }}
                  className="hover:bg-gray-50/50 dark:hover:bg-[#161F30]/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-gray-950 dark:text-white">
                    {o.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-950 dark:text-white">{o.user}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{o.phone}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-950 dark:text-white">
                    {o.itemsCount || o.items?.length || 1} ta tovar
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-950 dark:text-white">
                    {o.total.toLocaleString()} UZS
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase">
                      {o.paymentType === 'CLICK' ? (
                        <span className="text-blue-600">Click</span>
                      ) : o.paymentType === 'PAYME' ? (
                        <span className="text-[#00C2AF]">Payme</span>
                      ) : (
                        <span className="text-emerald-600">Naqd</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        o.status === 'COMPLETED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800/40'
                          : o.status === 'DELIVERING'
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 border border-blue-200 dark:border-blue-800/40'
                          : o.status === 'CANCELLED'
                          ? 'bg-red-50 dark:bg-red-950/50 text-red-600 border border-red-200 dark:border-red-800/40'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border border-amber-200 dark:border-amber-800/40'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(o);
                        setShowPrintModal(true);
                      }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#161F30] rounded-lg text-gray-400 hover:text-gray-700"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Order Details Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-900 dark:text-white" />
                  <span>Buyurtma {selectedOrder.id}</span>
                </h3>
                <span className="text-[11px] text-gray-400">{selectedOrder.date || 'Bugun'}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Customer & Delivery Details */}
            <div className="bg-gray-50 dark:bg-[#161F30] p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Mijoz:</span>
                <span className="font-bold text-gray-950 dark:text-white">{selectedOrder.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Telefon:</span>
                <span className="font-mono font-bold text-gray-950 dark:text-white">{selectedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Manzil:</span>
                <span className="font-medium text-gray-950 dark:text-white text-right max-w-[240px]">
                  {selectedOrder.location || 'Do\'kondan olib ketish'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">To'lov:</span>
                <span className="font-bold text-gray-950 dark:text-white">{selectedOrder.paymentType || 'CASH'}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-950 dark:text-white">Tovarlar tarkibi:</div>
              <div className="max-h-40 overflow-y-auto divide-y divide-gray-100 dark:divide-white/10">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <div className="font-bold text-gray-950 dark:text-white line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-gray-400">{item.quantity} dona x {item.price.toLocaleString()} UZS</div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-950 dark:text-white">
                      {(item.price * item.quantity).toLocaleString()} UZS
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Status Buttons */}
            {canManageOrders && (
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/10">
                <div className="text-xs font-bold text-gray-950 dark:text-white">Holatni o'zgartirish:</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['NEW', 'DELIVERING', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedOrder.status === st
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

            {/* Print Receipt Action */}
            <button
              type="button"
              onClick={() => {
                setShowPrintModal(true);
                triggerHaptic('light');
              }}
              className="w-full py-2.5 bg-gray-100 dark:bg-[#161F30] text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <Printer className="w-4 h-4" />
              <span>80mm Kassa Chekini Chop Etish</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. 80mm Thermal Receipt Print Modal */}
      {showPrintModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-black font-mono text-xs space-y-3">
            <div className="text-center space-y-1 border-b border-dashed border-gray-400 pb-3">
              <div className="font-black text-sm uppercase">LUXE BOUTIQUE</div>
              <div className="text-[10px]">Toshkent sh., Chilonzor 9</div>
              <div className="text-[10px]">Tel: +998 90 123-45-67</div>
              <div className="font-bold pt-1">CHEK: {selectedOrder.id}</div>
              <div className="text-[10px] text-gray-600">{new Date().toLocaleString()}</div>
            </div>

            <div className="space-y-1.5 border-b border-dashed border-gray-400 pb-3">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate max-w-[140px]">{item.name}</span>
                  <span>{item.quantity}x {item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1 border-b border-dashed border-gray-400 pb-3 font-bold">
              <div className="flex justify-between text-sm">
                <span>JAMI:</span>
                <span>{selectedOrder.total.toLocaleString()} UZS</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>To'lov usuli:</span>
                <span>{selectedOrder.paymentType || 'CASH'}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-500 pt-2">
              Xaridingiz uchun rahmat!
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 bg-black text-white font-bold rounded-lg text-xs"
              >
                Chop etish
              </button>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-2 bg-gray-200 text-black font-bold rounded-lg text-xs"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
