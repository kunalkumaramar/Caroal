const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body;

  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing Razorpay signature header' });
  }

  // 🔐 Signature validation
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );

  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid signature. Webhook verification failed.' });
  }

  // ✅ Safe JSON parse
  let payload;
  try {
    payload = JSON.parse(rawBody.toString());
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }

  const event = payload.event;

  switch (event) {
    case 'payment.captured':
      const paymentInfo = payload.payload.payment.entity;
      console.log('✅ Payment Captured:', paymentInfo);
      console.log('Order ID:', paymentInfo.order_id);
      // TODO: Update order status in DB to "paid"
      break;

    case 'payment.failed':
      console.log('❌ Payment Failed:', payload.payload.payment.entity);
      // TODO: Add failure logging/alerts
      break;

    default:
      console.log('⚠️ Unhandled Razorpay event:', event);
  }

  return res.status(200).json({ success: true });
});

module.exports = router;
