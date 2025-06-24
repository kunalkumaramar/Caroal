const express = require('express');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const router = express.Router();
require('dotenv').config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/initiate', async (req, res) => {
  try {
    const { orderId, user, method } = req.body;

    if (!orderId || !user || !method) {
      return res.status(400).json({ message: 'Missing payment initiation data' });
    }

    // 1. Find the order in DB
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const amountInPaise = Math.round(order.total * 100); // Convert to paise

    // 2. Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${order._id}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // 3. Send necessary info to frontend
    res.status(200).json({
      success: true,
      payment: {
        orderId: order._id,
        user,
        amount: order.total,
        currency: 'INR',
        method,
      },
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('🔴 Payment initiation error:', err);
    res.status(500).json({ message: 'Failed to initiate Razorpay payment' });
  }
});

module.exports = router;
