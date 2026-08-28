# 🛍️ Universal Telegram Mini App (TMA) & Web E-Commerce Platform

Enterprise darajadagi, o'ta tezkor (Highload), to'liq 3 tilli (`UZ` / `RU` / `EN`), Dark Mode rejimiga ega Telegram Mini App va Web elektron tijorat platformasi.

---

## 🎨 Dizayn Tizimi (Design System — Production Minimalist Edition)

* **Primary Action:** Solid Dark Charcoal / Black (`#111827` / `bg-gray-900 text-white`) yorug' rejimda va sof oq (`dark:bg-white dark:text-gray-950`) qorong'u rejimda barcha asosiy tugmalar, miqdor stepperi `[-] 1 [+]`, va faol tanlovlar uchun.
* **Tipografiya:** Inter / Plus Jakarta Sans (`text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[40px]`, asosiy narx: `text-base font-bold text-gray-950 dark:text-white`).
* **Radiuslar:** Tashqi bloklar va kapsulalar `rounded-2xl`, kartochkalar `rounded-xl`, tugmalar `rounded-lg`, stikerlar `rounded-md`.
* **Rasmlar:** Qat'iy `aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-lg` va `object-cover object-center`.
* **Mikro-animatsiyalar:** Barcha bosiluvchi elementlarda `active:scale-95 transition-transform duration-100` va Telegram Haptic Feedback.
* **Nasiya Savdo:** Butunlay chiqarib tashlangan, to'liq narx ustuvorligi ta'minlangan.

---

## 🌟 Asosiy Imkoniyatlar va Yangiliklar:

1. **🌓 Haqiqiy Tizimli Qorong'u Rejim (Dark Mode):**
   - Markaziy `useThemeStore` + `localStorage` (`app_theme`).
   - Barcha sahifalar, modallar, kartalar va harakat tugmalari to'liq qorong'u rejimga avtomatik moslashadi.

2. **🔔 Telegram Bildirishnomalari va Xavfsizlik Modali:**
   - Standart yoqilgan (`true`).
   - Dark mode uchun oq kvadrat va qora ptichka dizayni.
   - O'chirishga harakat qilinganda foydalanuvchini ogohlantiruvchi 3 tildagi tasdiqlash dialogi.

3. **🌐 To'liq Real Ko'p Tillilik (i18n: UZ, RU, EN):**
   - Markaziy `useLanguageStore` va `translations.ts` lug'at tizimi.
   - Profil sahifasidan til tanlanganda butun ilova (mahsulot nomlari, kategoriyalar, narx birliklari, tugmalar va bildirishnomalar) bir zumda avtomatik yangilanadi.

4. **📂 Uzum Mobile 2-Ustunli Master-Detail Katalog (`/catalog`):**
   - Chap ustunda rasmli asosiy toifalar (Master).
   - O'ng ustunda gorizontal subkategoriya tugmalari va mahsulotlar panjarasi (Detail).
   - Saralash (Mashhur, Yangi, Narx o'sish/kamayish), narx oralig'i slayderi va chegirmalar bo'yicha ishlovchi filtr modali.

5. **⭐ Mahsulot Tafsilotlari va Sharhlar Tizimi (`/product/[id]`):**
   - Variantlar (SKU), zaxira va narx sinxronizatsiyasi.
   - Faqat xarid qilgan tasdiqlangan mijozlar uchun sharh qoldirish modali (1-5 yulduz, afzalliklar, kamchiliklar, fikr).

6. **💖 Sevimlilar va Savat Tavsiyalari (`/wishlist` & `/cart`):**
   - Bo'limlar bo'sh bo'lganda ham xaridorni jalb qiluvchi to'liq *"Mashhur"* mahsulotlar panjarasi.
   - 15 daqiqalik zaxira taymeri va to'liq buyurtma rasmiylashtirish oynasi (Kuryer / PVZ tanlovi, telefon tasdiqlash, promokodlar).

7. **👤 Ixcham Apple/Telegram Uslubidagi Profil (`/profile`):**
   - Doiraviy gradient avatar va tasdiqlangan xaridor nishoni (`✓`).
   - 8 ta mustaqil modal oyna: Buyurtmalar tarixi va cheki, Keshbek va promokodlar, Yetkazish manzillari, Til tanlash, Mavzu rejimi, FAQ akkordeoni, Bildirishnomani o'chirish tasdiqlash modali va 24/7 Operator qo'llab-quvvatlashi.

8. **🖥️ Enterprise Web Admin Panel (`/admin`):**
   - **Buyurtmalar & Logistika Hub (Orders & Logistics):**
     * Zamonaviy Popover Dropdownlar (`Sana`, `Yetkazish`, `To'lov`, `Saralash`).
     * Avtomatlashgan ombor sinxronizatsiyasi (`deductStock` va `restoreStock`).
     * Avtomatlashgan to'lov va status o'tishlari (`CASH` + `COMPLETED` ➔ `PAID`, `PAID` + `CANCELLED` ➔ `REFUNDED`).
     * Kuryer biriktirish, bekor qilish sabablari va harakatlar tarixi jurnali (`OrderActivityLog`).
     * Qo'lda buyurtma yaratish modali (+998 telefon maskasi, ism sanitarizatsiyasi, jonli summa va zaxira nazorati).
     * Microsoft Excel uchun **UTF-8 BOM (`\uFEFF`)** formatidagi to'liq 14 ustunli CSV eksport va 80mm termal chek generatori.
     * 1-klikda Telegram chatini ochish va buyurtma xulosasini buferga ko'chirish.
   - **Savdo Analitikasi & Dashboard Hub:** Gibrid to'lqinli va ustunli SVG grafiklar, o'tgan davr bilan solishtirish (`Period Comparison`), Donut to'lovlar taqsimoti, 🥇🥈🥉 TOP-3 tovarlar shohsupasi va 4 bosqichli buyurtmalar quvuri.
   - **Operatsion Boshqaruv:** 3 tildagi Katalog va Mahsulotlar CRUD, toifalar Story, bannerlar karuseli, sharhlar moderatsiyasi, promokodlar, ommaviy push xabarlar, xodimlar rollari RBAC, kuryer tayinlash va tizim audit loglari (`useAuditStore`).
   - **Xavfsizlik:** Xavfsiz JWT Auth va Redis Instant Session Revocation.

---

## 📚 Rasmiy Hujjatlar Indeksi (Docs Index):

1. 📄 **[docs/1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md):** Biznes talablari, Bosh sahifa strukturasi va Foydalanuvchi ssenariylari (PRD).
2. 📄 **[docs/2_Texnik_Arxitektura.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/2_Texnik_Arxitektura.md):** 18 ta Prisma DB jadvali, GIN indekslari, Highload Redis Lock, Frontend State Architecture va Infratuzilma.
3. 📄 **[docs/3_Telegram_Integratsiya.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/3_Telegram_Integratsiya.md):** `@telegram-apps/sdk`, HMAC auth, `requestContact` va Bot API xabarnomalari.
4. 📄 **[docs/4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md):** Apple & Farfetch Design Tokens, Dark Mode Standartlari, Uzum Market komponentlari, Popover Dropdownlar va Admin Panel UI qoidalari.
5. 📄 **[docs/5_Roadmap.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/5_Roadmap.md):** Loyihaning barcha 10 ta ishlab chiqish sprintlari va statuslar.

---

### 🚀 Texnologik Stek (Tech Stack):
* **Frontend / Framework:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Zustand
* **Database & ORM:** PostgreSQL 15, Prisma ORM, PgBouncer Connection Pool
* **Indexing & Search:** PostgreSQL Trigram GIN (Generalized Inverted Index) — 0.01s qidiruv tezligi
* **Highload Concurrency:** Upstash Redis O(1) Atomic Stock Lock (`INCRBY` / `DECRBY`)
* **Auth & Security:** Telegram HMAC-SHA256 initData Verification, Upstash Rate Limiter (20 req/10s), Redis JWT Blacklist, XSS Sanitization
* **Payments:** Click & Payme + Immutable Refund Audit Ledger
* **Docker & DevOps:** Docker Multi-stage Alpine build, `docker-compose.yml`, GitHub Actions CI/CD
