const authorController = require('./authors');
const bookController = require('./book');
const cartController = require('./Cart');
const categoryController = require('./Category');
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
