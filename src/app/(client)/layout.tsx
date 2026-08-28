import React from 'react';
import { TelegramProvider } from '@/components/telegram/TelegramProvider';
import { HomeHeader } from '@/components/home/HomeHeader';
import { BottomNav } from '@/components/telegram/BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <TelegramProvider>
      <div className="min-h-screen bg-[#FAFAFA] text-gray-900 selection:bg-gray-900 selection:text-white flex flex-col font-sans antialiased">
        {/* Universal Adaptive Top Header */}
        <HomeHeader />

        {/* Responsive Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1.5 sm:pt-2 md:pt-2.5 pb-24 md:pb-16 transition-all">
          {children}
        </main>

        {/* Mobile-Only Persistent Bottom Navigation */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </TelegramProvider>
  );
}
