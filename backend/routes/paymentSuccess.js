const express = require('express');
const crypto = require('crypto');
const router = express.Router();
console.log('✅ paymentSuccess route loaded');
router.post('/', (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature, // frontend must pass this
  } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  // Step 1: Verify signature using crypto
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  // Step 2: You can now safely mark payment as completed
  console.log('✅ Razorpay payment verified');
  return res.status(200).json({ success: true, message: 'Payment verified successfully' });
});

module.exports = router;
