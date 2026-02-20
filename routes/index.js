const express = require('express');

// create a router instance
const router = express.Router();

// define other routes

router.use('/books', require('./books.js'));

module.exports = router;
