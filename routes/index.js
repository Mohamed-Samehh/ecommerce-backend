const express = require('express');
const router = express.Router();

// define other routes
router.use('/books', require('./books'));
router.use('/authors', require('./authors'));
router.use('/cart', require('./Cart')); // use for group of routes
router.use('/categories', require('./Category'));

module.exports = router;
