# Universal E-Commerce Platformasi (TMA & Web) — Texnik Arxitektura Hujjati

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatning Vazifasi va Chegaralari (Scope & Boundaries)

Ushbu hujjat platformaning **texnologik asosi, infratuzilmasi, ma'lumotlar bazasi sxemasi, xavfsizlik arxitekturasi va API marshrutlari**ni batafsil belgilaydi.

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. **Texnologik Stack:** Next.js, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Redis, Zustand.
2. **Ma'lumotlar Bazasi Sxemasi:** 18 ta jadval, ularning maydonlari va o'zaro bog'liqliklari.
3. **Ko'p Tillilik Arxitekturasi:** JSONB i18n va GIN indekslar orqali 0.01s jonli qidiruv.
4. **Xavfsizlik:** HMAC-SHA256 Telegram Auth, JWT + Redis Blacklist, Rate Limiting va Input Sanitization.
5. **Ombor Zaxirasi:** Redis Atomic Stock Lock — Highload sharoitda race condition himoyasi.
6. **Moliyaviy Audit:** O'zgarmas (Immutable) tranzaksiya jurnali.
7. **API Arxitekturasi:** Xaridor, Admin, To'lov Webhook va Cron marshrutlari.
8. **Frontend State Arxitekturasi:** 14 ta Zustand store va ularning vazifalari.
9. **DevOps:** Docker, CI/CD va joylashtirish (Deploy) sozlamalari.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Biznes Talablari va Sahifalar Tuzilishi:** [1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md) da yoritiladi.
2. **Telegram SDK va Bot API Kodlari:** [3_Telegram_Integratsiya.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/3_Telegram_Integratsiya.md) da yoritiladi.
3. **UI Dizayn Tokenlari va CSS:** [4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md) da yoritiladi.
4. **Ish Muddatlari va Sprint Rejalari:** [5_Roadmap.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/5_Roadmap.md) da yoritiladi.

---

## 1. Texnologik Stack va Infratuzilma

| Qatlam | Texnologiya | Versiya | Maqsadi |
|--------|-------------|---------|---------|
| **Framework** | Next.js (App Router) | 14.x | Server va klient tarafni yagona loyihada birlashtirish |
| **Til** | TypeScript | 5.x | Statik tiplash va xatolarni kompilyatsiya vaqtida ushlab qolish |
| **UI** | Tailwind CSS + Lucide Icons | 3.x | Tezkor va moslashuvchan dizayn |
| **State** | Zustand | 4.x | Yengil va tezkor klient holatini boshqarish |
| **ORM** | Prisma Client | 5.x | PostgreSQL bilan xavfsiz va qulay ishlash |
| **Ma'lumotlar Bazasi** | PostgreSQL (Supabase Hosted) | 15.x | JSONB i18n + GIN indekslar bilan kuchli relatsion baza |
| **Ulanish Havzasi** | PgBouncer (Supabase Pooler) | — | Serverless muhitda ulanishlar to'planishining oldini olish |
| **Kesh va Navbat** | Upstash Redis (HTTP) | — | Stock Lock, JWT Blacklist va Rate Limiter |
| **Auth** | jose (JWT) + HMAC-SHA256 | 5.x | Telegram foydalanuvchilarni xavfsiz autentifikatsiya |
| **To'lov** | Click API + Payme JSON-RPC 2.0 | — | O'zbekiston to'lov shlyuzlari integratsiyasi |
| **AI** | Google Gemini API | — | Mahsulot tavsiflarini avtomatik yozish va tarjima qilish |
| **Telegram SDK** | @telegram-apps/sdk | 2.x | Mini App native funksiyalari (Viewport, Haptic, BackButton) |
| **Joylashtirish** | Vercel (Serverless) yoki Docker (VPS) | — | Ikki xil deploy varianti |

---

## 2. Ma'lumotlar Bazasi Sxemasi (18 Model)

### 2.1. Enumlar (12 ta)

```
LanguageCode:     uz | ru | en
ProductBadge:     NEW | TOP | SALE | NONE
DiscountType:     PERCENT | FIXED
OrderStatus:      NEW | PROCESSING | DELIVERING | COMPLETED | CANCELLED | PARTIALLY_REFUNDED
PaymentType:      CLICK | PAYME | CASH
PaymentStatus:    PENDING | PAID | FAILED | REFUNDED | PARTIALLY_REFUNDED
DeliveryType:     COURIER | PICKUP
TransactionType:  PAYMENT | REFUND
PaymentProvider:  CLICK | PAYME | STARS | CASH
TransactionStatus: PENDING | SUCCESS | FAILED | CANCELLED
ReviewStatus:     PENDING | APPROVED | REJECTED
AdminRole:        SUPERADMIN | MANAGER
```

### 2.2. Jadvallar

#### 👤 1. Users — Telegram Xaridorlari
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | UUID (PK) | Unikal foydalanuvchi identifikatori |
| `telegram_id` | BigInt, Unique | Telegramdagi unikal ID |
| `first_name` | String | Ismi |
| `last_name` | String? | Familiyasi |
| `username` | String? | Telegram username |
| `phone` | String? | Telefon raqami |
| `language_code` | Enum (uz/ru/en), default: uz | Tanlangan til |
| `is_blocked` | Boolean, default: false | Bloklash holati |
| `created_at` | Timestamp | Ro'yxatdan o'tgan vaqt |

**Bog'liqliklar:** → CartItem[], Order[], UserPromocode[], Review[], Wishlist[], StockNotification[]

---

#### 📂 2. Categories — Toifalar
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `name` | JSONB | `{ uz: "...", ru: "...", en: "..." }` |
| `slug` | String, Unique | URL uchun nom |
| `image_url` | String? | Toifa rasmi |
| `is_active` | Boolean, default: true | Ko'rsatish holati |

**Indekslar:** GIN Index `idx_categories_name_gin` → 0.01s ko'p tilli qidiruv.

---

#### 🛍️ 3. Products — Mahsulotlar
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `category_id` | FK → Categories | Toifaga bog'liqlik |
| `name` | JSONB | 3 tildagi nom |
| `description` | JSONB | 3 tildagi tavsif |
| `base_price` | Decimal(12,2) | Asosiy narx |
| `old_price` | Decimal(12,2)? | Eski narx (chegirma uchun) |
| `badge` | Enum (NEW/TOP/SALE/NONE) | Nishon stikeri |
| `images` | String[] | Rasmlar ro'yxati |
| `is_active` | Boolean, default: true | Faollik holati |
| `created_at` | Timestamp | — |

**Indekslar:** GIN Trigram Index (`name`, `description`) → ko'p tilli jonli qidiruv 0.01s.

---

#### 🧬 4. ProductVariants — Variantlar (O'lcham, Rang, SKU)
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `product_id` | FK → Products | Mahsulotga bog'liqlik |
| `size` | String? | O'lcham: "S", "M", "L", "42" |
| `color` | String? | Rang: "Qora", "Oq" |
| `price` | Decimal(12,2)? | Variantning alohida narxi |
| `image_url` | String? | Variant uchun alohida rasm |
| `stock_count` | Integer, default: 0 | Ombordagi qoldiq soni |
| `sku` | String?, Unique | Shtrix-kod / SKU identifikatori |

---

#### 🖼️ 5. Banners — Bosh Sahifa Bannerlari
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `title` | JSONB | 3 tildagi banner sarlavhasi |
| `image_url` | String | Banner rasmi |
| `link_product_id` | FK → Products? | Bosilganda ochiladigan mahsulot |
| `is_active` | Boolean, default: true | Faollik |
| `sort_order` | Integer, default: 0 | Tartiblash raqami |

---

#### 🛒 6. CartItems — Savat
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `user_id` | FK → Users (UUID) | Xaridor |
| `product_id` | FK → Products | Mahsulot |
| `variant_id` | FK → ProductVariants? | Tanlangan variant |
| `quantity` | Integer | Soni |
| `updated_at` | Timestamp (auto) | Oxirgi yangilanish |

---

#### 🎟️ 7. Promocodes — Promokodlar
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `code` | String, Unique | Promokod matni |
| `discount_type` | Enum (PERCENT/FIXED) | Chegirma turi |
| `discount_value` | Decimal(12,2) | Chegirma qiymati |
| `min_order_amount` | Decimal(12,2)? | Minimal buyurtma summasi |
| `max_uses` | Integer? | Maksimal ishlatish soni |
| `used_count` | Integer, default: 0 | Hozirgi ishlatilgan son |
| `expires_at` | Timestamp? | Muddati |
| `is_active` | Boolean, default: true | Faollik |

---

#### 👥 8. UserPromocodes — Takroriy Ishlatish Nazorati
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `user_id` | FK → Users (UUID) | Foydalanuvchi |
| `promocode_id` | FK → Promocodes | Promokod |
| `used_at` | Timestamp | Ishlatilgan vaqt |

**Cheklov:** Unique Index `[user_id, promocode_id]` — Bitta xaridor bitta promokodni faqat 1 marta ishlata oladi.

---

#### 📦 9. Orders — Buyurtmalar
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `order_number` | String, Unique | `#10001` formatida |
| `user_id` | FK → Users (UUID) | Xaridor |
| `promocode_id` | FK → Promocodes? | Qo'llangan promokod |
| `branch_id` | FK → Branches? | Topshirish punkti |
| `status` | Enum (OrderStatus) | Buyurtma holati |
| `payment_type` | Enum (PaymentType) | To'lov usuli |
| `payment_status` | Enum (PaymentStatus) | To'lov holati |
| `subtotal_price` | Decimal(12,2) | Mahsulotlar narxi |
| `discount_price` | Decimal(12,2), default: 0 | Chegirma summasi |
| `delivery_price` | Decimal(12,2), default: 0 | Yetkazish narxi |
| `total_price` | Decimal(12,2) | Jami summa |
| `customer_name` | String | Xaridor ismi |
| `customer_phone` | String | Xaridor telefoni |
| `delivery_type` | Enum (COURIER/PICKUP) | Yetkazish turi |
| `address` | Text? | Yetkazish manzili |
| `latitude` | Decimal(10,8)? | Geolokatsiya kengligi |
| `longitude` | Decimal(11,8)? | Geolokatsiya uzunligi |
| `comment` | Text? | Xaridor izohi |
| `created_at` | Timestamp | Yaratilgan vaqt |

---

#### 💳 10. Transactions — Moliyaviy Audit Jurnali (Immutable Ledger)
Har bir to'lov va pul qaytarish (refund) harakati **alohida o'zgarmas qator** sifatida yoziladi:

| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `order_id` | FK → Orders | Buyurtmaga bog'liqlik |
| `parent_id` | FK → Transactions? | Refund bo'lsa, asosiy to'lov tranzaksiyasiga havola |
| `transaction_type` | Enum (PAYMENT/REFUND) | Tranzaksiya turi |
| `provider` | Enum (CLICK/PAYME/STARS/CASH) | To'lov provayderi |
| `transaction_id` | String | Tashqi tizim taqdim etgan unikal ID |
| `amount` | Decimal(12,2) | Summa |
| `status` | Enum (TransactionStatus) | Tranzaksiya holati |
| `reason` | String? | Bekor qilish sababi |
| `perform_time` | Timestamp? | Bajarilgan vaqt |
| `created_at` | Timestamp | Yozilgan vaqt |

---

#### 📋 11. OrderItems — Buyurtma Tarkibi
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `order_id` | FK → Orders | Buyurtma |
| `product_id` | FK → Products | Mahsulot |
| `variant_id` | FK → ProductVariants? | Variant |
| `quantity` | Integer | Soni |
| `price` | Decimal(12,2) | Xarid vaqtidagi narx (snapshot) |
| `selected_size` | String? | Tanlangan o'lcham |
| `selected_color` | String? | Tanlangan rang |

---

#### ⭐ 12. Reviews — Xaridor Sharhlari
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `user_id` | FK → Users (UUID) | Sharh muallifi |
| `product_id` | FK → Products | Mahsulot |
| `rating` | Integer (1-5) | Yulduzli baho |
| `comment` | Text? | Sharh matni |
| `images` | String[] | Rasmlar (max 4 ta) |
| `status` | Enum (PENDING/APPROVED/REJECTED) | Moderatsiya holati |
| `created_at` | Timestamp | — |

---

#### 💖 13. Wishlists — Sevimlilar
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `user_id` | FK → Users (UUID) | Xaridor |
| `product_id` | FK → Products | Mahsulot |
| `created_at` | Timestamp | — |

**Cheklov:** Unique Index `[user_id, product_id]` — Bitta mahsulot faqat 1 marta saqlanadi.

---

#### 📍 14. Branches — Topshirish Punktlari (Samovivoz)
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `name` | JSONB | 3 tildagi nom |
| `address` | JSONB | 3 tildagi manzil |
| `phone` | String? | Aloqa telefoni |
| `lat` | Decimal(10,8)? | Kenglik koordinatasi |
| `lng` | Decimal(11,8)? | Uzunlik koordinatasi |
| `is_active` | Boolean, default: true | Faollik |

---

#### 📦 15. StockNotifications — Mahsulot Qaytib Kelganda Xabar
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `user_id` | FK → Users (UUID) | Xaridor |
| `product_id` | FK → Products | Mahsulot |
| `variant_id` | FK → ProductVariants? | Variant |
| `is_notified` | Boolean, default: false | Xabar yuborilganmi? |
| `created_at` | Timestamp | — |

---

#### ⚙️ 16. StoreSettings — Do'kon Sozlamalari (White-Label)
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `store_name` | JSONB | 3 tildagi do'kon nomi |
| `logo_url` | String? | Do'kon logotipi |
| `currency` | String, default: "UZS" | Valyuta |
| `delivery_fee` | Decimal(12,2), default: 0 | Yetkazish narxi |
| `free_delivery_threshold` | Decimal(12,2)? | Bepul yetkazish chegarasi |
| `phone_number` | String? | Asosiy telefon |
| `terms_url` | JSONB? | Foydalanish shartlari havolasi |
| `is_active` | Boolean, default: true | Do'kon faolmi? |

> **Eslatma:** Telegram bot tokeni va to'lov kalitlari xavfsizlik sababli bazada emas, `.env` muhit o'zgaruvchilarida saqlanadi.

---

#### 👑 17. Admins — Boshqaruv Xodimlari
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `telegram_id` | BigInt, Unique | Xodimning Telegram ID si |
| `name` | String | Xodim ismi |
| `role` | Enum (SUPERADMIN/MANAGER) | Lavozim roli |
| `is_active` | Boolean, default: true | Faollik |

**Frontend RBAC Kengaytmasi:** Zustand `useStaffStore` da qo'shimcha rollar (`OPERATOR`, `COURIER`) bilan boshqariladi va `ROLE_PERMISSIONS` matritsasi orqali huquqlar aniqlanadi.

---

#### 📜 18. AdminLogs — Xodimlar Harakatlari Jurnali (Audit)
| Ustun | Turi | Izoh |
|-------|------|------|
| `id` | Serial (PK) | — |
| `admin_id` | FK → Admins | Kim bajardi |
| `action` | String | Harakat nomi: `UPDATE_PRODUCT`, `REFUND_ORDER` |
| `details` | JSONB? | Qo'shimcha tafsilotlar |
| `created_at` | Timestamp | Vaqt |

---

## 3. Ko'p Tillilik Arxitekturasi (i18n Architecture)

Platforma 3 tilda (`UZ`, `RU`, `EN`) to'liq ishlaydi. Arxitektura ikki qatlamdan iborat:

### 3.1. Ma'lumotlar Bazasi Qatlami (JSONB)
Toifalar, mahsulotlar, bannerlar va filiallar nomlari JSONB formatida saqlanadi:
```json
{ "uz": "Erkaklar kiyimi", "ru": "Мужская одежда", "en": "Men's Clothing" }
```

### 3.2. Frontend Qatlami (Zustand + Lug'at)
- **`useLanguageStore`:** Tanlangan til (`uz` | `ru` | `en`) va `t(key)` tarjima funksiyasi.
- **`src/locales/translations.ts`:** ~280 ta tarjima kaliti (tugmalar, xabarlar, dialoglar va h.k.).
- **Xavfsiz O'qish:** `product.name?.[lang] || product.name?.['uz'] || product.name` — til topilmasa uzbekchaga qaytish.
- **Sinxronizatsiya:** `localStorage('app_lang')` + `window.dispatchEvent('languageChange')` — barcha komponentlar bir lahzalik yangilanadi.

### 3.3. GIN Indekslar va Jonli Qidiruv
PostgreSQL `pg_trgm` (trigram) kengaytmasi va GIN indekslari orqali JSONB maydonlaridan **0.01 soniyada** ko'p tilli jonli qidiruv amalga oshiriladi:
```sql
CREATE INDEX idx_products_name_gin ON products USING GIN (name gin_trgm_ops);
CREATE INDEX idx_products_desc_gin ON products USING GIN (description gin_trgm_ops);
CREATE INDEX idx_categories_name_gin ON categories USING GIN (name gin_trgm_ops);
```

---

## 4. Xavfsizlik Arxitekturasi (Security Architecture)

### 4.1. Telegram HMAC-SHA256 Autentifikatsiya
Mini App ochilganda `initData` matnining haqiqiyligi 2 bosqichda tekshiriladi:
1. **Imzo Tekshiruvi:** `HMAC-SHA256(data_check_string, secret_key)` — imzo Telegram serveridagi hash bilan solishtiriladi.
2. **Vaqt Tekshiruvi (Replay Attack Himoyasi):** `auth_date` joriy vaqtdan **maksimal 2 soat (7200 soniya)** ichida bo'lishi shart. Eskirgan token rad etiladi.

### 4.2. JWT + Redis Blacklist (Instant Session Revocation)
- Admin tizimga kirganda JWT token beriladi (jose kutubxonasi).
- Admin bloklanganda yoki bo'shatilganda, tokenning `jti` identifikatori darhol **Redis Blacklist**-ga yoziladi.
- **Middleware** har bir API so'rovida tokenni Redis Blacklist dan tekshiradi:
  - Agar token Blacklist da bo'lsa → `401 Unauthorized` qaytariladi va seans to'xtatiladi.
  - Natija: token brauzerda saqlanib qolgan bo'lsa ham, bloklangan xodim tizimga kira olmaydi.

### 4.3. API Rate Limiter
Upstash Redis + `@upstash/ratelimit` (Sliding Window algoritmi):
- Cheklov: **20 ta so'rov / 10 soniya** (har bir IP manzilga).
- Oshib ketganda: `429 Too Many Requests` qaytariladi.
- Maqsad: Spam, brute-force va DDoS hujumlaridan himoya.

### 4.4. Input Sanitization (Kirishni Tozalash)
`src/lib/sanitize.ts` moduli orqali:
- **HTML/XSS Tozalash:** `<script>`, `onclick` va boshqa zararli teglar bloklanadi.
- **Telefon Validatsiyasi:** Faqat `+998XXXXXXXXX` formatidagi 12 belgili raqam qabul qilinadi.
- **Ism Sanitizatsiyasi:** Faqat lotin, kirill harflari, bo'shliq va tutuq belgisi (`'`) ruxsat etiladi.

---

## 5. Ombor Zaxirasi — Redis Atomic Stock Lock

Bir nechta xaridor bir vaqtda oxirgi mahsulotni sotib olishga uringanda race condition yuz bermasligi uchun Redis atomik operatsiyalari qo'llaniladi:

```
[Xaridor Checkout So'rovi]
       │
       ▼
Redis INCRBY reserved_stock:{variant_id} ──► (O(1) tezlikda zaxiraga olinadi)
       │
       ├─► (Zaxira ombor qoldig'idan oshib ketsa) → DECRBY + 400 "Mahsulot tugagan"
       └─► (Muvaffaqiyatli bo'lsa) → 15 daqiqaga lock qilinadi → Buyurtma yaratiladi
```

- **Texnologiya:** Upstash Redis `INCRBY` / `DECRBY` — O(1) vaqt murakkabligi.
- **Lock Muddati:** 15 daqiqa. Xaridor to'lamasa, zaxira avtomatik qaytariladi.
- **Cron Tozalagich:** `/api/cron/abandoned-carts` — eskirgan zaxiralarni muntazam tozalash.

---

## 6. Moliyaviy Audit — Immutable Transaction Ledger

To'lov va pul qaytarish (refund) jarayonlari o'zgarmas qatorlar sifatida yoziladi:

- **To'lov:** `transaction_type: PAYMENT`, `status: SUCCESS` → moliyaviy daromad qayd etiladi.
- **Pul Qaytarish:** Yangi qator `transaction_type: REFUND`, `parent_id` → asl to'lovga havola qilinadi.
- **Natija:** Hech qanday yozuv o'chirilmaydi yoki o'zgartirilmaydi — to'liq moliyaviy iz qoldiriladi.

---

## 7. Frontend State Arxitekturasi (14 ta Zustand Store)

| # | Store | Persist Kaliti | Vazifasi |
|---|-------|---------------|----------|
| 1 | `useCartStore` | `tma_shopping_cart` | Savat: tovarlar, promokod, narx hisoblash |
| 2 | `useWishlistStore` | `tma_user_wishlist` | Sevimlilar ro'yxati |
| 3 | `useLanguageStore` | `app_lang` | Faol til va `t(key)` tarjima funksiyasi |
| 4 | `useThemeStore` | `app_theme` | Light/Dark rejim |
| 5 | `useNotificationStore` | `store-notifications-storage` | Xaridor bildirishnomalar markazi |
| 6 | `useOrderStore` | `tma_real_orders_v3` + API | Buyurtmalar lifecycle, stock deduct/restore |
| 7 | `useProductStore` | API sync | Mahsulotlar katalogi va ombor qoldiqlari |
| 8 | `useCategoryStore` | API sync | Toifalar boshqaruvi |
| 9 | `useBannerStore` | API sync | Banner slayder boshqaruvi |
| 10 | `useReviewStore` | `tma_real_reviews_v3` | Sharhlar moderatsiyasi |
| 11 | `useCustomerStore` | `tma_real_customers_v3` | CRM xaridorlar bazasi |
| 12 | `useStaffStore` | `tma_real_staff_v3` | RBAC xodimlar va rollar |
| 13 | `useSettingsStore` | `store-settings-storage` | Do'kon sozlamalari (White-Label) |
| 14 | `useAuditStore` | `tma_real_audit_v3` | Xavfsizlik audit jurnali |

### Buyurtma Lifecycle Diagrammasi

```
                        ┌────────────────────────┐
                        │   Yangi Buyurtma (NEW)  │
                        └───────────┬────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
 [Ombor Avtomatik Kamayadi]  [Kuryer Tayinlanadi]     [Bekor Qilinadi]
  deductStock(items)          → DELIVERING holatiga     restoreStock(items)
                               avtomatik o'tadi         → Ombor qaytariladi
         │                          │                          │
         ▼                          ▼                          ▼
 [COMPLETED bo'lganda]       [Yetkazib Berildi]       [PAID → REFUNDED]
  CASH + PENDING bo'lsa:      → COMPLETED               To'lov qaytariladi
  To'lov → PAID avtomatik
```

---

## 8. API Marshrutlari (Routes Architecture)

### 8.1. Xaridor API'lari (Public)
| Metod | Marshut | Vazifasi |
|-------|---------|----------|
| `GET` | `/api/products` | Toifa va qidiruv bo'yicha mahsulotlar (GIN index) |
| `GET` | `/api/products/[id]` | Bitta mahsulot tafsilotlari va sharhlari |
| `POST` | `/api/products/[id]` | Tasdiqlangan xaridor sharhi qo'shish |
| `POST` | `/api/orders/checkout` | Redis Stock Lock bilan buyurtma yaratish |
| `POST` | `/api/orders/confirm-payment` | To'lovni tasdiqlash |
| `POST` | `/api/promocodes/validate` | Promokodni tekshirish |
| `POST` | `/api/auth` | Telegram Mini App initData HMAC tekshiruvi |
| `POST` | `/api/auth/web` | Veb-brauzer Telegram Login Widget tekshiruvi |

### 8.2. Admin API'lari (JWT + Redis Blacklist Himoyasida)
| Metod | Marshut | Vazifasi |
|-------|---------|----------|
| `GET/POST/DELETE` | `/api/admin/products` | Mahsulotlar CRUD |
| `GET/PUT/DELETE` | `/api/admin/orders` | Buyurtmalar boshqaruvi |
| `GET/PUT/DELETE` | `/api/admin/reviews` | Sharhlar moderatsiyasi |
| `GET/POST/DELETE` | `/api/admin/categories` | Toifalar boshqaruvi |
| `GET/POST/DELETE` | `/api/admin/banners` | Bannerlar boshqaruvi |
| `POST` | `/api/admin/broadcast` | Ommaviy Telegram xabarnoma |
| `POST` | `/api/admin/translate` | Gemini AI tarjima |
| `POST` | `/api/admin/upload` | Rasm yuklash |

### 8.3. To'lov Webhook'lari
| Metod | Marshut | Vazifasi |
|-------|---------|----------|
| `POST` | `/api/webhooks/click` | Click API: Prepare + Complete (MD5 imzo tekshiruvi) |
| `POST` | `/api/webhooks/payme` | Payme JSON-RPC 2.0: Check, Create, Perform, Cancel |

### 8.4. Cron va Ishchilar
| Metod | Marshut | Vazifasi |
|-------|---------|----------|
| `GET` | `/api/cron/abandoned-carts` | Eskirgan savat va zaxiralarni tozalash |

---

## 9. Yordamchi Modullar (src/lib/)

| Modul | Vazifasi |
|-------|----------|
| `prisma.ts` | PrismaClient singleton — Serverless muhitda ulanish havzasini boshqarish |
| `redis.ts` | Upstash Redis: `stockLockManager` (zaxira) + `jwtBlacklistManager` (seans bekor qilish) |
| `telegram.ts` | HMAC-SHA256 imzo tekshiruvi, deep-link validatsiyasi, Telegram Web Login tekshiruvi |
| `botNotifications.ts` | Telegram Bot API orqali admin va xaridorga xabar yuborish |
| `sanitize.ts` | XSS himoya, telefon va ism sanitizatsiyasi |
| `apiResponse.ts` | Standartlashtirilgan API javob formati (BigInt serialization bilan) |
| `audio.ts` | Web Audio API: yangi buyurtma kelib tushganda ovozli signal |

---

## 10. DevOps va Joylashtirish (Deployment)

### 10.1. Muhit O'zgaruvchilari (.env)
```
DATABASE_URL              — PostgreSQL/Supabase ulanish havolasi
TELEGRAM_BOT_TOKEN        — BotFather dan olingan bot tokeni
TELEGRAM_BOT_USERNAME     — Bot username
TELEGRAM_ADMIN_CHAT_ID    — Admin guruh yoki kanal ID si
JWT_SECRET                — JWT imzolash kaliti (32+ belgi)
UPSTASH_REDIS_REST_URL    — Redis server manzili
UPSTASH_REDIS_REST_TOKEN  — Redis autentifikatsiya tokeni
NEXT_PUBLIC_APP_URL       — Sayt manzili
CLICK_MERCHANT_ID/SERVICE_ID/SECRET_KEY — Click sozlamalari
PAYME_MERCHANT_ID/SECRET_KEY — Payme sozlamalari
GEMINI_API_KEY            — Google Gemini AI kaliti
```

### 10.2. Joylashtirish Variantlari

**Variant A — Vercel (Serverless):**
- Next.js avtomatik serverless deploy.
- Supabase PostgreSQL + PgBouncer Pooler.
- Upstash Redis (HTTP protokoli).
- GitHub Push → Vercel avtomatik deploy.

**Variant B — Docker (VPS):**
- Multi-stage Alpine Dockerfile.
- Docker Compose: Next.js + PostgreSQL 15 + Redis konteynerlar.
- `entrypoint.sh`: Prisma migratsiyalar va server ishga tushurish.

### 10.3. CI/CD Pipeline (GitHub Actions)
```
npm run lint → tsc --noEmit → npx prisma validate → Deploy
```
