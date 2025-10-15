// netlify/functions/sendTelegram.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const body = JSON.parse(event.body || '{}');
    // Replace the BOT_TOKEN value below with your real bot token BEFORE deploy
    const BOT_TOKEN = "8279712354:AAGhJz8Vg1hD2DCiu2jAcxc3Y26p7LLt06I";
    const CHANNEL_ID = body.channel_id || "-1003031571306";

    const {
      buyer,
      requestedBRICS,
      discountPercent,
      bnbPaid,
      usdApprox,
      txHash,
      memo,
      timestamp
    } = body;

    const text = `💰 New BRICS Purchase
👤 Buyer: ${buyer}
💎 BRICS requested: ${requestedBRICS}
🏷 Discount: ${discountPercent}%
💵 Paid: ${Number(bnbPaid).toFixed(6)} BNB (~$${Number(usdApprox).toFixed(2)})
🔗 Tx: https://bscscan.com/tx/${txHash}
🕒 ${timestamp || new Date().toISOString()}
MEMO: ${memo}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text,
        disable_web_page_preview: true
      })
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error('telegram error', errText);
      return { statusCode: 502, body: 'Telegram API error' };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
