const asyncHandler = require('../middleware/async-handler');
const {Order, OrderItem, Review} = require('../models');

const addReview = asyncHandler(async (req, res, next) => {
  const {bookId, rating, comment} = req.body;
  const userId = req.user.id;

  const deliveredOrder = await Order.findOne({userId, status: 'delivered'});
  if (!deliveredOrder) {
    const error = new Error('You must have a delivered order to submit a review.');
    error.statusCode = 403;
    return next(error);
  }

  const isPurchased = await OrderItem.findOne({orderId: deliveredOrder._id, bookId});
  if (!isPurchased) {
    const error = new Error('Review denied. You can only review books you have purchased.');
    error.statusCode = 403;
    return next(error);
  }

  const review = await Review.create({userId, bookId, rating, comment});
  res.status(201).json({status: 'success', data: review});
});

const getBookReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({bookId: req.params.bookId}).populate('userId', 'name');
  res.status(200).json({status: 'success', data: reviews});
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    return next(error);
  }

  if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    const error = new Error('Unauthorized. You can only delete your own reviews.');
    error.statusCode = 403;
    return next(error);
  }

  await review.deleteOne();
  res.status(204).send();
});

module.exports = {addReview, getBookReviews, deleteReview};
