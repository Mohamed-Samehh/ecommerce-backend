const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ref to user(by his objID) in collection called User in db
    required: [true, 'User reference is required'],
    unique: true // 1 to 1 relation each user has one cart, but multiple items
  },
  items: [{ // array of objects (docs)
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Book quantity is required'],
      min: [1, 'Quantity must be at least 1'], // validator block -inf => 0
      max: [100, 'Quantity cannot exceed 100'] // just prevent extreme values, but real stock checks occurs in controller
    }
  }]

}, {
  timestamps: true // TODO: feature delete cart if not updated in 15 days
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
