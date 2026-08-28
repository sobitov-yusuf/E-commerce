'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export function FlashDealsCountdown() {
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gray-900 text-white rounded-2xl p-3.5 sm:p-4 border border-gray-800 shadow-sm flex items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-white shrink-0">
          <Zap className="w-4 h-4 fill-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-tight text-white">KUN TAKLIFI</span>
            <span className="rounded-md text-[11px] font-semibold px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
              -30%
            </span>
          </div>
          <p className="text-xs font-normal text-gray-400">Bugungi eksklyuziv chegirmalar</p>
        </div>
      </div>

      {/* Countdown Box */}
      <div className="flex items-center gap-1 bg-gray-800/90 px-3 py-1.5 rounded-lg border border-gray-700 font-mono text-xs font-bold text-white shadow-inner shrink-0">
        <span>{String(countdown.hours).padStart(2, '0')}</span>
        <span className="text-gray-500 animate-ping">:</span>
        <span>{String(countdown.minutes).padStart(2, '0')}</span>
        <span className="text-gray-500 animate-ping">:</span>
        <span>{String(countdown.seconds).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
