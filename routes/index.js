const express = require('express');

const router = express.Router();

// define other routes
router.use('/auth', require('./auth'));
router.use('/books', require('./books'));
router.use('/authors', require('./authors'));
router.use('/cart', require('./Cart')); // use for group of routes
router.use('/categories', require('./Category'));
router.use('/order', require('./order-routes'));
router.use('/review', require('./review-routes'));

module.exports = router;
