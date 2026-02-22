const express = require('express');

const router = express.Router();
const {cartController} = require('../controllers'); // TODO: Link from sameh

router.get('/', cartController.display); // view cart (logged in user)
router.post('/', cartController.add); // add book to cart (same )
router.delete('/:bookId', cartController.remove); // delete book from cart (same)

module.exports = router;
