const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ref to user(by his objID) in collection called User in db
    required: true,
    unique: true // 1 to 1 relation each user has one cart, but multiple items
  },
  items: [{ // array of objects (docs)
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1 // validator block -inf => 0
    }
  }]

}, {
  timestamps: true // TODO: feature delete cart if not updated in 15 days
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
