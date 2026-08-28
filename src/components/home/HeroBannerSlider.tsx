'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerItem } from '@/store/useBannerStore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface HeroBannerSliderProps {
  banners: BannerItem[];
  triggerHaptic?: (type?: 'light' | 'medium') => void;
}

export function HeroBannerSlider({ banners, triggerHaptic }: HeroBannerSliderProps) {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const activeBanners = banners.filter((b) => b.isActive);

  const handleNext = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const handlePrev = useCallback(() => {
    if (activeBanners.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1 || isDragging) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(interval);
  }, [activeBanners.length, isDragging, handleNext]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -40) {
      handleNext();
    } else if (dragOffset > 40) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handleMouseUp = (e: React.MouseEvent, bannerLink?: string) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -40) {
      handleNext();
    } else if (dragOffset > 40) {
      handlePrev();
    } else if (Math.abs(dragOffset) < 6 && bannerLink) {
      triggerHaptic?.('medium');
      router.push(bannerLink || '/catalog');
    }
    setDragOffset(0);
  };

  if (activeBanners.length === 0) return null;

  return (
    <section className="relative w-full group select-none">
      {/* Outer Section: rounded-2xl */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={(e) => handleMouseUp(e, activeBanners[activeIndex]?.link)}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setDragOffset(0);
          }
        }}
        className="relative w-full aspect-[16/7] sm:aspect-[21/9] max-h-[380px] select-none cursor-grab active:cursor-grabbing"
      >
        {activeBanners.map((banner, idx) => {
          const isCurrent = idx === activeIndex;
          const bannerTitle =
            typeof banner.title === 'object' && banner.title
              ? (banner.title as any)[lang] || (banner.title as any).uz
              : banner.title || 'Banner';

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm transition-all ${
                isCurrent
                  ? 'z-20 opacity-100 scale-100 shadow-md'
                  : 'z-10 opacity-0 scale-95 pointer-events-none'
              }`}
              style={{
                transform: isCurrent
                  ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.015}deg)`
                  : undefined,
                transition: isDragging && isCurrent ? 'none' : 'all 450ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src={banner.image}
                alt={bannerTitle}
                draggable={false}
                className="w-full h-full object-cover object-center select-none pointer-events-none"
              />
            </div>
          );
        })}
      </div>

      {/* Desktop Arrow Controls: rounded-lg with active:scale-95 */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-lg bg-white/90 hover:bg-white border border-gray-200/90 backdrop-blur-md items-center justify-center text-gray-900 shadow-md opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 transition-transform duration-100"
            aria-label="Oldingi banner"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-lg bg-white/90 hover:bg-white border border-gray-200/90 backdrop-blur-md items-center justify-center text-gray-900 shadow-md opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 transition-transform duration-100"
            aria-label="Keyingi banner"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Progress Dots Indicator */}
      {activeBanners.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5 sm:mt-3">
          {activeBanners.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setActiveIndex(dotIdx)}
              aria-label={`Banner ${dotIdx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                dotIdx === activeIndex
                  ? 'w-6 sm:w-8 h-1.5 bg-gray-900'
                  : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
