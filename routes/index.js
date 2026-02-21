const express = require('express');

const router = express.Router();

// define other routes
router.use('/auth', require('./auth'));
router.use('/books', require('./books'));
router.use('/authors', require('./authors'));
router.use('/cart', require('./carts')); // use for group of routes
router.use('/categories', require('./categories'));
router.use('/order', require('./orders'));
router.use('/review', require('./reviews'));

module.exports = router;
