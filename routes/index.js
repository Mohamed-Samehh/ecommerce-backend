const express = require('express');

const router = express.Router();

router.use('/cart', require('./Cart')); // use for group of routes
router.use('/categories', require('./Category'));

module.exports = router;
