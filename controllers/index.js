const authorController = require('./author');
const bookController = require('./book');
const cartController = require('./cart');
const categoryController = require('./category');
const orderController = require('./order');
const reviewController = require('./review');

module.exports = {
  bookController,
  authorController,
  cartController,
  categoryController,
  orderController,
  reviewController
};
