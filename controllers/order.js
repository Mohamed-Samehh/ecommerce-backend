const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async-handler');
const {Book, Order, Cart} = require('../models');

const placeOrder = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {items, shippingAddress, paymentMethod = 'COD'} = req.body;
    const {country, city, street, postalCode} = shippingAddress;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      const error = new Error('Order must contain at least one item');
      error.statusCode = 400;
      throw error;
    }

    const bookIds = items.map((item) => item.bookId);
    const uniqueBookIds = new Set(bookIds);
    if (uniqueBookIds.size !== bookIds.length) {
      const error = new Error('Duplicate book items are not allowed. Adjust the quantity instead.');
      error.statusCode = 400;
      throw error;
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId).session(session);

      if (!book) {
        const error = new Error(`Book with ID ${item.bookId} not found`);
        error.statusCode = 404;
        throw error;
      }

      if (book.stock < item.quantity) {
        const error = new Error(
          `Insufficient stock for "${book.name}". Available: ${book.stock}, Requested: ${item.quantity}`
        );
        error.statusCode = 400;
        throw error;
      }

      book.stock -= item.quantity;
      await book.save({session});

      const subtotal = book.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        bookId: book._id,
        bookName: book.name,
        quantity: item.quantity,
        priceAtPurchase: book.price,
        subtotal
      });
    }

    const newOrder = new Order({
      userId,
      items: orderItems,
      shippingAddress: {
        country,
        city,
        street,
        postalCode
      },
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'success' : 'pending'
    });

    await newOrder.save({session});

    // Clear user's cart
    await Cart.findOneAndDelete({user: userId}).session(session);

    await session.commitTransaction();

    res.status(201).json({
      status: 'success',
      data: newOrder
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({userId: req.user.id})
    .populate('items.bookId', 'name coverImage')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders
  });
});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate('userId', 'firstName lastName email')
    .populate('items.bookId', 'name coverImage')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders
  });
});

const validTransitions = {
  'processing': ['shipped', 'delivered', 'cancelled'],
  'shipped': ['delivered', 'cancelled'],
  'out for delivery': ['delivered', 'cancelled'], // Legacy support
  'delivered': [],
  'cancelled': []
};

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const {status} = req.body;

  const order = await Order.findById(req.params.id)
    .populate('userId', 'firstName lastName email')
    .populate('items.bookId', 'name coverImage');

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    return next(error);
  }

  const allowed = validTransitions[order.status];
  if (!allowed || !allowed.includes(status)) {
    const error = new Error(
      `Cannot change status from "${order.status}" to "${status}"`
    );
    error.statusCode = 400;
    return next(error);
  }

  if (status === 'cancelled') {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      for (const item of order.items) {
        await Book.findByIdAndUpdate(
          item.bookId,
          {$inc: {stock: item.quantity}},
          {session}
        );
      }
      order.status = status;
      await order.save({session});
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      return next(error);
    } finally {
      session.endSession();
    }
  } else {
    order.status = status;
    await order.save();
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'firstName lastName email')
    .populate('items.bookId', 'name coverImage');

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    return next(error);
  }

  if (order.userId._id.toString() !== req.user.id && !req.user.roles.includes('admin')) {
    const error = new Error('Not authorized to view this order');
    error.statusCode = 403;
    return next(error);
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const {paymentStatus} = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {paymentStatus},
    {
      new: true,
      runValidators: true
    }
  ).populate('userId', 'firstName lastName email').populate('items.bookId', 'name coverImage');

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
};
