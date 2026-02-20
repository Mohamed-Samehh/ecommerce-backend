const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtItem: {
    type: Number,
    required: true,
    min: 0
  },
  bookName: {
    type: String,
    required: true,
    maxlength: 300
  }
}, {timestamps: true});

module.exports = mongoose.model('OrderItem', orderItemSchema);
