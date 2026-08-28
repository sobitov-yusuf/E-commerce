// Universal Telegram Mini App (TMA) E-Commerce — Telegram Bot Notifications Helper
// Sends 3-language Telegram Bot notifications to customers and admins for order events

interface SendNotificationOptions {
  chatId: string | number;
  text: string;
  parseMode?: 'HTML' | 'Markdown';
}

export async function sendTelegramNotification({
  chatId,
  text,
  parseMode = 'HTML',
}: SendNotificationOptions): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN environment variable is missing. Skipping bot notification.');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });

    const json = await res.json();
    return json.ok === true;
  } catch (error) {
    console.error('Error sending Telegram bot notification:', error);
    return false;
  }
}

/**
 * Send New Order Alert to Admin Group / Channel
 */
export async function sendAdminNewOrderAlert(orderNumber: string, amount: number, customerName: string, phone: string) {
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChatId) return;

  const text = `
🛒 <b>YANGI BUYURTMA QABUL QILINDI!</b>

📦 <b>Raqami:</b> ${orderNumber}
👤 <b>Mijoz:</b> ${customerName}
📞 <b>Tel:</b> ${phone}
💰 <b>Summa:</b> ${amount.toLocaleString()} UZS
  `.trim();

  await sendTelegramNotification({ chatId: adminChatId, text });
}

/**
 * Send Order Status Update Alert to Customer in UZ/RU/EN
 */
export async function sendCustomerOrderStatusNotification(
  customerTelegramId: number | string,
  orderNumber: string,
  newStatus: string,
  lang: 'uz' | 'ru' | 'en' = 'uz'
) {
  let statusText = newStatus;
  if (newStatus === 'NEW') statusText = lang === 'uz' ? 'Qabul qilindi ⏳' : 'Принят ⏳';
  if (newStatus === 'DELIVERING') statusText = lang === 'uz' ? 'Kuryer yo\'lda 🚴' : 'В пути 🚴';
  if (newStatus === 'COMPLETED') statusText = lang === 'uz' ? 'Muvaffaqiyatli yetkazildi ✅' : 'Доставлено ✅';
  if (newStatus === 'CANCELLED') statusText = lang === 'uz' ? 'Bekor qilindi ❌' : 'Отменен ❌';

  const text = `
📦 <b>Buyurtmangiz holati o'zgardi!</b>

Buyurtma raqami: <b>${orderNumber}</b>
Yangi holat: <b>${statusText}</b>

Xaridingiz uchun rahmat!
  `.trim();

  await sendTelegramNotification({ chatId: customerTelegramId, text });
}
