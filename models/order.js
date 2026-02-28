const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  bookName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtPurchase: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: {
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
    }
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
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
    required: true,
    min: 0
  }
}, { timestamps: true });

orderSchema.pre('validate', async function () {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);
