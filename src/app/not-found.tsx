'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in">
      {/* 404 Illustration Icon */}
      <div className="w-20 h-20 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200 shadow-xs">
        <FileQuestion className="w-10 h-10 stroke-[1.8]" />
      </div>

      <div className="space-y-2 max-w-xs">
        <span className="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-wider border border-gray-200">
          Xatolik 404
        </span>
        <h1 className="text-xl font-bold text-gray-950 tracking-tight">Sahifa Topilmadi</h1>
        <p className="text-xs text-gray-500 font-normal leading-relaxed">
          Siz qidirayotgan sahifa o'chirilgan, nomi o'zgartirilgan yoki vaqtinchalik mavjud emas.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2 pt-2">
        <Link
          href="/"
          className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-transform duration-100"
        >
          <Home className="w-4 h-4 text-white dark:text-gray-950" />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>
    </div>
  );
}
