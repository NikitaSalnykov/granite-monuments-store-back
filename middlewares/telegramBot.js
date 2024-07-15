const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;


// Trigger the telegram bot to send a message
async function sendNotification(order) {
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return
  }

  const message = buildMessage(order);
  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const chatIds = [
    TELEGRAM_CHAT_ID,
  ];

  for (const chatId of chatIds) {
    if (chatId) {
      try {
        const response = await fetch(telegramApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message to Telegram');
        }
      } catch (error) {
        console.error('Error sending message to Telegram:', error);
      }
    }
  }
}


function buildMessage(order) {
	// Build the message to send to telegram
	return `<b>⚡️Новый заказ!</b>
  
  <b>Информация о заказе:</b>

<b>Номер заказа: ${order.orderNumber}</b>

👤 <b>Имя заказчика:</b> ${order.name} ${order.surname}
📞 <b>Телефон:</b> ${order.tel}
🚚 <b>Способ доставки:</b> ${
  order.delivery !== "" ? order.delivery : "Не указан"
}

✅ Информация о заказе: ${order.info}

<b>💲Общая сумма заказа:</b> ${order.total}

Желаем вам прекрасного дня! ✌️`;
}

module.exports = sendNotification