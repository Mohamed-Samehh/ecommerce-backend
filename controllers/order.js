const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async-handler');
const {Book, Order, OrderItem} = require('../models');

const placeOrder = asyncHandler(async (req, res, next) => {
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
        const error = new Error(`Book ${book ? book.name : item.bookId} is out of stock.`);
        error.statusCode = 400;
        throw error;
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
    next(error);
  } finally {
    session.endSession();
  }
});

const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({userId: req.user.id}).sort('-createdAt');
  res.status(200).json({status: 'success', results: orders.length, data: orders});
});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate('userId', 'name email').sort('-createdAt');
  res.status(200).json({status: 'success', data: orders});
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {status: req.body.status},
    {returnDocument: 'after', runValidators: true}
  );

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({status: 'success', data: order});
});

const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {paymentStatus: req.body.paymentStatus},
    {returnDocument: 'after'}
  );

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({status: 'success', data: order});
});

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
};
