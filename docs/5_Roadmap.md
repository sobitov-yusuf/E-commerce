# Universal Telegram Mini App (TMA) E-Commerce — Rivojlanish Yo'l Xaritasi (Roadmap)

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatda Nimalar Turadi va Nimalar Turmaydi? (Scope & Boundaries)

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. **Loyiha Bosqichlari (Sprint 1 - Sprint 7):** Har bir sprintning mantiqiy maqsadi va vazifalar ro'yxati.
2. **Vazifalar Holati (Task Status):** Bajarilgan (`[x]`) va navbatdagi topshiriqlar jurnali.
3. **Loyiha Yo'l Xaritasi:** Ishlab chiqish va topshirish rejalari.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Biznes PRD Talablari:** Loyiha maqsadi va Bosh sahifa strukturasi **[1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md)** da turadi.
2. **PostgreSQL / Prisma DB Sxemalari:** Baza jadvallari va SQL **[2_Texnik_Arxitektura.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/2_Texnik_Arxitektura.md)** da turadi.
3. **Telegram SDK Kodlari:** HMAC auth va SDK funksiyalari **[3_Telegram_Integratsiya.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/3_Telegram_Integratsiya.md)** da turadi.
4. **UI Dizayn Tokenlari:** Ranglar va CSS speksifikatsiyalari **[4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md)** da turadi.

---

## 📌 Loyiha Bosqichlari va Topshirish Rejasi (Development Sprints)

Loyihani sifatli, o'z vaqtida, Highload va Serverless talablariga mos holda yakunlash uchun ishlab chiqish jarayoni **7 ta mantiqiy sprint (bosqich)**ga bo'lingan:

---

### 🚀 Sprint 1: Loyiha Poydevori, GIN Indexes va Auth Security — 100% YAKUNLANDI 🎉
* [x] `docs/` papkasidagi barcha rasmiy hujjatlarni to'liq yakunlash va tartiblash.
* [x] Next.js (App Router), TypeScript, Tailwind CSS va Shadcn UI loyihasini sozlash.
* [x] GitHub Actions CI/CD pipeline (`.github/workflows/ci-cd.yml`) linter va TypeScript sinovlarini ulash.
* [x] PostgreSQL bazasini PgBouncer Connection Pool bilan ulash va `prisma/schema.prisma` yozish.
* [x] `Categories` va `Products` jadvallaridagi JSONB nom va tavsiflarga **GIN Index** o'rnatish.
* [x] Prisma Client generatsiyasini bajarib, barcha 18 ta jadvalni tayyorlash.
* [x] Upstash Redis Rate Limiter va **JWT Blacklist Auth Middleware** sozlamalarini tayyorlash.

---

### 📱 Sprint 2: Client TMA App - Xaridor Qismi — 100% YAKUNLANDI 🎉
* [x] `@telegram-apps/sdk` native integratsiyasi (Viewport expansion, HapticFeedback, Native Buttons).
* [x] 3 tildagi (**O'zbek / Rus / Ingliz**) i18n provayderi va Headerda UZ/RU/EN til almashtirish kapsulasi.
* [x] GIN indekslangan mahsulotlar katalogi va ko'p tilli live-search mexanizmi.
* [x] Mahsulot tafsilotlari modali (SKU variantlar, reviews, stock notification, deep-link).
* [x] Savat (Zustand store), Promokod validate va Sevimlilar bo'limi.
* [x] Buyurtma berish (Checkout) API yo'lagi, Telegram `requestContact` va geolokatsiya.

---

### 🖥️ Sprint 3: Web Admin Panel & JWT Revocation — 100% YAKUNLANDI 🎉
* [x] Admin Auth (JWT session + Redis JWT Blacklist Revocation `middleware.ts`).
* [x] Katalog va Mahsulotlar CRUD Formasi (3 tildagi JSONB, Variantlar/SKU kiritish UI).
* [x] Rasmlarni avtomatik yuklash va saqlash servisi (`/api/admin/upload`).
* [x] ⭐ **Sharhlar Moderatsiyasi Sahifasi:** Kelgan sharhlarni `APPROVED` yoki `REJECTED` qilish.
* [x] 🔒 **Instant Session Revocation:** Bloklangan admin tokenini Redis Blacklist-ga yuborib seansni to'xtatish.
* [x] Buyurtmalar boshqaruvi jadvali, Fraud user blocking hamda Admin Audit Logs.
* [x] Kuryer uchun printable chek (Print Receipt PDF) chiqarish opsiyasi.

---

### 💳 Sprint 4: Atomic Redis Stock Lock, Queue va Immutable Refunds — 100% YAKUNLANDI 🎉
* [x] Click va Payme to'lov API va Webhook'larini yaratish (`/api/webhooks/click`, `/api/webhooks/payme`).
* [x] ⚡ **Highload O(1) Atomic Redis Stock Lock (`reserved_stock:{variant_id}`):** `INCRBY` / `DECRBY` zaxiralash.
* [x] 💳 **Immutable Financial Ledger (Refund Logs):** Pul qaytarish jarayonida yangi tranzaksiya yozish.
* [x] Infratuzilma Navbat Tizimi (Upstash QStash / BullMQ) va Cron Cleaner.
* [x] Telegram Bot API xabarnomalari (Admin va Mijoz uchun 3 tildagi bot xabarlari).

---

### 🧪 Sprint 5: Test, Deploy va Xavfsizlik — 100% YAKUNLANDI 🎉
* [x] Highload va Xavfsizlik testi: GIN qidiruv tezligi (<0.01s), JWT Blacklist, HMAC tekshiruvi, Rate-limiting va `npx tsc --noEmit`.
* [x] GitHub Actions avtomatik migratsiya va test quvurlari (`.github/workflows/ci-cd.yml`).
* [x] Serverga joylashtirish (Deploy) tayyorgarligi: `Dockerfile`, `docker-compose.yml`, `entrypoint.sh`.

---

### 🎨 Sprint 6: Production Minimalist Redesign & Bosh Sahifa Mukammalligi — 100% YAKUNLANDI 🎉
* [x] **Monoxrom Dizayn Tizimi (Apple & Farfetch):** Asosiy harakatlar `#111827` (`bg-gray-900`) va sof `#FAFAFA` fonga o'tkazildi.
* [x] **Bosh Sahifa Ketma-ketligi:** Header -> Stories -> Hero Banner -> Kategoriyalar -> "Tavsiya etiladigan mahsulotlar" (Tablar: Barchasi, Mashhur, Yangi) -> Telegram Support -> Trust Badges.
* [x] **Nasiya Savdo Butunlay Olib Tashlandi:** "Oyiga ... UZS" yorliqlari o'chirilib, asosiy narxga to'liq ustuvorlik berildi.
* [x] **Uzum Market Uslubidagi Pastki Tugma (`ProductCard`):** Narx alohida qatorda, pastda to'liq kenglikdagi `[ 🛒 Savatga ]` va `[ - X ta + ]` stepper. 0 ga tushirganda savatdan to'g'ri o'chirish ta'minlandi.
* [x] **Uzum Market Uslubidagi Gorizontal Kategoriya Kapsulalari (`CategoryCarousel`):** Ortiqcha sarlavhasiz, doiraviy rasm va aniq matnli kapsula tabletkalar (`h-[56px] sm:h-[60px]`, `w-[38px] h-[38px]` ikonka).
* [x] **To'liq Instagram Stories Tizimi (`StoriesReel` & `StoriesModal`):** Xatosiz doiralar, ko'p segmentli progress-bar, chap/o'ng bosish orqali o'tish, bosib turganda to'xtatish (Hold to pause), ikki marta bosganda yurakcha (Double-tap like).
* [x] **Mobil / Desktop Moslashuvchanlik:** Telefondagi ortiqcha ikkinchi profil tugmasi yashirildi, pastki navigatsiya uchun `pb-24` masofasi o'rnatildi.

---

### 🌟 Sprint 7: Master-Detail Katalog, Standalone Modalli Profil, Bo'sh Holat Tavsiyalari va To'liq 3 Tilli i18n — 100% YAKUNLANDI 🎉
* [x] **🌐 To'liq Ko'p Tillilik (i18n: UZ, RU, EN):** `useLanguageStore` + `translations.ts` lug'at tizimi. Profil orqali til o'zgartirilganda barcha sahifalar, komponentlar, tugmalar va tovarlar bir zumda sinxronlashadi.
* [x] **📂 Uzum Mobile 2-Ustunli Master-Detail Katalog (`/catalog`):** Chapda asosiy toifalar ro'yxati (Master), o'ngda gorizontal subkategoriya tugmalari va mahsulotlar panjarasi (Detail).
* [x] **🎛️ Katalog Filtr Modali:** Saralash (Mashhur, Yangi, Narx o'sish/kamayish), narx slayderi (0 - 1,000,000 UZS), faqat chegirmalar va bir klikda filtrlarni tozalash.
* [x] **💖 & 🛒 Bo'sh Holatlarda Tavsiyalar (`/wishlist` & `/cart`):** Hech qachon bo'shab qolmaydi: tepada ixcham xabar qutisi, pastida to'liq *"Mashhur"* mahsulotlar tavsiya panjarasi.
* [x] **👤 Ixcham Profil va 7 ta Standalone Modallar (`/profile`):** Doiraviy gradient avatar va tasdiqlangan nishon (`✓`). Buyurtmalar tarixi va cheki, Keshbek/Promokodlar, Manzillar, Til tanlash, Mavzu rejimi, FAQ akkordeoni va 24/7 Operator chatiga o'tish modallari.
* [x] **🔍 Toza va Ixcham Qidiruv Sahifasi (`/search`):** Sarlavhadan ortiqcha so'zlar olib tashlanib, toza va chiroyli holatga keltirildi.

---

### 🌓 Sprint 8: Haqiqiy Dark Mode, Telegram Bildirishnomalar Xavfsizligi va Mahsulot Sharhlari — 100% YAKUNLANDI 🎉
* [x] **🌓 Haqiqiy Tizimli Dark Mode (`useThemeStore` + `localStorage`):** Butun ilovada yagona to'liq qorong'u rejim, silliq o'tish va yuqori kontrastli oq harakat tugmalari (`dark:bg-white dark:text-gray-950`).
* [x] **🔔 Telegram Bildirishnoma Checkboxi va O'chirish Ogohlantirish Modali:**
  - Standart holatda yoqilgan (`true`).
  - Dark mode uchun oq kvadrat va qora ptichka dizayni.
  - O'chirishga harakat qilinganda foydalanuvchini ogohlantiruvchi 3 tildagi tasdiqlash dialogi.
* [x] **⭐ Mahsulot Tafsilotlari Sahifasida Tasdiqlangan Sharh Qoldirish Tizimi (`/product/[id]`):**
  - 1-5 yulduzli baholash, ism, afzalliklar, kamchiliklar va sharh formasi.
  - Faqat tovar sotib olgan xaridorlar sharh qoldirishi (Verified Buyer Guard) + test xarid simulyatsiyasi.
* [x] **💰 Keshbek va Promokodlar Modali Dark Polish:** To'q zumrad rangli shaffof karta (`dark:bg-emerald-950/50 dark:border-emerald-800/50`) va yuqori kontrastli matnlar.
* [x] **🛡️ Kod Salomatligi:** `npx tsc --noEmit` tekshiruvidan muvaffaqiyatli o'tgan (**0 ta xatolik**).

---

### ⚙️ Sprint 9: Enterprise Admin Console & Analytics Dashboard Hub — 100% YAKUNLANDI 🎉
* [x] **📊 Gibrid SVG Daromad Grafigi (Area & Neo-Bars):** To'lqinli (`Area`) va Ustunli (`Bar`) rejimlar, `padLeft: 58` koordinatali himoyalangan Y-o'qi, suzuvchi Glassmorphism Tooltip va 100% matematik hisoblangan davriy ulushlar.
* [x] **⚖️ O'tgan Davr Bilan Solishtirish (`Period Comparison`):** Bugun (kechagi soatlar bilan), 7 kun, Shu oy va Shu yil bo'yicha joriy va o'tgan davrni solishtiruvchi dinamik ko'rsatkichlar (`+X.X%`).
* [x] **💳 To'lov Usullari Taqsimoti (Donut & Linear Bars):** 160x160 interaktiv SVG Donut va markaziy ma'lumot ko'rsatkichi hamda chiziqli progress kartochkalari.
* [x] **🏆 TOP-3 Shohsupa Reytingi (Podium Leaderboard):** 🥇 Oltin Toj (`Crown`), 🥈 Kumush Medal, 🥉 Bronza Medal belgilariga ega TOP-3 tovarlar va kartochka bosilganda Katalogda o'sha tovarni filtrlab ochish.
* [x] **📦 4 Bosqichli Buyurtmalar Oqimi (Pipeline Funnel):** `NEW`, `DELIVERING`, `COMPLETED`, `CANCELLED` simmetrik holat kartalari.
* [x] **🧹 Toza va Decluttered Navigatsiya:** Dashboardda ortiqcha qidiruv yashirildi, boshqa bo'limlarga o'tganda qidiruv avtomatik tozalanadi va `[ ✕ ]` tugmasi bilan ta'minlandi.
* [x] **🛡️ Kod Salomatligi:** `npx tsc --noEmit` tekshiruvidan muvaffaqiyatli o'tgan (**0 ta xatolik**).

---

### 📦 Sprint 10: Enterprise Buyurtmalar va Logistika Hubi (Orders & Logistics Hub) — 100% YAKUNLANDI 🎉
* [x] **🎛️ Zamonaviy Popover Dropdownlar (Zero Native Selects):** Brauzerning eski `<select>` menyulari o'rniga loyiha dizayniga moslashtirilgan popover dropdownlar (`Sana`, `Yetkazish`, `To'lov`, `Saralash`) o'rnatildi (`rounded-2xl`, soya `shadow-xl`, aylanuvchi strelka `ChevronDown`, tanlangan bandda `<Check />` belgisi va `outside-click` yopilish mexanizmi).
* [x] **📅 Kunlik va Davriy Filtrlash (Period Date Filters):** `Bugun`, `Oxirgi 7 kun`, `Shu oy`, `Shu yil (2026)` filtrlari to'g'ridan-to'g'ri filtrlar qatoriga kiritildi.
* [x] **🔄 Ombor Qoldiqlarining Avtomatik Sinxronizatsiyasi (Stock Auto-sync):** Yangi buyurtma yaratilganda ombor qoldig'i avtomatik ayiriladi (`deductStock`), buyurtma bekor qilinganda (`CANCELLED`) esa barcha tovarlar avtomatik omborga qaytariladi (`restoreStock / Restock`).
* [x] **⚡ Holatlar O'tishining Avtomatlashtirilgan Mantiqi:**
  - `CASH` to'lovli buyurtma `COMPLETED` bo'lganda to'lov holati avtomatik ravishda `PAID` ga o'tadi.
  - To'langan (`PAID`) buyurtma bekor qilinganda to'lov holati avtomatik tarzda `REFUNDED` ga aylanadi.
  - Kuryer biriktirilganda buyurtma avtomatik `DELIVERING` holatiga o'tadi.
* [x] **📝 Qo'lda Buyurtma Yaratish Modali (Manual Order):** Qat'iy `+998` O'zbekiston telefon maskasi, ism va matnlarni sanitarizatsiya qilish, ombordagi real zaxirani tekshirish, variant tanlagich, jonli hisob-kitob va bepul yetkazish chegarasi (>300,000 UZS).
* [x] **📊 Microsoft Excel UTF-8 BOM CSV Eksport:** Tanlangan filtrlarga mos holatda **UTF-8 BOM (`\uFEFF`)** va nuqta-vergul (`;`) ajratgichli to'liq 14 ta ustunli hisobot generatsiyasi.
* [x] **🖨️ 80mm Standartdagi Termal Chek:** Kassa apparatlari uchun maxsus formatlangan chiroyli kvitansiya chop etish oynasi.
* [x] **⚡ 1-Klikda Tezkor Harakatlar:** Mijoz telefoniga to'g'ridan-to'g'ri Telegram chatini ochish (`https://t.me/+998...`) va buyurtma ma'lumotlarini buferga nusxalash (`Clipboard`).
* [x] **🧹 Modallar Ergonomikasi (Decluttered Layout):** Takroriy tugmalar yo'qotildi, yuqorida ixcham harakatlar, pastki qismda yagona toza `Yopish` tugmasi.
* [x] **🛡️ Kod Salomatligi:** `npx tsc --noEmit` tekshiruvidan muvaffaqiyatli o'tgan (**0 ta xatolik**).

---

### 🛍️ Sprint 11: Enterprise Katalog, Mahsulotlar & Sharhlar Moderatsiyasi Hubi — 100% YAKUNLANDI 🎉
* [x] **🎛️ Popover Dropdown Filtrlar (Zero Native Selects):** Kategoriya, Zaxira holati (Barchasi, Bor, Kam, Tugagan), Nishon (NEW, TOP, SALE, NONE) va Saralash (Yangi, Narx, Zaxira) filtrlari maxsus popover dropdownlarga o'tkazildi.
* [x] **📊 Mini-HUD KPI Ko'rsatkichlari:** Jami tovarlar soni, ombordagi umumiy donalar miqdori, kam qolgan tovarlar (amber ogohlantirish) va tugagan tovarlar (qizil indikator) jonli statistikasi.
* [x] **🔲 Ko'rinish Rejimlari (Grid va Table):** Farfetch/Apple minimalist kartochkalar rejimi (`aspect-square` rasm, chegirma foizi, tezkor restock `+5`/`+10`) va ixcham 8 ustunli jadval rejimi.
* [x] **⚡ Ommaviy Harakatlar Paneli (Bulk Actions):** Ko'p tovar tanlanganda `+5`/`+10` zaxira qo'shish, ommaviy nishon berish va ommaviy xavfsiz o'chirish.
* [x] **✨ Universal Mahsulot Modali & Gemini AI:** 3 tildagi nom va tavsiflar, `✨ Gemini AI` avtomatlashtirilgan marketing tavsif generatsiyasi, ko'p rasmli galereya (FileReader Base64), asosiy rasmni tanlash, dinamik SKU/Variantlar jadvali.
* [x] **📁 Kategoriyalar Boshqaruvi:** Toifa statistikasi, faollikni yoqish/o'chirish (`Eye`/`EyeOff`), 3 tildagi tahrirlash va o'chirish.
* [x] **⭐ Sharhlar Moderatsiyasi Hubi:** KPI ko'rsatkichlari, kutilayotgan sharhlarni 1-klikda tasdiqlash/rad etish, yulduzli va statusli popover filtrlar va `Barchasini tasdiqlash (Approve All)`.
* [x] **🛡️ Kod Salomatligi:** `npx tsc --noEmit` tekshiruvidan muvaffaqiyatli o'tgan (**0 ta xatolik**).


