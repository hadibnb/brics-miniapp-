// netlify/functions/sendTelegram.js
const fetch = require('node-fetch');

const 8279712354:AAGhJz8Vg1hD2DCiu2jAcxc3Y26p7LLt06I = (token)=>`https://api.telegram.org/bot${token}/sendMessage`;

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    // احراز ساده با header امن
    const headers = event.headers || {};
    const secretHeader = headers['x-shared-secret'] || headers['X-Shared-Secret'];
    const expected = process.env.SHARED_SECRET;
    if (!expected || secretHeader !== expected) {
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const body = JSON.parse(event.body || '{}');

    // مقدارهای مورد نیاز: buyer, requestedBRICS, bnbPaid, usdApprox, txHash, memo, timestamp
    const { buyer, requestedBRICS, bnbPaid, usdApprox, txHash, memo, timestamp } = body;
    if (!buyer || !txHash) return { statusCode: 400, body: 'Missing fields' };

    const token = process.env.8279712354:AAGhJz8Vg1hD2DCiu2jAcxc3Y26p7LLt06I;
    const chatId = process.env.@MyBricsLogbot;
    if (!token || !chatId) return { statusCode: 500, body: 'Server misconfigured' };

    const text =
`💰 New BRICS Purchase
👤 Buyer: ${buyer}
💎 BRICS requested: ${requestedBRICS}
💵 Paid: ${Number(bnbPaid).toFixed(6)} BNB (~$${Number(usdApprox).toFixed(2)})
🔗 Tx: https://bscscan.com/tx/${txHash}
🕒 ${timestamp}
MEMO: ${memo}`;

    const res = await fetch(TELEGRAM_API(token), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Telegram send failed', res.status, errText);
      return { statusCode: 502, body: 'Telegram API error' };
    }

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Internal Error' };
  }
};
