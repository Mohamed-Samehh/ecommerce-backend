const authorController = require('./authors');
const bookController = require('./book');
const cartController = require('./cart');
const categoryController = require('./category');
const orderController = require('./order-controller');
const reviewController = require('./review-controller');

module.exports = {
  bookController,
  authorController,
  cartController,
  categoryController,
  orderController,
  reviewController
};
