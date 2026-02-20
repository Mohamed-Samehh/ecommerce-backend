const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Review = require('../models/review');

async function addReview(req, res) {
  try {
    const {bookId, rating, comment} = req.body;
    const userId = req.user.id;
    const deliveredOrder = await Order.findOne({
      userId,
      status: 'delivered'
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only review books after your order is delivered.'
      });
    }

    const isPurchased = await OrderItem.findOne({
      orderId: deliveredOrder._id,
      bookId
    });

    if (!isPurchased) {
      return res.status(403).json({
        status: 'fail',
        message: 'You cannot review a book you haven’t purchased.'
      });
    }

    const newReview = await Review.create({
      userId,
      bookId,
      rating,
      comment
    });

    res.status(201).json({
      status: 'success',
      data: {review: newReview}
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.code === 11000 ? 'You already reviewed this book.' : error.message
    });
  }
}

async function getBookReviews(req, res) {
  try {
    const reviews = await Review.find({bookId: req.params.bookId})
      .populate('userId', 'name');

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {reviews}
    });
  } catch (error) {
    res.status(400).json({status: 'fail', message: error.message});
  }
}

module.exports = {
  addReview,
  getBookReviews
};
