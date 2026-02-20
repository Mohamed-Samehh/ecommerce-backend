const mongoose = require('mongoose');
const Book = require('../models/book');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');

async function placeOrder(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {items, country, city, street, postalCode, paymentMethod} = req.body;
    const userId = req.user.id;
    let totalAmount = 0;
    const orderItemsToSave = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId).session(session);

      if (!book || book.stock < item.quantity) {
        throw new Error(`Book ${book ? book.name : item.bookId} is out of stock.`);
      }

      book.stock -= item.quantity;
      await book.save({session});

      totalAmount += book.price * item.quantity;
      orderItemsToSave.push({
        bookId: item.bookId,
        quantity: item.quantity,
        priceAtItem: book.price,
        bookName: book.name
      });
    }

    const newOrder = new Order({
      userId,
      country,
      city,
      street,
      postalCode,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'success' : 'pending'
    });

    const savedOrder = await newOrder.save({session});

    const finalItems = orderItemsToSave.map(item => ({...item, orderId: savedOrder._id}));
    await OrderItem.insertMany(finalItems, {session});

    await session.commitTransaction();
    res.status(201).json({status: 'success', data: {order: savedOrder}});
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({status: 'fail', message: error.message});
  } finally {
    session.endSession();
  }
}

module.exports = {placeOrder};
