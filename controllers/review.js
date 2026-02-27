const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async-handler');
const { Order, Review } = require('../models');

const addReview = asyncHandler(async (req, res, next) => {
  const { bookId, rating, comment } = req.body;
  const userId = req.user.id;

  console.log('--- Add Review Debug ---');
  console.log('User ID:', userId);
  console.log('Book ID:', bookId);

  // Explicit casting to ensure exact matches in filters
  const uId = new mongoose.Types.ObjectId(userId);
  const bId = new mongoose.Types.ObjectId(bookId);

  const deliveredOrder = await Order.findOne({
    userId: uId,
    'status': 'delivered',
    'items.bookId': bId
  });

  if (!deliveredOrder) {
    console.log('Order check failed. No delivered order found for this book.');
    const error = new Error('Review denied. You can only review books from your delivered orders.');
    error.statusCode = 403;
    return next(error);
  }

  console.log('Order check passed. Proceeding with Upsert.');

  const review = await Review.findOneAndUpdate(
    { userId: uId, bookId: bId },
    { rating, comment },
    { new: true, upsert: true, runValidators: true }
  );

  console.log('Review Result:', review);
  res.status(201).json({ status: 'success', data: review });
});

const getBookReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ bookId: req.params.bookId })
    .populate('userId', 'firstName lastName avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});
const getMyReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ userId: req.user.id })
    .populate('bookId', 'title coverImage')
    .sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    error.name = 'ReviewNotFoundError';
    return next(error);
  }

  if (review.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
    const error = new Error('Unauthorized. You can only delete your own reviews.');
    error.statusCode = 403;
    return next(error);
  }

  await review.deleteOne();
  res.status(204).send();
});

const getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find()
    .populate('userId', 'firstName lastName avatar')
    .populate('bookId', 'name coverImage')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});

module.exports = { addReview, getBookReviews, deleteReview, getMyReviews, getAllReviews };
