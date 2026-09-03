<div align="center">
  <img src="https://img.icons8.com/?size=512&id=v97YvH9hN75g&format=png" alt="Logo" width="120" height="120" />
  <h1>🛍️ Universal E-Commerce (Telegram Mini App & Web)</h1>
  <p>
    <strong>Next.js 14, Zustand, Tailwind CSS va Prisma orqali qurilgan to'liq miqyosli oq-yorliq (White-Label) e-tijorat platformasi.</strong>
  </p>
  
  <p>
    <a href="#xususiyatlar">Xususiyatlar</a> •
    <a href="#texnologiyalar-steki">Texnologiyalar</a> •
    <a href="#qura-boshlash">O'rnatish</a> •
    <a href="#arxitektura">Arxitektura</a> •
    <a href="#skriptlar">Skriptlar</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Zustand-4.5-yellow?style=for-the-badge&logo=react" alt="Zustand" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  </p>
</div>

---

## 🌟 Xususiyatlar (Key Features)

### 📱 Gibrid Platforma (TMA & Web)
- **Telegram Mini App (TMA)**: Telegram ichida uzluksiz ishlovchi UI/UX (Haptic Feedback va TMA qoidalariga to'liq mos).
- **Web Brauzer**: Oddiy brauzerlardan kirganda ham mukammal ishlaydigan PWA-tayyor PWA arxitekturasi va Telegram Widget orqali avtorizatsiya.

### 🎨 Apple & Farfetch Dizayn Tizimi
- Qat'iy o'rnatilgan tipografiya (Inter) va komponent radiuslari (`rounded-2xl`).
- **Dark Mode**: 100% integratsiya qilingan tungi rejim, yuqori kontrastli UI.
- **Mikro-animatsiyalar**: Bosish, hover (ko'tarilish) va sahifalararo silliq o'tishlar.

### ⚙️ Enterprise Admin Dashboard (`/admin`)
- **Dashboard Hub**: SVG interaktiv grafiklar (Area/Bar), Donut diagrammalar va reyting shohsupasi.
- **Orders Hub**: Ombor avto-sinxronizatsiyasi, UTF-8 CSV eksport va 80mm Termal Chek printer integratsiyasi.
- **Catalog Hub**: Gemini AI yordamida tovarlarni tarjima qilish, galereya tizimi va murakkab SKU/variant matritsasi.

### 🌍 Global 100% i18n Tizimi
- UZ, RU va EN tillarini to'liq qo'llab-quvvatlaydi. Til o'zgartirilganda sahifa yangilanmasdan (Zustand orqali) barcha matnlar jonli ravishda o'zgaradi.

---

## 🛠 Texnologiyalar Steki

| Qism | Texnologiya | Maqsad |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18 | Asosiy freymvork, SSR, sahifalar marshrutizatsiyasi |
| **Stil/UI** | Tailwind CSS, Lucide React | Dizayn, yordamchi utility-klasslar va vektor ikonkalari |
| **Holat (State)** | Zustand (Persist) | Global state-menejment (Savat, Profil, Til, Mavzu) |
| **Ma'lumotlar Bazasi** | PostgreSQL (Supabase) + Prisma | Relational ma'lumotlar bazasi va ORM |
| **Telegram SDK** | `@twa-dev/sdk` | TMA muhitini aniqlash va Haptic amallar |
| **Integratsiyalar** | Payme, Click | Webhook orqali mahalliy to'lov tizimlari (tayyorlangan) |

---

## 📁 Arxitektura va Tuzilma

Loyiha qat'iy Master-Detail va Hub arxitekturasiga asoslangan.

```text
📦 telegram-mini-app
 ┣ 📂 docs                   # Loyihaning barcha PRD, Arxitektura, DB hujjatlari
 ┣ 📂 prisma                 # Prisma ORM sxemasi (schema.prisma)
 ┣ 📂 src
 ┃ ┣ 📂 app                  # Next.js 14 App Router
 ┃ ┃ ┣ 📂 (client)           # Xaridor interfeysi (Bosh sahifa, Katalog, Savat, Profil)
 ┃ ┃ ┣ 📂 admin              # Enterprise boshqaruv paneli (Dashbaord)
 ┃ ┃ ┗ 📂 api                # REST API va Webhooklar (Auth, Click, Payme)
 ┃ ┣ 📂 components           # Qayta ishlatiluvchi UI (Auth, Modals, Admin Hubs)
 ┃ ┣ 📂 locales              # i18n tarjimalar lug'ati (translations.ts)
 ┃ ┣ 📂 store                # Zustand holat boshqaruvi (14 ta store)
 ┃ ┗ 📂 types                # Global TypeScript interfeyslari
 ┣ 📜 tailwind.config.ts     # Tailwind sozlamalari va maxsus ranglar
 ┗ 📜 package.json           # Bog'liqliklar
```

*(Batafsil arxitektura uchun `docs/2_Texnik_Arxitektura.md` hujjatini o'qing)*

---

## 🚀 Qura boshlash (Quick Start)

Loyihani o'z kompyuteringizda ishga tushirish uchun quyidagi amallarni bajaring:

### 1. Repozitoriyni ko'chirish
```bash
git clone https://github.com/sobitov-yusuf/E-commerce.git
cd telegram-e-commerce
```

### 2. Bog'liqliklarni o'rnatish
```bash
npm install
# yoki
yarn install
```

### 3. Atrof-muhit o'zgaruvchilarini sozlash (Environment Variables)
Loyihaning ildizida `.env` faylini yarating va quyidagilarni kiriting:
```env
# Ma'lumotlar bazasi (Supabase / PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/db"

# Telegram Bot Token (TMA validatsiya va xabarnomalar uchun)
TELEGRAM_BOT_TOKEN="123456789:ABCDefgh..."

# To'lov Tizimlari API Kalitlari (Ixtiyoriy)
CLICK_SECRET_KEY="click_secret_here"
PAYME_SECRET_KEY="payme_secret_here"
```

### 4. Prisma ma'lumotlar bazasini sinxronlash (Opsional)
```bash
npx prisma generate
npx prisma db push
```

### 5. Rivojlanish serverini ishga tushirish (Dev Server)
```bash
npm run dev
```
Loyiha `http://localhost:3000` manzilida ishga tushadi.

---

## 📜 Skriptlar (Available Scripts)

- `npm run dev` — Dasturni ishlab chiqish rejimida ishga tushirish (Hot-reload).
- `npm run build` — Production uchun optimizatsiya qilingan build yaratish.
- `npm run start` — Production serverni ishga tushirish.
- `npx tsc --noEmit` — TypeScript xatoliklarini tekshirish (qattiq nazorat).

---

## ⚖️ Litsenziya

Ushbu loyiha yopiq manbali (Closed-Source) bo'lib, barcha huquqlar himoyalangan. Tizimdan foydalanish faqat ruxsat etilgan shaxslar uchundir.
