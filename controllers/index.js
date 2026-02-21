const authorController = require('./author');
const bookController = require('./book');
const cartController = require('./Cart');
const categoryController = require('./Category');
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
