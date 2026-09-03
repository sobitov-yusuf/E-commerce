# Universal E-Commerce Platformasi (TMA & Web) — Rivojlanish Yo'l Xaritasi (Roadmap)

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatning Vazifasi va Chegaralari (Scope & Boundaries)

Ushbu hujjat loyihaning **barcha bajarilgan bosqichlari va kelajakdagi rejalari**ni qayd etadi.

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. **Yakunlangan Sprintlar:** Har bir bosqichning maqsadi va bajarilgan vazifalari.
2. **Joriy Holat:** Hozirgi faol ish va uning tafsilotlari.
3. **Kelajak Rejalari:** Keyingi bosqichlarda qilinadigan ishlar.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Biznes Talablari:** [1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md) da.
2. **Texnik Arxitektura:** [2_Texnik_Arxitektura.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/2_Texnik_Arxitektura.md) da.
3. **Telegram SDK:** [3_Telegram_Integratsiya.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/3_Telegram_Integratsiya.md) da.
4. **UI Dizayn Tokenlari:** [4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md) da.

---

## Yakunlangan Bosqichlar

### ✅ Sprint 1: Loyiha Poydevori, Auth va Infratuzilma
- [x] Next.js 14 (App Router), TypeScript, Tailwind CSS loyihasini sozlash.
- [x] PostgreSQL (Supabase) bazasini PgBouncer bilan ulash.
- [x] `prisma/schema.prisma` — 18 ta jadval va 12 ta enum yaratish.
- [x] JSONB maydonlariga GIN Trigram indekslar o'rnatish (0.01s jonli qidiruv).
- [x] Upstash Redis Rate Limiter va JWT Blacklist Auth Middleware sozlash.
- [x] GitHub Actions CI/CD pipeline (lint + tsc + prisma validate).

---

### ✅ Sprint 2: Xaridor Ilovasi (Client TMA & Web)
- [x] `TelegramProvider` — TMA va Web brauzer uchun yagona kontekst provayderi.
- [x] TMA initData HMAC-SHA256 autentifikatsiya (`/api/auth`).
- [x] Web brauzer Telegram Login Widget autentifikatsiya (`/api/auth/web`).
- [x] 3 tilli (UZ/RU/EN) i18n provayderi (`useLanguageStore` + `translations.ts`, ~280 kalit).
- [x] Bosh sahifa: Header, Stories, Hero Banner, Toifa kapsulalari, Tavsiya mahsulotlar (Barchasi/Mashhur/Yangi tablari).
- [x] Master-Detail 2-ustunli Katalog (`/catalog`) + Filtr modali.
- [x] Mahsulot tafsilotlari sahifasi: rasm galereyasi, variant tanlagich (o'lcham/rang/SKU), sharhlar.
- [x] Savat (Zustand `useCartStore`), promokod validatsiyasi, 15 daqiqalik ombor taymeri.
- [x] Buyurtma rasmiylashtirish: kuryer/topshirish, manzil, telefon maskasi, to'lov tanlash.
- [x] Sevimlilar bo'limi va bo'sh holat tavsiyalari.
- [x] Profil sahifasi: 8 ta mustaqil modal (Buyurtmalar, Keshbek, Manzillar, Til, Mavzu, FAQ, Bildirishnomalar, Operator).

---

### ✅ Sprint 3: Enterprise Admin Panel
- [x] Admin JWT Auth + Redis JWT Blacklist Instant Revocation.
- [x] Dashboard Hub: Gibrid SVG grafik (Area/Bar), davr taqqoslash, Donut to'lov diagrammasi, TOP-3 shohsupa, buyurtmalar oqimi.
- [x] Buyurtmalar Hub: Zero-native-select popover dropdownlar, davr filtrlari, ombor avto-sinxronizatsiya, kuryer tayinlash, UTF-8 BOM CSV eksport, 80mm termal chek.
- [x] Katalog Hub: Grid/Table ko'rinishlari, mini-HUD statistika, ommaviy harakatlar paneli, Gemini AI tarjima, ko'p rasmli galereya, SKU variantlar matritsasi.
- [x] Toifalar boshqaruvi: statistika, ko'rinishni yoqish/o'chirish, tahrirlash, o'chirish.
- [x] Sharhlar moderatsiyasi: KPI ko'rsatkichlari, 1-klikda tasdiqlash/rad etish, ommaviy tasdiqlash.
- [x] Mijozlar CRM: xaridorlar bazasi, VIP maqomi, Telegram chatiga o'tish.
- [x] Marketing Hub: bannerlar, promokodlar, ommaviy Telegram xabarnoma.
- [x] Sozlamalar Hub: do'kon nomi, yetkazish, to'lov shlyuzlari, xodimlar RBAC, audit jurnali.

---

### ✅ Sprint 4: To'lov va Xavfsizlik
- [x] Click to'lov API va Webhook (`/api/webhooks/click`).
- [x] Payme JSON-RPC 2.0 to'lov API va Webhook (`/api/webhooks/payme`).
- [x] Redis Atomic Stock Lock (Highload O(1) zaxira) + 15 daqiqalik lock.
- [x] Immutable Financial Ledger (Transaction jadvali — refund audit izi).
- [x] Telegram Bot xabarnomalari: Admin yangi buyurtma, Xaridor holat yangilanishi, Elektron kvitansiya.

---

### ✅ Sprint 5: Dizayn Tizimi va Dark Mode
- [x] Minimalist monoxrom dizayn tizimi (#FAFAFA fon, #111827 harakat rangi).
- [x] To'liq Dark Mode (`useThemeStore`, `localStorage`, HTML `dark` klass).
- [x] Dark rejimda yuqori kontrastli oq harakat tugmalari.
- [x] Micro-animatsiyalar: `active:scale-95`, hover ko'tarilish, skeleton shimmer.
- [x] Glassmorphism pastki navigatsiya va kartochkalar.

---

### ✅ Sprint 6: Test, Deploy va Sifat Nazorati
- [x] `npx tsc --noEmit` — 0 ta TypeScript xatosi.
- [x] Multi-stage Alpine Dockerfile va Docker Compose (Next.js + PostgreSQL + Redis).
- [x] Vercel Serverless deploy va Supabase PostgreSQL integratsiyasi.
- [x] GitHub Actions CI/CD avtomatik pipeline.

---

### ✅ Sprint 7: Hujjatlar Tizimini Mukammallashtirish (Joriy)
- [x] `docs/1_Talablar_PRD.md` — To'liq qayta yozildi (White-Label, RBAC, ikki tomonlama auth, ipidan-ignasigacha sahifalar).
- [x] `docs/2_Texnik_Arxitektura.md` — 18 jadval, 14 Zustand store, API routes, xavfsizlik, DevOps.
- [x] `docs/3_Telegram_Integratsiya.md` — TMA va Web auth, Bot API xabarnomalari, Deep Linking.
- [x] `docs/4_UI_UX_Dizayn_Tizimi.md` — Ranglar, tipografiya, komponentlar, responsive, dark mode, animatsiyalar.
- [x] `docs/5_Roadmap.md` — Ushbu yo'l xaritasi.

---

## Kelajak Rejalari (Keyingi Bosqichlar)

### 📋 Navbatdagi Ishlar
- [ ] Barcha hujjatlarga moslangan holda mavjud kodni tekshirish va tozalash.
- [ ] Koddagi soxta "Alisher Zokirov" test foydalanuvchini neytral placeholderlarga almashtirish.
- [ ] Admin paneldagi eski dizayn muammolarini Dizayn Tizimi hujjatiga moslash.
- [ ] Telegram Mini App ichida real qurilmada to'liq sinov.
- [ ] `README.md` ni yangi hujjatlar tizimiga moslangan holda qayta yozish.
- [ ] `.agents/AGENTS.md` ni tozalash — faqat agent qoidalari, dizayn speklar doc 4 da.

### 🚀 Kelajak Sprint G'oyalari
- [ ] Real PostgreSQL ma'lumotlar bazasiga to'liq o'tish (localStorage dan).
- [ ] Admin panel uchun Telegram botdan login (BotFather admin authentication).
- [ ] Xaridor buyurtma kuzatuv sahifasi (Live Order Tracking).
- [ ] Push bildirishnomalar (Telegram Bot orqali marketing avtomatlashtirish).
- [ ] Mahsulot tavsiyalari algoritmi (Xarid tarixiga asoslangan).
- [ ] Qidiruv natijalarini Redis da keshlash (yanada tezroq response).
- [ ] PWA (Progressive Web App) rejimi — brauzerda ilovani o'rnatish imkoniyati.
