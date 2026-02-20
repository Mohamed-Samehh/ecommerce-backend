const express = require('express');

// create a router instance
const router = express.Router();

// define other routes

router.use('/books', require('./books'));
router.use('/authors', require('./authors'));

module.exports = router;
