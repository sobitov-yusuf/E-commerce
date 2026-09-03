# Universal E-Commerce Platformasi (TMA & Web) — UI/UX Dizayn Tizimi

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatning Vazifasi va Chegaralari (Scope & Boundaries)

Ushbu hujjat platformaning **barcha vizual standartlarini** — ranglar, tipografiya, radiuslar, soyalar, komponent tuzilishlari, qorong'u rejim, moslashuvchanlik va interaktiv animatsiyalarni **yagona boshqaruv markazi** sifatida belgilaydi.

**Maqsad:** Har qanday sahifa yoki komponent yaratilganda, dasturchi shu hujjatga qarab **100% bir xil** va **professional** darajada yasay olishi.

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. Ranglar Palitrasi (Light va Dark Mode tokenlari).
2. Tipografiya iyerarxiyasi (Shrift o'lchamlari va qalinliklari).
3. Radiuslar va Soyalar standarti.
4. Barcha UI Komponent spetsifikatsiyalari.
5. Moslashuvchanlik breakpointlari (Responsive Design).
6. Mikro-animatsiyalar va o'tishlar (Transitions).
7. Admin panel dizayn standarti.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Sahifalar Strukturasi va Biznes Mantiqlari:** [1_Talablar_PRD.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/1_Talablar_PRD.md) da.
2. **Bazaviy Jadvallar va API:** [2_Texnik_Arxitektura.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/2_Texnik_Arxitektura.md) da.
3. **Telegram SDK Kodlari:** [3_Telegram_Integratsiya.md](file:///c:/Users/HP/Desktop/Telegram%20Mini%20App/docs/3_Telegram_Integratsiya.md) da.

---

## 1. Ranglar Palitrasi (Light & Dark Mode Tokenlari)

Platforma **ikki rejimda** ishlaydi. Har bir element uchun aniq rang belgilangan:

| Element | Light Mode | Dark Mode | Qo'llanilishi |
|---------|-----------|-----------|---------------|
| **Sahifa Foni** | `#FAFAFA` | `#090D16` | Butun sahifa orqa foni |
| **Kartochka Yuzasi** | `#FFFFFF` | `#111827` | Mahsulot kartochkalari, modallar, panellar |
| **Ikkilamchi Yuzasi** | `#F9FAFB` (gray-50) | `#161F30` | Ichki bloklar, subkategoriya tabletkalari |
| **Chegaralar** | `#E2E8F0` (20% shaffof) | `rgba(255,255,255, 0.08)` | Nozik ajratuvchi chiziqlar |
| **Asosiy Harakat** | `#111827` (gray-900) fon, oq matn | `#FFFFFF` fon, `#030712` matn | Barcha tugmalar, faol tablar |
| **Asosiy Matn** | `#030712` (gray-950) | `#F9FAFB` | Sarlavhalar, narxlar |
| **Tana Matni** | `#1F2937` (gray-800) | `#E5E7EB` (gray-200) | Mahsulot nomlari |
| **So'niq Matn** | `#9CA3AF` (gray-400) | `#94A3B8` (slate-400) | Tavsiflar, sanalar |
| **Chegirma Yorlig'i** | `#FEF2F2` fon, `#DC2626` matn | `rgba(127,29,29,0.5)` fon, `#F87171` matn | `-20%` stikeri |
| **Keshbek Kartasi** | `#ECFDF5` fon, `#059669` chegara | `rgba(6,78,59,0.5)` fon, `rgba(5,150,105,0.5)` chegara | Bonus va keshbek bloki |
| **Stories Halqasi** | `#111827` (2px) | `#FFFFFF` (2px) | Aksiya doiralari |

> **Qat'iy Taqiq:** Nasiya va bo'lib to'lash (`"Oyiga ... UZS"`) yorliqlari butun platformadan to'liq chiqarib tashlangan. Faqat asosiy narx ko'rsatiladi.

---

## 2. Tipografiya Iyerarxiyasi

**Asosiy Shrift:** Inter / -apple-system / SF Pro Display / system-ui, sans-serif

| Maqsad | Tailwind Klasslari | Izoh |
|--------|-------------------|------|
| **Sahifa Sarlavhasi** | `text-lg font-bold text-gray-950` | Sahifa boshlang'ich sarlavhasi |
| **Bo'lim Sarlavhasi** | `text-base font-semibold text-gray-900` | Ichki bo'lim sarlavhasi |
| **Mahsulot Nomi** | `text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] leading-snug` | Kartochkadagi tovar nomi |
| **Asosiy Narx** | `text-base font-bold text-gray-950` | Joriy narx |
| **Eski Narx** | `text-xs font-normal text-gray-400 line-through` | Chizilgan eski narx |
| **Toifa / Ikkilamchi** | `text-xs uppercase tracking-wider text-gray-400 font-semibold` | Toifa nomi, sanalar |
| **Tugma Matni** | `text-xs font-semibold` yoki `text-sm font-semibold` | Tugmalardagi matn |
| **Kichik Nishon** | `text-[11px] font-semibold` | Chegirma stikerlari, badge |

---

## 3. Radiuslar va Soyalar Standarti

| Element Turi | Radius | Soya | Misol |
|-------------|--------|------|-------|
| **Tashqi Bloklar, Bannerlar** | `rounded-2xl` (16px) | `shadow-sm` | Hero Banner, Stories Modal |
| **Mahsulot Kartochkalari** | `rounded-xl` (12px) | `shadow-sm` hover:`shadow-md` | ProductCard |
| **Tugmalar va Inputlar** | `rounded-lg` (8px) | — | Savatga tugma, qidiruv maydoni |
| **Nishonlar (Badge)** | `rounded-md` (6px) | — | `-20%`, `TOP`, `NEW` |
| **Doiraviy Elementlar** | `rounded-full` | — | Avatar, Stories doirasi |
| **Filtr va Dropdown Modallari** | `rounded-2xl` (yuqori) | `shadow-xl` | Filtr oynasi, Popover menyu |

### Kartochka Umumiy Standarti:
```
rounded-xl border border-gray-200/70 shadow-sm bg-white
hover:shadow-md hover:-translate-y-0.5 transition-all
```

---

## 4. UI Komponent Spetsifikatsiyalari

### 4.1. Mahsulot Kartochkasi (ProductCard)

Mahsulot kartochkasi qat'iy tartibda, yuqoridan pastga quyidagi bloklardan iborat:

```
┌────────────────────────┐
│ ┌──────────────────────┤ ← Chegirma Yorlig'i (yuqori chap)
│ │  -20%                │ ← Sevimlilar ♡ (yuqori o'ng)
│ │                      │
│ │   RASM (1:1 Kvadrat) │ ← aspect-square, object-cover
│ │                      │
│ └──────────────────────┤
│ Mahsulot nomi (2 qator)│ ← text-sm font-medium line-clamp-2
│                         │
│ 340 000 UZS             │ ← text-xs text-gray-400 line-through (eski)
│ 272 000 UZS             │ ← text-base font-bold (asosiy narx)
│                         │
│ ┌──────────────────────┐│
│ │   [ 🛒 Savatga ]     ││ ← w-full h-9 rounded-lg (0 dona holat)
│ └──────────────────────┘│
└─────────────────────────┘
```

**Rasm Konteyneri:** `aspect-square w-full overflow-hidden bg-gray-50 rounded-lg` — rasmlar `object-cover object-center` bilan markazlashtiriladi.

**To'liq Kenglikdagi Dinamik Harakat Tugmasi:**
- **0 dona (Savatda yo'q):**
  ```
  w-full h-9 bg-gray-900 text-white rounded-lg font-semibold text-xs
  dark:bg-white dark:text-gray-950
  active:scale-95 transition-transform
  ```
  Matn: `[ 🛒 Savatga ]`

- **> 0 dona (Savatda bor):**
  ```
  w-full h-9 bg-gray-900 text-white rounded-lg px-2
  flex items-center justify-between font-bold text-xs
  dark:bg-[#1E293B]
  ```
  Ko'rinish: `[ -   X ta   + ]` — Minus bosilganda 0 ga tushsa, tovar savatdan o'chadi.

---

### 4.2. Gorizontal Toifa Kapsulalari (CategoryCarousel)

Banner ostida to'g'ridan-to'g'ri joylashuvchi yotiq kapsula tabletkalar:

```
┌──────────────────────────────┐
│ (○ Rasm)  Toifa Nomi          │ ← h-[56px] sm:h-[60px] rounded-2xl px-4
└──────────────────────────────┘
```

- **Chap qism:** Doiraviy rasm `w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full overflow-hidden`.
- **O'ng qism:** Toifa nomi `text-sm sm:text-[15px] font-semibold whitespace-nowrap`.
- **Nofaol holat:** `bg-white border border-gray-200/80 text-gray-800`.
- **Faol holat:** `bg-gray-900 border-gray-900 text-white font-bold shadow-md`. Dark: `bg-white text-gray-950`.

---

### 4.3. Aksiya va Yangiliklar Doiralari (Stories Reel & Modal)

**Bosh Sahifa Doiralari:**
```
w-[62px] h-[62px] sm:w-[70px] sm:h-[70px] rounded-full
border-2 border-gray-950 dark:border-white p-[2.5px]
```

**To'liq Ekranli Modal:**
- Tepada ko'p segmentli progress-bar (har bir segmentning uzunligi hisoblangan).
- Ekranning chap yarmi bosilsa — oldingi slayd, o'ng yarmi bosilsa — keyingi slayd.
- Barmog'ingizni ekranga bosib tursangiz — hikoya to'xtaydi (Hold to pause).
- Tezda ikki marta bossangiz — yurakcha animatsiyasi (Double-tap ♡ like).

---

### 4.4. Master-Detail 2-Ustunli Katalog (`/catalog`)

```
┌──────────┬─────────────────────────────┐
│  MASTER  │        DETAIL                │
│          │  [Sub-toifa 1] [Sub-toifa 2] │ ← Gorizontal pills
│ (○) Kiyim│                              │
│ (○) Poyas│  ┌──────┐ ┌──────┐           │
│ (○) Kross│  │Tovar1│ │Tovar2│           │ ← 2/3/4 ustunli panjara
│          │  └──────┘ └──────┘           │
│  w-[82px]│  ┌──────┐ ┌──────┐           │
│  sm:100px│  │Tovar3│ │Tovar4│           │
│  md:210px│  └──────┘ └──────┘           │
└──────────┴─────────────────────────────┘
```

- **Chap ustun:** `w-[82px] sm:w-[100px] md:w-[210px]`, doiraviy rasm `w-10 h-10`.
- **O'ng ustun:** Sub-toifa pills + mahsulotlar panjarasi.
- **Tanlangan toifa:** Yuqori kontrastli qora/oq tabletka.
- **Filtr Modali:** Pastdan silliq chiquvchi oyna (`rounded-t-2xl`), saralash tugmalari, narx slayderi, faqat chegirmalar kaliti, "Tozalash" va "Ko'rsatish" tugmalari.

---

### 4.5. Sevimlilar va Savat Bo'sh Holat Standarti

Bo'sh sahifa hech qachon quruq qolmaydi:
- **Yuqorida:** Ixcham oq karta (`rounded-2xl border p-6`), ikonka, xabar matni va `[ Katalogga o'tish ]` tugmasi.
- **Pastida:** To'liq *"Mashhur"* tavsiya etiladigan mahsulotlar panjarasi.

---

### 4.6. Profil va Mustaqil Modallar (`/profile`)

- **Shaxsiy karta:** `w-14 h-14 rounded-full ring-2 ring-gray-100 dark:ring-white/10` gradient avatar, yashil tasdiqlangan nishon (`✓`).
- **Menyu guruhlari:** `rounded-2xl divide-y divide-gray-100 bg-white dark:bg-[#111827]`.
- **Har bir bo'lim:** Alohida mustaqil modal (Drawer) oynasi sifatida ochiladi.
- **Bildirishnoma Checkboxi:**
  - Light: `bg-gray-900 text-white` (qora kvadrat + oq ptichka).
  - Dark: `bg-white text-gray-950` (oq kvadrat + qora ptichka).

---

### 4.7. Popover Dropdown Standarti (Brauzer `<select>` Taqiqlangan)

Barcha tanlov menyulari loyihaning maxsus popover komponentlari orqali ko'rsatiladi:
- `rounded-2xl`, `shadow-xl` chuqur soya.
- Tanlangan band yonida `<Check />` belgisi.
- Ochilganda aylanuvchi strelka (`ChevronDown rotate-180`).
- Tashqariga bosilganda o'z-o'zidan yopilish (`outside-click`).

---

## 5. Moslashuvchanlik Standarti (Responsive Design)

| Breakpoint | Kenglik | Amal |
|-----------|---------|------|
| **Mobil (Default)** | `< 640px` | 2 ustunli mahsulot panjarasi, pastki navigatsiya |
| **Katta Mobil (sm)** | `640px+` | O'lchamlar biroz kattalashtadi |
| **Planshet (md)** | `768px+` | 3 ustunli panjara, kengaytirilgan sidebar |
| **Noutbuk (lg)** | `1024px+` | 4 ustunli panjara, keng Header |
| **Monitor (xl)** | `1280px+` | Keng layout, keng Admin panel |

### Konteyner Chegarasi:
Sayt hech qachon cheksiz kenglikka yoyilmaydi:
```
max-w-7xl mx-auto px-4
```

### Mobil Xavfsiz Masofalar:
```css
.pb-safe { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
.pt-safe { padding-top: max(12px, env(safe-area-inset-top)); }
```

### Pastki Navigatsiya Ofseti:
Mobil pastki menyu ostida kontent yashirib qolmasligi uchun:
```
pb-24  /* 96px pastki bo'shliq */
```

---

## 6. Mikro-animatsiyalar va O'tishlar

| Harakat | Klass | Maqsadi |
|---------|-------|---------|
| **Bosish Effekti** | `active:scale-95 transition-transform duration-100` | Tugma, kartochka va havolalarga tegish hissi |
| **Hover Ko'tarilish** | `hover:-translate-y-0.5 hover:shadow-md transition-all` | Kartochka ustiga kelganda silliq ko'tarilish |
| **Rejim O'tishi** | `transition: background-color 0.2s ease, color 0.2s ease` | Light/Dark rejim almashganda silliq o'tish |
| **Skeleton Yuklanish** | `animate-shimmer` (CSS gradient animation, 1.5s loop) | Ma'lumot yuklanayotganda shimmer effekti |
| **Xatolik Silkinish** | `animate-shake` (0.4s ease-in-out) | Noto'g'ri kiritish yoki validatsiya xatosi |
| **Telegram Haptic** | `haptic.impact('light')` | Fizik vibratsiya javob berish |

---

## 7. Maxsus CSS Yordamchilari

| Klass | Maqsadi |
|-------|---------|
| `.glass-bottom-nav` | Glassmorphism shaffof pastki panel (blur 20px, 88% shaffoflik) |
| `.glass-card` | Shaffof soyali kartochka (blur 12px) |
| `.border-hairline` | 1px nozik chegara |
| `.touch-target` | Minimal 44x44px bosish hududi (Apple HIG standarti) |
| `.shadow-card` | Yengil kartochka soyasi |
| `.shadow-premium` | Chuqurroq ko'k soyali blok |
| `.no-scrollbar` | Yashirin aylantiruvchi (scrollbar) |

---

## 8. Admin Panel Dizayn Standarti (`/admin`)

Admin panel xaridor qismiga moslashgan, lekin kengaytirilgan dizaynga ega:

### 8.1. Analitika Grafiklari
- **Gibrid Grafik:** Smooth Bézier to'lqinli (`Area`) va zamonaviy Ustunli (`Bar`) SVG rejimlar.
- **Davr Taqqoslash:** Joriy davr (to'q chiziq) va o'tgan davr (kulrang punktir) vizual taqqoslash.
- **Suzuvchi Tooltip:** Glassmorphism shaffof quti — aniq summa, o'tgan summa va o'sish foizi.

### 8.2. To'lov Diagrammalari
- **Donut Chart:** 160x160 SVG doira, markazida asosiy ko'rsatkich.
- **Chiziqli Progress:** Gorizontal progress-barlar bilan alternativ ko'rinish.
- Almashtirgich: `[ 🍩 Doira | 📊 Chiziqli ]`.

### 8.3. TOP-3 Shohsupa
- 🥇 **Oltin Toj** (Crown) — 1-o'rin.
- 🥈 **Kumush Medal** — 2-o'rin.
- 🥉 **Bronza Medal** — 3-o'rin.
- Kartochka bosilganda Katalogda shu tovar filtrlanib ochiladi.

### 8.4. Buyurtmalar Oqimi (Pipeline Funnel)
4 ta holat kartalari: 🟣 Yangi → 🟡 Yetkazilmoqda → 🟢 Bajarildi → 🔴 Bekor qilindi.

### 8.5. Toza Navigatsiya
- Dashboard bo'limida ortiqcha qidiruv yashiriladi.
- Qidiruv faqat Katalog, Buyurtmalar va Mijozlar bo'limlarida chiqadi.
- Bo'lim almashganda qidiruv maydoni avtomatik tozalanadi.

---

## 9. Qorong'u Rejim To'liq Standarti (Dark Mode)

### Boshqaruv:
- `useThemeStore` (Zustand) + `localStorage('app_theme')`.
- `document.documentElement` ga `dark` CSS klassi qo'shiladi/olib tashlanadi.

### Asosiy Qoida:
**Qorong'u rejimda barcha asosiy harakat tugmalari, faol tablar va tanlangan filtrlar yuqori kontrastli OQ rangda bo'ladi:**
```
dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100
```

### Keshbek Kartasi:
Qorong'u rejimda to'q zumrad shaffof kartaga aylanadi:
```
dark:bg-emerald-950/50 dark:border-emerald-800/50
```

### Fon Qatlamlari:
```
Sahifa foni:        #090D16  (eng to'q)
Kartochka yuzasi:   #111827  (o'rta)
Ikkilamchi bloklar: #161F30  (och)
Chegaralar:         rgba(255,255,255, 0.08)
```

---

## 10. Daxlsiz Ma'lumotlar va Neytral Placeholderlar Standarti

| Element | To'g'ri (Neytral) | Noto'g'ri (Taqiqlangan) |
|---------|-------------------|------------------------|
| Ism placeholder | `Ism Familiya` | `Shohrux Aliyev` |
| Telefon placeholder | `+998 (90) 123-45-67` | `+998 99 888 77 66` |
| Manzil placeholder | `Yetkazib berish manzili...` | `Chilonzor 9-kvartal, 15-uy` |
| Sharh placeholder | `Fikringizni yozing...` | Shaxsiy ismlar |
| Ro'yxatdan o'tmagan user | `Foydalanuvchi` | `Alisher Zokirov` |
| Komponent nomlari | `Dinamik Harakat Tugmasi` | `Uzum Market Style Button` |
| Dizayn referenslari | `Minimalist Kartochka` | `Apple Card`, `Farfetch Card` |
