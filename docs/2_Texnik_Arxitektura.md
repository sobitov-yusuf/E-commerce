# Universal Telegram Mini App (TMA) E-Commerce — Arxitektura va Texnik Hujjat

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatda Nimalar Turadi va Nimalar Turmaydi? (Scope & Boundaries)

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. **Texnologik Stack & Infratuzilma:** Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, PgBouncer va Upstash Redis sozlamalari.
2. **Ma'lumotlar Bazasi Sxemasi (Schema):** Prisma ORM va PostgreSQL dagi barcha 18 ta jadvallar va ularning maydonlari.
3. **PostgreSQL GIN Indexing:** Trigram GIN indeksi yordamida ko'p tilli 0.01s live-search.
4. **Highload Redis Stock Lock:** Savat checkoutida O(1) tezlikda ombor zaxirasini atomik band qilish algoritmi.
5. **Security & JWT Blacklist Revocation:** Token bekor qilish va seansni zudlik bilan to'xtatish infratuzilmasi.
6. **Immutable Financial Ledger:** Pul qaytarilganda (refund) audit jurnali yozilishi texnik mantiqi.
7. **API Router & Webhooks Architecture:** Client, Admin, Payment Webhook va Cron API marshrutlari.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Biznes PRD Talablari:** Loyiha maqsadi va foydalanuvchi talablari **[1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md)** da turadi.
2. **Telegram SDK Native Tugmalari:** MainButton va HapticFeedback kodlari **[3_Telegram_Integratsiya.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/3_Telegram_Integratsiya.md)** da turadi.
3. **UI Rang Tokenlari:** Visual CSS va dizayn spetsifikatsiyalari **[4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md)** da turadi.
4. **Sprint Vaqtlari va Muddatlar:** Topshiriqlar ro'yxati va holati **[5_Roadmap.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/5_Roadmap.md)** da turadi.

---

## 1. Texnologik Stack va Infratuzilma (Tech Stack & Architecture)

Loyihaning global standartlarga mos, tezkor, Highload (yuqori yuklama) va Serverless muhitlarga 100% moslashuvchan bo‘lishi uchun quyidagi stack tanlangan:

* **Frontend / Framework:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Shadcn UI.
* **Multi-Language (i18n) Arxitekturasi:**
  * **Zustand State (`src/store/useLanguageStore.ts`):** `lang: 'uz' | 'ru' | 'en'`, `setLang`, `t(key)` yordamchi tarjima funksiyasi.
  * **Lug'at (`src/locales/translations.ts`):** Barcha UI matnlari, buyurtma, savat, sevimlilar va bildirishnomalar lug'ati.
  * **Mahsulotlar JSONB:** DB da `name` va `description` JSONB ko'rinishida saqlanadi (`{ "uz": "...", "ru": "...", "en": "..." }`).
  * **Xavfsiz O'qish Sintaksisi (Frontend Guard):** Barcha kartochka va modallarda xatoliksiz `product.name?.[lang] || product.name?.['uz'] || product.name` shaklida render qilinadi.
  * **Sinxronizatsiya:** `localStorage.getItem('app_lang')` va `window.dispatchEvent(new Event('languageChange'))` orqali butun ilova bo'ylab bir lahzalik reaktiv sinxronizatsiya.
* **Telegram UI SDK & Web Fallback:** `@telegram-apps/sdk` + xavfsiz `TelegramProvider` (Telegram ichida native Viewport, HapticFeedback va MainButton; oddiy veb-brauzerda esa mock `Alisher Zokirov` seansi va xavfsiz `try/catch` haptic wrapperi).
* **Backend:** Next.js API Routes (Serverless / Node.js asosidagi tezkor API'lar).
* **Ma'lumotlar Bazasi (Database):** PostgreSQL 15 (Relational Database + JSONB i18n support + **GIN Generalized Inverted Indexing**).
* **Database Connection Pooling:** PgBouncer yoki Prisma Accelerate (Serverless muhitda DB ulanishlar to'lib qolishining oldini olish uchun).
* **ORM (Database Client):** Prisma ORM (TypeScript bilan xavfsiz va qulay ishlash uchun).
* **State Management:** Zustand (`useThemeStore` — Dark/Light Mode, `useCartStore` — Savat va miqdor stepperi, `useWishlistStore`, `useLanguageStore`, `useNotificationStore`).
* **Infratuzilma va Navbat Tizimi (Queue Architecture):**
  * **Option A (Vercel / Serverless Deployment):** **Upstash QStash** yoki **Inngest** (Serverless muhitda Long-running worker jarayoni talab qilinmaydigan HTTP/Event-driven navbat va cron tizimi).
  * **Option B (Docker / VPS Deployment):** **BullMQ + Redis Workers** (DigitalOcean / Hetzner kabi doimiy ishlovchi Docker VPS konteynerida Node.js background processlar).
* **Redis Highload Stock Locking:** Redis **Atomic INCRBY / DECRBY** (O(1) tezlikda ombor zaxirasini zudlik bilan band qilish va chiqarish `reserved_stock:{variant_id}`).
* **Security & Auth:** Telegram HMAC-SHA256 Verification + JWT **Redis JWT Blacklist List** (Foydalanuvchi yoki admin ishdan bo'shatilganda seansni zudlik bilan bekor qilish).
* **Rate Limiter Middleware:** Upstash Redis + `@upstash/ratelimit` (API endpointlarini spam va DDOS'dan himoya qilish uchun - 20 req/10s).
* **CI/CD Pipeline:** GitHub Actions CI/CD (Prisma migration validation, ESLint va avtomatik deploy).

---

## 2. Ma'lumotlar Bazasi Jadvallari va Bog‘liqliklari (Database Schema - 18 Models)

### 👤 1. Users (Telegram Xaridorlari)
* `id` (UUID / PK)
* `telegram_id` (BigInt, Unique) — Telegramdagi unikal ID
* `first_name` (String) — Ismi
* `last_name` (String, Nullable) — Familiyasi
* `username` (String, Nullable) — Telegram username
* `phone` (String, Nullable) — Telefon raqami
* `language_code` (Enum: `uz`, `ru`, `en`, default: `uz`)
* `is_blocked` (Boolean, default: `false`) — Spam va fraud foydalanuvchilarni bloklash
* `created_at` (Timestamp)

### 📂 2. Categories (Kategoriyalar - Multilingual JSONB)
* `id` (Serial / PK)
* `name` (JSONB) — `{ uz: "Kiyim", ru: "Одежда", en: "Clothing" }`
* `slug` (String, Unique) — URL uchun nom
* `image_url` (String, Nullable)
* `is_active` (Boolean, default: `true`)
* **Indexes:** GIN Index `idx_categories_name_gin` (`USING GIN (name)`)

### 🛍️ 3. Products (Mahsulotlar - Multilingual JSONB & GIN Search)
* `id` (Serial / PK)
* `category_id` (FK -> Categories.id)
* `name` (JSONB) — `{ uz: "Futbolka", ru: "Футболка", en: "T-Shirt" }`
* `description` (JSONB) — `{ uz: "...", ru: "...", en: "..." }`
* `base_price` (Decimal)
* `old_price` (Decimal, Nullable)
* `badge` (Enum: `NEW`, `TOP`, `SALE`, `NONE`, default: `NONE`)
* `images` (Text[])
* `is_active` (Boolean, default: `true`)
* `created_at` (Timestamp)
* **Indexes:** GIN Trigram Index (`USING GIN (name, description)`) — 0.01s live-search.

### 🧬 4. ProductVariants (Mahsulot Variantlari va Ombor Qoldig'i - SKU)
* `id` (Serial / PK)
* `product_id` (FK -> Products.id)
* `size` (String, Nullable) — "S", "M", "L", "42"
* `color` (String, Nullable) — "Qora", "Oq"
* `price` (Decimal, Nullable)
* `image_url` (String, Nullable)
* `stock_count` (Integer, default: 0) — Variant ombor qoldig'i
* `sku` (String, Nullable, Unique) — Barcode/SKU kodi

### 🖼️ 5. Banners (Bosh Sahifa Bannerlari)
* `id` (Serial / PK)
* `title` (JSONB) — Banner sarlavhasi
* `image_url` (String)
* `link_product_id` (FK -> Products.id, Nullable)
* `is_active` (Boolean, default: `true`)
* `sort_order` (Integer, default: 0)

### 🛒 6. CartItems (Savat Elementlari)
* `id` (Serial / PK)
* `user_id` (FK -> Users.id)
* `product_id` (FK -> Products.id)
* `variant_id` (FK -> ProductVariants.id, Nullable)
* `quantity` (Integer)
* `updated_at` (Timestamp)

### 🎟️ 7. Promocodes (Promokodlar)
* `id` (Serial / PK)
* `code` (String, Unique) — `SUMMER20`
* `discount_type` (Enum: `PERCENT`, `FIXED`)
* `discount_value` (Decimal)
* `min_order_amount` (Decimal, Nullable)
* `max_uses` (Integer, Nullable)
* `used_count` (Integer, default: 0)
* `expires_at` (Timestamp, Nullable)
* `is_active` (Boolean, default: `true`)

### 👥 8. UserPromocodes (Promokod Suiiste'moli Nazorati)
* `id` (Serial / PK)
* `user_id` (FK -> Users.id)
* `promocode_id` (FK -> Promocodes.id)
* `used_at` (Timestamp, default: `now()`)
* **Constraints:** Unique Index `[user_id, promocode_id]` — Bir foydalanuvchi faqat 1 marta ishlatishi mumkin.

### 📦 9. Orders (Buyurtmalar, Geolokatsiya & Statuslar)
* `id` (Serial / PK)
* `order_number` (String, Unique) — `#10045`
* `user_id` (FK -> Users.id)
* `promocode_id` (FK -> Promocodes.id, Nullable)
* `branch_id` (FK -> Branches.id, Nullable)
* `status` (Enum: `NEW`, `PROCESSING`, `DELIVERING`, `COMPLETED`, `CANCELLED`, `PARTIALLY_REFUNDED`)
* `payment_type` (Enum: `CLICK`, `PAYME`, `CASH`, `STARS`)
* `payment_status` (Enum: `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`)
* `subtotal_price` (Decimal)
* `discount_price` (Decimal, default: 0)
* `delivery_price` (Decimal, default: 0)
* `total_price` (Decimal)
* `customer_name` (String)
* `customer_phone` (String)
* `delivery_type` (Enum: `COURIER`, `PICKUP`)
* `address` (Text, Nullable)
* `latitude` (Decimal, Nullable)
* `longitude` (Decimal, Nullable)
* `comment` (Text, Nullable)
* `created_at` (Timestamp)

### 💳 10. Transactions (Immutable Financial Audit Ledger)
Har bir to'lov va pul qaytarish (refund) harakati **alohida o'zgarmas qator**:
* `id` (Serial / PK)
* `order_id` (FK -> Orders.id)
* `parent_id` (FK -> Transactions.id, Nullable) — Refund bo'lsa asli to'lov tranzaksiyasiga havola
* `transaction_type` (Enum: `PAYMENT`, `REFUND`)
* `provider` (Enum: `CLICK`, `PAYME`, `STARS`, `CASH`)
* `transaction_id` (String) — Tashqi tizim taqdim etgan unikal ID
* `amount` (Decimal)
* `status` (Enum: `PENDING`, `SUCCESS`, `FAILED`, `CANCELLED`)
* `reason` (String, Nullable)
* `perform_time` (Timestamp, Nullable)
* `created_at` (Timestamp, default: `now()`)

### 📋 11. OrderItems (Buyurtma Tarkibi)
* `id` (Serial / PK)
* `order_id` (FK -> Orders.id)
* `product_id` (FK -> Products.id)
* `variant_id` (FK -> ProductVariants.id, Nullable)
* `quantity` (Integer)
* `price` (Decimal)
* `selected_size` (String, Nullable)
* `selected_color` (String, Nullable)

### ⭐ 12. Reviews (Sharhlar va Moderatsiya)
* `id` (Serial / PK)
* `user_id` (FK -> Users.id)
* `product_id` (FK -> Products.id)
* `rating` (Integer) — 1 dan 5 gacha
* `comment` (Text, Nullable)
* `images` (Text[])
* `status` (Enum: `PENDING`, `APPROVED`, `REJECTED`, default: `PENDING`)
* `created_at` (Timestamp)

### 💖 13. Wishlists (Sevimlilar Ro'yxati)
* `id` (Serial / PK)
* `user_id` (FK -> Users.id)
* `product_id` (FK -> Products.id)
* `created_at` (Timestamp)
* **Constraints:** Unique Index `[user_id, product_id]`

### 📍 14. Branches (Do'kon Filiallari - Samovivoz)
* `id` (Serial / PK)
* `name` (JSONB)
* `address` (JSONB)
* `phone` (String, Nullable)
* `lat` (Decimal, Nullable)
* `lng` (Decimal, Nullable)
* `is_active` (Boolean, default: `true`)

### 📦 15. StockNotifications (Mavjud Bo'lganda Bildirishnoma)
* `id` (Serial / PK)
* `user_id` (FK -> Users.id)
* `product_id` (FK -> Products.id)
* `variant_id` (FK -> ProductVariants.id, Nullable)
* `is_notified` (Boolean, default: `false`)
* `created_at` (Timestamp)

### ⚙️ 16. StoreSettings (White-Label Do'kon Sozlamalari)
* `id` (Serial / PK)
* `store_name` (JSONB)
* `logo_url` (String, Nullable)
* `currency` (String, default: `"UZS"`)
* `delivery_fee` (Decimal, default: 0)
* `free_delivery_threshold` (Decimal, Nullable)
* `phone_number` (String, Nullable)
* `terms_url` (JSONB, Nullable)
* `is_active` (Boolean, default: `true`)

### 👑 17. Admins (Adminlar va Ruxsatlar)
* `id` (Serial / PK)
* `telegram_id` (BigInt, Unique)
* `name` (String)
* `role` (Enum: `SUPERADMIN`, `MANAGER`)
* `is_active` (Boolean, default: `true`)

### 📜 18. AdminLogs (Admin Harakatlari Audit Logi)
* `id` (Serial / PK)
* `admin_id` (FK -> Admins.id)
* `action` (String) — `UPDATE_PRODUCT`, `REFUND_ORDER`
* `details` (JSONB, Nullable)
* `created_at` (Timestamp)

---

## 3. Highload Redis Atomic Stock Locking

Checkout vaqtida bir nechta xaridor bir vaqtda oxirgi mahsulotni sotib olishga uringanda race condition hosil bo'lmaydi:

```text
[Checkout So'rovi] 
       │
       ▼
Redis INCRBY reserved_stock:{variant_id} ──► (O(1) tezlikda zaxiraga olinadi)
       │
       ├─► (Agar zaxira ombor qoldig'idan oshib ketsa) ──► DECRBY bajariladi va 400 Out of Stock qaytariladi.
       └─► (Agar zaxira muvaffaqiyatli bo'lsa) ──► 15 daqiqaga lock qilinadi va buyurtma yaratiladi.
```

---

## 4. Security & Auth: JWT Revocation (Redis Blacklist)

Superadmin tomonidan biror adminning ruxsati bekor qilinganda (`is_active = false`):
1. Admin tokenining `jti` unikal identifikatori darhol Redis Blacklist-ga yoziladi.
2. Next.js Auth Middleware har bir API so'rovida ushbu blacklist-ni o'qiydi.
3. Agar token blacklist-da bo'lsa, brauzerda JWT saqlanib qolgan bo'lsa ham `401 Unauthorized` qaytarilib, seans darhol to'xtatiladi.

---

## 5. Next.js API Routes & Webhook Arxitekturasi

* **Client APIs:**
  * `GET /api/products` — Live-search (PostgreSQL GIN index) & pagination.
  * `GET /api/categories` — Kategoriyalar ro'yxati.
  * `POST /api/cart` & `DELETE /api/cart` — Savat boshqaruvi.
  * `POST /api/promocodes/validate` — Promokod tekshiruvi.
  * `POST /api/orders` — Redis Atomic Stock Lock bilan buyurtma yaratish.
* **Payment Webhooks:**
  * `POST /api/webhooks/click` — Click MD5 signature verification & payment status update.
  * `POST /api/webhooks/payme` — Payme JSON-RPC 2.0 Basic Auth verification.
* **Admin Protected APIs:**
  * `GET/POST /api/admin/products` — Admin mahsulotlar CRUD.
  * `GET/PATCH /api/admin/orders` — Buyurtma statuslarini almashtirish va refund.
  * `GET/POST /api/admin/reviews` — Sharhlar moderatsiyasi.
* **Cron Workers:**
  * `GET /api/cron/abandoned-carts` — Eskirgan zaxiralarni tozalash (BullMQ / QStash).

---

## 6. Devops, Docker & CI/CD Pipeline

* **Docker Build:** Multi-stage Alpine Dockerfile.
* **Docker Compose:** Next.js App container + PostgreSQL 15 container + Redis container.
* **CI/CD Pipeline:** GitHub Actions (`.github/workflows/ci-cd.yml`): `npm run lint` ➔ `tsc --noEmit` ➔ `npx prisma validate`.

---

## 7. Frontend State Architecture: Buyurtmalar va Ombor Sinxronizatsiyasi

Enterprise boshqaruv panelining ishonchli va atomik ishlashini ta'minlash uchun quyidagi reaktiv state reductorlari joriy etilgan:

```text
                               ┌───────────────────────────┐
                               │     Admin Action Event    │
                               └─────────────┬─────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
  [Yangi Buyurtma Yaratish]        [Holatni "COMPLETED" Qilish]     [Buyurtmani Bekor Qilish]
             │                               │                               │
             ▼                               ▼                               ▼
• deductStock(items)            • CASH + PENDING bo'lsa:        • restoreStock(items)
  Ombor qoldig'i avtomatik        To'lov holati avtomatik         Omborga barcha tovarlar
  kamaytiriladi                   "PAID" ga o'tadi                qaytariladi (Restock)
• useOrderStore.addOrder        • activityLogs & auditStore     • PAID to'lov "REFUNDED" ga o'tadi
• activityLogs & auditStore       yoziladi                      • activityLogs & auditStore yoziladi
```

* **Zustand Persist Stores:**
  * `useOrderStore`: Buyurtmalar holati (`NEW`, `DELIVERING`, `COMPLETED`, `CANCELLED`), kuryer tayinlash (`assignCourier`), to'lov boshqaruvi (`updateOrderPaymentStatus`) va ichki `OrderActivityLog` jurnali.
  * `useProductStore`: `deductStock(items)` va `restoreStock(items)` orqali variant va umumiy SKU qoldiqlarini 100% atomik sinxronizatsiya qilish.
  * `useAuditStore`: Xavfsizlik va audit jurnali (`Orders`, `Inventory`, `Auth`, `Staff`).
  * `useStaffStore`: Rolga asoslangan ruxsatlar (`SUPER_ADMIN`, `MANAGER`, `COURIER`) va kuryerlar ro'yxati.
* **MS Excel UTF-8 BOM CSV Generator:**
  * Browser API (`Blob` + `\uFEFF` UTF-8 Byte Order Mark + `;` separator) orqali Windows MS Excel dasturida kirill va lotin harflarini to'g'ri o'qilishini ta'minlovchi 14 ustunli eksport moduli.

