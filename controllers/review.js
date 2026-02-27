const asyncHandler = require('../middleware/async-handler');
const {Order, Review} = require('../models');

const addReview = asyncHandler(async (req, res, next) => {
  const {bookId, rating, comment} = req.body;
  const userId = req.user.id;

  const deliveredOrder = await Order.findOne({
    userId,
    'status': 'delivered',
    'items.bookId': bookId
  });

  if (!deliveredOrder) {
    const error = new Error('Review denied. You can only review books from your delivered orders.');
    error.statusCode = 403;
    return next(error);
  }

  const review = await Review.create({userId, bookId, rating, comment});
  res.status(201).json({status: 'success', data: review});
});

const getBookReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({bookId: req.params.bookId})
    .populate('userId', 'firstName lastName avatar')
    .sort({createdAt: -1});

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});
const getMyReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({userId: req.user.id})
    .populate('bookId', 'title coverImage')
    .sort({createdAt: -1});
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

module.exports = {addReview, getBookReviews, deleteReview, getMyReviews};
