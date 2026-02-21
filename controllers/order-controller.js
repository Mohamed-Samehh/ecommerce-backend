const mongoose = require('mongoose');
const Book = require('../models/books');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');

async function placeOrder(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {items, country, city, street, postalCode, paymentMethod} = req.body;
    const userId = req.user.id;
    let totalAmount = 0;
    const itemsToSave = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId).session(session);
      if (!book || book.stock < item.quantity) {
        throw new Error(`Book ${book ? book.name : item.bookId} is out of stock.`);
      }
      book.stock -= item.quantity;
      await book.save({session});

      totalAmount += book.price * item.quantity;
      itemsToSave.push({
        bookId: item.bookId,
        quantity: item.quantity,
        priceAtItem: book.price,
        bookName: book.name
      });
    }

    const newOrder = await Order.create([{
      userId,
      country,
      city,
      street,
      postalCode,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'success' : 'pending'
    }], {session});

    const orderItems = itemsToSave.map((item) => ({...item, orderId: newOrder[0]._id}));
    await OrderItem.insertMany(orderItems, {session});

    await session.commitTransaction();
    res.status(201).json({status: 'success', data: newOrder[0]});
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({status: 'fail', message: error.message});
  } finally {
    session.endSession();
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({userId: req.user.id}).sort('-createdAt');
    res.status(200).json({status: 'success', results: orders.length, data: orders});
  } catch (error) {
    res.status(400).json({status: 'fail', message: error.message});
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort('-createdAt');
    res.status(200).json({status: 'success', data: orders});
  } catch (error) {
    res.status(400).json({status: 'fail', message: error.message});
  }
}

async function updateOrderStatus(req, res) {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {status: req.body.status}, {returnDocument: 'after', runValidators: true});
    if (!order) return res.status(404).json({message: 'Order not found'});
    res.status(200).json({status: 'success', data: order});
  } catch (error) {
    res.status(400).json({status: 'fail', message: error.message});
  }
}

async function updatePaymentStatus(req, res) {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {paymentStatus: req.body.paymentStatus}, {returnDocument: 'after'});
    if (!order) return res.status(404).json({message: 'Order not found'});
    res.status(200).json({status: 'success', data: order});
  } catch (error) {
    res.status(400).json({status: 'fail', message: error.message});
  }
}

module.exports = {placeOrder, getMyOrders, getAllOrders, updateOrderStatus, updatePaymentStatus};
