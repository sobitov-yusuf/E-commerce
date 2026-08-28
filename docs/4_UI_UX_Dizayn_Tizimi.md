# 4. UI/UX Dizayn Tizimi (Design System) — Production Grade Standard

Ushbu hujjat do'konning barcha vizual komponentlari, ranglar palitrasi (Light & Dark rejimlar), tipografiyasi, radiuslari, tugmalar tuzilishi, modallar va mikro-interaksiyalari bo'yicha qat'iy standartlarni belgilaydi.

---

## 🎨 1. Ranglar Palitrasi (Light & Dark Mode Tokens)

| Element Nomi | Light Mode Token | Dark Mode Token | Qo'llanilishi |
| :--- | :--- | :--- | :--- |
| **Page Background** | `bg-[#FAFAFA]` | `dark:bg-[#0B0F17]` | Platformaning umumiy orqa foni |
| **Card Surface** | `bg-white` | `dark:bg-[#111827]` | Mahsulot kartochkalari, modallar, kapsulalar va Header |
| **Secondary Surface**| `bg-gray-50` | `dark:bg-[#161F30]` | Ichki bloklar, subkategoriya tabletkalari, promo kartochkalar |
| **Borders (Hairline)**| `border-gray-200/80`| `dark:border-white/10`| Nozik ajratuvchi chegaralar |
| **Primary Action Btn**| `bg-gray-900 text-white`| `dark:bg-white dark:text-gray-950` | Barcha asosiy harakat tugmalari, filtr qo'llash, buyurtma berish |
| **Active Pill / State**| `bg-gray-900 text-white`| `dark:bg-white dark:text-gray-950` | Tanlangan til, mavzu, variantlar va faol tablar |
| **Primary Text** | `text-gray-950` | `dark:text-white` | Asosiy sarlavhalar, yirik narxlar (`text-base font-bold`) |
| **Body / Title Text** | `text-gray-800` | `dark:text-gray-200` | Mahsulot sarlavhalari (`text-sm font-medium leading-snug`) |
| **Muted Text** | `text-gray-400` | `dark:text-gray-400` | Tavsiflar, sanalar va ikkilamchi parametrlar |
| **Cashback Card** | `bg-emerald-50 border-emerald-200` | `dark:bg-emerald-950/50 dark:border-emerald-800/50` | Keshbek balansi va bonus kartasi |
| **Discount Tag** | `bg-red-50 text-red-600` | `dark:bg-red-950/50 dark:text-red-400` | Yumshoq qizil chegirma yorlig'i (`-20%`) |
| **Stories Ring** | `border-2 border-gray-950`| `dark:border-white` | Stories doiralarining toza qora/oq halqasi |

> **Qat'iy Taqiq:** Nasiya va bo'lib to'lash ("oyiga ... UZS") yorliqlari butun platformadan to'liq chiqarib tashlangan. Asosiy narxga to'liq ustuvorlik beriladi.

---

## 🔤 2. Tipografiya Standarti (Typography & Hierarchy)

* **Asosiy Shrift:** Inter / Plus Jakarta Sans
* **Mahsulot Nomi:** `text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[40px] leading-snug`
* **Asosiy Narx:** `text-base font-bold text-gray-950 dark:text-white`
* **Eski Narx:** `text-xs font-normal text-gray-400 dark:text-gray-500 line-through`
* **Kategoriya / Ikkilamchi:** `text-xs uppercase tracking-wider text-gray-400 font-semibold`

---

## 🛍️ 3. Mahsulot Kartochkasi va Tugma Tuzilishi (Uzum Market Style Button Layout)

Mahsulot kartochkasining pastki qismi har doim ikki qatorda, qat'iy tartibda shakllantiriladi:

1. **Yuqori Qator (Narx qatori):**
   * Eski chizilgan narx yuqorida (`text-xs text-gray-400 line-through`).
   * Asosiy yirik narx pastida (`text-base font-bold text-gray-950 dark:text-white`).
   * Narx va tugma bir-birini qisib qo'ymasligi uchun butun kenglik faqat narxga ajratilgan.

2. **Pastki Qator (To'liq Enli Harakat Tugmasi):**
   * **Savatda bo'lmaganda (0 dona):** `[ 🛒 Savatga ]` — To'liq enli tugma (`w-full h-9 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-lg font-semibold text-xs active:scale-95`).
   * **Savatga qo'shilganda (> 0 dona):** `[ -   X ta   + ]` — To'liq enli stepper (`w-full h-9 bg-gray-900 dark:bg-[#1E293B] text-white rounded-lg px-2 flex items-center justify-between font-bold text-xs`). Minus bosilganda mahsulot miqdori 0 ga tushib savatdan to'g'ri o'chadi.

---

## 🏷️ 4. Kategoriyalar Kapsulalari (Uzum Market Style Horizontal Capsules)

* **Tuzilishi:** Gorizontal yotiq kapsula shaklidagi kartochkalar (`rounded-2xl`, balandligi `h-[56px] sm:h-[60px]`, ichki bo'shliq `px-4 sm:px-5`).
* **Chap qism:** Doiraviy mini rasm/ikonka konteyneri (`w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full overflow-hidden`).
* **O'ng qism:** Toifaning to'liq ko'rinuvchi nomi (`text-sm sm:text-[15px] font-semibold whitespace-nowrap`).
* **Holatlar:**
  * Nofaol: `bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#161F30]`.
  * Faol: `bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 font-bold shadow-md`.

---

## 📂 5. Master-Detail 2-Ustunli Katalog Dizayni (`/catalog`)

* **Chap ustun (Master Sidebar):** `w-[82px] sm:w-[100px] md:w-[210px]`, doiraviy rasm (`w-10 h-10`) va toifa nomi.
* **O'ng ustun (Detail Section):** Subkategoriya pills (`bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300` / `bg-gray-900 dark:bg-white text-white dark:text-gray-950`) va 2/3/4-ustunli mahsulot panjarasi.
* **Filtr Modali:** Pastdan chiquvchi silliq oyna (`bg-white dark:bg-[#111827] rounded-t-2xl sm:rounded-2xl`), 4 ta saralash tugmasi, narx slayderi va bir klikda qo'llash/tozalash tugmalari.

---

## 💖 & 🛒 6. Sevimlilar va Savat Bo'sh Holatlar Standarti (`/wishlist` & `/cart`)

* Bo'sh sahifa ko'rsatish qat'iyan man etiladi.
* **Tuzilishi:**
  - Yuqorida ixcham oq karta (`rounded-2xl border border-gray-200/80 dark:border-white/10 p-6`), ikonka va Katalogga o'tish oq/qora harakat tugmasi.
  - Pastida esa to'liq *"Mashhur"* tavsiya etiladigan mahsulotlar panjarasi.

---

## 👤 7. Profil, Bildirishnomalar va Standalone Modallar Standarti (`/profile`)

* **Shaxsiy karta:** Doiraviy gradient avatar (`w-14 h-14 rounded-full ring-2 ring-gray-100 dark:ring-white/10`), yashil tasdiqlangan xaridor nishoni (`✓`), Ism va username.
* **Menyu guruhlari:** Apple & Telegram sozlamalar uslubidagi ixcham bloklar (`rounded-2xl divide-y divide-gray-100 dark:divide-white/10 bg-white dark:bg-[#111827]`).
* **Telegram Bildirishnoma Checkboxi:**
  - Yorug' rejimda: Qora kvadrat + oq ptichka (`bg-gray-900 text-white`).
  - Qorong'u rejimda: Oq kvadrat + qora ptichka (`dark:bg-white dark:text-gray-950`).
* **Standalone Modallar:** Har bir amal alohida toza modal oyna sifatida ochiladi (Buyurtmalar, Keshbek/Promokodlar, Manzillar, Til tanlash, Mavzu rejimi, FAQ va Bildirishnomani o'chirishni tasdiqlash dialogi).

---

## 🌐 8. Ko'p Tillilik (i18n) Vizual Standarti

* Barcha tugmalar, narx birliklari (`UZS`), sarlavhalar va dialoglar 3 tilda (`UZ`, `RU`, `EN`) dinamik moslashadi.
* Matn uzunligi o'zgarganda tartib buzilmasligi uchun `truncate` va `line-clamp` qoidalariga amal qilinadi.

---

## ⚙️ 9. Admin Boshqaruv Paneli va Analitika Hub Standarti (`/admin`)

* **Gibrid Grafik UI (Area Wave & Neo-Bar Chart):**
  - Smooth Bézier Spline (`Area`) va zamonaviy ustunli (`Bar`) ko'rinish.
  - O'tgan davr bilan taqqoslash (`Period Comparison`): Joriy davr to'q rangda, o'tgan davr esa kulrang punktir/och ustunda.
  - Suzuvchi Glassmorphism Tooltip: Aniq summa, o'tgan summa va o'sish foizini (`+X.X%`) aks ettiradi.
* **To'lov Usullari Taqsimoti (Payment Breakdown):**
  - Segmentli almashtirgich: `[ 🍩 Doira (Donut) | 📊 Chiziqli (Bars) ]`.
  - 160x160 o'lchamli interaktiv SVG Donut va markaziy ma'lumot indikatori.
* **TOP-3 Shohsupa Reytingi (Podium Leaderboard):**
  - Oddiy raqamlar o'rniga: 🥇 Oltin Toj (`Crown`), 🥈 Kumush Medal (`Medal`), 🥉 Bronza Medal (`Medal`).
  - Kartochka bosilganda Katalog bo'limida aynan o'sha tovar bo'yicha filtrlab ochiladi.
* **Buyurtmalar Oqimi (Pipeline Funnel):**
  - 4 ta asosiy holat: 🟣 *Yangi*, 🟡 *Yetkazilmoqda*, 🟢 *Bajarildi*, 🔴 *Bekor qilindi*.
* **Toza Navigatsiya:**
  - Dashboard qismida ortiqcha qidiruv maydoni yashirilgan, bo'limlar almashganda qidiruv avtomatik tozalanadi.

---

## 🎛️ 10. Popover Dropdownlar va Modallar Ergonomikasi Standarti

* **Zamonaviy Popover Dropdownlar (Zero Native Selects):**
  - Brauzerning platforma-xos eski `<select>` elementlari o'rniga loyihaning to'liq nazorat ostidagi popover menyulari qo'llanadi.
  - `rounded-2xl` burchaklar, `shadow-xl` chuqur soyalar, tanlangan band yonida `<Check />` belgisi, ochilganda aylanuvchi strelka (`ChevronDown rotate-180`).
  - Tashqariga bosilganda o'z-o'zidan yopiluvchi `outside-click` mantiqi.
* **Tozalangan Modallar (Decluttered Action Layout):**
  - Takroriy tugmalar yo'qotilgan: amallar (Chek, Telegram, Nusxa) yuqori sarlavhada ixcham joylashadi.
  - Pastki footerda faqat toza, yagona `Yopish` tugmasi qoldiriladi.
* **Qorong'u Rejim Yuqori Kontrasti:**
  - Qorong'u rejimda barcha asosiy tugmalar va tanlangan filtrlar sof oq fonga (`dark:bg-white dark:text-gray-950`) aylanadi.

