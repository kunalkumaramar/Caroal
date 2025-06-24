const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
  shippingAddress: Object,
  billingAddress: Object,
  paymentMethod: String,
  status: { type: String, default: 'pending' },
  total: Number,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
