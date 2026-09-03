# Antigravity (AI Agent) Operatsion Qoidalari

Ushbu hujjat sun'iy intellekt agenti (Google Antigravity / Gemini) loyihada ishlayotganda qat'iy amal qilishi kerak bo'lgan xulq-atvor va texnik operatsiya qoidalarini belgilaydi.

⚠️ **DIQQAT AI:** Loyihaning UI/UX va biznes logikasini o'zgartirishdan oldin `docs/` papkasidagi PRD va Arxitektura hujjatlariga murojaat qiling! Bu hujjat faqat sizning amaliy ishlashingizni tartibga soladi.

## 1. 🛡️ TypeScript Qat'iy Nazorati (Strict TS Checking)
- **Har bir fayl yozilgandan so'ng**, majburiy ravishda terminalda `npx tsc --noEmit` buyrug'i ishga tushirilishi va 0 ta xatolik chiqishi tasdiqlanishi shart.
- Hech qachon TS xatolariga ko'z yumilmaydi. Hamma xatolar joyida to'g'irlanishi kerak (`any` kabi vaqtinchalik yechimlardan iloji boricha qochib, to'g'ri interfeyslar chaqirilishi kerak, faqat imkonsiz holatdagina `any` ruxsat etiladi).

## 2. 📝 Fayllarni Tahrirlash Qoidasi (TSX / PowerShell Cheklovi)
- **PowerShell interpolatsiyasi xavfi**: `.tsx` fayllarni terminalda echo yoki string interpolatsiyasi (`@" ... "@`) bilan yaratish TAQIQLANADI! Chunki PowerShell TSX ichidagi `${...}` o'zgaruvchilarni yo'qotib yuboradi va kodni buzadi.
- **Yechim**: Har doim `.tsx` va `.ts` fayllarni yaratish yoki tahrirlash uchun **faqatgina `write_to_file` yoki `replace_file_content` instrumentlaridan** foydalaning.

## 3. 🚫 Avtomatlashgan Brauzer Tekshiruvi Taqiqi
- Foydalanuvchi qat'iy talabi bo'yicha avtomatlashgan brauzer subagenti (Browser testing) ishlatilmasin!
- Tizimni tekshirish faqat kod darajasida (static analysis), `npx tsc --noEmit` va server loglari orqali amalga oshirilsin.

## 4. 🗂️ Modulli Yondashuv va Fokus
- Har safar bitta bo'lim yoki bitta fayl doirasida ishlang. Foydalanuvchi "Admin panelni to'g'irla" desa, faqat `admin` ga oid fayllarni tahrirlang. Global arxitekturani foydalanuvchi ruxsatisiz o'zgartirmang.
- Eski, kerak bo'lmagan native `<select>` teglar yoki eski modal turlari uchrasa, loyihaning standart `CustomDropdown` va zamonaviy Drawer modallariga avtomatik o'tkazing.

## 5. 🌐 Xavfsizlik va Neytral Matnlar
- UI interfeyslarga va placeholderlarga o'zingizdan shaxslar (masalan, "Alisher Zokirov") yoki boshqa brendlar nomini yozmang.
- Hamma vaqt toza va neytral shablonlardan foydalaning: `Ism Familiya`, `+998 (90) 123-45-67`. Brauzerda test qilinmagan xavfsiz nol-holatlari (Empty States) yozing.
