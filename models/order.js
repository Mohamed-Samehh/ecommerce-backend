const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'out for delivery', 'delivered'],
    default: 'processing'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'Online'],
    default: 'COD'
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);
