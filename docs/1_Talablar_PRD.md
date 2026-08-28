# Universal Telegram Mini App (TMA) E-Commerce — Talablar Hujjati (PRD)

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatda Nimalar Turadi va Nimalar Turmaydi? (Scope & Boundaries)

Loyihani tartibli va tushunarli rivojlantirish uchun ushbu hujjatning aniq chegaralari belgilangan:

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. **Biznes va Loyiha Maqsadi:** Platforma nima uchun yaratilmoqda va uning tijoriy qiymati nima?
2. **Foydalanuvchi Rollari (Personas):** Xaridor, Admin, Kuryer kabi sub'ektlarning huquq va vazifalari.
3. **Funksional Talablar (Functional Requirements):** Har bir sahifa va komponentdan kutiladigan mantiqiy xatti-harakatlar hamda qoidalar.
4. **Bosh Sahifa va Ichki Sahifalar Strukturasi:** Header, Stories, Hero Banner, Kategoriyalar, Master-Detail Katalog, Sevimlilar, Savat, Modalli Profil va Qidiruv.
5. **Nofunksional Talablar (Non-Functional Requirements):** Tizim tezligi, xavfsizlik, moslashuvchanlik va to'liq 3 tillilik (`UZ`, `RU`, `EN`) talablari.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Baza Jadvallari va SQL Kodlar:** PostgreSQL/Prisma sxemalari va DB indekslari **[2_Texnik_Arxitektura.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/2_Texnik_Arxitektura.md)** da turadi.
2. **Dizayn Rang Kodlari va CSS Tokenlar:** Hex ranglar, shrift va CSS klaslar **[4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md)** da turadi.
3. **HMAC Auth va Telegram API Kodlari:** Dasturlash kodlari va algoritmlar **[3_Telegram_Integratsiya.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/3_Telegram_Integratsiya.md)** da turadi.
4. **Sprint Rejalari va Muddati:** Ish vaqtlari va topshiriqlar jurnali **[5_Roadmap.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/5_Roadmap.md)** da turadi.

---

## 1. Loyihaning Maqsadi va Biznes Konsepsiyasi
Telegram orqali istalgan qonuniy va halol mahsulotlarni (kiyim-kechak, atir-upa, poyabzallar, soatlar, taqinchoqlar va boshqalar) sotishga mo‘ljallangan universal, tezkor, o'ta jozibador va zamonaviy elektron do‘kon platformasini yaratish. Ushbu tizim kelgusida biznes egalariga tayyor professional yechim sifatida taqdim etiladi.

---

## 2. Foydalanuvchi Turlari va Rollari
1. **Xaridor (Client):** Telegram bot yoki to'g'ridan-to'g'ri havola orqali do‘konga kirib, mahsulotlarni ko'radi, Instagram-style stories tomosha qiladi, saralaydi, savatga qo'shadi va buyurtma beradi.
2. **Admin (Do‘kon Egasi / Menejer):** Web admin panel orqali katalog, mahsulotlar, bannerlar, promokodlar, sharhlar moderatsiyasi hamda buyurtmalarni to‘liq boshqaradi.

---

## 3. Xaridor Qismi (Client App / TMA) — Sahifalar va Funksiyalar

### 🔹 1. Bosh Sahifaning Qat'iy Yakuniy Ketma-ketligi (Home Page Strict Order):
1. **🔝 Header (Yuqori Navigatsiya Paneli):**
   * **Logo & Nomi:** Do'kon logotipi va "Boutique Edition" yozuvi.
   * **Markazlashgan Qidiruv:** Kengligi cheklangan (`max-w-lg`) aqlli live-search qidiruv satri.
   * **Desktop Navigatsiya:** Bosh sahifa, Katalog, Sevimlilar (hisoblagichli), Savat (hisoblagichli).
   * **Bildirishnomalar (🔔):** O'qilmagan xabarlar soni dinamik ko'rsatiladi.
   * **Profil Tugmasi:** Desktopda yuqori o'ng burchakda ko'rinadi, mobil qurilmalarda esa pastki `BottomNav` paneli bilan takrorlanmasligi uchun `hidden md:flex` qilingan.

2. **⭕ Stories Bo'limi (Stories Reel & Instagram-Style Modal):**
   * **Asosiy Ro'yxat:** Bosh sahifaning yuqori qismida, gorizontal aylanuvchi Instagram-uslubidagi doiralar (`w-[62px] h-[62px] rounded-full border-2 border-gray-950 p-[2.5px]`).
   * **To'liq Ekranli Instagram Modal (`StoriesModal`):** Ko'p segmentli progress-bar, Tap to navigate, Hold to pause, Double-tap like yurakcha animatsiyasi.

3. **🖼️ Hero Banner Slayderi (Pure Clean Image Slider):**
   * Ortiqcha matnlar va xira gradientlarsiz toza, yuqori sifatli banner rasmlari.

4. **🏷️ Kategoriyalar Slayderi (Uzum Market Style Horizontal Capsules):**
   * Ortiqcha sarlavhasiz gorizontal kapsulalar (`h-[56px] sm:h-[60px] px-4 rounded-2xl`).
   * Chapda doiraviy mini rasm/ikonka (`w-[38px] h-[38px] rounded-full`), o'ngda toifaning aniq nomi (`text-sm font-semibold whitespace-nowrap`).

5. **🛍️ Asosiy Mahsulotlar Bo'limi ("Tavsiya etiladigan mahsulotlar"):**
   * **Sarlavha & Filtr Tablari:** Sarlavha yonida bir qatorda joylashgan toza tablar: *"Barchasi"*, *"Mashhur"* (Flame 🔥), *"Yangi"* (Sparkles ✨).
   * **Mahsulot Kartochkalari (Uzum Market Style Full-Width Footer):**
     - Kvadrat rasm konteyneri (`aspect-square bg-gray-50 rounded-lg`).
     - Mahsulot nomi (`text-sm font-medium line-clamp-2 min-h-[40px]`).
     - **Narx qatori:** Nasiya/bo'lib to'lash yozuvlarisiz, to'liq narx ustuvorligi (`text-base font-bold text-gray-950` va ustidan chizilgan eski narx).
     - **Pastki To'liq Kenglikdagi Tugma:**
       * Savatda 0 ta bo'lsa: `[ 🛒 Savatga ]` to'liq qora tugma (`h-9 font-semibold text-xs`).
       * Savatda > 0 bo'lsa: `[ -   X ta   + ]` interaktiv stepper (kamaytirganda 0 ga tushirib savatdan to'g'ri o'chiradi).

6. **💬 Telegram Support CTA Banner:** Menejer bilan 1-klikda bog'lanish bloki.
7. **🛡️ Trust & Warranty Badges:** 100% Original, Tezkor yetkazish va Oson qaytarish kafolatlari.
8. **📱 Mobil Pastki Navigatsiya (`BottomNav` & `pb-24` Clearance).**

---

### 🔹 2. Uzum Mobile Master-Detail 2-Ustunli Katalog (`/catalog`)
* **Chap Ustun (Master):** Rasmli asosiy toifalar ro'yxati (Kiyimlar, Poyabzallar, Sumkalar, Soatlar, Parfyumeriya, Taqinchoqlar).
* **O'ng Ustun (Detail):** Gorizontal subkategoriya tugmalari (pills) va mahsulotlar panjarasi.
* **Filtr Modali:** Saralash (Mashhur, Yangi, Narx o'sish/kamayish), narx oralig'i slayderi (0 - 1,000,000 UZS), faqat chegirmali mahsulotlar va filtrlarni tozalash (Reset).

---

### 🔹 3. Sevimlilar Bo'limi (`/wishlist`)
* **Bo'sh Holat:** Quruq bo'shab qolmaydi — yuqorida ixcham xabar qutisi + Katalogga o'tish tugmasi, pastida to'liq *"Mashhur"* mahsulotlar tavsiya panjarasi.
* **Saqlangan Mahsulotlar:** Yurakchani bosib saqlangan tovarlar ro'yxati va to'g'ridan-to'g'ri savatga qo'shish imkoniyati.

---

### 🔹 4. Savat va Buyurtma Rasmiylashtirish (`/cart`)
* **Bo'sh Holat:** Bo'sh bo'lganda ham xaridorni jalb qiluvchi *"Mashhur"* mahsulotlar tavsiya panjarasi.
* **15 daqiqalik Zaxira Taymeri:** Mahsulotlar omborda ushlab turilishini eslatuvchi interaktiv banner.
* **Buyurtma Xulosasi va Yetkazish:**
  - Yetkazib berish turi: *Kuryer orqali* (2 soatda eshikkacha) / *Olib ketish punkti - PVZ* (Bepul).
  - Telegram `requestContact` orqali tasdiqlangan telefon raqam.
  - Promokod qo'llash (foizli va qat'iy summali chegirmalar).
  - To'lov hisob-kitoblari (Mahsulotlar narxi, Tejalgan mablag', Yetkazib berish, Jami to'lov).

---

### 🔹 5. Mahsulot Tafsilotlari Sahifasi (`/product/[id]`) va Drawer
* **Galereya va Variantlar**: Slayderli rasm galereyasi, o'lcham va rang SKU tanlagichi (zaxira va narx avtomatik sinxronlanadi).
* **Tablar Tizimi**: Tavsif (Description), Xususiyatlar (Specifications) va Mijozlar fikrlari (Customer Reviews).
* **⭐ Tasdiqlangan Xaridor Sharhlari Modali**:
  - 1 dan 5 gacha yulduzli baholash, ism, afzalliklari, kamchiliklari va umumiy sharh matni.
  - Faqat mahsulotni haqiqatan sotib olgan mijozlar uchun sharh qoldirish ruxsati (Verified Buyer Filter).
  - Sinov uchun test xarid simulyatsiyasi.
* **Pastki Harakat Paneli**: To'liq kenglikdagi narx, zaxira holati, 1-klikda tezkor xarid va Savatga qo'shish tugmalari.

---

### 🔹 6. Profil, Bildirishnomalar va Mustaqil Modallar (`/profile`)
* Apple & Telegram sozlamalar ro'yxati uslubidagi ixcham monoxrom dizayn.
* Doiraviy gradient avatar va tasdiqlangan xaridor nishoni (`✓`).
* **🌓 Haqiqiy Qorong'u Rejim (Dark Mode)**: Barcha sahifalar, kartalar, modallar va tugmalarning yuqori kontrastli qorong'u rejimda ishlashi.
* **🔔 Telegram Bildirishnomalari Boshqaruvi**:
  - Standart holatda yoqilgan (`true`).
  - Dark mode uchun maxsus yuqori kontrastli checkbox (oq kvadrat + qora ptichka).
  - O'chirishga harakat qilinganda 3 tildagi ogohlantiruvchi tasdiqlash dialogi.
* **8 ta Mustaqil Standalone Modal Oyna:**
  1. 📦 **Mening buyurtmalarim modali:** Buyurtmalar tarixi, statuslar (Yetkazilmoqda, Bajarildi) va batafsil kuryer cheki.
  2. 💰 **Keshbek va Promokodlar modali:** Bonus balansi, amaldagi promokodlar va ularni 1-klikda nusxalash.
  3. 📍 **Yetkazish manzillari modali:** Saqlangan uylar va yangi manzil qo'shish.
  4. 🌐 **Ilova tili modali:** O'zbekcha (`UZ`), Ruscha (`RU`) va Inglizcha (`EN`) tillarini darhol almashtirish.
  5. 🌓 **Mavzu rejimi modali:** Yorug' (Light) va Qorong'u (Dark) rejimlar.
  6. ❓ **FAQ modali:** Yetkazish, to'lov va qaytarish bo'yicha interaktiv akkordeon savol-javoblar.
  7. ⚠️ **Bildirishnomani o'chirishni tasdiqlash modali:** Xavfsizlik ogohlantirish dialogi.
  8. 💬 **24/7 Operator bilan bog'lanish:** Telegram qo'llab-quvvatlash botiga to'g'ridan-to'g'ri o'tish.

---

### 🔹 7. Tezkor Qidiruv Sahifasi (`/search`) va Bildirishnomalar (`/notifications`)
* **Qidiruv:** Toza sarlavha, debounced jonli qidiruv, PostgreSQL Trigram GIN indeksi orqali <0.01s qidiruv tezligi.
* **Bildirishnomalar Markazi:** Buyurtma, aksiya va tizim xabarlari, o'qilgan deb belgilash va to'g'ridan-to'g'ri buyurtmaga o'tish tugmalari.

---

### 🔹 8. Enterprise Web Admin Panel (`/admin`)
* **Dizayn Standarti va Rejimlar**: Loyihaning rasmiy minimal dizayn tizimiga (`bg-[#FAFAFA]` / `dark:bg-[#0B0F17]`) 100% moslashtirilgan, yorug' (Light) va qorong'u (Dark) rejimlar o'rtasida 1-klikda almashinuvchi interfeys.
* **Tozalangan Minimalist Yuqori Navbar (Ultra-clean Top Navbar)**:
  - Barcha tarqoq elementlar, ovoz sinovi, til va tema tugmalari yuqori paneldan butunlay tozalandi.
  - Faqat: Mobil menyu tugmasi, Do'kon logotipi va toza Qidiruv paneli (`Qidirish...`).
* **6 ta Konsolidatsiyalashgan Asosiy Boshqaruv Markazi (6-Hub Architecture)**:
  1. 📊 **Dashboard & Analitika Hub**:
     - **Ko'p Darajali Vaqt Oralig'i & Taqvim (Advanced Date Range & Comparison):**
       * `[ Bugun | Oxirgi 7 kun | Shu oy | Shu yil (2026) | 📅 Oraliq tanlash ]` bo'yicha dinamik tushum, buyurtmalar soni va o'rtacha chek.
       * **📅 Ixtiyoriy Sana Tanlagich Modali (Custom Date Range Picker):** Boshlanish va tugash sanalarini erkin tanlash hamda oxirgi 30 kun / 3 oy tezkor shablonlari.
       * **⚖️ O'tgan Davr Bilan Solishtirish Rejimi (Period-over-Period Comparison):** 1-klikda solishtirish yoqilib, o'tgan yil/oy/haftaga nisbatan o'sish/pasayish deltalari (`+26.8%`) va grafikda yonma-yon qo'shaloq ustunlar (Joriy davr vs O'tgan davr legendasi) bilan vizuallashadi.
     - **Buyurtmalar Holati Mini-Hunisi (Order Pipeline Funnel):** `Yangi (NEW)`, `Jarayonda (PROCESSING)`, `Kuryerda (DELIVERING)`, `Yetkazildi (COMPLETED)`, `Bekor qilindi (CANCELLED)` sonlari va 1-klikda o'sha status bo'yicha Buyurtmalar bo'limiga sakrash.
     - **Ombor Qiymati & Aktivlar (Inventory Assets Valuation):** Ombordagi jami tovarlarning chakana qiymati (`UZS`) va faol SKU soni.
     - **Kam qolgan tovarlar signali (Low Stock Warning Alert):** Omborda zaxirasi $\le 3$ qolgan tovarlar alohida ogohlantirish kartasida chiqadi va bosilganda to'g'ridan-to'g'ri Katalog bo'limiga o'tadi.
     - **Apple & Stripe Uslubidagi Gibrid Interaktiv Grafik (Hybrid Area Wave & Neo-Bar Chart):**
       * **Rejimlar almashinuvi:** `[ 📈 To'lqinli (Smooth Bézier Spline) | 📊 Ustunli (Neo-Bars) ]` tugmasi.
       * **Suzuvchi Tooltip (Glassmorphism):** Nuqta ustiga borganda aniq summa, foiz va solishtirma oynachasi ochiladi.
       * **Y-Axis Valyuta Shkalasi & Gorizontal Setka:** Dinamik `6.0M`, `4.0M`, `2.0M`, `0 UZS` shkalalari.
       * **3 ta Mini-HUD Tahliliy Xulosalari:** 🏆 *Eng yuqori cho'qqi*, ⚡ *Davr bo'yicha o'rtacha tushum*, 📈 *O'sish dinamikasi*.
     - **To'lov Usullari Taqsimoti (Donut & Progress Bars Hybrid):**
        * **Dumaloq Diagramma (Interactive SVG Donut Chart):** Payme (45%), Click (35%) va Naqd (20%) rangli halqalari va markaziy interaktiv indikator.
        * **Progress Barlar & Aniq Summala:** Har bir usul bo'yicha foiz, to'lov nomi va davrdagi aniq tushum summasi (`UZS`).
        * **Interaktiv Hover:** Halqa yoki to'lov turi ustiga borganda markazda ulush va summa ko'rinishi.
     - **Bekor qilish ko'rsatkichi (Cancellation Rate % & Reasons):** Bekor qilish foizi va eng ko'p uchragan asosiy sabab.
     - **Eng ko'p sotilgan TOP-3 tovarlar shohsupasi (Top-3 Selling Leaderboard):** Xit tovarlar reytingi (🥇 Oltin, 🥈 Kumush, 🥉 Bronza), tovar rasmi, sotilgan donasi va keltirgan tushumi.
  2. 📋 **Buyurtmalar & Kuryer Hub (Orders & Logistics Hub)**:
     - **Zamonaviy Popover Dropdownlar (Zero Native Selects):** Barcha filtrlar (`Sana`, `Yetkazish`, `To'lov`, `Saralash`) Apple/Farfetch standartidagi ochiluvchi popover menyular orqali boshqariladi (`rounded-2xl`, soya `shadow-xl`, aylanuvchi strelka `ChevronDown`, tanlangan bandda `<Check />` belgisi va `outside-click` yopilish mexanizmi).
     - **Kunlik va Davriy Filtrlash (Period Date Filters):** `Bugun`, `Oxirgi 7 kun`, `Shu oy`, `Shu yil (2026)` filtrlari to'g'ridan-to'g'ri jadval ustidagi filtrlar qatoriga birlashtirilgan.
     - **Ombor Qoldiqlarining Avtomatik Sinxronizatsiyasi (Stock Auto-sync):**
        * Yangi buyurtma yaratilganda tovar va uning tanlangan varianti ombor zaxirasidan avtomatik ayiriladi (`deductStock`).
        * Buyurtma bekor qilinganda (`CANCELLED`), barcha tovarlar avtomatik ravishda omborga qaytariladi (`restoreStock / Restock`).
     - **Holatlar O'tishining Avtomatlashtirilgan Mantiqi (Auto State Transitions):**
        * Naqd to'lovli (`CASH`) buyurtma `COMPLETED` bo'lganda to'lov holati avtomatik ravishda `PAID` ga o'tadi.
        * To'langan (`PAID`) buyurtma bekor qilinganda to'lov holati avtomatik tarzda `REFUNDED` ga aylanadi.
        * Kuryer biriktirilganda buyurtma avtomatik `DELIVERING` holatiga o'tadi.
     - **Qo'lda Buyurtma Yaratish (Manual Order Modal):**
        * Xaridor ismi va manzilini qat'iy sanitarizatsiya qilish (kodlar va maxsus belgilar bloklanadi).
        * Telefon raqamiga qat'iy `+998 (XX) XXX-XX-XX` maskasi va 12 raqamli tekshiruv.
        * Katalogdan real vaqtda tovar tanlash, variantlar va mavjud ombor zaxirasini tekshirish.
        * Jonli summa va bepul yetkazib berish chegarasi (>300,000 UZS) hisob-kitobi.
     - **1-Klikda Tezkor Harakatlar:**
        * Mijoz bilan 1-klikda Telegram chatini ochish (`https://t.me/+998...`).
        * Buyurtma xulosasini buferga nusxalash (`Clipboard`) va bildirishnoma tosti.
        * Telefon raqami ustiga bosib qo'ng'iroq qilish (`tel:...`).
     - **Bekor Qilish Sabablari Modali (Cancel Reason Modal):** Standart sabablar ro'yxati va ixtiyoriy matnli izoh kiritish.
     - **Kuryer Tayinlash Modali (Courier Assignment):** Tizimda ro'yxatdan o'tgan faol kuryerlar (`role: COURIER`) ro'yxatidan tanlash.
     - **Harakatlar Tarixi Jurnali (Order Activity Logs):** Har bir o'zgarish vaqti va ijrochisi bilan qayd etib boriladi.
     - **80mm Standartdagi Termal Chek:** Kassa apparatlari uchun maxsus formatlangan chiroyli kvitansiya chop etish darchasi.
     - **Microsoft Excel / CSV Eksport:** Tanlangan filtrlarga mos ravishda **UTF-8 BOM (`\uFEFF`)** va nuqta-vergul (`;`) ajratgichli to'liq 14 ta ustunli hisobot yuklab olish.
     - **Tozalangan Modallar (Decluttered UI):** Modaldagi ortiqcha va takroriy tugmalar olib tashlangan, pastda faqat bitta toza `Yopish` tugmasi qoldirilgan.
  3. 📦 **Katalog Boshqaruvi Hub**:
     - *Mahsulotlar:* 3 tildagi JSONB nom/tavsif, Gemini AI tarjimasi, narx, ombor qoldig'i, kam qolgan tovarlarda `⚠️ Kam qoldi` stikeri va `+5` / `+10` zaxira qo'shish tugmalari, qurilmadan to'g'ridan-to'g'ri rasm yuklash (`useProductStore`).
     - *Kategoriyalar:* Toifalar Stories boshqaruvi, fayldan rasm yuklash, ko'rsatish/yashirish (`isActive`) va o'chirish (`useCategoryStore`).
     - *Sharhlar:* Xaridorlar qoldirgan 1-5 yulduzli sharhlarni tasdiqlash (`APPROVED`) yoki rad etish (`REJECTED`) moderatsiyasi (`useReviewStore`).
  4. 👥 **Mijozlar Bazasi va CRM Hub**:
     - Telegram xaridorlari ro'yxati, `@username`, telefon raqami, buyurtmalar soni va jami sarflangan summa (LTV).
     - 1-klikda Telegram chatiga o'tish (`https://t.me/username`), VIP mijoz qilish (`VIP`) va firibgarlarni bloklash (`BLOCKED`) boshqaruvi (`useCustomerStore`).
  5. 🎯 **Marketing va Reklama Hub**:
     - *Bannerlar:* Bosh sahifadagi 16:9 HD slayderlarini fayldan yuklash va havola biriktirish (`useBannerStore`).
     - *Promokodlar:* Chegirma foizlari, minimal buyurtma va ishlatilish limitlarini belgilash.
     - *Xabarnomalar:* Barcha mijozlarga rasm va CTA tugmali ommaviy push xabarlar yuborish (`useNotificationStore`).
  6. ⚙️ **Tizim va Sozlamalar Hub**:
     - *Tizim va Interfeys Sozlamalari:* Ilova tilini tanlash (`UZ`, `RU`, `EN`) va Vizual mavzu rejimini tanlash (☀️ Yorug' / 🌙 Qorong'u).
     - *Do'kon & To'lovlar:* Do'kon nomi, telefon, Telegram bot, ish vaqti, yetkazib berish narxlari va bepul chegara, to'lov shlyuzlari (Payme, Click, Naqd) va Gemini AI kaliti (`useSettingsStore`).
     - *Xodimlar & Rollar:* Super Admin, Menejer va Kuryer rollarini taqsimlash (`useStaffStore`).
     - *Audit Jurnali:* Tizimdagi harakatlarni vaqti va bajaruvchisi bilan qayd etuvchi xavfsizlik jurnali (`useAuditStore`).
* **Mobil 4-Tabli Pastki Navigatsiya (Mobile 4-Tab Bottom Bar)**:
  - `[ Dashboard, Buyurtmalar, Katalog, Barchasi/Menu ]`
  - `Barchasi` tugmasi `Mijozlar (CRM)`, `Marketing` va `Sozlamalar` bo'limlarini o'z ichiga olgan qulay Bottom Sheet / Drawer ochadi.

---

## 4. Loyihaning 5 ta Asosiy Hujjatlar Indeksi (Docs Suite Index)

1. 📄 **[1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md):** Loyihaning to'liq PRD hujjati va Bosh sahifa hamda ichki sahifalar strukturasi.
2. 📄 **[2_Texnik_Arxitektura.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/2_Texnik_Arxitektura.md):** 18 ta jadval DB sxemasi, GIN indexes, Redis Atomic Stock Lock va Infratuzilma.
3. 📄 **[3_Telegram_Integratsiya.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/3_Telegram_Integratsiya.md):** `@telegram-apps/sdk`, HMAC auth, `requestContact` va Bot API xabarnomalari.
4. 📄 **[4_UI_UX_Dizayn_Tizimi.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/4_UI_UX_Dizayn_Tizimi.md):** Apple & Farfetch Minimalist Dizayn Tizimi, Dark Mode Standartlari va Uzum Market Komponentlari.
5. 📄 **[5_Roadmap.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/5_Roadmap.md):** Barcha ishlab chiqish sprintlari (Sprint 1 - Sprint 8).
