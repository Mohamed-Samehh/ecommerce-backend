const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Review = require('../models/review');

async function addReview(req, res) {
  try {
    const {bookId, rating, comment} = req.body;
    const userId = req.user.id;

    const deliveredOrder = await Order.findOne({userId, status: 'delivered'});
    if (!deliveredOrder) return res.status(403).json({message: 'Must have a delivered order to review.'});

    const isPurchased = await OrderItem.findOne({orderId: deliveredOrder._id, bookId});
    if (!isPurchased) return res.status(403).json({message: 'You did not buy this book.'});

    const review = await Review.create({userId, bookId, rating, comment});
    res.status(201).json({status: 'success', data: review});
  } catch {
    res.status(400).json({status: 'fail', message: 'Already reviewed or invalid data'});
  }
}

async function getBookReviews(req, res) {
  try {
    const reviews = await Review.find({bookId: req.params.bookId}).populate('userId', 'name');
    res.status(200).json({status: 'success', data: reviews});
  } catch (error) {
    res.status(400).json({status: 'fail', message: error.message});
  }
}

async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({message: 'Review not found'});

    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({message: 'Unauthorized'});
    }

    await review.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({status: 'fail', message: error.message});
  }
}

module.exports = {addReview, getBookReviews, deleteReview};
