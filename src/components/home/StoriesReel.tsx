'use client';

import React from 'react';
import { StoryItem } from '@/types';
import { useLanguageStore } from '@/store/useLanguageStore';

interface StoriesReelProps {
  stories: StoryItem[];
  onSelectStory: (story: StoryItem) => void;
  triggerHaptic?: (type?: 'light' | 'medium') => void;
}

export function StoriesReel({ stories, onSelectStory, triggerHaptic }: StoriesReelProps) {
  const { lang } = useLanguageStore();

  return (
    <section className="w-full select-none pt-0.5 pb-0 -mb-1.5 sm:-mb-2.5">
      <div className="flex overflow-x-auto gap-4 sm:gap-5 md:gap-6 px-1 sm:px-3 py-1 no-scrollbar items-center">
        {stories.map((story) => {
          const localizedTitle =
            typeof story.title === 'object' && story.title
              ? (story.title as any)[lang] || (story.title as any).uz
              : String(story.title || '');

          const localizedTag =
            typeof story.tag === 'object' && story.tag
              ? (story.tag as any)[lang] || (story.tag as any).uz
              : String(story.tag || '');

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                triggerHaptic?.('medium');
                onSelectStory(story);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-transform duration-100 select-none"
            >
              {/* Flawless Story Ring Container (zero white halos or subpixel clipping on hover) */}
              <div className="w-[62px] h-[62px] sm:w-[70px] sm:h-[70px] rounded-full border-2 border-gray-950 p-[2.5px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105 bg-transparent">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={story.image}
                    alt={localizedTitle}
                    className="w-full h-full object-cover object-center select-none"
                  />
                </div>
              </div>

              <span className="text-[11px] sm:text-xs font-semibold text-gray-800 tracking-tight whitespace-nowrap text-center">
                {localizedTag}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
