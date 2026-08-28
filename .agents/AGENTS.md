# Foydalanuvchining Doimiy Dizayn Qoidalari va Standartlari (Production Design System)

Ushbu qoidalar loyihadagi barcha UI/UX komponentlari va sahifalar uchun 100% majburiy hisoblanadi:

## 1. 🔤 Tipografiya va Matn Iyerarxiyasi (Typography & Hierarchy)
- **Asosiy Shrift**: Yagona toza sans-serif shrift (Inter / Plus Jakarta Sans).
- **Mahsulot Nomi**: `text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] leading-snug`.
- **Asosiy Narx**: `text-base font-bold text-gray-950`.
- **Eski Narx**: `text-xs font-normal text-gray-400 line-through`.
- **Kategoriya / Ikkilamchi ma'lumot**: `text-xs uppercase tracking-wider text-gray-400 font-semibold`.

## 2. 🔲 Standartlashtirilgan Radiuslar va Soyalar (Radii & Shadows)
- **Tashqi bloklar, Bannerlar va Kapsulalar**: `rounded-2xl`
- **Mahsulot Kartochkalari**: `rounded-xl border border-gray-200/70 shadow-sm bg-white hover:shadow-md hover:-translate-y-0.5 transition-all`
- **Tugmalar va Kiritish maydonlari (Buttons & Inputs)**: `rounded-lg`
- **Yorliqlar va Stikerlar (Badges)**: `rounded-md text-[11px] font-semibold px-2 py-0.5`

## 3. 🛍️ Uzum Market Uslubidagi Pastki Tugma (`ProductCard`)
- Narx har doim alohida qatorda to'liq kenglikda turadi (`text-base font-bold text-gray-950`).
- Pastida to'liq kenglikdagi harakat tugmasi:
  - 0 dona bo'lsa: `w-full h-9 bg-gray-900 text-white rounded-lg font-semibold text-xs` (`[ 🛒 Savatga ]` / `[ 🛒 В корзину ]` / `[ 🛒 Add to Cart ]`).
  - \> 0 dona bo'lsa: `w-full h-9 bg-gray-900 text-white rounded-lg px-2 flex items-center justify-between font-bold text-xs` (`[ - X ta + ]`).
  - Kamaytirganda 0 ga tushib savatdan to'g'ri o'chirilishi shart.

## 4. 🏷️ Uzum Market Uslubidagi Gorizontal Kategoriya Kapsulalari (`CategoryCarousel`)
- Gorizontal kapsula tabletkalar (`h-[56px] sm:h-[60px] px-4 rounded-2xl`).
- Chapda doiraviy mini rasm/ikonka (`w-[38px] h-[38px] rounded-full overflow-hidden`), o'ngda toifaning aniq nomi (`text-sm font-semibold whitespace-nowrap`).
- Ortiqcha "Kategoriyalar < >" sarlavhasi olib tashlangan, to'g'ridan-to'g'ri banner ostida joylashadi.

## 5. ⭕ Instagram Stories Standarti (`StoriesReel` & `StoriesModal`)
- Bosh sahifa doiralari: `w-[62px] h-[62px] sm:w-[70px] sm:h-[70px] rounded-full border-2 border-gray-950 p-[2.5px]`. Ortiqcha oq xatoliklar yo'qotilgan.
- To'liq ekranli Instagram modali: Ko'p segmentli progress-bar, chap/o'ng bosish bilan o'tish, bosib turganda to'xtatish (Hold to pause), double-tap bilan like (yurakcha animatsiyasi).

## 6. 🖼️ Rasmlarning Kvadrat Standarti (Aspect Ratios)
- Barcha mahsulot kartochkalaridagi rasm konteyneri qat'iy **`aspect-square w-full overflow-hidden bg-gray-50 rounded-lg`** bo'ladi.
- Rasmlar **`object-cover object-center`** bilan xatosiz markazlashtiriladi.

## 7. ⚡ Interaktiv Mikro-animatsiyalar (Micro-animations)
- Barcha bosiluvchi tugmalar, kartochkalar va havolalarga: **`active:scale-95 transition-transform duration-100`** qo'llanadi.
- Telegram Haptic Feedback qo'llab-quvvatlanadi (`impactOccurred`).

## 8. 🎨 Ranglar Palitrasi (Apple & Farfetch Minimalist)
- **Sahifa foni**: `bg-[#FAFAFA]`
- **Asosiy harakat**: Dark Charcoal / Black (`#111827` / `bg-gray-900 text-white hover:bg-black`)
- **Chegirma yorlig'i**: `bg-red-50 text-red-600 border border-red-100 rounded-md text-[11px] font-semibold px-2 py-0.5`
- **Taqiq**: Nasiya / bo'lib to'lash yorliqlari butunlay chiqarib tashlangan, asosiy narxga to'liq ustuvorlik beriladi.

## 9. 🏛️ Bosh Sahifaning Qat'iy Ketma-ketligi (Home Page Strict Order)
1. **Header** (Logo, Search, Wishlist, Cart, Profile `hidden md:flex`)
2. **Stories Bar** (Instagram doiralari)
3. **Hero Banner Slider** (Toza rasmli slayder)
4. **Categories Carousel** (Uzum Market gorizontal kapsulalari)
5. **Main Product Showcase** (Sarlavha: "Tavsiya etiladigan mahsulotlar", Tablar: "Barchasi", "Mashhur", "Yangi", Uzum uslubidagi pastki tugmali kartochkalar)
6. **Telegram Support CTA Banner**
7. **Trust & Warranty Badges** (Original, Tezkor yetkazish, Oson qaytarish)
8. **Bottom Nav & Clearance** (`pb-24`)

## 10. 🌐 Ko'p Tillilik (i18n) Standarti
- Ilova 3 tilda to'liq ishlaydi: **O'zbekcha (`UZ`)**, **Ruscha (`RU`)**, **Inglizcha (`EN`)**.
- Markaziy boshqaruv: `useLanguageStore` (Zustand) + `src/locales/translations.ts`.
- Profil orqali til o'zgartirilganda butun ilova (mahsulot nomlari, toifalar, barcha sahifalar, buyurtma, savat va pastki menyu) darhol yangilanadi.

## 11. 📂 Uzum Mobile Master-Detail 2-Ustunli Katalog Standarti (`/catalog`)
- **Chap ustun (Master)**: Asosiy toifalar (rasm + toifa nomi).
- **O'ng ustun (Detail)**: Subkategoriya tugmalari (pills) va mahsulotlar panjarasi.
- **Filtr Modali**: Saralash tartibi (Mashhurlari, Yangi kelganlar, Narx o'sish/kamayish), narx slayderi (0 - 1,000,000 UZS), faqat chegirmadagi mahsulotlar va filtrlarni tozalash (Reset).

## 12. 💖 & 🛒 Bo'sh Holatlar Standarti (Wishlist & Cart Empty State Standard)
- `/wishlist` va `/cart` hech qachon quruq bo'shab qolmaydi.
- Yuqorida ixcham bildirishnoma qutisi + Katalogga o'tish tugmasi.
- Pastida to'liq *"Mashhur"* tavsiya etiladigan mahsulotlar panjarasi joylashadi.

## 13. 👤 Profil va Mustaqil Modallar Standarti (`/profile`)
- Profil sahifasi doiraviy gradient avatar va tasdiqlangan nishon (`✓`) bilan boshlanadi.
- Apple/Telegram sozlamalar ro'yxati uslubida ixcham bloklarga bo'linadi.
- Har bir bo'lim (Buyurtmalar tarixi, Keshbek/Promokodlar, Manzillar, Til tanlash, Mavzu, FAQ) alohida mustaqil modal oyna (Drawer/Modal) ko'rinishida ochiladi.

## 14. 🌓 Haqiqiy Qorong'u Rejim Standarti (Dark Mode Standard)
- **Fikr va Arxitektura**: Butun ilova to'liq `dark` klassi va `useThemeStore` orqali ishlaydi, tanlangan rejim `localStorage` (`app_theme`) da saqlanadi.
- **Qorong'u Fon va Sirtlar**: Asosiy fon `dark:bg-[#0B0F17]`, kartochkalar va modallar `dark:bg-[#111827]`, ikkilamchi bloklar `dark:bg-[#161F30]`, chegaralar `dark:border-white/10`.
- **Harakat Tugmalari (Action Buttons)**: Qorong'u rejimda barcha asosiy harakat tugmalari, faol tablar va saralash tabletkalari to'liq yuqori kontrastli oq rangda bo'ladi: **`dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100`**.
- **Keshbek Kartasi**: Qorong'u rejimda to'q zumrad shaffof kartaga aylanadi: `dark:bg-emerald-950/50 dark:border-emerald-800/50`.

## 15. 🔔 Telegram Bildirishnomalari va O'chirishni Tasdiqlash Standarti (Notifications Safety Standard)
- **Standart Holat**: Barcha foydalanuvchilar uchun standart yoqilgan (`true`) bo'ladi va `localStorage`da eslab qolinadi.
- **Checkbox Ko'rinishi**:
  - Yorug' rejimda: Qora kvadrat + oq ptichka (`bg-gray-900 text-white`).
  - Qorong'u rejimda: Oq kvadrat + qora ptichka (`dark:bg-white dark:text-gray-950`).
- **O'chirish Xavfsizligi (Confirmation Dialog)**: Foydalanuvchi bildirishnomani o'chirmoqchi bo'lsa, ogohlantirish modali ochilib buyurtma holatlari va aksiyalar yetib bormasligi haqida 3 tilda (`UZ`, `RU`, `EN`) so'raladi.

## 16. 🚫 Avtomatlashgan Brauzer Tekshiruvi Taqiqi
- Foydalanuvchi qat'iy talabi bo'yicha avtomatlashgan brauzer subagenti ishlatilmaydi.
- Tekshiruvlar faqat `npx tsc --noEmit` va dev server loglari orqali amalga oshiriladi.

## 17. ⚙️ Enterprise Web Admin Panel Standarti (`/admin`)
- **Dizayn va Ranglar Standarti**: Loyihaning umumiy minimalist Farfetch/Apple dizayn tizimiga 100% bo'ysunadi. Asosiy fon `bg-[#FAFAFA]` (Light) / `dark:bg-[#0B0F17]` (Dark), panellar `bg-white` / `dark:bg-[#111827]`, ikkilamchi bloklar `bg-gray-50` / `dark:bg-[#161F30]`, chegaralar `border-gray-200/80` / `dark:border-white/10`.
- **Harakat Tugmalari va Tablar**: Tanlangan faol tablar va asosiy harakat tugmalari yorug' rejimda qora (`bg-gray-900 text-white`), qorong'u rejimda esa yuqori kontrastli oq (`dark:bg-white dark:text-gray-950`) bo'ladi.
- **Ko'p Tillilik (100% i18n)**: Boshqaruv konsoli 3 ta tilda (`UZ`, `RU`, `EN`) ishlaydi va `useLanguageStore` orqali dinamik almashtiriladi.
- **11 ta Enterprise Boshqaruv Moduli**: Buyurtmalar (va CSV eksport / chek), Savdo Analitikasi (SVG grafiklar), Mahsulotlar CRUD (va fayldan rasm yuklash), Kategoriyalar Story, Bannerlar Carousel, Sharhlar Moderatsiyasi, Promokodlar, Ommaviy Bildirishnomalar, Xodimlar va Rollar RBAC (`useStaffStore`), Audit Jurnali (`useAuditStore`) va Tizim/Do'kon Sozlamalari (`useSettingsStore`).
- **Dashboard & Analitika Hub Standartlari**:
  - **Daromad Dinamikasi Grafiki**: To'lqinli (`Area`) va Ustunli (`Bar`) SVG rejimlar, `padLeft: 58` koordinatalar bilan Y-o'qiga matn tushmasligi, 100% matematik hisob-kitoblar va davrlar bo'yicha dinamik o'sish ko'rsatkichi (`+X.X%`).
  - **O'tgan Davr Bilan Solishtirish (`Period Comparison`)**: Joriy davr (to'q chiziq/ustun) va o'tgan davr (kulrang punktir/och ustun) taqqoslanishi, interaktiv tooltipda farq foizi va o'tgan summa ko'rsatilishi.
  - **To'lov Usullari Taqsimoti**: Dumaloq Donut (`SVG Donut Chart`, markaziy indikator) va Chiziqli progress-barlar almashuvi.
  - **TOP-3 Shohsupa Reytingi**: 🥇 Oltin Toj (`Crown`), 🥈 Kumush Medal, 🥉 Bronza Medal bilan TOP-3 tovarlar va 1-klikda to'g'ridan-to'g'ri filtrlab katalogga o'tish.
  - **Buyurtmalar Oqimi (Funnel)**: 4 ta asosiy holat (`NEW`, `DELIVERING`, `COMPLETED`, `CANCELLED`).
  - **Toza Navigatsiya (Decluttered Header)**: Dashboard bo'limida ortiqcha qidiruv maydoni ko'rsatilmaydi, qidiruv faqat Katalog, Buyurtmalar va Mijozlar bo'limlarida chiqadi va bo'lim alishganda avtomatik tozalanadi.
- **Ovozli Signal**: Yangi buyurtma yoki hodisalarda Web Audio API chimes signali yangraydi.

## 18. 🛡️ Ma'lumotlarni Qat'iy Validatsiya Qilish, Xavfsizlik va Daxlsiz/Neytral Matnlar Standarti (Input Validation, Data Safety & Neutral Placeholders)
- **Daxlsiz & Neytral Placeholderlar (No Advertisements or Specific Names)**:
  - Barcha kiritish maydonlarida (Input, Textarea) aniq shaxslar yoki do'konlar reklama qilinmaydi.
  - Faqat neytral, professional matnlar ishlatiladi: `Ism Familiya`, `+998 (90) 123-45-67`, `Yetkazib berish manzili...`, `Qo'shimcha izoh...`.
- **Telefon Raqam Maskasi va Qat'iy Cheklov (Strict Phone Formatting)**:
  - Telefon maydoniga faqat raqamlar yozilishi ta'minlanadi, barcha harflar va begona simvollar avtomatik bloklanadi.
  - Avtomatik O'zbekiston kodi bilan formatlanadi: `+998 (XX) XXX-XX-XX` (jami 9 ta mahalliy raqam).
  - Raqam 12 ta belgidan (`998XXXXXXXXX`) kam bo'lsa, shakl saqlanmaydi va xatolik ko'rsatiladi.
- **Ism va Matnlarni Sanitarizatsiya Qilish (Name & Text Sanitization)**:
  - Ism kiritish maydoniga sonlar, dastur kodlari (`<script>`, SQL injection belgilari) yoki maxsus simvollar kiritilishi bloklanadi (faqat lotin, kirill harflari, bo'shliq va tutuq belgisi `'`).
- **Tugmalar va Interfeys Matnlari Tozaligi**:
## 19. 📦 Enterprise Buyurtmalar va Logistika Hub Standarti (Orders & Logistics Hub Standard)
- **Zamonaviy Popover Dropdownlar (Zero Native Selects in Filters)**:
  - Eski brauzer `<select>` menyulari butunlay taqiqlangan.
  - Barcha filtrlar (`Sana`, `Yetkazish`, `To'lov`, `Saralash`) loyiha dizayn tizimiga moslashtirilgan popover dropdown komponentlari orqali ishlaydi (`rounded-2xl`, soya `shadow-xl`, aylanuvchi strelka `ChevronDown`, tanlangan bandda `<Check />` belgisi va `outside-click` yopilish mexanizmi).
- **Kunlik va Davriy Filtrlash (Period Date Filters)**:
  - Buyurtmalar jadvalida davr bo'yicha saralash to'g'ridan-to'g'ri filtrlar qatorida bir xil dizaynda joylashadi (`Bugun`, `Oxirgi 7 kun`, `Shu oy`, `Shu yil`).
- **Avtomatlashgan Ombor Sinxronizatsiyasi (Automatic Inventory Stock Sync)**:
  - Yangi buyurtma yaratilganda mahsulot va uning tanlangan varianti ombor zaxirasidan avtomatik ayiriladi (`deductStock`).
  - Buyurtma bekor qilinganda (`CANCELLED`), barcha tovarlar avtomatik ravishda omborga qaytariladi (`restoreStock / Restock`).
- **To'lov va Logistika Holatlarining Avtomatik O'tishi**:
  - `CASH` to'lovli buyurtma `COMPLETED` bo'lganda to'lov holati avtomatik ravishda `PAID` ga o'tadi.
  - To'langan (`PAID`) buyurtma bekor qilinganda to'lov holati avtomatik `REFUNDED` ga aylanadi.
  - Kuryer biriktirilganda buyurtma avtomatik `DELIVERING` holatiga o'tadi.
- **Harakatlar Jurnali (Audit & Activity Logs)**:
  - Buyurtma ustida amal bajarilganda vaqti va ijrochisi bilan `activityLogs` va global `useAuditStore` ga qayd etiladi.
- **MS Excel va Termal Chek Standarti**:
  - CSV eksport fayllari **UTF-8 BOM (`\uFEFF`)** va nuqta-vergul (`;`) ajratgichi bilan shakllantirilib, Microsoft Excel dasturida harflar buzilmasdan ochilishi ta'minlanadi.
  - Kassa apparatlari uchun 80mm formatidagi termal chek generatori mavjud.
- **Toza Modallar (Decluttered UI)**:
  - Buyurtma modallarida takroriy tugmalar bo'lmaydi, harakatlar yuqori sarlavhada ixcham joylashadi, pastki qismda faqat yagona toza `Yopish` tugmasi qoldiriladi.

## 20. 🛍️ Enterprise Katalog, Mahsulotlar & Sharhlar Moderatsiyasi Hub Standarti (Catalog & Reviews Hub Standard)
- **Zero Native Selects va Popover Standarti**:
  - Katalog filtrlari (Kategoriya, Zaxira holati, Nishon, Saralash) va mahsulot formasi tanlovlari to'liq loyihaning maxsus popover dropdownlari orqali boshqariladi (`custom-filter-dropdown-container`).
- **Mahsulotlar Mini-HUD Ko'rsatkichlari**:
  - Jami mahsulotlar soni, jami zaxira birligi, tugagan tovarlar (qizil) va kam qolgan tovarlar (amber ogohlantirish) jonli hisoblanadi va 1-klikda filtrlanadi.
- **Ko'rinish Rejimlari (Grid vs Table)**:
  - **Grid Rejimi**: Farfetch & Apple minimalist kartochkalari, kvadrat rasm (`aspect-square`), to'liq narx va chegirma hisobi, tezkor restock tugmalari (`+5`, `+10`).
  - **Table Rejimi**: Zich ma'lumotlar jadvali, ommaviy tanlash katakchalari, tezkor harakatlar.
- **Ommaviy Harakatlar Paneli (Bulk Actions Bar)**:
  - Bir nechta tovar tanlanganda: ommaviy zaxira qo'shish (`+5`, `+10`), nishon berish (`TOP`, `SALE`) va ommaviy o'chirish.
- **Universal Mahsulot Modali & Gemini AI Integratsiyasi**:
  - 3 tilda (`UZ`, `RU`, `EN`) nom va tavsiflar.
  - `✨ Gemini AI` tugmasi bilan avtomatik yuqori sifatli marketing matnlari va tarjimalar yaratilishi.
  - Qurilmadan ko'p rasmli galereya yuklash (FileReader Base64), asosiy rasmni belgilash va o'chirish.
  - Dinamik SKU & Variantlar jadvali (O'lcham, rang, narx, qoldiq).
- **Kategoriyalar va Sharhlar Moderatsiyasi**:
  - Kategoriyalar statistikasi, ko'rinish holatini yoqish/o'chirish (`Eye`/`EyeOff`), tahrirlash va o'chirish.
  - Sharhlar mini-HUDi (Kutilayotgan, tasdiqlangan, rad etilgan, o'rtacha reyting), yulduzli va statusli popover filtrlar, 1-klikda tasdiqlash/rad etish va barchasini ommaviy tasdiqlash (`Approve All`).

## 21. 💬 Enterprise Sharhlar Xavfsizligi, FIFO Cheklovi & Moderatsiya Standarti (Reviews Policy & Architecture)
- **Haqiqiy Xaridor Tekshiruvi (`Verified Buyer`)**:
  - Mahsulot sahifasida sharh qoldirish uchun xaridor ushbu tovarni avval xarid qilgan bo'lishi shart (`useOrderStore` va `localStorage` orqali tekshiriladi).
  - Xarid qilmagan foydalanuvchiga sharh yozish shakli ochilmaydi, o'rniga xavfsizlik modali (`ShowNotEligibleModal`) chiqadi.
- **Anti-Spam Cheklovi (1 Xaridor = 1 Sharh)**:
  - Bitta xaridor bitta mahsulotga faqat 1 dona sharh qoldira oladi. Agar avval yozgan bo'lsa, `"Siz allaqachon sharh qoldirgansiz"` ogohlantirish oynasi ochiladi.
- **Rasmlar Xavfsizligi va Filtrlari**:
  - MIME-type tekshiruvi (faqat `image/jpeg`, `image/png`, `image/webp`).
  - Hajm cheklovi: Har bir rasm maksimal 5 MB.
  - Soni: Maksimal 4 tagacha rasm.
- **Maksimal Sharhlar Ko'rsatish Cheklovi & FIFO Siyosati (`maxReviewsPerProduct`)**:
  - Mahsulot sahifasida xaridorlarga bir vaqtning o'zida eng yangi N ta tasdiqlangan sharh ko'rsatiladi (`allApprovedReviews.slice(0, maxReviewsPerProduct)`).
  - Yangi sharh tasdiqlanganda eng eskisi o'rnini bo'shatadi (FIFO).
  - Admin do'kon sozlamalaridan (`/admin` -> Sozlamalar) ushbu limitni (5, 10, 20, 50 ta) erkin boshqara oladi.
- **Interaktiv "Foydali bo'ldi 👍" Reytingi**:
  - Mijozlar sharhlarga "Foydali" laykini bosishi, do'kon ma'muriyatining rasmiy javobini ko'rishi mumkin.
- **Brauzer Popuplari Butunlay Yo'qotilgan (Custom Confirmation Modal)**:
  - Brauzerning `window.confirm` xabarlari butunlay taqiqlangan. O'chirish amallarida loyiha dizayniga moslashtirilgan xavfsiz qizil modal (`openConfirmDialog`) ishlatiladi.



