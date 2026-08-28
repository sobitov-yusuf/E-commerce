'use client';

import React, { useRef, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { MultilingualText } from '@/types';

interface CategoryItem {
  id: number;
  name: MultilingualText | string;
  image: string;
  isActive: boolean;
  showOnHome?: boolean;
}

interface CategoryCarouselProps {
  categories: CategoryItem[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  triggerHaptic?: (type?: 'light' | 'medium') => void;
}

export function CategoryCarousel({
  categories,
  selectedCategoryId,
  onSelectCategory,
  triggerHaptic,
}: CategoryCarouselProps) {
  const { lang, t } = useLanguageStore();
  const catScrollerRef = useRef<HTMLDivElement>(null);
  const [isCatDragging, setIsCatDragging] = useState(false);
  const [catStartX, setCatStartX] = useState(0);
  const [catScrollLeft, setCatScrollLeft] = useState(0);

  const activeCategories = categories.filter((c) => c.isActive !== false && c.showOnHome !== false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!catScrollerRef.current) return;
    setIsCatDragging(true);
    setCatStartX(e.pageX - catScrollerRef.current.offsetLeft);
    setCatScrollLeft(catScrollerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isCatDragging || !catScrollerRef.current) return;
    e.preventDefault();
    const x = e.pageX - catScrollerRef.current.offsetLeft;
    const walk = (x - catStartX) * 1.5;
    catScrollerRef.current.scrollLeft = catScrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsCatDragging(false);
  };

  return (
    <section className="w-full select-none py-1">
      {/* Horizontal Uzum-Style Category Capsules Container */}
      <div
        ref={catScrollerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex overflow-x-auto gap-3 sm:gap-4 px-1 sm:px-2 py-1.5 no-scrollbar scroll-smooth items-center cursor-grab active:cursor-grabbing"
      >
        {/* "Barchasi" (All) Uzum-Style Capsule Card */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic?.('light');
            onSelectCategory(null);
          }}
          className={`h-[56px] sm:h-[60px] px-4 sm:px-5 rounded-2xl border flex items-center gap-3 sm:gap-3.5 shrink-0 active:scale-95 transition-all duration-150 shadow-2xs ${
            selectedCategoryId === null
              ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 shadow-md'
              : 'bg-white dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
          }`}
        >
          <div
            className={`w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full flex items-center justify-center shrink-0 ${
              selectedCategoryId === null
                ? 'bg-white/20 dark:bg-black/10 text-white dark:text-gray-950'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}
          >
            <LayoutGrid className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-sm sm:text-[15px] font-semibold tracking-tight whitespace-nowrap ${
              selectedCategoryId === null ? 'text-white dark:text-gray-950 font-bold' : 'text-gray-900 dark:text-white'
            }`}
          >
            {t('home_all')}
          </span>
        </button>

        {/* Dynamic Category Capsules */}
        {activeCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const localizedName =
            typeof cat.name === 'object' && cat.name
              ? (cat.name as any)[lang] || (cat.name as any).uz
              : String(cat.name || '');

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                triggerHaptic?.('light');
                onSelectCategory(isSelected ? null : cat.id);
              }}
              className={`h-[56px] sm:h-[60px] px-4 sm:px-5 rounded-2xl border flex items-center gap-3 sm:gap-3.5 shrink-0 active:scale-95 transition-all duration-150 shadow-2xs ${
                isSelected
                  ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 shadow-md'
                  : 'bg-white dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
              }`}
            >
              <div
                className={`w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full overflow-hidden shrink-0 flex items-center justify-center ${
                  isSelected ? 'bg-white/20 dark:bg-black/10 p-0.5' : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <img
                  src={cat.image}
                  alt={localizedName}
                  className="w-full h-full object-cover object-center pointer-events-none rounded-full"
                />
              </div>
              <span
                className={`text-sm sm:text-[15px] font-semibold tracking-tight whitespace-nowrap ${
                  isSelected ? 'text-white dark:text-gray-950 font-bold' : 'text-gray-900 dark:text-white'
                }`}
              >
                {localizedName}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
