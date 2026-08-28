'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowRight, Store, Check, Heart, Send } from 'lucide-react';
import { StoryItem } from '@/types';
import { useLanguageStore } from '@/store/useLanguageStore';

interface StoriesModalProps {
  stories: StoryItem[];
  activeStoryIndex: number | null;
  onClose: () => void;
  onNavigate: (url: string) => void;
}

export function StoriesModal({
  stories,
  activeStoryIndex,
  onClose,
  onNavigate,
}: StoriesModalProps) {
  const { lang, t } = useLanguageStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const durationMs = 4500; // 4.5 seconds per story
  const tickInterval = 50;
  const progressStep = (tickInterval / durationMs) * 100;

  useEffect(() => {
    if (activeStoryIndex !== null) {
      setCurrentIndex(activeStoryIndex);
      setProgress(0);
      setIsPaused(false);
      setIsLiked(false);
    }
  }, [activeStoryIndex]);

  const triggerHaptic = (type: 'light' | 'medium' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleNext = useCallback(() => {
    triggerHaptic('light');
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    triggerHaptic('light');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  }, [currentIndex]);

  // Main Timer Loop
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + progressStep;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused, handleNext, progressStep]);

  // Handle Double Tap to Like
  const handleDoubleTap = () => {
    setIsLiked(true);
    setShowHeartAnim(true);
    triggerHaptic('medium');
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  if (activeStoryIndex === null || !stories[currentIndex]) return null;

  const currentStory = stories[currentIndex];

  const storyTitle =
    typeof currentStory.title === 'object' && currentStory.title
      ? (currentStory.title as any)[lang] || (currentStory.title as any).uz
      : String(currentStory.title || '');

  const storySubtitle =
    typeof currentStory.subtitle === 'object' && currentStory.subtitle
      ? (currentStory.subtitle as any)[lang] || (currentStory.subtitle as any).uz
      : String(currentStory.subtitle || '');

  const storyTag =
    typeof currentStory.tag === 'object' && currentStory.tag
      ? (currentStory.tag as any)[lang] || (currentStory.tag as any).uz
      : String(currentStory.tag || '');

  const storyLinkText =
    typeof currentStory.linkText === 'object' && currentStory.linkText
      ? (currentStory.linkText as any)[lang] || (currentStory.linkText as any).uz
      : String(currentStory.linkText || t('go_to_catalog'));

  return (
    <div className="fixed inset-0 z-[99999] bg-black/95 sm:bg-black/90 backdrop-blur-md flex items-center justify-center select-none animate-in fade-in duration-200">
      {/* Desktop Container (constrained like Instagram web modal) */}
      <div
        className="relative w-full h-full sm:h-[90vh] sm:max-h-[820px] sm:max-w-[420px] sm:rounded-2xl overflow-hidden bg-black flex flex-col justify-between shadow-2xl"
        onDoubleClick={handleDoubleTap}
      >
        {/* Background Full-bleed Story Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentStory.image}
            alt={storyTitle}
            className="w-full h-full object-cover object-center select-none pointer-events-none"
          />
          {/* Subtle Top & Bottom Vignette Overlays for Maximum Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/85 pointer-events-none" />
        </div>

        {/* Double Tap Floating Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-300">
            <Heart className="w-24 h-24 fill-red-500 text-red-500 drop-shadow-2xl animate-bounce" />
          </div>
        )}

        {/* Touch / Click zones for Previous (left 35%) & Next (right 65%) with Hold-to-Pause */}
        <div
          className="absolute inset-0 z-10 flex"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Left Tap Zone */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="w-[35%] h-full cursor-pointer"
          />
          {/* Right Tap Zone */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="w-[65%] h-full cursor-pointer"
          />
        </div>

        {/* 1. TOP HEADER SECTION */}
        <div className="relative z-20 p-3.5 sm:p-4 space-y-2.5 pt-4 sm:pt-3">
          {/* Segmented Progress Bars (Instagram Stories Multi-bars) */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((_, idx) => {
              let segmentFill = '0%';
              if (idx < currentIndex) segmentFill = '100%';
              else if (idx === currentIndex) segmentFill = `${progress}%`;

              return (
                <div
                  key={idx}
                  className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white rounded-full transition-all ease-linear"
                    style={{
                      width: segmentFill,
                      transitionDuration: idx === currentIndex ? `${tickInterval}ms` : '0ms',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* User / Store Header Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {/* Store Avatar with Ring */}
              <div className="w-8 h-8 rounded-full border border-white/60 p-0.5 flex items-center justify-center bg-gray-900 shadow-sm">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight drop-shadow-sm">
                    LUXE BOUTIQUE
                  </span>
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[10px] text-white/70 font-normal">• 15d</span>
                </div>
              </div>
            </div>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-all"
              aria-label={t('close')}
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 2. BOTTOM CONTENT & CTA ACTION SECTION */}
        <div className="relative z-20 p-4 sm:p-5 space-y-3.5 pb-6 sm:pb-5">
          {/* Tag & Story Headline */}
          <div className="space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              {storyTag}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-md">
              {storyTitle}
            </h3>
            <p className="text-xs text-white/80 font-normal drop-shadow-sm">
              {storySubtitle}
            </p>
          </div>

          {/* Call to Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('medium');
              onClose();
              onNavigate(currentStory.linkUrl || '/catalog');
            }}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-transform duration-100"
          >
            <span>{storyLinkText}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Quick Action Reaction Bar (Like & Share) */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2 text-white/80 text-xs font-normal">
              <span>{currentIndex + 1} / {stories.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('light');
                  setIsLiked((prev) => !prev);
                }}
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
                aria-label="Yoqdi"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'} stroke-[2]`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
