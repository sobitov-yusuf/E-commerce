# Universal E-Commerce Platformasi (Telegram Mini App & Web) — Mahsulot Talablari Hujjati (PRD)

---

## 📌 Hujjat Qoidalari: Ushbu Hujjatning Vazifasi va Chegaralari (Scope & Boundaries)

Ushbu hujjat loyihaning **bosh loyiha chizmasi (Product Requirements Document — PRD)** hisoblanadi. Unda platformaning nima maqsadda yaratilayotgani, kimlar tomonidan ishlatilishi, har bir sahifaning tuzilishi, biznes mantiqlari va barcha funksional qoidalari **ipidan ignasigacha** aniq belgilangan.

### ✅ Ushbu Hujjatda Nimalar Turadi (In-Scope)?
1. **Biznes Maqsadi va "White-Label" Modeli:** Tizim qanday qilib tayyor mahsulot sifatida biznes egalariga ($300-$1000) sotiladi va qanday moslashtiriladi?
2. **Gibrid Foydalanish Mantiqi:** Ham Telegram Mini App (TMA), ham to'laqonli Web brauzerda ishlash talablari.
3. **Yagona Telegram Avtorizatsiya Tizimi:** Barcha mijozlarning Telegram orqali ro'yxatdan o'tishi va yagona bazaga yig'ilishi.
4. **Foydalanuvchi Rollari (RBAC):** Xaridor, Super Admin, Menejer va Kuryer huquqlari.
5. **To'liq Funksional Talablar:** Bosh sahifa, Katalog, Mahsulot ko'rinishi, Savat, Buyurtma rasmiylashtirish, Sevimlilar, Profil va Admin panelning 8 ta moduli.
6. **Nofunksional Talablar:** Tezlik, moslashuvchanlik (Responsive), xavfsizlik va 100% ko'p tillilik (`UZ`, `RU`, `EN`).
7. **Daxlsiz 0-Holat Siyosati:** Yangi do'konda hech qanday qalbaki yozuvlar bo'lmasligi.

### ❌ Ushbu Hujjatda Nimalar Turmaydi (Out-of-Scope)?
1. **Baza Jadvallari va SQL Kodlari:** PostgreSQL/Prisma sxemalari `docs/2_Texnik_Arxitektura.md` da yoritiladi.
2. **Telegram Bot API Algoritmlari:** HMAC tekshiruv va bot webhook kodlari `docs/3_Telegram_Integratsiya.md` da yoritiladi.
3. **Dizayn Rang Kodlari va CSS Tokenlari:** Hex ranglar va Tailwind klasslari `docs/4_UI_UX_Dizayn_Tizimi.md` da yoritiladi.
4. **Ish Muddatlari va Topshiriqlar:** Sprint rejalari `docs/5_Roadmap.md` da yoritiladi.

---

## 1. Loyihaning Biznes Maqsadi va "White-Label" Konsepsiyasi

### 1.1. Asosiy Vazifasi
Istalgan turdagi qonuniy va halol tovarlarni (kiyim-kechak, poyabzallar, aksessuarlar, parfyumeriya, elektronika, maishiy buyumlar va boshqalar) ham **Telegram Mini App**, ham **Veb-sayt** orqali mijozga qulay, ishonchli va tezkor sotishni ta'minlaydigan universal elektron savdo platformasini yaratish.

### 1.2. Tijoriy Model (Tayyor Sotiladigan Mahsulot — Turnkey Solution)
* Ushbu platforma bir marta mukammal, xatosiz va mustahkam qilib ishlab chiqiladi.
* Tizim kelgusida biznes egalariga va do'kon sohiblariga o'z savdosini onlaynga o'tkazishlari uchun **tayyor mahsulot (White-label kod bazasi)** sifatida $300, $500 yoki $1000 qiymatida sotiladi.
* **10 Daqiqada Moslashtirish Qobiliyati:** Yangi buyurtmachi kelganda dasturchi butun kodni qaytadan yozmaydi. Admin panelning "Sozlamalar" bo'limidan yangi biznesning:
  - Do'kon nomi va logotipi;
  - Telegram bot tokeni va admin ID si;
  - Yetkazib berish zonalari va tariflari;
  - To'lov shlyuzlari (Payme, Click, Naqd pul);
  - Bosh sahifa bannerlari va toifalari
  bir zumda sozlanadi va do'kon buyurtmachiga to'liq topshiriladi.

---

## 2. Foydalanuvchi Rollari va Huquqlari (Role-Based Access Control — RBAC)

Tizimda 4 ta asosiy foydalanuvchi roli mavjud:

1. **Xaridor (Mijoz / Client):**
   - Mahsulotlar katalogini ko'rish, toifalar bo'yicha saralash va jonli qidirish.
   - Tovarlarni savatga va sevimlilar ro'yxatiga qo'shish.
   - Yetkazib berish manzilini ko'rsatib, to'lov turini tanlagan holda buyurtma rasmiylashtirish.
   - Shaxsiy keshbek balansini to'plash va navbatdagi xaridlarda chegirma sifatida qo'llash.
   - O'z buyurtmalari tarixini va yetkazish holatini jonli kuzatib borish.
   - O'zi xarid qilgan mahsulotlarga yulduzli sharh qoldirish.

2. **Super Admin (Do'kon Egasi / Bosh Administrator):**
   - Tizimning to'liq egasi. Barcha bo'limlarga 100% cheksiz huquqqa ega.
   - Moliyaviy analitika, umumiy tushum, o'rtacha chek va savdo grafiklarini kuzatish.
   - Barcha buyurtmalarni ko'rish, holatini o'zgartirish, bekor qilish va pulni qaytarish (refund).
   - Katalogga mahsulot qo'shish, tahrirlash, o'chirish, rasm yuklash va ombor zaxirasini boshqarish.
   - Toifalar, aksiyalar, bannerlar va promokodlar yaratish.
   - Mijozlar sharhlarini moderatsiya qilish (tasdiqlash yoki rad etish).
   - CRM bo'limi orqali barcha xaridorlar ro'yxatini ko'rish, VIP maqomini berish yoki bloklash.
   - Xodimlarni (Menejer, Kuryer) tizimga qo'shish va rollarini belgilash.
   - Do'konning barcha asosiy sozlamalarini (nomi, bot, to'lovlar) boshqarish.

3. **Menejer / Operator:**
   - Yangi kelib tushgan buyurtmalarni ko'rish, xaridor bilan bog'lanish va buyurtmani tasdiqlash.
   - Mahsulotlar katalogini ko'rish va zarurat bo'lganda ombor zaxirasini to'ldirish.
   - Mijozlar sharhlarini o'qish va rasmiy javob yozish.
   - Moliyaviy sozlamalar va tizim xavfsizlik auditiga ruxsati cheklanadi.

4. **Kuryer (Logistika Xodimi):**
   - Faqat o'ziga biriktirilgan buyurtmalar ro'yxatini, mijoz telefonini va yetkazish manzilini ko'rish.
   - Buyurtmani qabul qilib olganda "Yetkazilmoqda", topshirganda esa "Yetkazib berildi" holatiga o'tkazish.
   - Naqd to'lovli buyurtmalarda pul qabul qilinganini tasdiqlash.

---

## 3. Yagona Telegram Avtorizatsiya Tizimi (Single Telegram Auth)

Tizim xaridorlarni ajratmaydi — ular qaysi qurilma yoki qaysi eshikdan kirishidan qat'i nazar, yagona Telegram identifikatori bilan ishlaydi:

1. **Telegram Mini App Orqali Kirganda:**
   - Xaridor Telegram bot ichidagi do'kon tugmasini bosganda, ilova Telegram `initData` orqali foydalanuvchining `id`, `first_name`, `last_name`, `username` ma'lumotlarini **0 soniyada, hech qanday login yoki parol so'ramasdan** avtomatik taniydi.

2. **Veb-Brauzer (Kompyuter yoki Mobil Brauzer) Orqali Kirganda:**
   - Sayt foydalanuvchiga eski uslubdagi uzun ro'yxatdan o'tish formalarini ko'rsatmaydi.
   - Xaridorga yagona qulay tugma taqdim etiladi: **`[ ✈️ Telegram orqali kirish ]`**.
   - Tugma bosilganda do'konning rasmiy Telegram boti orqali bir klikda xavfsiz tasdiqlanadi va veb-sessiya ochiladi.

3. **Biznes Egasi Uchun Foydasi:**
   - Xaridor qayerdan kirishidan qat'i nazar, uning barcha xaridlari, keshbek balansi va saqlangan manzillari yagona profilida jamlanadi.
   - Do'kon egasi barcha mijozlarning Telegram akkauntlarini o'z CRM bazasida yig'ib boradi va keyinchalik bot orqali bepul ommaviy xabarnomalar (marketing) yubora oladi.

---

## 4. To'liq Funksional Talablar (Ipidan-Ignasigacha Sahifalar Strukturasi)

### 4.1. Bosh Sahifa (Home Page — Qat'iy Yakuniy Ketma-ketlik)

Bosh sahifa yuqoridan pastga tomon quyidagi 8 ta asosiy blokdan qat'iy tartibda shakllanadi:

1. **🔝 Yuqori Navigatsiya Paneli (Header):**
   - **Do'kon Logotipi va Nomi:** Chap tomonda do'kon logotipi va nomi.
   - **Markazlashgan Jonli Qidiruv (Live Search Bar):** Matn kiritilganda darhol tovarlarni taklif qiluvchi qidiruv maydoni.
   - **Sevimlilar Tugmasi:** Yurakcha belgisi va saqlangan tovarlar soni hisoblagichi (`badge`).
   - **Savat Tugmasi:** Savat belgisi va savatdagi tovarlar soni hisoblagichi (`badge`).
   - **Bildirishnomalar (🔔):** O'qilmagan xabarlar indikatori.
   - **Profil Tugmasi:** Kompyuterda yuqori o'ng burchakda turadi, telefonlarda esa pastki menyu bilan takrorlanmasligi uchun yashiriladi (`hidden md:flex`).

2. **⭕ Aksiya va Yangiliklar Doiralari (Stories Reel & Modal):**
   - Do'kondagi eng so'nggi aksiyalar, chegirmalar va yangiliklarni aks ettiruvchi gorizontal aylanuvchi doiralar.
   - Bosilganda to'liq ekranli interaktiv oyna ochiladi:
     - Tepada ko'p segmentli progress-bar;
     - Ekranning o'ng/chap tomoniga bosib keyingi/oldingi slaydga o'tish;
     - Ekranni bosib turganda hikoyani to'xtatib turish (Hold to pause);
     - Ekranga ketma-ket ikki marta bosganda yurakcha animatsiyasi (Double-tap to like).

3. **🖼️ Asosiy Katta Bannerlar Slayderi (Hero Banner Slider):**
   - 16:9 HD formatdagi toza, yuqori sifatli marketing bannerlari.
   - Avtomatik silliq siljiydi, barmoq bilan chapga/o'ngga surish imkoniyati mavjud.
   - Banner bosilganda unga biriktirilgan maxsus toifaga yoki aksiya tovarlariga o'tadi.

4. **🏷️ Gorizontal Toifa Kapsulalari (Horizontal Category Capsule Pills):**
   - Banner ostida to'g'ridan-to'g'ri joylashuvchi yotiq kapsula tabletkalar.
   - Har bir kapsula chap tomonida doiraviy miniatyura rasm, o'ng tomonida toifaning aniq nomidan iborat.
   - Kapsula bosilganda sahifadagi tovarlar o'sha toifaga qarab bir zumda filtrlanadi.

5. **🛍️ Asosiy Tovarlar Panjarasi ("Tavsiya etiladigan mahsulotlar"):**
   - **Sarlavha va Saralash Tablari:**
     - Sarlavha: *"Tavsiya etiladigan mahsulotlar"*.
     - Yonida 3 ta tezkor tab: `[ Barchasi ]`, `[ Mashhur 🔥 ]`, `[ Yangi ✨ ]`.
   - **Mahsulot Kartochkasi Tuzilishi:**
     - Kvadrat shakldagi tiniq rasm (`aspect-square`);
     - Chegirma yorlig'i (`-20%`) va status stikeri (`TOP`, `NEW`);
     - O'ng yuqori burchakda sevimlilarga qo'shish tugmasi (yurakcha);
     - Mahsulot nomi (2 qatorga cheklangan, chiroyli tekislangan);
     - **Narx qatori:** Har doim alohida qatorda to'liq kenglikda (Asosiy narx yirik qora/oq shriftda, agar chegirma bo'lsa chizilgan eski narx yuqorida);
     - **To'liq Kenglikdagi Dinamik Harakat Tugmasi:**
       - Tovar savatda 0 dona bo'lsa: `[ 🛒 Savatga ]` to'liq kenglikdagi mustahkam tugma.
       - Tovar savatga qo'shilganda (>0 dona): `[ -   X ta   + ]` interaktiv boshqaruvchi. Minus bosilib 0 ga tushganda tovar savatdan o'chadi.

6. **💬 Qo'llab-quvvatlash va Menejer Bilan Bog'lanish Bloki (Support CTA):**
   - 1-klikda do'kon operatorining rasmiy Telegram profiliga o'tish tugmasi.

7. **🛡️ Kafolat va Ishonch Nishonlari (Trust Badges):**
   - `100% Original mahsulotlar`, `Tezkor yetkazib berish`, `10 kunda bepul qaytarish`.

8. **📱 Mobil Pastki Navigatsiya Paneli (Bottom Navigation):**
   - Smartfonlarda doimiy ko'rinib turuvchi 5 ta asosiy bo'lim: `[ Bosh sahifa, Katalog, Qidiruv, Sevimlilar, Profil ]`.
   - iPhone va Android qurilmalari chegaralari hisobga olingan xavfsiz bo'shliq (`safe-area-inset-bottom`).

---

### 4.2. Ikki Ustunli Master-Detail Katalog Sahifasi (`/catalog`)

* **Chap Ustun (Master Toifalar):**
  - Vertikal aylanuvchi toifalar ro'yxati (doiraviy miniatyura rasm va toifa nomi).
  - Tanlangan toifa yuqori kontrastli qora/oq tabletka bilan ajralib turadi.
* **O'ng Qism (Detail Tovarlar Maydoni):**
  - Tanlangan toifaga tegishli sub-kategoriya tabletkalari (`pills`).
  - O'ng yuqori burchakda Filtr tugmasi.
  - 2/3/4 ustunli moslashuvchan mahsulotlar panjarasi.
* **Pastdan Ochiluvchi Filtr Modali (Filter Drawer):**
  - Saralash parametrlari: *Ommabop*, *Yangi kelganlar*, *Narx o'sishi bo'yicha*, *Narx kamayishi bo'yicha*.
  - Narx slayderi (Minimal narxdan Maksimal narxgacha erkin sozlash).
  - Faqat chegirmadagi tovarlarni ko'rsatish kaliti.
  - "Filtrlarni tozalash" (Reset) va "Natijalarni ko'rsatish" tugmalari.

---

### 4.3. Mahsulot Tafsilotlari Sahifasi (`/product/[id]`)

* **Interaktiv Rasm Galereyasi:**
  - Slayderli ko'p rasmli galereya, pastida kichik rasm miniatyuralari.
  - Katta ekranda rasmni kattalashtirib (zoom) ko'rish.
* **Narx va Chegirma Bloki:**
  - Asosiy narx, eski chizilgan narx va tejalgan summa.
* **Variantlar va SKU Tanlagich (Variants Matrix):**
  - O'lchamlar tanlash (`S`, `M`, `L`, `XL`, `40`, `41` va h.k.).
  - Ranglar tanlash (doiraviy rangli indikatorlar).
  - Tanlangan variantga qarab ombordagi qoldiq soni real vaqtda yangilanadi (agar tugagan bo'lsa, "Tugagan" deb bloklanadi).
* **Ichki Bo'limlar Tablari:**
  1. *Mahsulot Tavsifi:* Tovar haqida batafsil ma'lumotlar.
  2. *Xususiyatlari:* Ishlab chiqarilgan davlat, material, brend, kafolat muddati.
  3. *Mijozlar Sharhlari:* O'rtacha yulduzli reyting, fotosuratli sharhlar va do'kon ma'muriyatining javoblari.
* **⭐ Tasdiqlangan Xaridor Sharhlari Qoidasi (Verified Buyer Policy):**
  - Mahsulotga faqat ushbu tovarni haqiqatan sotib olgan va buyurtmasi "Yetkazildi" bo'lgan xaridor sharh qoldira oladi.
  - Har bir xaridor bitta mahsulotga faqat 1 dona sharh yoza oladi (anti-spam).
  - Sharh yozishda 1-5 yulduz, matn, afzalliklari, kamchiliklari va qurilmadan 4 tagacha rasm yuklash imkoniyati bo'ladi.
* **Pastki Mahkamlangan Harakat Paneli (Sticky Bottom Action Bar):**
  - Ekranning pastida doimo ko'rinib turadi: Narx + `[ 1-klikda xarid ]` + `[ 🛒 Savatga qo'shish ]`.

---

### 4.4. Savat va Buyurtmani Rasmiylashtirish (`/cart`)

* **Bo'sh Holat Standarti:** Savat bo'sh bo'lganda quruq bo'shab qolmaydi — ixcham xabar qutisi va pastida xaridorni qiziqtiruvchi tavsiya tovarlar panjarasi chiqadi.
* **Mahsulotlar Ro'yxati:**
  - Tovarlar surati, nomi, tanlangan o'lchami/rangi, narxi va donasini o'zgartirish (`- / +`).
  - Tovarni savatdan o'chirish tugmasi.
* **15 Daqiqalik Ombor Zaxirasi Taymeri:**
  - Savatga tovar qo'shilganda ombordan zaxiralanadi va 15 daqiqalik teskari hisob taymeri ko'rsatiladi.
* **Buyurtma Shakli (Checkout Form):**
  1. **Yetkazib berish usuli:**
     - *Kuryer orqali yetkazish:* Shahar bo'ylab 2-3 soatda eshikkacha yetkazish.
     - *Topshirish punktidan olib ketish (PVZ):* Do'kondan yoki punktan bepul olib ketish.
  2. **Manzil kiritish:** Shahar, tuman, ko'cha, uy va xonadon raqami hamda xaridor mo'ljali.
  3. **Aloqa telefoni:** Avtomatik O'zbekiston kodi bilan formatlangan qat'iy raqam (`+998 (XX) XXX-XX-XX`).
  4. **To'lov usulini tanlash:**
     - *Naqd pulda to'lov* (Mahsulot yetib kelganda to'lanadi).
     - *Click* (Onlayn to'lov).
     - *Payme* (Onlayn to'lov).
  5. **Promokod va Keshbek Chegirmasi:**
     - Promokod kiritish maydoni (foizli yoki qat'iy summa chegirmasi).
     - To'plangan keshbek balansini xarid summasidan ayirib to'lash imkoniyati.
  6. **Hisob-kitob qutisi:** Mahsulotlar narxi, chegirma summasi, yetkazib berish narxi (agar chegara summasidan oshsa — bepul) va Jami to'lov.
* **Buyurtma Tasdiqlanganda Sodir Bo'ladigan Voqealar:**
  1. Ombordagi mahsulot qoldig'i avtomatik ayiriladi.
  2. Do'kon egasining Telegramiga barcha tovarlar, manzil va telefon bilan boyitilgan yangi buyurtma xabari keladi.
  3. Xaridorning shaxsiy Telegramiga kvitansiya (elektron chek) va buyurtma raqami boradi.
  4. Savat tozalanadi va buyurtma muvaffaqiyatli qabul qilinganligi ko'rsatiladi.

---

### 4.5. Sevimlilar Bo'limi (`/wishlist`)

* Xaridor o'ziga yoqqan tovarlarni yurakcha orqali saqlab qo'yadigan shaxsiy ro'yxat.
* Har bir tovar kartochkasida to'g'ridan-to'g'ri `[ Savatga qo'shish ]` tugmasi mavjud.
* Ro'yxat bo'sh bo'lsa, xaridorni zeriktirmaslik uchun ommabop tavsiya mahsulotlar panjarasi ko'rsatiladi.

---

### 4.6. Profil va Mustaqil Modallar Standarti (`/profile`)

Foydalanuvchi profil sahifasi ixcham guruhlangan bloklardan iborat bo'lib, har bir bo'lim alohida mustaqil modal oyna (Drawer) ko'rinishida ochiladi:

1. **Shaxsiy Ma'lumotlar Kartasi:**
   - Doiraviy gradient avatar, foydalanuvchi ismi, Telegram username va tasdiqlangan xaridor nishoni (`✓`).
2. **Keshbek Balansi Kartasi:**
   - Xaridorning joriy keshbek summasi (`0 UZS`), qanday ishlashi haqida ma'lumot va faol promokodlar ro'yxati.
3. **8 ta Mustaqil Modal Oyna:**
   - 📦 **Mening Buyurtmalarim Modali:** Xaridorning barcha buyurtmalari ro'yxati, filtrlash (`Barchasi`, `Yetkazilmoqda`, `Bajarildi`), buyurtma tarkibi, to'lov turi va elektron kuryer cheki.
   - 💰 **Hamyon va Keshbek Modali:** To'plangan ballar va amaldagi promokodlarni nusxalash.
   - 📍 **Saqlangan Manzillar Modali:** Xaridorning saqlangan uylari va yangi manzil qo'shish.
   - 🌐 **Ilova Tili Modali:** O'zbekcha (`UZ`), Ruscha (`RU`) va Inglizcha (`EN`) tillarini bir zumda almashtirish.
   - 🌓 **Mavzu Rejimi Modali:** Yorug' (Light) va yuqori kontrastli Qorong'u (Dark) rejimlar.
   - ❓ **FAQ Modali:** Yetkazib berish, to'lov, almashtirish va kafolat bo'yicha interaktiv akkordeon savol-javoblar.
   - 🔔 **Bildirishnomalar Boshqaruvi Modali:** Telegram xabarnomalarini yoqish/o'chirish va o'chirishda ogohlantiruvchi xavfsizlik dialogi.
   - 💬 **24/7 Operator Bilan Bog'lanish:** Do'kon menejeri bilan bevosita Telegram orqali bog'lanish.

---

### 4.7. Tezkor Jonli Qidiruv (`/search`) va Bildirishnomalar Markazi (`/notifications`)

* **Jonli Qidiruv:** Kiritilgan so'z bo'yicha tovarlar nomi, toifasi va tavsifidan 0.05 soniyada qidirib topish.
* **Bildirishnomalar Markazi:** Yangi aksiyalar, buyurtma holati o'zgargani (Kuryer yo'lda, Yetkazildi) haqidagi xabarlar tarixi.

---

### 4.8. Enterprise Web Admin Panel (`/admin` — 8 ta Boshqaruv Markazi)

Do'kon egasi va xodimlar biznesni to'liq boshqarishi uchun mo'ljallangan markazlashgan konsol:

1. 📊 **Boshqaruv & Analitika Hub (Dashboard):**
   - Jami savdo tushumi, buyurtmalar soni, o'rtacha xarid cheki va ro'yxatdan o'tgan mijozlar soni.
   - Vaqt oralig'i bo'yicha hisobot: *Bugun*, *Oxirgi 7 kun*, *Shu oy*, *Shu yil* va erkin sana tanlash.
   - O'tgan davr bilan taqqoslash (O'sish/pasayish deltalari, `+X.X%`).
   - Gibrid interaktiv grafik: To'lqinli (`Area`) va Ustunli (`Bar`) rejimlar.
   - To'lov turlari taqsimoti: Payme, Click va Naqd pul ulushi (Interaktiv Donut diagramma).
   - TOP-3 Yetakchi Mahsulotlar shohsupasi (🥇 Oltin, 🥈 Kumush, 🥉 Bronza).

2. 📋 **Buyurtmalar & Logistika Hub (Orders Hub):**
   - Barcha buyurtmalar jadvali, holatlar bo'yicha saralash (`Yangi`, `Yetkazilmoqda`, `Yetkazildi`, `Bekor qilindi`).
   - Kuryerni biriktirish va mijoz bilan 1-klikda Telegram chatini ochish.
   - Ombor zaxirasining avtomatik sinxronlashuvi (Buyurtmada tovar zaxiradan o'chadi, bekor bo'lsa omborga qaytadi).
   - 80mm formatdagi kassa apparatlari uchun termal kvitansiya chop etish.
   - Microsoft Excel uchun to'liq UTF-8 BOM CSV hisobot yuklab olish.

3. 🛍️ **Katalog & Mahsulotlar Hub:**
   - Yangi tovar qo'shish va mavjudlarini tahrirlash.
   - 3 tilda (`UZ`, `RU`, `EN`) nom va tavsif kiritish.
   - `✨ Gemini AI` yordamida bir klikda tavsif va marketing matnlarini avtomatik tarjima qilish.
   - Qurilmadan to'g'ridan-to'g'ri ko'p rasmli galereya yuklash.
   - SKU variantlar matritsasi (O'lcham, rang, narx, ombor zaxirasi).
   - Kam qolgan tovarlar signali (`⚠️ Kam qoldi`) va tezkor omborni to'ldirish tugmalari (`+5`, `+10`).

4. 🏷️ **Toifalar Boshqaruvi Hub (Categories):**
   - Yangi toifalar ochish, rasm yuklash, ko'rsatish/yashirish va o'chirish.

5. 💬 **Sharhlar Moderatsiyasi Hub (Reviews):**
   - Xaridorlar yozgan sharhlarni ko'rib chiqish, tasdiqlash (`APPROVED`) yoki rad etish (`REJECTED`).
   - Do'kon nomidan xaridorga rasmiy minnatdorchilik yoki javob yozish.

6. 👥 **Mijozlar Bazasi va CRM Hub:**
   - Barcha xaridorlarning Telegram profillari, telefonlari, xaridlar soni va jami sarflagan summasi (LTV).
   - Mijozga VIP maqomini berish yoki nojo'ya foydalanuvchilarni bloklash.

7. 🎯 **Marketing va Aksiya Hub:**
   - Bosh sahifadagi 16:9 HD bannerlarni boshqarish.
   - Promokodlar yaratish (chegirma foizi, minimal buyurtma summasi va amal qilish muddati).
   - Barcha xaridorlarning Telegramiga bot orqali rasmli ommaviy xabarnoma (Broadcast) yuborish.

8. ⚙️ **Do'kon Sozlamalari & Rollar Hub (Settings & RBAC):**
   - Do'kon nomi, logotipi, asosiy telefon raqami va manzili.
   - Telegram Bot tokeni va Admin Telegram ID raqamini ulash/almashtirish.
   - To'lov shlyuzlari kalitlari va yetkazib berish zonalari narxlari.
   - Xodimlar (Super Admin, Menejer, Kuryer) qo'shish va huquqlarini belgilash.
   - Tizim xavfsizlik harakatlari jurnali (Audit Logs).

---

## 5. Nofunksional Talablar (Sifat, Tezlik, Moslashuvchanlik va Xavfsizlik)

1. **Tezlik va Hosildorlik:**
   - Sahifalarning dastlabki yuklanish vaqti 1.2 soniyadan oshmasligi shart.
   - Qidiruv natijalari debounced texnologiya bilan 0.05 soniyada taqdim etiladi.
2. **Universal Moslashuvchanlik (Adaptive Layouts):**
   - Sayt har qanday smartfon (`<600px`), planshet (`600-840px`), noutbuk (`840-1200px`) va katta monitorlarda (`>1200px`) mutanosib va tartibli ochiladi.
   - Katta ekranlarda sayt cheksiz yoyilib ketmaydi (`max-w-7xl mx-auto`).
3. **To'liq Ko'p Tillilik (100% i18n):**
   - Barcha tugmalar, tizim xabarlari, cheklar, tovar nomlari va xatolar 3 tilda (`UZ`, `RU`, `EN`) ishlaydi.
4. **Qat'iy Xavfsizlik va Sanitarizatsiya:**
   - Foydalanuvchi kiritadigan barcha matnlar (ism, manzil, sharh) zararli dastur kodlaridan (XSS, SQL injection) avtomatik tozalanadi.
   - Telefon raqamlari qat'iy 12 raqamli tekshiruvdan o'tkaziladi.
5. **Brauzer Popuplari Butunlay Taqiqlangan:**
   - Brauzerning standart `window.confirm` yoki `alert` oynalari ishlatilmaydi. Barcha ogohlantirishlar loyihaning xavfsiz modallari orqali ko'rsatiladi.

---

## 6. Neytral Ma'lumotlar va Sof 0-Holat Siyosati (Pristine 0-State Policy)

1. **Hech Qanday Begona Brendlar va Soxta Ismlar Bo'lmaydi:**
   - Kod ichida ixtiyoriy shaxs ismlari ("Shohrux", "Abror", "Alisher") yoki tashqi brend nomlari ishlatilmaydi.
   - Standart placeholderlar: `Ism Familiya`, `+998 (90) 123-45-67`, `Yetkazib berish manzili...`.
   - Foydalanuvchi ro'yxatdan o'tmagan bo'lsa: `Foydalanuvchi`, username: `Mijoz`.
2. **Sof 0-Holatda Topshirish Standarti:**
   - Do'kon yangi biznes egasiga topshirilganda, unda avvalgi soxta buyurtmalar yoki soxta mijozlar bo'lmaydi.
   - Dashboard ko'rsatkichlari, buyurtmalar, keshbek va sharhlar sof **0 holatida** bo'ladi.
   - Yangi biznes egasi o'z tovarlarini kiritib, birinchi real buyurtmani qabul qilishi bilan hisob-kitoblar boshlanadi.
