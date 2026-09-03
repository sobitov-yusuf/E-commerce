# Universal E-Commerce Platformasi (TMA & Web) — Telegram Bot va Mini App Integratsiya Hujjati

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatning Vazifasi va Chegaralari (Scope & Boundaries)

Ushbu hujjat platformaning **Telegram ekotizimi bilan integratsiyasi** — Mini App SDK, Bot API xabarnomalari, autentifikatsiya va xavfsizlik mexanizmlarini batafsil belgilaydi.

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. **`@telegram-apps/sdk` Native Integratsiyasi:** Viewport Expansion, HapticFeedback, BackButton va CloudStorage.
2. **TelegramProvider Arxitekturasi:** TMA va Web brauzer uchun yagona kontekst provayderi.
3. **Ikki Tomonlama Autentifikatsiya:** TMA `initData` HMAC-SHA256 va Web brauzer Telegram Login Widget.
4. **Telegram Contact Sharing:** 1-klikda tasdiqlangan telefon raqamini olish.
5. **Deep Linking (`startapp`):** Mahsulot va toifaga to'g'ridan-to'g'ri havola formatiga moslash.
6. **Bot API Xabarnomalari:** Admin va Xaridorga avtomatik 3 tildagi buyurtma xabarlari va elektron kvitansiya.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Biznes Talablari va Sahifalar:** [1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md) da yoritiladi.
2. **PostgreSQL / Prisma DB:** [2_Texnik_Arxitektura.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/2_Texnik_Arxitektura.md) da yoritiladi.
3. **UI Dizayn Tokenlari:** [4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md) da yoritiladi.
4. **Sprint Rejalari:** [5_Roadmap.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/5_Roadmap.md) da yoritiladi.

---

## 1. `@telegram-apps/sdk` Native Integratsiyasi

Telegram Mini App (TMA) foydalanuvchiga xuddi iOS/Android ilovasi kabi silliq tajriba berishi uchun `@telegram-apps/sdk` v2.x kutubxonasidan foydalaniladi.

### Asosiy Native Funksiyalar:

| Funksiya | Maqsadi | Qo'llanilishi |
|----------|---------|---------------|
| **Viewport Expansion** | Mini App ochilishi bilan to'liq ekranga yozish | `postEvent('web_app_expand')` |
| **ThemeParams Sync** | Telegram mavzusiga (Light/Dark) avtomatik moslashish | Rang kodlarini o'qish va qo'llash |
| **HapticFeedback** | Vibratsiya orqali tegishli (tactile) javob berish | Savatga qo'shish: `impact('light')`, Buyurtma: `notification('success')` |
| **BackButton** | Telegram yuqori chap orqaga tugmasini boshqarish | Ichki sahifalarda ko'rsatish, bosh sahifada yashirish |
| **ClosingConfirmation** | Xaridor tasodifan ilovani yopishining oldini olish | `enableClosingConfirmation()` |
| **CloudStorage** | Foydalanuvchi sozlamalarini Telegram bulutida saqlash | Til va mavzu tanlovini eslab qolish |

---

## 2. TelegramProvider — Yagona Kontekst Provayderi

`TelegramProvider` (`src/components/telegram/TelegramProvider.tsx`) — platformaning markaziy autentifikatsiya va Telegram SDK boshqaruvchisi. U **ikkala muhitda** (TMA va Web brauzer) xatosiz ishlaydi:

### Arxitektura Diagrammasi:

```
┌─────────────────────────────────────────────────────────┐
│                   TelegramProvider                       │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────────────┐   │
│  │ TMA muhitimi?     │    │ Web brauzer muhitimi?    │   │
│  │ (initData mavjud) │    │ (initData yo'q)          │   │
│  └────────┬─────────┘    └──────────┬───────────────┘   │
│           │                          │                    │
│           ▼                          ▼                    │
│  [initData HMAC tekshiruv]  [localStorage dan sessiya]   │
│  POST /api/auth             yoki TelegramLoginModal      │
│           │                          │                    │
│           ▼                          ▼                    │
│      ┌────────────────────────────────┐                  │
│      │  user, token, isAuthenticated  │                  │
│      │  isTelegramWebApp, haptic      │                  │
│      │  loginWithWeb(), logout()      │                  │
│      └────────────────────────────────┘                  │
│                                                          │
│  ──► React Context orqali barcha komponentlarga uzatiladi│
└─────────────────────────────────────────────────────────┘
```

### Kontekst Maydonlari:

| Maydon | Turi | Izoh |
|--------|------|------|
| `webApp` | any | Telegram WebApp SDK obyekti (brauzerda `null`) |
| `user` | TelegramUser ǀ null | Hozirgi foydalanuvchi ma'lumotlari |
| `isReady` | boolean | Provayder ishga tushganmi? |
| `isTelegramWebApp` | boolean | Telegram ichidan ochilganmi? |
| `isAuthenticated` | boolean | Foydalanuvchi tizimga kirganmi? |
| `token` | string ǀ null | JWT sessiya tokeni |
| `showAuthModal` | boolean | Web login modali ochiqmi? |
| `loginWithWeb()` | function | Web brauzerdan kirish |
| `logout()` | function | Tizimdan chiqish |
| `haptic` | object | `impact()`, `notification()`, `selection()` |

### Muhim Qoida — Sof 0-Holat:
Web brauzerda Telegram `initData` topilmasa va `localStorage` da saqlangan sessiya bo'lmasa, foydalanuvchi `null` holatida qoladi va `TelegramLoginModal` ko'rsatiladi. **Hech qanday soxta test foydalanuvchi avtomatik yaratilmaydi.**

---

## 3. Ikki Tomonlama Autentifikatsiya Tizimi

### 3.1. TMA Autentifikatsiya (Telegram Mini App Ichidan)

Xaridor Telegram ichidagi do'kon tugmasini bosganda:
1. Telegram `initData` matnini ilovaga uzatadi.
2. Ilova `POST /api/auth` ga `initData` ni yuboradi.
3. Server HMAC-SHA256 imzo tekshiruvi va `auth_date` yangiligini tekshiradi.
4. Muvaffaqiyatli bo'lsa, JWT token va foydalanuvchi ma'lumotlari qaytariladi.

**HMAC-SHA256 Algoritmi (`src/lib/telegram.ts`):**

```typescript
export function verifyTelegramInitData(
  initDataRaw: string,
  botToken: string,
  maxAgeSeconds: number = 7200 // Maksimal 2 soat
): TelegramAuthResult {
  const urlParams = new URLSearchParams(initDataRaw);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  // 1. Kalitlarni alfabit bo'yicha tartiblash
  const params: string[] = [];
  for (const [key, value] of urlParams.entries()) {
    params.push(`${key}=${value}`);
  }
  params.sort();
  const dataCheckString = params.join('\n');

  // 2. Secret Key: HMAC-SHA256("WebAppData", botToken)
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  // 3. Imzoni solishtirish
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash !== hash) return { isValid: false };

  // 4. auth_date tekshiruvi (Replay Attack himoyasi)
  const authDate = parseInt(urlParams.get('auth_date') || '0', 10);
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > maxAgeSeconds) return { isValid: false };

  const user = JSON.parse(urlParams.get('user') || '{}');
  return { isValid: true, user };
}
```

### 3.2. Web Brauzer Autentifikatsiya (Telegram Login Widget)

Kompyuter yoki telefon brauzeridan kirgan foydalanuvchi uchun:
1. Do'kon bosh sahifasida `[ ✈️ Telegram orqali kirish ]` tugmasi ko'rinadi.
2. Tugma bosilganda `TelegramLoginModal` (`src/components/auth/TelegramLoginModal.tsx`) ochiladi.
3. Foydalanuvchi Telegram botga o'tib, 1-klikda avtorizatsiya beradi.
4. Bot orqali qaytgan ma'lumotlar `POST /api/auth/web` ga yuboriladi.
5. Server `verifyTelegramWebAuth()` funksiyasi orqali SHA-256 imzoni tekshiradi.
6. Muvaffaqiyatli bo'lsa, JWT token beriladi va sessiya `localStorage` ga saqlanadi.

**Web Login HMAC Tekshiruvi:**

```typescript
export function verifyTelegramWebAuth(
  data: Record<string, any>,
  botToken: string,
  maxAgeSeconds: number = 86400 // 24 soat
): TelegramAuthResult {
  const { hash, ...rest } = data;
  const sortedKeys = Object.keys(rest).sort();
  const dataCheckString = sortedKeys.map((key) => `${key}=${rest[key]}`).join('\n');

  // Web login uchun: SHA256(botToken) secret key sifatida ishlatiladi
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash !== hash) return { isValid: false };

  // auth_date yangiligini tekshirish
  const authDate = parseInt(data.auth_date, 10);
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > maxAgeSeconds) return { isValid: false };

  return { isValid: true, user: { id: Number(data.id), ... } };
}
```

### 3.3. TMA va Web Autentifikatsiya Farqi

| Xususiyat | TMA (Telegram Ichida) | Web Brauzer |
|-----------|----------------------|-------------|
| **Imzo kaliti** | `HMAC-SHA256("WebAppData", botToken)` | `SHA256(botToken)` |
| **Sessiya muddati** | 2 soat (7200 sec) | 24 soat (86400 sec) |
| **Foydalanuvchi harakati** | Avtomatik (0 klik) | 1 klik (Telegram bot orqali) |
| **Token saqlash** | Xotirada (state) | `localStorage` (`web_tg_user`, `web_tg_token`) |
| **API endpoint** | `POST /api/auth` | `POST /api/auth/web` |

---

## 4. Telegram Contact Sharing (`requestContact`)

Xaridor telefon raqamini qo'lda yozib o'tirmasligi uchun Telegram dan 1-klikda tasdiqlangan raqam olinadi:

1. **Telegram muhitida:** Checkout sahifasida `[ 📱 Telegram raqamimni ulashish ]` tugmasi ko'rinadi.
2. Tugma bosilganda Telegram native `requestContact()` dialog oynasi ochiladi.
3. Xaridor tasdiqlagach, tasdiqlangan telefon raqami buyurtma formasiga tushadi va profilga saqlanadi.
4. **Web Brauzer / Rad Etish Fallback:** Agar foydalanuvchi brauzerda bo'lsa yoki Telegram dialogini rad etsa, avtomatik ravishda qo'lda telefon kiritish maydoni ochiladi (`+998 (XX) XXX-XX-XX`). Hech qanday xatolik yuz bermaydi.

---

## 5. Deep Linking va Mahsulot Ulashish

Har bir mahsulot sahifasida "Do'stga yuborish" tugmasi mavjud:

### Havola Formati:
```
t.me/{BOT_USERNAME}/app?startapp=prod_123
```

### Telegram Qoidalariga Mos Validatsiya:
Telegram rasmiy hujjatlariga ko'ra `startapp` parametri qat'iy qoida bo'yicha:
- Faqat **lotin harflari, raqamlar va pastki chiziq** (`^[a-zA-Z0-9_]{1,64}$`).
- Maksimal **64 belgi**.

### Qo'llab-Quvvatlanadigan Deep Link Turlari:

| Prefiks | Turi | Misol | Natija |
|---------|------|-------|--------|
| `prod_` | Mahsulot | `prod_123` | `/product/123` sahifasi ochiladi |
| `cat_` | Toifa | `cat_45` | `/catalog` sahifasi o'sha toifa bilan ochiladi |
| `ref_` | Tavsiya (Referral) | `ref_998` | Tavsiya egasini aniqlash |

### Ishlash Mantiqi:
```
Xaridor havolani Telegramga yuboradi
    → Do'st uni bosadi
    → Telegram Mini App ochiladi
    → SDK start_param = "prod_123" ekanligini o'qiydi
    → validateAndParseStartAppParam("prod_123") → type: "product", id: "123"
    → Ilova /product/123 sahifasini ochadi
```

---

## 6. Telegram Bot API Xabarnomalari

Bot orqali admin va xaridorga 3 xil avtomatik xabar yuboriladi:

### 6.1. Admin Xabarnomasi (Yangi Buyurtma)
Yangi buyurtma kelib tushganda admin guruh/kanalga xabar boradi:

```
🛒 YANGI BUYURTMA QABUL QILINDI!

📦 Raqami: #10045
👤 Mijoz: [Xaridor ismi]
📞 Tel: +998 90 123 45 67
💰 Summa: 340 000 UZS
```

### 6.2. Xaridor Xabarnomasi (Buyurtma Holati O'zgarishi)
Buyurtma holati yangilanganda xaridorning shaxsiy Telegramiga 3 tildan birida xabar boradi:

| Holat | UZ | RU | EN |
|-------|----|----|----|
| `NEW` | ⏳ Qabul qilindi | ⏳ Принят | ⏳ Accepted |
| `PROCESSING` | 📦 Tayyorlanmoqda | 📦 В обработке | 📦 Processing |
| `DELIVERING` | 🚴 Kuryer yo'lda | 🚴 Курьер в пути | 🚴 Out for delivery |
| `COMPLETED` | ✅ Muvaffaqiyatli yetkazildi | ✅ Доставлено | ✅ Delivered |
| `CANCELLED` | ❌ Bekor qilindi | ❌ Отменен | ❌ Cancelled |

### 6.3. Elektron To'lov Kvitansiyasi (Receipt)
To'lov muvaffaqiyatli bo'lganda xaridorga rasmiy elektron chek yuboriladi:

```
🧾 TO'LOV CHEKI (ELEKTRON KVITANSIYA)

✅ To'lov muvaffaqiyatli qabul qilindi!

📦 Buyurtma: #10045
💳 To'lov turi: Click
💰 Jami to'landi: 340 000 UZS

Xarid qilingan mahsulotlar:
1. [Mahsulot nomi] (2 x 120 000 UZS)
2. [Mahsulot nomi] (1 x 100 000 UZS)

Buyurtmangiz tayyorlanmoqda. Tez orada kuryer siz bilan bog'lanadi!
```

---

## 7. Telegram Mini App SDK Moslik Jadvali

Platforma quyidagi Telegram versiyalarida ishlaydi:

| Funksiya | Minimal Telegram Versiyasi |
|----------|---------------------------|
| Mini App ochish | Bot API 6.1+ |
| `initData` HMAC Auth | Bot API 6.1+ |
| HapticFeedback | Bot API 6.1+ |
| BackButton | Bot API 6.1+ |
| CloudStorage | Bot API 6.9+ |
| ClosingConfirmation | Bot API 6.2+ |
| requestContact | Bot API 6.9+ |
| Web Login Widget | Bot API 5.0+ |
