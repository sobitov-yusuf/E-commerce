// Universal Telegram Mini App (TMA) E-Commerce — Telegram Bot Notifications Helper
// Sends 3-language Telegram Bot notifications to customers and admins for order events & payment receipts

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
export async function sendAdminNewOrderAlert(
  orderNumber: string,
  amount: number,
  customerName: string,
  phone: string
) {
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChatId) return;

  const text = `
🛒 <b>YANGI BUYURTMA QABUL QILINDI!</b>

📦 <b>Raqami:</b> <code>${orderNumber}</code>
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
  let statusEmoji = '⏳';

  if (newStatus === 'NEW') {
    statusText = lang === 'uz' ? 'Qabul qilindi' : lang === 'ru' ? 'Принят' : 'Accepted';
    statusEmoji = '⏳';
  } else if (newStatus === 'PROCESSING') {
    statusText = lang === 'uz' ? 'Tayyorlanmoqda / To\'landi' : lang === 'ru' ? 'В обработке / Оплачен' : 'Processing / Paid';
    statusEmoji = '📦';
  } else if (newStatus === 'DELIVERING') {
    statusText = lang === 'uz' ? 'Kuryer yo\'lda' : lang === 'ru' ? 'Курьер в пути' : 'Out for delivery';
    statusEmoji = '🚴';
  } else if (newStatus === 'COMPLETED') {
    statusText = lang === 'uz' ? 'Muvaffaqiyatli yetkazildi' : lang === 'ru' ? 'Доставлено' : 'Delivered';
    statusEmoji = '✅';
  } else if (newStatus === 'CANCELLED') {
    statusText = lang === 'uz' ? 'Bekor qilindi' : lang === 'ru' ? 'Отменен' : 'Cancelled';
    statusEmoji = '❌';
  }

  const title =
    lang === 'uz'
      ? 'Buyurtmangiz holati yangilandi!'
      : lang === 'ru'
      ? 'Статус вашего заказа обновлен!'
      : 'Your order status has been updated!';

  const orderLabel = lang === 'uz' ? 'Buyurtma raqami:' : lang === 'ru' ? 'Номер заказа:' : 'Order number:';
  const statusLabel = lang === 'uz' ? 'Yangi holat:' : lang === 'ru' ? 'Новый статус:' : 'New status:';
  const footer =
    lang === 'uz'
      ? 'Xaridingiz uchun rahmat!'
      : lang === 'ru'
      ? 'Спасибо за покупку!'
      : 'Thank you for your purchase!';

  const text = `
${statusEmoji} <b>${title}</b>

${orderLabel} <b>${orderNumber}</b>
${statusLabel} <b>${statusText}</b>

${footer}
  `.trim();

  await sendTelegramNotification({ chatId: customerTelegramId, text });
}

/**
 * Send Official Payment Receipt to Customer
 */
export async function sendOrderPaymentReceipt({
  chatId,
  orderNumber,
  amount,
  paymentProvider,
  items,
  lang = 'uz',
}: {
  chatId: string | number;
  orderNumber: string;
  amount: number;
  paymentProvider: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  lang?: 'uz' | 'ru' | 'en';
}) {
  const receiptTitle =
    lang === 'uz'
      ? '🧾 <b>TO\'LOV CHEKI (ELEKTRON KVITANSIYA)</b>'
      : lang === 'ru'
      ? '🧾 <b>ЭЛЕКТРОННЫЙ ЧЕК ОБ ОПЛАТЕ</b>'
      : '🧾 <b>ELECTRONIC PAYMENT RECEIPT</b>';

  const orderLabel = lang === 'uz' ? 'Buyurtma:' : lang === 'ru' ? 'Заказ:' : 'Order:';
  const methodLabel = lang === 'uz' ? 'To\'lov turi:' : lang === 'ru' ? 'Способ оплаты:' : 'Payment method:';
  const totalLabel = lang === 'uz' ? 'Jami to\'landi:' : lang === 'ru' ? 'Итого оплачено:' : 'Total paid:';

  const itemsList = items
    .map((item, idx) => `${idx + 1}. ${item.name} (${item.quantity} x ${item.price.toLocaleString()} UZS)`)
    .join('\n');

  const text = `
${receiptTitle}

✅ <b>To'lov muvaffaqiyatli qabul qilindi!</b>

📦 <b>${orderLabel}</b> <code>${orderNumber}</code>
💳 <b>${methodLabel}</b> ${paymentProvider}
💰 <b>${totalLabel}</b> <b>${amount.toLocaleString()} UZS</b>

<b>Xarid qilingan mahsulotlar:</b>
${itemsList}

<i>Buyurtmangiz tayyorlanmoqda. Tez orada kuryer siz bilan bog'lanadi!</i>
  `.trim();

  await sendTelegramNotification({ chatId, text });
}
