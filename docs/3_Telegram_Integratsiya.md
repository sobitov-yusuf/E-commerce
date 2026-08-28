# Universal Telegram Mini App (TMA) E-Commerce — Telegram Bot va Mini App Integratsiyasi

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatda Nimalar Turadi va Nimalar Turmaydi? (Scope & Boundaries)

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. **`@telegram-apps/sdk` Native Integratsiyasi:** Viewport Expansion, HapticFeedback, MainButton, BackButton va CloudStorage.
2. **Local Development Mocking UI Wrapper:** Localhost brauzerida Mini App muhitini simulyatsiya qilish (`TelegramProvider.tsx`).
3. **Telegram Auth & HMAC Security:** `initData` ni HMAC SHA-256 va `auth_date` orqali serverda tekshirish algoritmi kodi.
4. **Telegram Contact Sharing (`requestContact`):** 1-klikda tasdiqlangan telefon raqamini olish va saqlash.
5. **Deep Linking (`startapp`):** `t.me/bot/app?startapp=prod_123` formati va Telegram qoidalariga mos regex validation.
6. **Telegram Bot API Xabarnomalari:** Admin va Mijoz (status o'zgarganda) uchun bot xabarnomasi shablonlari.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Biznes PRD Talablari:** Loyiha maqsadi va foydalanuvchi rollari **[1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md)** da turadi.
2. **PostgreSQL / Prisma DB Sxemalari:** Baza jadvallari va SQL indekslari **[2_Texnik_Arxitektura.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/2_Texnik_Arxitektura.md)** da turadi.
3. **Dizayn Rang Tokenlari va CSS:** Hex ranglar va shriftlar **[4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md)** da turadi.
4. **Sprint Rejalari:** Ish muddati va topshiriqlar jurnali **[5_Roadmap.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/5_Roadmap.md)** da turadi.

---

## 1. `@telegram-apps/sdk` Integratsiyasi va Native UI

Telegram Mini App ilovasi foydalanuvchiga xuddi iOS/Android native ilovasi kabi silliq va sifatli tajriba berishi uchun `@telegram-apps/sdk` kutubxonasidan foydalaniladi.

### 🔹 Asosiy Native Funksiyalar:
* **Viewport Expansion:** Mini App ochilishi bilan `postEvent('web_app_expand')` orqali to'liq ekranga yoziladi.
* **ThemeParams Sync:** Telegram mavzusiga (Light/Dark mode va rang kodlariga) avtomatik moslashish.
* **HapticFeedback (Vibratsiya signalizatsiyasi):**
  * `impactOccurred('light' | 'medium' | 'heavy')` — Savatga mahsulot qo'shganda yoki miqdorini oshirganda tactile javob berish.
  * `notificationOccurred('success' | 'error')` — Buyurtma muvaffaqiyatli tasdiqlanganda vibratsiya.
* **MainButton (Asosiy pastki tugma):** Buyurtma berish sahifasida Telegram'ning native pastki yashil tugmasidan foydalanish (`MainButton.setText('Buyurtma berish')`).
* **BackButton (Orqaga tugmasi):** Ichki sahifalarga kirganda Telegram ilovasining yuqori chap burchagidagi orqaga tugmasini avtomatik ko'rsatish va bosh sahifada yashirish.
* **CloudStorage:** Foydalanuvchi tanlagan til (Uz/Ru/En) va mavzuni `Telegram.WebApp.CloudStorage` orqali foydalanuvchi Telegram akkauntida saqlash.

---

## 2. Local Development & Web Fallback Wrapper (`TelegramProvider.tsx`)

Mini App Telegram ichidan tashqarida (masalan `http://localhost:3000` yoki oddiy veb-brauzerda) ochilganda hech qanday runtime error bermasligi va ishlab turishi uchun xavfsiz `TelegramProvider` va `useTelegram` hooki yaratilgan:

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  webApp: any;
  user: TelegramUser | null;
  isReady: boolean;
  haptic: {
    impact: (style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notification: (type?: 'error' | 'success' | 'warning') => void;
    selection: () => void;
  };
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      useThemeStore.getState().initializeTheme();

      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        if (typeof tg.ready === 'function') tg.ready();
        if (typeof tg.expand === 'function') tg.expand();
        if (typeof tg.enableClosingConfirmation === 'function') tg.enableClosingConfirmation();

        setWebApp(tg);
        setUser(tg.initDataUnsafe?.user || {
          id: 7890123,
          first_name: 'Alisher',
          last_name: 'Zokirov',
          username: 'alisher_z',
          language_code: 'uz',
        });
      } else {
        // Web Brauzer Fallback
        setUser({
          id: 7890123,
          first_name: 'Alisher',
          last_name: 'Zokirov',
          username: 'alisher_z',
          language_code: 'uz',
        });
      }
    } catch (e) {
      console.error('TelegramProvider setup error:', e);
    } finally {
      setIsReady(true);
    }
  }, []);

  const haptic = {
    impact: (style = 'light') => {
      try { webApp?.HapticFeedback?.impactOccurred(style); } catch (e) {}
    },
    notification: (type = 'success') => {
      try { webApp?.HapticFeedback?.notificationOccurred(type); } catch (e) {}
    },
    selection: () => {
      try { webApp?.HapticFeedback?.selectionChanged(); } catch (e) {}
    },
  };

  return (
    <TelegramContext.Provider value={{ webApp, user, isReady, haptic }}>
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext);
```

---

## 3. Telegram Auth va HMAC `initData` Xavfsizlik Tekshiruvi

Telegram Mini App ochilganda `window.Telegram.WebApp.initData` matnini uzatadi. Server ushbu ma'lumotning haqiqiyligini tekshirmasdan turib foydalanuvchiga ruxsat bermasligi shart. Seans eskirishi (Replay Attack) himoyasi uchun `auth_date` maksimal **1-2 soat (3600-7200 soniya)** bilan cheklanadi.

### 🛡️ HMAC-SHA256 Tekshiruv Algoritmi (TypeScript):

```typescript
import crypto from 'crypto';

export function verifyTelegramInitData(initDataRaw: string, botToken: string): { isValid: boolean; user?: any } {
  const urlParams = new URLSearchParams(initDataRaw);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  // 1. Kalitlarni alfabit bo'yicha tartiblash va data-check-string tuzish
  const params: string[] = [];
  for (const [key, value] of urlParams.entries()) {
    params.push(`${key}=${value}`);
  }
  params.sort();
  const dataCheckString = params.join('\n');

  // 2. Secret Key yaratish: HMAC-SHA256("WebAppData", botToken)
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  // 3. Hisoblangan hash bilan Telegram hash'ini solishtirish
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash !== hash) {
    return { isValid: false };
  }

  // 4. auth_date vaqtini tekshirish (Replay Attack himoyasi - Max 2 soat / 7200 sec)
  const authDate = parseInt(urlParams.get('auth_date') || '0', 10);
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > 7200) {
    return { isValid: false };
  }

  const user = JSON.parse(urlParams.get('user') || '{}');
  return { isValid: true, user };
}
```

---

## 4. Telegram Contact Sharing (`requestContact`) va Web Fallback

Mijoz telefon raqamini qo'lda yozib o'tirmasligi uchun Telegram'dan 1-klikda avtomatik olinadi:
1. **Telegram Muhitida:** Checkout sahifasida "📱 Telegram raqamimni ulashish" tugmasi ko'rinadi.
2. Tugma bosilganda Telegram native `requestContact()` muloqot oynasi ochiladi.
3. Mijoz tasdiqlagach, verified telefon raqami avtomatik ravishda buyurtma formasiga tushadi va foydalanuvchi profiliga biriktiriladi.
4. **Desktop / Web Fallback:** Agar foydalanuvchi ilovani oddiy brauzerda ochgan bo'lsa yoki Telegram muloqotini rad etsa, avtomatik ravishda qo'lda telefon raqam kiritish inputi (`+998 (XX) XXX-XX-XX`) ochiladi. Hech qanday xatolik yuz bermaydi.

---

## 5. Deep Linking va Mahsulot Ulashish (Share Product)

Har bir mahsulot sahifasida "Do'stga yuborish" tugmasi bo'ladi.
* **Havola formati:** `t.me/my_shop_bot/app?startapp=prod_123`
* **Qat'iy Telegram Parametr Qoidalari:** Telegram rasmiy hujjatlariga ko'ra `startapp` parametri **faqat lotin harflari, raqamlar va pastki chiziqdan (`^[a-zA-Z0-9_]{1,64}$`)** va maksimal 64 belgi bo'lishi shart.
* **Ishlash mantiqi:** Xaridor havolani yuboradi -> Telegram Mini App ochiladi -> SDK `start_param = prod_123` ekanligini o'qiydi -> Mini App `#123` mahsulot sahifasini ochib beradi.

---

## 6. Telegram Bot API Xabarnomalari (Notification Lifecycles)

### 🔹 Admin Xabarnomasi (Yangi buyurtma va Geolokatsiya):
```text
🛍️ YANGI BUYURTMA #10045!

👤 Xaridor: Alisher Zokirov (@alisher)
📞 Telefon: +998 90 123 45 67
💵 Summa: 340 000 so'm
💳 To'lov: Click (PAID ✅)
📍 Manzil: Toshkent sh., Chilonzor 1-mavze
🗺️ Xarita: https://maps.google.com/?q=41.2995,69.2401
```

### 🔹 Mijoz Xabarnomasi (Buyurtma statusi o'zgarganda):
* **DELIVERING (Kuryerga berildi):**  
  `🚚 Buyurtmangiz #10045 kuryerga topshirildi! Tez orada yetkazib beriladi.`
* **COMPLETED (Topshirildi):**  
  `🎉 Buyurtmangiz #10045 muvaffaqiyatli topshirildi! Xaridingiz uchun rahmat.`
* **CANCELLED (Bekor qilindi):**  
  `❌ Buyurtmangiz #10045 bekor qilindi.`
