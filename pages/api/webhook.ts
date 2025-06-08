import type { NextApiRequest, NextApiResponse } from 'next';

const sendTgMessage = async (
  url: string,
  payload: Record<string, unknown>
) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error('Telegram API error:', data);
  }
  return data;
};

const escapeMarkdown = (text: string) =>
  text.replace(/[\\_\*\[\]()~`>#+\-=|{}.!]/g, '\\$&');

type ResponseData = {
  ok: boolean;
  error?: string;
  note?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Метод не поддерживается' });
  }

  try {
    const body = req.body;
    if (body.message?.web_app_data?.data) {
      const parsed = JSON.parse(body.message.web_app_data.data);
      const BOT_TOKEN = process.env.BOT_TOKEN;
      const OWNER_CHAT_ID =
        process.env.OWNER_CHAT_ID || process.env.ADMIN_USER_ID;

      if (!BOT_TOKEN || !OWNER_CHAT_ID) {
        console.error('BOT_TOKEN or chat id env var not set');
        return res
          .status(500)
          .json({ ok: false, error: 'Server misconfiguration' });
      }

      const sendMessageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

      if (parsed.type === 'order') {
        const cartData: { id: number; name: string; price: number; qty: number }[] =
          Array.isArray(parsed.cart) ? parsed.cart : [];

        const itemsList = cartData
          .map((i) => `• ${i.name} × ${i.qty} = ${i.price * i.qty} ₽`)
          .join('\n');
        const total = cartData
          .reduce((sum, it) => sum + it.price * it.qty, 0)
          .toFixed(2);

        await sendTgMessage(sendMessageUrl, {
          chat_id: body.message.chat.id,
          text: `✅ Ваш заказ принят!\n\nСостав заказа:\n${itemsList}\n\nИтого: ${total} ₽`,
        });

        const fromUser = body.message.from;
        const customerName = fromUser.username
          ? `@${fromUser.username}`
          : `${fromUser.first_name || ''} ${fromUser.last_name || ''}`.trim() || fromUser.id;

        const userInfo = `${escapeMarkdown(customerName)} ${escapeMarkdown(`(ID: ${fromUser.id})`)}`;

        await sendTgMessage(sendMessageUrl, {
          chat_id: OWNER_CHAT_ID,
          parse_mode: 'MarkdownV2',
          text:
            `📦 *Новый заказ*\n\n` +
            `Клиент: ${userInfo}\n` +
            `Состав заказа:\n${escapeMarkdown(itemsList)}\n\n` +
            `Итого: ${total} ₽`,
        });

        return res.status(200).json({ ok: true });
      }

      if (parsed.type === 'feedback') {
        const { name, phone, address, services, comment } = parsed as {
          type: 'feedback';
          name: string;
          phone: string;
          address: string;
          services: string[];
          comment: string;
        };

        await sendTgMessage(sendMessageUrl, {
          chat_id: body.message.chat.id,
          text: `✅ Спасибо за обратную связь, ${name}!\nМы получили вашу заявку и свяжемся с вами в ближайшее время.`,
        });

        const serviceListText =
          Array.isArray(services) && services.length > 0 ? services.join(', ') : '— не выбрано —';

        await sendTgMessage(sendMessageUrl, {
          chat_id: OWNER_CHAT_ID,
          parse_mode: 'MarkdownV2',
          text:
            `📝 *Новая заявка обратной связи*\n\n` +
            `Имя: ${escapeMarkdown(name)}\n` +
            `Телефон: ${escapeMarkdown(phone)}\n` +
            `Адрес: ${escapeMarkdown(address)}\n` +
            `Услуги: ${escapeMarkdown(serviceListText)}\n` +
            `Комментарий: ${escapeMarkdown(comment || '— без комментариев —')}`,
        });

        return res.status(200).json({ ok: true });
      }

      return res.status(200).json({ ok: true, note: 'Unknown type' });
    }

    return res.status(200).json({ ok: true, note: 'No web_app_data' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
